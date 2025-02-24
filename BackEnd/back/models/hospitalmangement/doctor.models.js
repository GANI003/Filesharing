import mongoose from "mongoose";
// import { hospital } from "./hospital.models
const doctorSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    salary : {
        type : Number,
        required : true,
        enum : ["USD","IND"],
    },
    qualification : {
        type : String,
        required : true,
    },
    experience : {
        type : Number,
        required : true,
        default : 0,
    },
    worksInHospital : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : "Hospital",
        }],
    
},{timestamps : true});

export const doctor = mongoose.model("Doctor",doctorSchema);