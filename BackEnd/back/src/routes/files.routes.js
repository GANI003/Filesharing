import { Router } from "express";
import { upload } from "../middleware/multter.middleware.js";
import { jwtVerify } from "../middleware/auth.middleware.js";
import {  createFolder, getFilesnFolders,createFile,deleteFolder, getFiles } from "../controllers/folders.controller.js";
const router = Router();

router.route('/createFolder').post(jwtVerify,createFolder);
router.route('/createFile').post(jwtVerify,upload.single("url"),createFile);
router.route('/getFolders').get(jwtVerify,getFilesnFolders);
router.route('/getFiles/:id/:fid').get(jwtVerify,getFiles);
router.route('/deleteFile').patch(jwtVerify,deleteFolder);
router.route('/deleteFolder').patch(jwtVerify,deleteFolder);

export default router;