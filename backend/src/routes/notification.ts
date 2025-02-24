import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import client from "../utils/prisma";

export const notificationRouter=Router()

notificationRouter.get("/lists",authenticate,async(req,res)=>{
    try {
        const appResult=await client.application.findMany({
            where:{
                UserId:req.userId,
                status:{in:["ACCEPTED","REJECTED"]}
            },
            orderBy:{
                updatedAt:"desc"
            },
            select:{
                status:true,
                job:{
                    select:{
                        title:true,
                        employer:{
                            select:{
                              employerProfile:{
                                select:{
                                    id:true,
                                    companyName:true
                                }
                              }
                            }
                        }
                    }
                }
            },
            take:5
        })
        res.status(201).json({messagge:"succefully retrive the job status",appResult})
    } catch (error) {
        console.log("error from app status lists",error);
        res.status(500).json({message:"server error",error})
    }
})