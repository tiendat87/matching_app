import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer with Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Extract file extension
    const fileExt = file.originalname.split(".").pop();
    const fileName = `profile_${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}`;

    return {
      folder: "dating-app/profiles",
      allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
      max_file_size: 5000000, // 5MB
      transformation: [
        { width: 1200, height: 1200, crop: "limit" }, // Limit max dimensions
        { quality: "auto:best" }, // Auto optimize quality
        { fetch_format: "auto" }, // Auto format (webp where supported)
      ],
      public_id: fileName,
      resource_type: "image",
    };
  },
});

// File filter to validate file types
const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.")
    );
  }
};

// Configure multer
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 6, // Max 6 images per profile
  },
});

export default cloudinary;
