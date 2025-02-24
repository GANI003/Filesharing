import mongoose from "mongoose";

const folderSchema = new mongoose.Schema(
    {
        title: {
            type : String,
        },
        path: String, // Full path on the serve
        user : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Usercreation",
            required : true,
        },
        type : String,
        Url : String,
        files : [
            {
                subTitle : String,
                url : String,
            }
        ]
    }
)
export const Folder = mongoose.model("Folder",folderSchema);