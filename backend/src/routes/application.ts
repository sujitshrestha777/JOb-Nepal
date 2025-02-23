import { Router } from "express";
import { ApplicationSchema, UpdateApplicationSchema } from "../types/types"; // Define these schemas
import client from "../utils/prisma";
import { authenticate, authorize } from "../middleware/auth.middleware"; // Middleware for auth
import { Role } from "@prisma/client";
import { number } from "zod";

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

    // Create the application
    const application = await client.application.create({
      data: {
        jobId:Number(jobId),
        content:content,
        UserId: req.userId, 
        status: "PENDING", 

      },
    });

   res.status(201).json({ message: "Application submitted successfully", application });
   return 
  } catch (error) {
    console.error("Error applying for job:", error);
  res.status(500).json({ message: "Failed to apply for job" });
  }
});

// Get details of a specific application
applicationRouter.get("/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const application = await client.application.findUnique({
      where: { id: parseInt(id) },
    });

    if (!application) {
     res.status(404).json({ message: "Application not found" });
     return
    }

    // Ensure the user is the applicant or the employer
    if (application.id !== req.userId && !(req.role === "EMPLOYER")) {
       res.status(403).json({ message: "You are not authorized to view this application" });
       return
    }

     res.status(200).json({ application });
  } catch (error) {
    console.error("Error fetching application:", error);
    res.status(500).json({ message: "Failed to fetch application" });
  }
});

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

// Withdraw an application (job seeker only)
applicationRouter.delete("/:id", authenticate, authorize("USER"), async (req, res) => {
  const { id } = req.params;

  try {
    const application = await client.application.findUnique({
      where: { id: parseInt(id) },
    });

    if (!application) {
     res.status(404).json({ message: "Application not found" });
     return
    }

    // Ensure the user is the applicant
    if (application.UserId !== req.userId) {
       res.status(403).json({ message: "You are not authorized to withdraw this application" });
       return
    }

    await client.application.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Application withdrawn successfully" });
  } catch (error) {
    console.error("Error withdrawing application:", error);
     res.status(500).json({ message: "Failed to withdraw application" });
  }
});

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
  