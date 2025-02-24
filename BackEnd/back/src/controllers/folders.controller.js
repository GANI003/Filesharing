import { upload } from '../middleware/multter.middleware.js';
import {Folder} from '../models/folders.models.js';
import { asyncHandler } from '../utils/asynchandler.js';
import { uploadOnCloudinary,deleteUploaded } from '../utils/cloudinary.js';

const createFolder = asyncHandler(async (req,res) => 
    {
        const {title} = req.body;
        console.log('Req Body : ',req.body);
        // const pather = `${parent}/${title}`
        // if(path == title)
        // {

        //     const folderCreated = await Folder.create(
        //         {
        //             title,
        //             path,
        //             type : 'folder',
        //             user : req.user._id
        //         }
        //     )
        //     res.json(folderCreated);
        // }
        // else
        // {

        // }
        // console.log('Folder is Created');

        // if(title === path)
        // {
        //     const folderData = await Folder.create(
        //         {
        //             title,
        //             path,
        //             type : 'folder',
        //             user : req.user._id
        //         }
        //     )
        //     console.log('FolderData : ',folderData);
        //     if(!folderData)
        //         return res.status(400);
        //     return res.json(folderData);
        // }
        // else
        // {
        //     const parent = await Folder.findOne(
        //         {
        //             path : path.substring(0,path.indexOf('/')),
        //         }
        //     )
        //     parent.path = path;
        //     await parent.save({validateBeforeSave : false});
        // }
        // else
        // {
        //     const parent = await Folder.findOneAndUpdate(
        //         {
        //             path : path.substring(0,path.indexOf('/')),
        //         },
        //         {
        //             path : path
        //         }
        //     )
        // }
        const user = req.user._id;
        const existFolder = await Folder.findOne(
            {
                title : `${title}.user.${user}`
            }
        )
        console.log("Exist : ",existFolder);
        // const size = Object.keys(existFolder[0]).length;
        // console.log(size);
        if( existFolder !== null)
            {

                console.log('Folder With same names are not allowed');
                res.json({err : "Folder With same names are not allowed",status : 400})
            }
            else
            {
                
                const folderCreation = await Folder.create(
                    {
                        user,
                        title : `${title}.user.${user}`,
                        type : 'folder'
                    }
                )
                console.log('Folder is Created');
                res.json(folderCreation);
    }
    }

)
const createFile = asyncHandler(async (req,res) => {
    const {title,folderPath} = req.body;
    console.log("Request Body : ",req.body);
    console.log('Folder path',folderPath);
    const pather = folderPath.substring(0,folderPath.indexOf('.user'))
    console.log('Pather',pather);
    const fileFound = await Folder.findOne(
        {
            title : `${title}.user.${req.user._id}`,
        }
    )
    console.log('File Found : ',fileFound);
    
    if(fileFound !== null && folderPath === '/')
    {
        res.json({err : `${title} file is already exist`,status : 400} );
    }
    else
    {
        if(folderPath === '/')
        {
            const filePath = await req.file?.path;
            const file_url = await uploadOnCloudinary(filePath);
            const outsideFile = await Folder.create(
                {
                    type : "file",
                    title : `${title}.user.${req.user._id}`,
                    user  : `${req.user._id}`,
                    Url : file_url.url,
                }
            )
            return res.json(outsideFile);
        }
        const filePath = await req.file?.path;
        console.log(filePath);
        const file_url = await uploadOnCloudinary(filePath);
        // if(parentFolder === "")
        // {
        // const fileName = await Folder
        const fileDataExist = await Folder.findOne(
            {
                title : folderPath,
                files : {
                    $elemMatch : {
                        subTitle : `${title}.user.${req.user._id}`,
                     }
                 }
            }
        )
        console.log('File Data Exist : ',fileDataExist);
        if(fileDataExist !== null)
        {
            console.log(`file with this ${title} is already exist`);
            deleteUploaded(file_url.url);
            return res.json({err:`file with this ${title} is already exist`,status : 400})
        }
        else
        {
            const fileDataExist1 = await Folder.findOneAndUpdate(
                {
                    title : folderPath,
                },
                {
                $push :  { files : {
                        subTitle : `${title}.user.${req.user._id}`,
                        url : file_url.url,
                    }}
                }
            )   
            fileDataExist1.save({validateBeforeSave : false})
            console.log('File is created : ',fileDataExist1);
        }
        // fileData.save({validateBeforeSave : false})
        // res.json({fileData})

    }
        // }
    // else
    // {
    //     const parent = await Folder.findOne(
    //         {
    //             path : parentFolder.substring(0,path.indexOf('/')),
    //         }
    //     )
    //     parent.path = `${parentFolder}/${title}`;
    //     await parent.save({validateBeforeSave : false});
    // }
})
const deleteFolder = asyncHandler(async (req,res) => {
    // console.log(req.body);
    const {itemId,fId,type} = req.body;
    if((fId === undefined) && type === 'folder')
    {
        await Folder.findByIdAndDelete(itemId);
    }
    else 
    {
        await Folder.findOneAndUpdate(
            {
                _id: fId, 
            },
            {
                $pull: { 
                    files: { subTitle: itemId }
                }
            },
            {
                new: true, 
            }
        );
        console.log('Deleted Successfully');
    }
})
const getFiles = asyncHandler(async (req,res) => {
    // const fileId = req.parmas.id;
    // console.log('FileId : ',req.path);
    const str = req.path;
    const file = str.substring(10);
    console.log(file);
    const fileId = file.substring(0,file.indexOf('/'));
    const filed = fileId.replace('%20',' ');
    const filedId = filed.substring(0,filed.indexOf('/'))
    console.log(filed);
    console.log(filedId);
    const folder = file.substring(file.indexOf('/')+1);
    console.log(fileId);
    console.log(folder);
    console.log(fileId.indexOf(String(folder)));
    console.log(filed.includes(fileId));
    
    if(filed.includes(fileId) && folder == fileId)
    {
        const findFolder = await Folder.findById(folder)
        console.log(findFolder);
        res.json(findFolder);
    }
   else
    {
         const findFile = await Folder.find(
             {
                 _id : folder,
                 "files.subTitle": filed
                },
                {
                    "files.$" : 1
                }
            )
            console.log(findFile);
            // const idx = findFile[0].files.findIndex(ele => ele.subTitle === filed)
            // console.log(idx);
            if(findFile[0] != null)
                res.json(findFile[0].files[0])
        } 
})
const getFilesnFolders = asyncHandler(async (req, res) => {
    const userFF = await Folder.find(
        {
            user : req.user._id,
        }   
    )
    // console.log('User : ',req.user._id );
    // console.log("User files and folders: ",userFF);
    res.json(userFF);
});




export {createFolder,createFile,getFilesnFolders,deleteFolder,getFiles} 