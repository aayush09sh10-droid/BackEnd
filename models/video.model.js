import mongoose,{Schema} from "mongoose";

const videosSchema=new Schema({
    videoFile:{
        type:String,
        required:true,

    },
    thumbnail:{
        type:String,
        reuqired:true
    },
    description:{
        type:Sring,
        required:true

    },
    duration:{
        type:Number,
        required:true,
    },
    views:{
        type:Number,
        required:true
    },
    ispublished:{
        type:Boolean,
        deafult:true,
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"

    }
},{
    timestamps:true
});

export const Video = mongoose.model("Video",videoScehma)