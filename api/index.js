import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import uploadRouter from './routes/upload.route.js';
const app = express();
app.disable('x-powered-by');
app.use(cors({origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true}));
app.use(express.json({limit:'1mb'}));
app.use(cookieParser());
app.get('/api/health', (req,res)=>res.json({success:true}));
let connection;
app.use('/api', async(req,res,next)=>{
  try {
    if (!process.env.MONGO_URI) return res.status(503).json({success:false,message:'Database is not configured'});
    if (mongoose.connection.readyState !== 1) {
      connection ||= mongoose.connect(process.env.MONGO_URI, {serverSelectionTimeoutMS:8000}).catch(error=>{connection=null;throw error;});
      await connection;
    }
    next();
  } catch(error) {next(error);}
});
app.use('/api/upload',uploadRouter);
app.use('/api/user',userRouter);
app.use('/api/auth',authRouter);
app.use('/api/listing',listingRouter);
app.use((req,res)=>res.status(404).json({success:false,message:'Route not found'}));
app.use((err,req,res,next)=>{
  const status = err.code === 11000 ? 409 : ['ValidationError','CastError','MulterError'].includes(err.name) ? 400 : err.statusCode || 500;
  res.status(status).json({success:false,message:err.code===11000?'Username or email is already in use':status===500?'Unable to complete request. Please try again.':err.message});
});
if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') app.listen(process.env.PORT || 3000);
export default app;
