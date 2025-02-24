import {Text} from "../models/text.models.js"
import {asyncHandler} from "../utils/asynchandler.js"
import fs from 'fs';
import path from 'path';
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { text } from "stream/consumers";
import {format} from 'date-fns';
import mongoose from "mongoose";
import {ObjectId} from 'mongodb';
// import { log } from "util";

const createFile = async (textName,textData) => {
    const folderPath = path.join('controllers', '..', 'public', 'temp');
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
    const filePath = path.join(folderPath, `${textName}.txt`);
    const file = await fs.writeFileSync(filePath,textData);
    return filePath;
}

const createTextFile = asyncHandler( async (req,res) => {
   const {textName,textData} = req.body;
    console.log(req.body);    
    const user = req.user._id;
    const fileExist = await Text.findOne(
        {
            user : `${user}`,
            title :`${textName}`
        }
    )
    console.log(fileExist);
    if(fileExist !== null)
    {
        console.log(`${textName}.txt is already exist`);
        
        res.json(
            {
                err : `${textName}.txt is already exist`,
                status : 400,
            }
        )
    }
    else{
        const filePath = await createFile(textName,textData);
        console.log(filePath);
        const file_url = await uploadOnCloudinary(filePath);
        console.log('url of cloudinary : ',file_url);
        const textDataCreate = await Text.create(
            {
                title : textName,
                user,
                version : {
                    url : file_url.url,
                    createdTime : format(new Date() , 'MMMM dd, yyyy h:mm:ss a'),
                }
            }
        ) 
        console.log('Text id created');
        res.json(textDataCreate);
    }
})

const versionTheFile = asyncHandler( async (req,res) => {
    const {textName,textData} = req.body;
    console.log(req.body);
    const user = req.user._id;
    const filePath = await createFile(textName,textData); 
    const fileUrl = await uploadOnCloudinary(filePath);
    const fileData = await Text.findOneAndUpdate(
        {
            user,
            title : textName,            
        },
        {
            $push : {
                version : {
                    url : fileUrl.url,
                    createdTime : format(new Date() , 'MMMM dd, yyyy h:mm:ss a'),
            }       
        }
    }
    )
    res.json(fileData);
})

const getTextFile = asyncHandler(async (req,res) => {
    const textData = await Text.find(
        {
            user : req.user._id,
        }
    )
    console.log(textData);
    res.json(textData);
})

const deleteTextFile = asyncHandler(async (req,res) => {

    const {id} = req.params
    console.log(id,req.params);
    const deleteFile = await Text.findByIdAndDelete(
        id,
    )
    console.log('Deleted');
    res.json(
        {
            status : 200,
            msg : "Successfully Deleted",
        }
    )
})

const deleteVersion = asyncHandler(async (req,res) => {
   const {versionId,fileId} = req.params;
    // console.log('Id : ',typeOf(fid));
    console.log(req.params);
    // const fileVersion = await Text.findByIdAndUpdate(
    //     {

    //      _id : fid, // Directly match the fileId
    //      version: { 
    //         _id : vid,
    //      }
    //     },
    //     {
    //         $pull: {
    //             version: { 
    //                 _id: vid,

    //              } // Pull the version based on its _id
    //         }
    //     },
    //     {
    //         new: true, // Return the updated document
    //         // runValidators: true // Ensure the operation adheres to schema validation rules
    //     }
    // );
    
   
    const fileVerion = await Text.findByIdAndUpdate(
        {
            _id :fileId,
            version : {
                _id : versionId,
            }
        },
        {
            $pull : {
                version : {
                    _id : versionId,
                }
            }
        },
        {
            new : true,
        }
    )
    // const versionId  = new  mongoose.Types.ObjectId(vid);
    // console.log(versionId);
    // console.log(' Did ',fileVersion);
    // console.log(idx);   
    // console.log(fileVersion.version[0]._id);
    
    console.log('DONE');
    
    
})
export {
    createTextFile,
    getTextFile,
    versionTheFile,
    deleteTextFile,
    deleteVersion,
}