import { Usercreation } from "../models/usersCreation.models.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessandRefresh = async (userId) => {
        try {
            const user = await Usercreation.findById(userId);
            const accessToken = await user.generateaccessToken();
            const refreshToken =await user.generaterefreshToken();
            // console.log(accessToken,refreshToken);
            user.refreshToken = refreshToken
            await user.save({ validateBeforeSave: false })
            return {accessToken,refreshToken};
        } catch (error) {
            console.log(error);
        }
}

const userCreation = asyncHandler(async (req , res , next) => {
        const {username,email,password,fullname} = req.body;
        if([username,email,password,fullname].some(ele => {ele?.trim() === ""}))
            res.json({msg : 'All the fields must required',err : true})
        const user = await Usercreation.findOne({
            $or : [{email},{username}]
        })
        if(user) res.json({msg : 'User is already exist',err : true})
        const imageLocalPath = await req.file?.path;
        if(!imageLocalPath) res.json({msg : 'Avatar is compulsary'})
        const image = await uploadOnCloudinary(imageLocalPath);
        if(!image) res.json({msg : 'Re-upolad the pic',err : true})
        const newUser = await Usercreation.create({
            username,
            email,
            password,
            fullname,
            image : image.url
        })
        console.log(newUser);
        
        console.log('User Login done Successfully');
        const loggedUser = await Usercreation.findById(newUser._id).select("-password");
            return res.json(loggedUser);
        // userLogin();
})

const userLogin = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    // Validate fields
    if ([username, email, password].some((ele) => ele?.trim() === "")) {
        return res.json({ msg: "All fields must be required" });
    }

    // Find user by username or email
    const user = await Usercreation.findOne({
        $or: [{ email }, { username }],
    });

    // User doesn't exist
    if (!user) {
        return res.json({ msg: "User does not exist", err: true });
    }

    // Check password
    const checkPass = await user.checkPassword(password);
    console.log(password);
    console.log(checkPass);
    if (!checkPass) {
        return res.json({ msg: "Wrong Password", err: true });
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessandRefresh(user._id);

    // Select user fields without password and refreshToken
    const loggedUser = await Usercreation.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
    };

    // If no token is found in cookies, set new cookies
    const token = req.cookies.accessToken || req.header("Cookie");

    if (!token) {
        return res
            .cookie("accessToken", accessToken, options)  // Set the accessToken cookie
            .cookie("refreshToken", refreshToken, options)  // Set the refreshToken cookie
            .json(loggedUser);  // Send the response after setting cookies
    }

    // If token exists, just send the loggedUser
    return res.json(loggedUser);
});


const refreshTokenFunc = asyncHandler(async (req,res) => {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    console.log(refreshToken);
    res.json({"Cookie" : refreshToken});
})

const logoutUser = asyncHandler(async (req,res) => {
     await Usercreation.findByIdAndUpdate(
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
      }
    
      return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({msg : "Logged Out Successfully"})
})

export {userCreation,userLogin,refreshTokenFunc,logoutUser}