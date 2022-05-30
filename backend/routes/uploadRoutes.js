import { protect, admin } from '../middleware/authMiddleware.js'
import path from 'path';    // path module from node.js
import express from 'express';
import multer from 'multer';    // Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files

// Cloudinary does NOT support ES6 module, so use this way to make it work
import cloudinaryES6 from 'cloudinary';
const cloudinary = cloudinaryES6.v2;

import { CloudinaryStorage } from 'multer-storage-cloudinary'

const router = express.Router();

// --------------------------below used for save images to local storage -------------------------
// storage setting
// const storage = multer.diskStorage({
//     destination(req, file, cb) {
//         cb(null, 'uploads/');    // null means no Error, then upload to folder Meegle
//     },
//     filename(req, file, cb) {
//         cb(
//             null,
//             `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}` // path.extname: get the original file ext. It includes the dot(.), so don't need to manually add a dot(.) 
//         );
//     },
// });


//check file type before uploading
// function checkFileType(file, cb) {
//     const filetypes = /jpg|jpeg|png/;   //Regular_Expression

//     // .test method will give us a boolean value. so variable extname is True/False
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // when set a RE variable, it comes with a .test and other RE methods

//     // every file has a mime type, like JPEG ...
//     // Why check mime type in addition to file extension?
//     // To double-check that we use the correct file type to upload
//     // The client browser (Chrome) that automatically identifies the mime type and then populates the Content-Type in the request header.
//     const mimetype = filetypes.test(file.mimetype);

//     if (extname && mimetype) {
//         return cb(null, true);
//     } else {
//         cb('Images only!');
//     }
// }


// pass in as middleware to the upload route
// const upload = multer({
//     storage,
//     fileFilter: function (req, file, cb) {
//         checkFileType(file, cb);
//     },
// });

//------------------- above used for save images to local storage




// use cloudinary to storage images
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Meegle',
        allowed_formats: ['jpeg', 'png', 'jpg']
    },
});

const upload = multer({ storage })


router.post(
    '/',
    protect,
    admin,
    upload.single('image'),
    (req, res) => {
        // if use upload.array, below use req.files(plural)
        const uploadImageURL = req.file.path
        res.send(uploadImageURL)
    }
);

export default router;