import express from 'express';
import authRoutes from './routes/auth.routes.js';
import connectMongoDB from './db/connectMongoDB.js';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json()); // to parse req.body
app.use(express.urlencoded({ extended: true })); // to parse urlencoded data

app.use(cookieParser());

app.use("/api/auth", authRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectMongoDB();
})