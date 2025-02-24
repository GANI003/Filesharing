import { asyncHandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken";
// import { User } from "../models/user.models.js";
import { Usercreation } from "../models/usersCreation.models.js";
import { Folder } from "../models/folders.models.js";
// import { userContext } from "../../../front/src/contex/UserContextProvider.jsx";
// import { userCreation } from "../controllers/usersCreation.controller.js";

export const jwtVerify = asyncHandler(async (req, res, next) => {
    try {
        // Get token from cookies or authorization header
        const token = req.cookies.accessToken || req.header("Cookie");
        // console.log(token)
        // If no token is found, respond with "Unauthorized Token"
        if (!token) {
            return res.status(401).json({ msg: "Unauthorized: No token provided" });
        }

        // Verify the token with the secret key
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // Find user by the ID decoded from the token
        const user = await Usercreation.findById(decodedToken?._id).select("-password -refreshToken");
        // const user = await Folder.findById(decodedToken._id);
        // console.log(decodedToken.username);
        // console.log("Tokens : ",decodedToken);
        // console.log("Users : ",user);

        // If user not found, respond with "Invalid Token"
        if (!user) {
            return res.status(401).json({ msg: "Invalid Token: User not found" });
        }

        // Attach the user to the request object
        req.user = user;

        // Call next() to pass control to the next middleware or route handler
        next();
    } catch (error) {
        // Catch any errors and respond with "Invalid access token"
        console.error("JWT Verification Error: ", error);
        return res.status(401).json({ msg: "Invalid access token" });
    }
});
