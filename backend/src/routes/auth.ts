import { Router } from "express";
import {  SigninSchema, signupSchema } from "../types/types";
import { hash,compare } from "bcrypt";
import  client from "../utils/prisma"
import jwt from "jsonwebtoken"
export const authRouter=Router()

authRouter.post("/signup",async(req,res)=>{
    const parseddata =signupSchema.safeParse(req.body);
    if(!parseddata.success){
        res.status(401).json({"message":"invalid schema!!!"});
        return
    }
    const {name,email,password,role}=parseddata.data
    const hashedPassword = await hash(password, Number(process.env.HASH_NUMBER));
  
    try {
        const prevUser=await client.user.findFirst({
            where:{
                email,
            }
        })
        if(prevUser){
            res.status(402).json({message:"user email already exists"});
            return
        }
      const user=await client.user.create({
        data: {
          name,
          password: hashedPassword,
          email,
          role:role||"USER"
        },
      });
      const token=jwt.sign({userId:user.id,role:user.role},process.env.JWT_PASSWORD!,{expiresIn:"2d"})
      res.status(200).json({ message: "Signup success" ,token,role:user.role,userId:user.id});
      return;
    } catch (error) {
      console.error("Error during signup:", error);
      res.status(400).json({ message: "Signup failed" });
      return;
    }
})
authRouter.post("/signin",async(req,res)=>{
    const parsedData=SigninSchema.safeParse(req.body);
    if(!parsedData.success){
        res.json(400).json({"message":"invalid schema"});
        return
    }
    const {email,password}=parsedData.data;
    try {
        const user=await client.user.findUnique({
            where:{
                email
            }
        })
        if(!user){
            res.status(404).json({message:"email address not found"})
            return
        }
        const isValid=await compare(password,user.password);
        if(!isValid){
            res.status(403).json({message:"invalid password"})
            return
        }
        const token = jwt.sign(
            {
                userId: user.id,
                role:user.role
            },
            process.env.JWT_PASSWORD!,
            //1month expiry date
            { expiresIn:  '30d'}
        );
        res.status(200).json({message:"SignIN success",
            token,role:user.role,
            userId:user.id
        })
    }catch (error) {
        res.status(400).json({message:"SignIN failed!!!"})
    }
})
