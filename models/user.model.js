import mosngoose,{Schema} from "mongoose";
import { JsonWebTokenError } from "jsonwebtoken";
import bcrypt from "bcryptjs";
const userSchema = new Schema({
    userName:{
        type:String,
        requried:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true,
    },
    email:{
        type:String,
        requried:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    fullname:{
        type:String,
        requried:true,
        unique:true,
        index:true,
        trim:true,
        
    },
    avatar:{
        type:String,//cloudinary url
        requried:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true,
    },
    coverImage:{
        type:String,
        
    },
    watchHistory:[{
        type:Schema.Types.ObjectId,
        ref:"Video"
    }],
    password:{
        type:String,
        required:[true,"password is required"]
    },
    refreshToken:{
        type:String,

    }
    
},{
    timestamps:true
});
userSchema.pre("save",function(next){
    if(!this.isModified("password"))
        return next()

    
    this.password=bcrypt.hash(this.password,10)
    next()

})
userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAccessToken=function(){
    return Jwt.sign({
        _id:this._id,
        email:this.email,
        fullname:this.fullname,
        userName:this.userName,

    },
    process.env.ACCESS_TOKEN_SECERET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY,

    }
)
}
userSchema.methods.generateRefreshToken=function(){
     return Jwt.sign({
        _id:this._id,
        email:this.email,
        fullname:this.fullname,
        userName:this.userName,

    },
    process.env.ACCESS_TOKEN_SECERET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY,

    }
) 

}

export const User = mongoose.model("User",userSchema)