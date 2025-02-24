import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessandRefreshTokens = async (userId) => {
   try {
      const user = await User.findById(userId)
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()
      

      user.refreshToken = refreshToken
      await user.save({ validateBeforeSave: false })

      return {accessToken, refreshToken}


  } catch (error) {
      res.json({msg : "Something went wrong"})
  }
}

const registerUser = asyncHandler(async (req , res) => {
     // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res
    const {username,email,password,fullname} = req.body;
    if (
        [fullname, email, username, password].some((field) => field?.trim() === "")
    ) {
       res.json({msg : "Error"});
    }
   const existed = await User.findOne({
    $or : [{username},{email}]
   })
   if(existed) res.json({msg : "User already existed"})

   const avatarPath = await req.files?.avatar[0].path;
   const coverImagePath = await req.files?.coverImage[0].path;
   // let coverImagePath;
   // if(res.files && Array.isArray(res.files) && res.files.coverImage.length > 0)
   //    coverImagePath = await req.files?.coverImage[0].path;
   // else
   //  coverImagePath = "";

    const avatar = await uploadOnCloudinary(avatarPath)
    const coverImage = await uploadOnCloudinary(coverImagePath)

   if(!avatarPath) res.json({msg:"avatar file not found"})
   
   const user = await User.create({
    fullname,
    password,
    email,
    avatar : avatar.url,
    coverimage : coverImage.url,
    username  : username.toLowerCase(),
   })

   const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
   )

   if(!createdUser) res.json({msg : "User was not created"});

   res.json({msg : createdUser})

})

const loginUser = asyncHandler(async (req,res) => {
      const {username,email,password} = req.body;
      if([username,email,password].some((ele) => ele?.trim() === ""))
         res.json({msg : "All fields must be compulsary"})
      
      const user = await User.findOne({
         $or : [{username},{email}]
      })

      const passwordVerify = await user.isPasswordCorrect(password)

      if(!passwordVerify)
         res.json({msg : "Wrong Password"})
      const {accessToken,refreshToken} =await generateAccessandRefreshTokens(user._id);
      const loggedUser = await User.findById(user._id).select("-password -refreshToken")
      console.log(accessToken+" "+refreshToken);
      const option = {
         httpOnly : true,
         secure : true
      }
      // console.log(accessToken+" "+refreshToken);

      res.cookie("accessToken", accessToken, option)
      .cookie("refreshToken", refreshToken, option)
      .json({ msg: "Login successful", loggedUser, accessToken, refreshToken });

})

const logoutUser = asyncHandler(async (req,res) => {
   await User.findByIdAndUpdate(
      req.user._id,
      {
          $unset: {
              refreshToken: 1 // this removes the field from document
          }
      },
      {
          new: true
      }
  )

  const options = {
      httpOnly: true,
      secure: true
  }

  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json({msg : "Logged Out Successfully"})
})

const refreshNewToken = asyncHandler(async (req,res) => {
   const cookierefreshToken = req.cookies.refreshToken || req.body.refreshToken;
   if(!cookierefreshToken) res.json({msg : "Unauthorized Tokens"});

   const decodedOne = jwt.verify(cookierefreshToken,process.env.REFRESH_TOKEN_SECRET);

   const user = await User.findById(decoded._id)

   if(!user) req.json({msg : "Invalid refresh token"})

   if(cookierefreshToken !== user?.refreshToken)
      res.json({msg: "refresh token is expired"})
   
   const {accessToken,newrefreshToken} = await generateAccessandRefreshTokens(user._id);
   const option = {
      httpOnly : true,
      secure : true,
   }
   res
   .cookie("accessToken",accessToken,option)
   .cookie("refreshToken",newrefreshToken,option)
   .json({msg: "new refresh token is added"})
   

})

const changePassword = asyncHandler(async (req,res) => {
   const {oldPassword, newPassword} = req.body

    

    const user = await User.findById(req.user?._id)
    console.log(user);
    const check = await user.isPasswordCorrect(oldPassword)
    console.log(check);
    
    if (!check) {
        res.json({msg : "Wrong Password"});
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

   res.json({msg : "Password Updated Successfully"})

})

const changeAvatar = asyncHandler(async (req,res) => {
   const avatarLocalPath = req.file?.path;
   if(!avatarLocalPath) res.json({msg : "File path is required"})
   
   const avatar = await uploadOnCloudinary(avatarLocalPath);

   if(!avatar) res.json({msg : "Reupload again"});

   const user = await User.findByIdAndUpdate(
      req.user._id,
      {
         $set : {
            avatar : avatar.url,
         }
      },
      {
         new : true,
      }
   )
   await user.save({validateBeforeSave : false})
   res.json({msg : "Updated the new Image"})
})
export { 
   registerUser,
   loginUser,
   logoutUser,
   changePassword,
   changeAvatar,
 } 

