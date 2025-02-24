import mongoose from "mongoose";

const paitentSchema = new mongoose.Schema(
    {
        name : {
            type : String,
            required : true,
        },
        diagnoistWith : {
            type : String,
        }
        ,
        address : {
            type : String,
            required : true,
        }
        ,
        age : {
            type : Number,
            required : true,
        }
        ,
        bloodgroup : {
            type : String,
            required : true,
        } ,
        gender : {
            type : String,
            required : true,
            enum : ["M","F","O"],
        },
        admitedIn : {
            type:mongoose.Schema.Types.ObjectId,
            ref : "Hospital",
        }
    }
    ,{timestamps : true});

export const paitent = mongoose.model("Paitent",paitentSchema);