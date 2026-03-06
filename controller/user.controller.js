import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiError.js";
import { User} from "../models/user.model.js";
import {uploadCloudniary} from "../utils/cloudniary.js"
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser=asyncHandler(async(req,res)=>{
    //Get data
    //validation
    //user already login:usernam,email
    //file upload:avtar,images
    //upload them to cloudniary , avtar check 
    //create user object- creater entry in db
    //check for user creation 
    //return response
    const {fullname,userName,email,password}=req.body
    console.log("email:",email);
    console.log(req.files)
    if (
        [fullname,email,userName,password].some((field)=>
        field?.trim()==="")
    ){
        throw new ApiError(400, "All compulsory field are required")


    }

    const existedUser=await User.findOne({
        $or:[{userName},{email}]
    })
    if(existedUser){
        throw new ApiError(409,"User already existed")

    }
    const avatarLocalPath=req.files?.avatar[0]?.path
    const coverImageLocalPath=req.files?.coverImage[0]?.path
    if(!avatarLocalPath){
        throw new ApiError(410,"Avatar required")
    }

    const avatar = await uploadCloudniary(avatarLocalPath)
    const coverImage=await uploadCloudniary(coverImageLocalPath)
    console.log(avatar)

    if(!avatar){
        throw new ApiError(400,"Avatar is requried")

    }

    const user=await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url||"",
        email,
        password,
        userName:userName.toLowerCase(),

    })
    const createdUserName=await User.findById(user._id).select("-password -refreshToken")
    if(!createdUserName){
        throw new ApiError (500,"Somthing went wrong while creating user")
    }
    return res.status(201).json(
        new ApiResponse(201,"User registered successfully",createdUserName)
    )
    





})

export {registerUser}