import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';


export const signup = async (req, res, next) => {
 const { username, email, password } = req.body
 if (!username || !email || typeof password !== 'string' || password.length < 6) return next(errorHandler(400, 'Enter a username, email and password of at least 6 characters'));
 const hashedPassword = bcryptjs.hashSync(password, 10);
 const newUser = new User({username, email, password: hashedPassword});
 try {
    await newUser.save()
 res.status(201).json('User created successfully!')
 } catch (error) {
    next(error);
 }
};


export const signin = async (req, res, next) => {
   const { email, password } = req.body
   try {
      const validUser = await User.findOne({email});
      if (!validUser) return next(errorHandler(404, 'User not Found!'));
      const validPassword = bcryptjs.compareSync(password, validUser.password);
      if (!validPassword) return next(errorHandler(401, 'Wrong credentials'));
      const token = jwt.sign({ id: validUser._id}, process.env.JWT_SECRET, {expiresIn:'7d'});
      const { password: pass, ...rest } = validUser._doc;
      res.cookie('access_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 604800000 }).status(200).json(rest);

   } catch(error) {
      next(error);
   }
}

export const google = async (req, res, next) => {
 try {
   if (!process.env.FIREBASE_API_KEY) return next(errorHandler(503, 'Google sign-in is unavailable'));
   if (typeof req.body.idToken !== 'string') return next(errorHandler(401, 'Google sign-in token is required'));
   const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key='+process.env.FIREBASE_API_KEY, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({idToken:req.body.idToken})});
   const account = await response.json();
   const identity = account.users?.[0];
   if (!response.ok || !identity?.email || !identity.emailVerified) return next(errorHandler(401,'Unable to verify Google sign-in'));
   let user = await User.findOne({email:identity.email});
   if (!user) user = await User.create({username:(identity.displayName || 'user').replace(/\s/g,'').toLowerCase()+crypto.randomUUID().slice(0,8),email:identity.email,password:bcryptjs.hashSync(crypto.randomUUID(),10),avatar:identity.photoUrl});
   const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});
   const {password,...safeUser}=user.toObject();
   res.cookie('access_token',token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:604800000}).json(safeUser);
 } catch(error){next(error);}
};

export const signOut = async (req, res, next) => {
   try {
      res.clearCookie('access_token');
      res.status(200).json('User has been logged out!');
   } catch (error) {
      next (error)
   }
}