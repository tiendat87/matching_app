import { Request, Response } from "express";
import ProfileImage from "../models/Image";
import Profile from "../models/Profile";
import cloudinary from "../config/cloudinary";
import sequelize from "../config/database";
import { Op } from "sequelize";
import { UploadApiResponse } from "cloudinary";

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

interface CloudinaryFile {
  public_id: string;
  version: number;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  url: string;
  secure_url: string;
  original_filename: string;
  bytes: number;
}

export async function uploadImages(req: Request, res: Response) {
  try {
    const profileId = parseInt(req.params.profileId);
    const profile = await Profile.findByPk(profileId);
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
      return res.status(400).json({ error: "No images uploaded" });
    }

    // req.files là array từ multer
    const files = Array.isArray(req.files)
      ? req.files
      : Object.values(req.files).flat();

    const existingImages = await ProfileImage.count({ where: { profileId } });
    if (existingImages + files.length > 6) {
      return res.status(400).json({
        error: `Maximum 6 images allowed. You have ${existingImages} images and tried to upload ${files.length} more.`,
      });
    }

    const images = await Promise.all(
      files.map((file: any, index) => {
        // Tạo thumbnail URL
        const thumbnailUrl = cloudinary.url(file.filename, {
          width: 300,
          height: 300,
          crop: "fill",
          gravity: "face",
          quality: "auto",
        });

        return ProfileImage.create({
          profileId,
          cloudinaryId: file.filename, // public_id
          imageUrl: file.path, // URL chính
          thumbnailUrl, // thumbnail
          width: 0, // chưa có metadata, để 0 tạm
          height: 0, // chưa có metadata, để 0 tạm
          format: file.mimetype.split("/")[1], // jpeg/png
          bytes: file.size,
          order: existingImages + index,
          isPrimary: existingImages === 0 && index === 0,
        });
      })
    );

    res.status(201).json({ message: "Images uploaded", images });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload images" });
  }
}

export async function getProfileImages(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const profileId = parseInt(req.params.profileId);

    const images = await ProfileImage.findAll({
      where: { profileId },
      order: [
        ["isPrimary", "DESC"],
        ["order", "ASC"],
      ],
    });

    res.json(images);
  } catch (error) {
    console.error("Get images error:", error);
    res.status(500).json({ error: "Failed to fetch images" });
  }
}

export async function deleteImage(req: Request, res: Response): Promise<void> {
  try {
    const imageId = parseInt(req.params.imageId);

    const image = await ProfileImage.findByPk(imageId);
    if (!image) {
      res.status(404).json({ error: "Image not found" });
      return;
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(image.cloudinaryId);

    // If this was the primary image, make the next image primary
    if (image.isPrimary) {
      const nextImage = await ProfileImage.findOne({
        where: {
          profileId: image.profileId,
          order: { [Op.gt]: image.order },
        },
        order: [["order", "ASC"]],
      });

      if (nextImage) {
        nextImage.isPrimary = true;
        await nextImage.save();
      }
    }

    // Delete from database
    await image.destroy();

    // Reorder remaining images
    const remainingImages = await ProfileImage.findAll({
      where: { profileId: image.profileId },
      order: [["order", "ASC"]],
    });

    for (let i = 0; i < remainingImages.length; i++) {
      remainingImages[i].order = i;
      await remainingImages[i].save();
    }

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Delete image error:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
}

export async function setPrimaryImage(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const imageId = parseInt(req.params.imageId);

    const image = await ProfileImage.findByPk(imageId);
    if (!image) {
      res.status(404).json({ error: "Image not found" });
      return;
    }

    // Remove primary status from all other images of this profile
    await ProfileImage.update(
      { isPrimary: false },
      { where: { profileId: image.profileId } }
    );

    // Set this image as primary
    image.isPrimary = true;
    await image.save();

    res.json({ message: "Primary image updated successfully" });
  } catch (error) {
    console.error("Set primary image error:", error);
    res.status(500).json({ error: "Failed to set primary image" });
  }
}

export async function reorderImages(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const profileId = parseInt(req.params.profileId);
    const { imageOrder } = req.body; // Array of image IDs in desired order

    if (!Array.isArray(imageOrder)) {
      res.status(400).json({ error: "Invalid image order" });
      return;
    }

    // Verify all images belong to this profile
    const images = await ProfileImage.findAll({
      where: { profileId },
    });

    if (images.length !== imageOrder.length) {
      res.status(400).json({ error: "Image count mismatch" });
      return;
    }

    const imageIds = images.map((img) => img.id);
    for (const id of imageOrder) {
      if (!imageIds.includes(id)) {
        res.status(400).json({ error: "Invalid image ID in order" });
        return;
      }
    }

    // Update order
    const updatePromises = imageOrder.map((imageId, index) => {
      return ProfileImage.update(
        { order: index },
        { where: { id: imageId, profileId } }
      );
    });

    await Promise.all(updatePromises);

    res.json({ message: "Image order updated successfully" });
  } catch (error) {
    console.error("Reorder images error:", error);
    res.status(500).json({ error: "Failed to reorder images" });
  }
}
