import mongoose from "mongoose";

const medicalrecordSchema = new mongoose.Schema({},{timestamps : true});

export const medicalrecord = mongoose.model("Medicalrecord",medicalrecordSchema);