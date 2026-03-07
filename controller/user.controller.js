import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiError.js";
import { User} from "../models/user.model.js";
import {uploadCloudniary} from "../utils/cloudniary.js"
import { ApiResponse } from "../utils/apiResponse.js";

const generateAccessAndRfreshToken=async(userId)=>{
    try{
        const user=await User.findById(userId);
        const accessToken=user.generateAccessToken();
        const refreshToken=user.generateRfreshToken();
        user.refreshToken=refreshToken;

        await user.save({validateBeforeSave:false});
        return{accessToken,refreshToken}


    }
    catch{
        throw new ApiError(500,"Something went wrong while generating refresh adn access token")
    }
}

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
const loginUser=asyncHandler(async(req,res)=>{
    //req->data
    //username or email
    //find the user 
    //password check
    //access and refresh token generate adn send to user
    //send cookies
    //response success fully login

    const {email,userName,password}=req.body
    if (!userName || !email){
        throw new ApiError(400,"username and password is required")

    }
    const user = await User.findOne({
        $or:[{userName},{email}]

    })
    if (!user){
        throw new ApiError(404,"user not found")
    }

    const isPasswordVaild=await user.isPasswordCorrect(password)
    if (!isPasswordVaild){
        throw new ApiError(404,"passowrd incorrect")
    }

    const {accessToken,refreshToken}=await generateAccessAndRfreshToken(user._id)

    const LoggedInUser=await User.findById(user._id).select("-password -refresToken")

    const option={
        httpOnly:true,
        secure:true,
    }
    return res.status(200).cookie("accessToken",accessToken,option).cookie("refreshToken",refreshToken,option)
    .json(
        new ApiResponse(
            200,
            {
                user:LoggedInUser,accessToken,

            },"user loggedin successfully"

        )
    )





})
const logoutUser= asyncHandler(async(req,res)=>{
    User.findByIdAndUpdate(
        req.user._id,{
            $set:{
                refreshToken:undefined  
            }
        },
        {
            new:true

        }
        
        
    )
    const option={
        httpOnly:true,
        secure:true,
    }
    return res
    .status(200)
    .clearCookie("accessToken",option)
    .clearCookie("refreshToken",option)
    .json(new ApiResponse(200,"User logged out successfully"))
    
})

export {registerUser,loginUser,logoutUser}