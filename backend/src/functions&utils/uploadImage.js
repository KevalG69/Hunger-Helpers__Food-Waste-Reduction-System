//Modules 
const multer = require("multer");
const {CloudinaryStorage} = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinaryConfig.js");


//Models

const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder: "pfp",//folder name in cloudinary 
        format: async ()=> 'png',//convert formate into png
        public_id:(req,file) => file.originalname.split('.')[0]
    }
});

const upload = multer({storage:storage});

module.exports = upload;