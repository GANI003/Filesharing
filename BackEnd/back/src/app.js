import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./routes/users.routes.js"
// import files from './routes/files.routes.js';
const app = express()

app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL (React app running on localhost:3000
    credentials: true
}));

app.use(express.json({limit: "16mb"}))
app.use(express.urlencoded({extended: true, limit: "16mb"}))
// app.use(express.static("public"))
app.use(cookieParser())


// Register the routes
app.use('/users', userRouter);
// app.use('/files', files);

export { app };
