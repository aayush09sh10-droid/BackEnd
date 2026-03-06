import {v2 as cloudinary} from "cloudinary"
import { response } from "express";

import fs from "fs"

// const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
  cloud_name: 'dmxp6fb4g', 
  api_key: '625767263198926', 
  api_secret: '5TP2QPG7tFNEz7S2FNke42bFGzw' 
});

const uploadCloudniary = async (localfilepath) => {
    console.log(response)
    try {
        if (!localfilepath) return null;

        const response = await cloudinary.uploader.upload(localfilepath, {
            resource_type: "auto"
        });

        console.log("File uploaded to cloudinary:", response.url);
        return response;
        fs.unlinkSync(localfilepath)
        

    }
    
    
    catch (error) {
        fs.unlinkSync(localfilepath); // delete temp file
        return null;
    }
    
};
export {uploadCloudniary}





