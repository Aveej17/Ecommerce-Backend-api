import cloudinaryPackage from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from 'dotenv';
const cloudinary = cloudinaryPackage.v2;

dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// console.log({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// Create storage engine for multer
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "Ecommerce-api",
        allowed_formats: ['jpg', 'jpeg', 'png'],
    },
});

// Init multer with storage engine
const upload = multer({ storage });

// // Wrap the upload function to log errors
// const uploadMiddleware = (req, res, next) => {
//     upload(req, res, function (err) {
//         if (err instanceof multer.MulterError) {
//             // A Multer error occurred when uploading
//             console.error('Multer error:', err);
//             return res.status(500).json({ message: 'Multer error', error: err.message });
//         } else if (err) {
//             // An unknown error occurred
//             console.error('Unknown error during upload:', err);
//             return res.status(500).json({ message: 'Unknown error during upload', error: err.message });
//         }
//         next();
//     });
// };



// export default uploadMiddleware;

export default upload;

