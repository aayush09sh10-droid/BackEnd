import mosngoose,{Schema} from "mongoose";
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
export const User = mongoose.model("User",userSchema)