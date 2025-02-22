import { Router } from "express";
import client from "../utils/prisma";
import { authenticate } from "../middleware/auth.middleware";
import { UpdateEmployerProfileSchema, UpdateUserProfileSchema } from "../types/types";
import { uploadFiles } from "../middleware/upload.middleware";
import path from "path";
import  fs from 'fs';
export const userRouter=Router()


//user id for profile anyone
userRouter.get("/profile/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const user = await client.user.findUnique({
        where: { id: parseInt(id) },
        include: {
          userProfile: true, // Include user profile details if available
          employerProfile: true, // Include employer profile details if available
        },
      });
  
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
  
      res.status(200).json({ user });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

// update or create the user profile
userRouter.put("/profile/user", authenticate,uploadFiles, async (req, res) => {
  const { userId } = req;
  const id =Number(userId)
  const parsedData = UpdateUserProfileSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.status(400).json({ message: "Invalid input data", errors: parsedData.error.errors });
    console.log("error in useprofile update parsed data", parsedData.error.errors)
    return    
  }
  const photoPath = req.files && !Array.isArray(req.files) && "photo" in req.files && Array.isArray(req.files["photo"])
  ? req.files["photo"][0].path
  : null;
  const resumePath = req.files && !Array.isArray(req.files) && "resume" in req.files && Array.isArray(req.files["resume"])
  ? req.files["resume"][0].path
  : null;
  console.log(photoPath,resumePath)
  

  try {
    const user = await client.user.findUnique({
      where: { id },
      include: { userProfile: true }, // Include the user's profile
    });

    if (!user) {
    res.status(404).json({ message: "User not found" });
    return 
    }

    // Ensure the user is updating their own profile
    if (user.id !== req.userId) {
     res.status(403).json({ message: "You are not authorized to update this profile" });
     return 
    }
    const updatedData={
      ...parsedData.data,
      ...(photoPath && { photoUrl: photoPath as string }),
      ...(resumePath&&{resumeUrl:resumePath as string})
    }

    // Update or create the UserProfile
    const updatedProfile = await client.userProfile.upsert({
      where: { UserId: id },
      update: updatedData,
      create: { ...updatedData, UserId:id },
    });

     res.status(200).json({ message: "User profile updated successfully", profile: updatedProfile });
  } catch (error) {
    console.error("Error updating user profile:", error);
   res.status(500).json({ message: "Failed to update user profile" });
  }
});

// update or create the employer profile
userRouter.put("/profile/employer", authenticate, uploadFiles, async (req, res) => {
  if (req.body.noEmployees) {
    req.body.noEmployees = parseInt(req.body.noEmployees, 10);
  }
  const photoPath = req.files && !Array.isArray(req.files) && "photo" in req.files && Array.isArray(req.files["photo"])
    ? req.files["photo"][0].path
    : null;
  
  const id = Number(req.userId); 
  const parsedData = UpdateEmployerProfileSchema.safeParse(req.body);
  if (!parsedData.success) {
     res.status(400).json({ message: "Invalid input data", errors: parsedData.error.errors });
     return
  }

  try {
    const user = await client.user.findUnique({
      where: { id },
      include: { employerProfile: true }, 
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return
    }

    // Ensure the user is updating their own profile
    if (user.id !== id) {
       res.status(403).json({ message: "You are not authorized to update this profile" });
       return
    }

    const updateData = {
      ...parsedData.data,
      ...(photoPath && { companyphotourl: photoPath as string }),
    };

    // Update or create the EmployerProfile
    const updatedProfile = await client.employerProfile.upsert({
      where: { UserId: id },
      update: updateData,
      create: { ...updateData, UserId: id },
    });

    res.status(200).json({ message: "Employer profile updated successfully", profile: updatedProfile });
  } catch (error) {
    console.error("Error updating employer profile:", error);
     res.status(500).json({ message: "Failed to update employer profile" });
     return
  }
});


//   userRouter.delete("/:id", authenticate, async (req, res) => {
//     const { id } = req.params;
  
//     // Check if the user is an admin
//     if (req.role !== "ADMIN") {
//       res.status(403).json({ message: "Unauthorized" });
//       return;
//     }
  
//     try {
//       await client.user.delete({
//         where: { id: parseInt(id) },
//       });
  
//       res.status(200).json({ message: "User deleted successfully" });
//     } catch (error) {
//       console.error("Error deleting user:", error);
//       res.status(500).json({ message: "Failed to delete user" });
//     }
//   }); 


userRouter.get("/profile/resume/:id", async (req, res) => {
  try {
    const { id } = req.params; 
    const user = await client.userProfile.findUnique({
      where: { UserId: parseInt(id) },
      select: { resumeUrl: true },
    });

    if (!user?.resumeUrl) {
        res.status(404).json({ error: "Resume not found" });
        return 
    }
    const filePath = path.resolve(user.resumeUrl);

    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: "File not found" });
      return
    }


    res.sendFile(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve resume" });
  }
}); 

userRouter.post("/profile/resume",authenticate,uploadFiles,async (req, res) => {
  try {
    const userId=req.userId
    const resumePath = req.files && !Array.isArray(req.files) && "resume" in req.files &&
    Array.isArray(req.files["resume"])
      ? req.files["resume"][0].path
      : null;
  
    const photoPath = req.files && !Array.isArray(req.files) && "photo" in req.files &&
     Array.isArray(req.files["photo"])
      ?req.files["photo"][0].path
      :null;

      console.log(`photo path :::: ${photoPath}`)

    const updatedUser = await client.userProfile.upsert({
      where: { UserId: Number(userId) },
      update: { resumeUrl: resumePath ,photoUrl: photoPath },
      create: {
        UserId: Number(userId),
        resumeUrl: resumePath,
        skills  : ["JavaScript", "React", "Node.js", "Python", "SQL"] ,
        bio    :  "very very hardworker",
       photoUrl:photoPath
      },
    });
    

    res.status(200).json({ message: 'Files uploaded successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `Failed to upload files${error}` });
  }
});

userRouter.get("/profile/photo/:id", async (req, res) => {
  try {
    const { id } = req.params; 
    const user = await client.userProfile.findUnique({
      where: { UserId: parseInt(id) },
      select: { photoUrl: true },
    });

    if (!user?.photoUrl) {
        res.status(404).json({ error:`photoUrl not found ` });
        return 
    }
    const filePath = path.resolve(user.photoUrl);

    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: "File not found" });
      return
    }


    res.sendFile(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve resume" });
  }
});

//get profile 
userRouter.get("/profile",authenticate, async (req, res) => { 
  const id  = req.userId;
  try {
    const user = await client.user.findUnique({
      where: { id: Number(id) },
      include: {
        userProfile: true, // Include user profile details if available
        employerProfile: true, // Include employer profile details if available
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if(user.employerProfile){
      const jobs= await client.job.findMany({
        where:{employerId:Number(id)}
      })
      res.status(200).json({ user,jobs });
    }

   
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

