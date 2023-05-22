const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


const deleteCloudinary = async (cloudinary, publicId) => new Promise(
    (resolve, reject) => {
		const handler = (error, result) => {
			if (error) {
				reject(error);
				return;
			}
			resolve(result);
		}
		cloudinary.uploader.destroy(publicId, handler)
})


module.exports = { cloudinary, deleteCloudinary }