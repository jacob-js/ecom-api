import fileUpload from 'express-fileupload';
import cloudinary from 'cloudinary';
import path from 'path';
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const fUploadMiddlware = fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, '../temp'),
})

export const uploadProductImage = async (req, field) =>{
    const cover = req.files[field];
    if(cover){
        const res = await cloudinary.v2.uploader.upload(cover.tempFilePath);
        return res.url
    }
}