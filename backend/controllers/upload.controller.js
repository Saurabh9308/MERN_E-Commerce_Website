import cloudinary from "../utils/cloudinary.js";

// --- UPLOAD IMAGES ---
export const uploadImages = async (req, res) => {
  try {
    // 1. Check files
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    // 2. Upload all images
    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "products" }, // optional but recommended
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );

        stream.end(file.buffer);
      });
    });

    // 3. Wait for all uploads
    const imageUrls = await Promise.all(uploadPromises);

    // 4. Send response
    return res.status(200).json({
      success: true,
      urls: imageUrls,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error uploading images",
      error: error.message,
    });
  }
};