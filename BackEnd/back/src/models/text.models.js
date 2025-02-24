import mongoose from "mongoose";

const textSchema = new mongoose.Schema(
    {
        title : String,
        user : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Usercreation"
        },
        version : [
            {
                
                url : String,
                createdTime : String, // can we keep Date as a data type
            }
        ]
    }
)

export const Text = mongoose.model("Text",textSchema);