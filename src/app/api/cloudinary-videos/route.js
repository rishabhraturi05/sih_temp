import { NextResponse } from "next/server";

// Ensure this runs in the Node.js runtime so Buffer is available
export const runtime = "nodejs";

export async function GET() {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Cloudinary environment variables are not set" },
        { status: 500 }
      );
    }

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/search`;

    const authHeader =
      "Basic " + Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

    // Search videos; filtering by folder "videosss" (you can change this to match your Cloudinary folder structure)
    // To fetch from multiple folders, use: "resource_type:video AND (folder:videosss/* OR folder:engineering/computer-science/*)"
    const body = {
      expression: "resource_type:video AND folder:videosss/*", // Only videos from "videosss" folder
      max_results: 100,
      sort_by: [{ public_id: "desc" }],
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Cloudinary API error:", errorText);
      return NextResponse.json(
        { error: "Failed to fetch videos from Cloudinary" },
        { status: 500 }
      );
    }

    const data = await response.json();

    const videos = (data.resources || []).map((resource) => ({
      public_id: resource.public_id,
      secure_url: resource.secure_url,
      format: resource.format,
      bytes: resource.bytes,
      created_at: resource.created_at,
      folder: resource.folder || "",
      tags: resource.tags || [],
    }));

    return NextResponse.json({ videos });
  } catch (error) {
    console.error("Error fetching Cloudinary videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}


