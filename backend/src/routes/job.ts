import { Router } from "express";
import { JobSchema, UpdateJobSchema } from "../types/types"; // Define these schemas
import client from "../utils/prisma";
import jwt from "jsonwebtoken";
import { authenticate, authorize } from "../middleware/auth.middleware"; // Middleware for auth

export const jobRouter = Router();

// Create a new job (employer only)
jobRouter.post("/", authenticate, authorize("EMPLOYER"), async (req, res) => {
  const parsedData = JobSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({ message: "Invalid input data", errors: parsedData.error.errors });
    return;
  }

  const { title,
    content,
    salary,
    experience,
    education,
    jobtype,
    skills,
    workLocation
   } = parsedData.data;

  try {
    const job = await client.job.create({
      data: {
        title,
        content,
        salary,
        experience,
        education,
        jobtype,
        skills,
        workLocation,
        employerId: req.userId, 
      },
    });

    res.status(200).json({ message: "Job created successfully", job });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ message: "Failed to create job" });
  }
});

// Get all jobs (public)
jobRouter.get("/", async (req, res) => {
  try {
    const jobs = await client.job.findMany({  
        orderBy:[
            {boost:'desc'},
            { createdAt:"asc"}
           ],
            take:7    
  });
    res.status(200).json({ jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
});

// Get a specific job by ID (public)
// jobRouter.get("/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     const job = await client.job.findUnique({
//       where: { id: parseInt(id) },
//     });
//     if (!job) {
//       res.status(404).json({ message: "Job not found" });
//       return;
//     }

//     res.status(200).json({ job });
//   } catch (error) {
//     console.error("Error fetching job:", error);
//     res.status(500).json({ message: "Failed to fetch job" });
//   }
// });

// Update a job (employer only)
jobRouter.put("/:id", authenticate, authorize("EMPLOYER"), async (req, res) => {

  const { id } = req.params;
  const parsedData = UpdateJobSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.status(400).json({ message: "Invalid input data", errors: parsedData.error.errors });
    return;
  }

  try {
    const job = await client.job.findUnique({
      where: { id: parseInt(id) },
    });

    if (!job) {
      res.status(404).json({ message: "Job not found" });
      return;
    }

    // Ensure the employer owns the job
    if (job.employerId !== req.userId) {
      res.status(403).json({ message: "You are not authorized to update this job" });
      return;
    }

    const updatedJob = await client.job.update({
      where: { id: parseInt(id) },
      data: parsedData.data,
    });

    res.status(200).json({ message: "Job updated successfully", job: updatedJob });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ message: "Failed to update job" });
  }
});

// Delete a job (employer only)
jobRouter.delete("/:id", authenticate, authorize("EMPLOYER"), async (req, res) => {
  const { id } = req.params;

  try {
    const job = await client.job.findUnique({
      where: { id: parseInt(id) },
    });

    if (!job) {
      res.status(404).json({ message: "Job not found" });
      return;
    }

    // Ensure the employer owns the job
    if (job.employerId !== req.userId) {
      res.status(403).json({ message: "You are not authorized to delete this job" });
      return;
    }
    await client.job.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ message: "Failed to delete job" });
  }
});

// Get applications for a specific job (employer only)
jobRouter.get("/:id/applications", authenticate, authorize("EMPLOYER"), async (req, res) => {
  const { id } = req.params;
  try {
    const job = await client.job.findUnique({
      where: { id: parseInt(id) },
    });

    if (!job) {
      res.status(404).json({ message: "Job not found" });
      return;
    }

    // Ensure the employer owns the job
    if (job.employerId !== req.userId) {
      res.status(403).json({ message: "You are not authorized to view these applications" });
      return;
    }

    const applications = await client.application.findMany({
      where: { jobId: parseInt(id) },
    });

    res.status(200).json({ applications });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
});

  