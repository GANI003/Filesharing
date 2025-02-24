import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";
import {app} from "../app.js"

const connection = async () => {
    try{
        const connect = await mongoose.connect(`${process.env.MONGOO_URL}/${DB_NAME}`);
            // console.log(`Server is start listening from port ${process.env.PORT}`);
        console.log('MongoDB connection Successfull: ',connect.connection.host);
        
    }
    catch(err){
        console.log('Connection Failed');
    }
}

export default connection;