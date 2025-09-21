import axios from "axios";
import { Request, Response } from "express";

export async function getCitySuggestions(
  req: Request,
  res: Response
): Promise<any> {
  const { q } = req.query;
  console.log("City search query:", q);

  if (!q || typeof q !== "string") {
    return res
      .status(400)
      .json({ error: "Query parameter 'q' is required and must be a string" });
  }

  try {
    const response = await axios.get("https://photon.komoot.io/api/", {
      params: {
        q: q,
        limit: 5,
        lang: "de", // Spracheinstellung für deutsche Ergebnisse
        osm_tag: "place:city",
        layer: "city", // Fokus auf Städte
        bbox: "5.866,47.270,15.042,55.099", // Bounding-Box für Deutschland
      },
    });

    const suggestions = response.data.features.map((feature: any) => {
      const properties = feature.properties;
      return {
        name: properties.name,
        state: properties.state || "",
        country: properties.country || "Germany",
        osm_id: properties.osm_id,
        coordinates: feature.geometry.coordinates,
      };
    });
    console.log(suggestions);
    res.json(suggestions);
  } catch (err: any) {
    console.error("Photon API error:", err.response?.data || err.message);
    res.status(500).json({ error: "Server error" });
  }
}
