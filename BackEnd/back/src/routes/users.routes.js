import { Router } from "express";
// import {
//     loginUser , logoutUser, registerUser,changePassword,changeAvatar
// } from "../controllers/users.controller.js"
import { upload } from "../middleware/multter.middleware.js";
import { jwtVerify } from "../middleware/auth.middleware.js";
import { refreshTokenFunc, userCreation, userLogin,logoutUser } from "../controllers/usersCreation.controller.js";
import {  createFolder, getFilesnFolders,createFile,deleteFolder, getFiles } from "../controllers/folders.controller.js";
import {  createTextFile,deleteTextFile,deleteVersion,getTextFile, versionTheFile } from "../controllers/text.controller.js";
const router = Router();

//login routes
// router.route('/register').post(
//     // (req,res) => {
//     // res.json({
//     //     msg:"done",
//     // })}
//     upload.fields
//     ([
// {
//         name : "avatar",
//         maxCount : 1
//     },
//     {
//         name : "coverImage",
//         maxCount : 1
//     }
// ]
// ),
//     registerUser
// );
// router.route('/login').post(loginUser)
// router.route('/login/changePassword').patch(jwtVerify,changePassword)
// router.route('/login/changeAvatar').patch(upload.single("avatar"),jwtVerify,changeAvatar)
// router.route('/logout').post(jwtVerify,logoutUser)
//login using the front-end
router.route('/register').post(upload.single("image"),userCreation);
router.route('/login').post(userLogin);
router.route('/logout').get(jwtVerify,logoutUser);
router.route('/cookieGetter').get(refreshTokenFunc);
router.route('/createFolder').post(jwtVerify,createFolder);
router.route('/createFile').post(jwtVerify,upload.single("url"),createFile);
router.route('/getFolders').get(jwtVerify,getFilesnFolders);
router.route('/createText').post(jwtVerify,createTextFile);
router.route('/getTextFiles').get(jwtVerify,getTextFile);
router.route('/versionText').post(jwtVerify,versionTheFile);
router.route('/deleteFolder').patch(jwtVerify,deleteFolder);
router.route('/deleteFile').patch(jwtVerify,deleteFolder);
router.route('/getFiles/:id/:fid').get(jwtVerify,getFiles);
router.route('/deleteTextFile/:id').delete(jwtVerify,deleteTextFile);
router.route('/deleteVersion/:fileId/:versionId').delete(jwtVerify,deleteVersion);


export default router;
