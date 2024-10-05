const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");
const User = require('../models/User.model.js');
const { AsyncHandler, ApiResponse } = require('../utils/Helpers.js');

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = AsyncHandler(async (localFilePath, res) => {
    try {
        if (!localFilePath) return ApiResponse(res, false, "File path missing!", {}, 400);

        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        // File has been uploaded successfully
        fs.unlinkSync(localFilePath);  // Remove the local file after upload

        return ApiResponse(res, true, "File uploaded successfully!", { url: response.url }, 200);

    } catch (error) {
        // Log error and return a failure response
        console.error("Cloudinary Upload Error: ", error);
        return ApiResponse(res, false, "Failed to upload file to Cloudinary", {}, 500);
    }
});

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
