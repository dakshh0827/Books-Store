import cloudinary from '../lib/cloudinary.js';

export const uploadBase64Image = async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ message: 'Image is required' });
    }

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: 'lendSellBooks',
    });

    res.status(201).json({
      message: 'Image uploaded successfully',
      url: uploadResponse.secure_url,
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};
