import { Role } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
declare global {
    namespace Express {
        interface Request {
            userId: number;
            role:Role
        }
    }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const {authorization}=req.headers
    if(!authorization){
        res.status(404).json({message:"no token found"});
        return
    }
    // const token=authorization.split(" ")[1];
    const token=authorization;
    try {
        const decoded=jwt.verify(token,process.env.JWT_PASSWORD!) as {userId:number,role:Role};
        if(!decoded.userId){
            res.json({message:"authorized header are missing"});
            return
        }
        req.userId = decoded.userId;
        req.role=decoded.role;
        next()
       
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ message: 'Invalid token re login' });
            return
          } else if (error instanceof jwt.TokenExpiredError) {
            res.status(403).json({ message: 'Token expired re login' });
            return
          } else {
            res.status(500).json({ message: 'Server error re login' });
            return
          }
    }
};

export const authorize = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.role !== role) {
      res.status(403).json({ message: "Forbidden: Insufficient permissions" });
      return 
    }
    next();
  };
};