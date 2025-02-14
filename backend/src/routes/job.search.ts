import { Router } from "express";
import client from "../utils/prisma";
import { JobFilterSchema } from "../types/types";
 
export const jobSerachRouter = Router()

// search based on tittle
jobSerachRouter.get("/search", async (req, res) => {
    let { title } = req.query; // Get the 'title' query parameter from the request
    if (!title) {
      res.status(400).json({ message: "Title query parameter is required" });
      return
    }
    try {
      // Search for jobs where the title contains the provided search term (case-insensitive)
      const jobs = await client.job.findMany({
        where: {
          title: {
            contains: title.toString(),  // Case-insensitive search
            mode: 'insensitive', // Ensures case-insensitive search
          },
        },
          orderBy: [
            { boost: 'desc' },       // Boosted jobs first
            { createdAt: 'asc' },    // Older jobs first
          ],
          take: 10,
        
      });
  
      if (jobs.length === 0) {
        res.status(404).json({ message: "No jobs found with that title" });
        return
      }
  
      res.status(200).json({ jobs });
    } catch (error) {
      console.error("Error searching jobs by title:", error);
      res.status(500).json({ message: "Failed to search jobs by title",error: error });
    }
});

// POST /filter
jobSerachRouter.post("/filter", async (req, res) => {
    const parsedData = JobFilterSchema.safeParse(req.body);
  
    if (!parsedData.success) {
      res.status(400).json({ message: "Invalid input data",errors: parsedData.error});
      return;
    }
    const {
     jobType,
     workLocation,
     experience,
     salary,
     education
    } = parsedData.data;
  
    try {
      
      const where :any= {};
  
      if (education) {
        where.education = {
          contains: education,
          mode: 'insensitive', // Case-insensitive search
        };
      }
      if(jobType){
        where.jobtype=jobType
      }
  
      if (salary ) {
        where.salary={gte :salary};
        
      }
  
      if (workLocation) {
        where.workLocation = workLocation;
      }
  
      if(experience) {
        where.experience = experience;
      }
  
      // Fetch jobs based on filters
      const jobs = await client.job.findMany({
        where,
        orderBy: [
          { boost: 'desc' },       // Boosted jobs first
          { createdAt: 'asc' },    // Older jobs first
        ],
        take:10
      });
  
      // Count total matching jobs
      const total = await client.job.count({ where });
  
      // Return response
      res.status(200).json({
        jobs,
        total,
      });
    } catch (error) {
      console.error("Error filtering jobs:", error);
      res.status(500).json({ message: "Failed to filter jobs" });
    }
  });
  

  
