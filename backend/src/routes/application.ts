import { Router } from "express";
import { ApplicationSchema, UpdateApplicationSchema } from "../types/types"; // Define these schemas
import client from "../utils/prisma";
import { authenticate, authorize } from "../middleware/auth.middleware"; // Middleware for auth
import { Role } from "@prisma/client";
import { date, number } from "zod";

export const applicationRouter = Router();

// Apply for a job (job seeker only)
applicationRouter.post("/apply", authenticate, authorize("USER"), async (req, res) => {
  const parsedData = ApplicationSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({ message: "Invalid input data", errors: parsedData.error.errors });
    return
  }

  const { jobId,content } = parsedData.data;

  try {
    const job = await client.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      res.status(404).json({ message: "Jobpost not found" });
      return 
    }
    const userId_jobId=await client.application.upsert({
      where :{
        userId_jobId:{
          UserId:req.userId,
          jobId:jobId
        }
      },
      update:{
        createdAt:new Date(),
        content:content,
      },
      create:{
        jobId:Number(jobId),
        content:content,
        UserId: req.userId, 
        status: "PENDING", 
      }
    })
    if(userId_jobId){
      res.status(201).json({ message: "Application submitted successfully"});
      return 
    }
  } catch (error) {
    console.error("Error applying for job:", error);
  res.status(500).json({ message: "Failed to apply for job" });
  }
});

// // Get details of a specific application
// applicationRouter.get("/:id", authenticate, async (req, res) => {
//   const { id } = req.params;

//   try {
//     const application = await client.application.findUnique({
//       where: { id: parseInt(id) },
//     });

//     if (!application) {
//      res.status(404).json({ message: "Application not found" });
//      return
//     }

//     // Ensure the user is the applicant or the employer
//     if (application.id !== req.userId && !(req.role === "EMPLOYER")) {
//        res.status(403).json({ message: "You are not authorized to view this application" });
//        return
//     }

//      res.status(200).json({ application });
//   } catch (error) {
//     console.error("Error fetching application:", error);
//     res.status(500).json({ message: "Failed to fetch application" });
//   }
// });

// Update application status (employer only),AppStatus { PENDING ACCEPTED REJECTED}
applicationRouter.put("/:id", authenticate, authorize("EMPLOYER"), async (req, res) => {
  const { id } = req.params;
  const parsedData = UpdateApplicationSchema.safeParse(req.body);

  if (!parsedData.success) {
   res.status(400).json({ message: "Invalid input data", errors: parsedData.error.errors });
   return 
  }
  const {status} = parsedData.data

  try {
    const application = await client.application.findUnique({
      where: { id: parseInt(id) },
    });

    if (!application) {
     res.status(404).json({ message: "Application not found" });
     return 
    }

    // Ensure the employer owns the job
    const job = await client.job.findUnique({
      where: { id: application.jobId },
    });

    if (!job || job.employerId !== req.userId) {
     res.status(403).json({ message: "You are not authorized to update this application" });
     return
    }

    const updatedApplication = await client.application.update({
      where: { id: parseInt(id) },
      data: { status},
    });

   res.status(200).json({ message: "Application status updated successfully", application: updatedApplication });
   return
  } catch (error) {
    console.error("Error updating application:", error);
   res.status(500).json({ message: "Failed to update application" });
  }
});

applicationRouter.get("/lists",authenticate,authorize("EMPLOYER"),async(req,res)=>{
  try {
    const employerId=Number(req.userId);
    console.log("employer:",employerId);
          const applications = await client.application.findMany({
              where: {
                  job: {
                      employerId
                  }
              },
              include: {
                  user: {
                      include:{
                        userProfile:true
                      }
                  },
                  job: {
                      select: {
                          id: true,
                          title: true,
                          salary: true,
                          jobtype: true,
                          workLocation: true
                      }
                  }
              },
              orderBy: {
                  createdAt: 'desc'
              }
          });
  res.status(201).json({message:"succefully retrive the applications",applications})
  } catch (err) {
    console.log("error from fetching application",err)
    res.status(500).json({message:"faild to get the applications",error:err})
  }
})

// Get all applications of that particular job
applicationRouter.get("/job/:jobId", authenticate, async (req, res) => {
    const { jobId } = req.params;
    try {
      if (!jobId || isNaN(parseInt(jobId))) {
        res.status(400).json({ message: "Invalid job ID" });
        return;
      }
      // Fetch all applications for the given job ID
      const applications = await client.application.findMany({
        where: { jobId: parseInt(jobId) }, // Match the jobId
        include: {
          user: true, // Optionally include user data for applications
          job: true,  // Optionally include job data
        },
        orderBy: { createdAt: "desc" }, // Sort applications by creation date
      });
      if (!applications || applications.length === 0) {
        res.status(404).json({ message: "No applications found for this job" });
        return;
      }
      res.status(200).json({ applications });
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

//rejected or accepted of appliaction
applicationRouter.put("/:id/status",authenticate,authorize("EMPLOYER"),async(req,res)=>{
  const id=req.params.id;
  const {status}=req.body;
  if(!(status==="ACCEPTED"||status==="REJECTED")){
    res.status(401).json({message:"no status(rejected/accepted) is provided"});
    return
  }
  try {
    const postOwner=await client.application.findFirst({
      where:{
        id:Number(id),
        job:{
          employerId:req.userId
        }
      },
    })
   if(postOwner){
    const response=await client.application.update({
      where:{
        id:Number(id)
      },
      data:{
        status,
        updatedAt:new Date()
      }
    })
  }else{
    res.status(401).json({message:"not authorized "});
    return
  }
  res.status(201).json({message:"successfully status updated",status:status })
  } catch (error) {
    res.status(500).json({message:"server error",error})
  }
})