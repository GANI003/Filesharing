import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const userCreationSchema = new mongoose.Schema(
    {
        username : {
            type : String,
            required : true
        },
        fullname : {
            type : String,
            required : true
        },
        email : {
            type : String,
            required : true
        },
        password : {
            type : String,
            requried : true
        },
        image : {
            type : String,
            requried : true
        },
        refreshToken : {
            type : String,
        }
    },
    {
        timestamps : true
    }
)

userCreationSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})
  
  // Checking password method
userCreationSchema.methods.checkPassword = async function(password){
    return await bcrypt.compare(password, this.password)
}
userCreationSchema.methods.generateaccessToken = async function()
{
       return jwt.sign(
        {
            _id : this._id,
            username:this.username,
            email : this.email,
            fullname : this.name,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
       )
}
userCreationSchema.methods.generaterefreshToken = async function()
{
    return jwt.sign(
        {
            _id : this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}

export const Usercreation = mongoose.model("Usercreation",userCreationSchema);
