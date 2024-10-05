const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");
const User = require('../models/User.model.js');
const { AsyncHandler, ApiResponse } = require('../utils/Helpers.js');
require('dotenv').config();

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) throw new Error("File path missing");

        // Upload the file to Cloudinary
        console.log(localFilePath);
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        fs.unlinkSync(localFilePath);  // Remove the local file after upload

        return { success: true, url: response.url };  // Return the URL after upload

    } catch (error) {
        console.error("Cloudinary Upload Error: ", error);
        return { success: false, message: "Failed to upload file to Cloudinary" };
    }
};


const deleteOnCloudinary = AsyncHandler(async (publicId, resourceType = 'image', res) => {
    if (!publicId) {
        return ApiResponse(res, false, "Public ID is missing for deletion", {}, 400);
    }

    try {
        // Handle deletion for both videos and images
        const response = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
        console.log("Cloudinary Deletion Response: ", response);

        if (response.result !== "ok") {
            return ApiResponse(res, false, `Error while deleting the ${resourceType} on Cloudinary: ${response.result}`, {}, 400);
        }

        return ApiResponse(res, true, `${resourceType} deleted successfully!`, {}, 200);
    } catch (error) {
        console.error("Cloudinary Deletion Error: ", error);
        return ApiResponse(res, false, `Failed to delete ${resourceType} on Cloudinary`, {}, 500);
    }
});

module.exports = {
    uploadOnCloudinary,
    deleteOnCloudinary
};
