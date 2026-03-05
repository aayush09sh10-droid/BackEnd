import {v2} from "cloudinary"

import fs from "fs"

const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
  cloud_name: 'dmxp6fb4g', 
  api_key: '625767263198926', 
  api_secret: '5TP2QPG7tFNEz7S2FNke42bFGzw'
});

const uploadCloudniary = async(localfilepath)=>{
    try{
        if(!localfilepath) return null;
        //upload file 
        cloudinary.v2.uploader
        .upload(localfilepath,{
        resource_type:"auto"
})
.then(result=>console.log(result));


    }
    catch(error){
        fs.unlinkSync(localfilepath)//remove the locallysaved temoprary file as the upload operation got failed

    }
}
export {uploadCloudniary}





