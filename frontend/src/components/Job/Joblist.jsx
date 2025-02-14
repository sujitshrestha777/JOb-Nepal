import React, { useCallback, useContext, useEffect } from "react";
import { Card, CardContent, Typography, Box, Grid, Alert } from "@mui/material";
import axios from "axios";
import JobDetailCard from "./Jobdetail";
import { JobsContext, SearchContext } from "../../context/Context";

// const jobData = [
//   {
//     title: "Full Stack Engineer II - Creator Engagement",
//     company: "Teachable",
//     location: "Remote",
//   },
//   {
//     title: "Full Stack Engineer II - Creator Engagement",
//     company: "Teachable",
//     location: "Remote",
//   },
//   {
//     title: "Full Stack Engineer II - Creator Engagement",
//     company: "Teachable",
//     location: "Remote",
//   },
//   {
//     title: "Full Stack Engineer II - Creator Engagement",
//     company: "Teachable",
//     location: "Remote",
//   },
//   {
//     title: "Full Stack Engineer II - Creator Engagement",
//     company: "Teachable",
//     location: "Remote",
//   },
//   {
//     title: "Full Stack Engineer (Developer Insights & Automation)",
//     company: "Yelp",
//     location: "Remote - US",
//   },
//   {
//     title: "CampusPress Site Specialist",
//     company: "Incsub",
//     location: "Remote",
//   },
// ];

function JobCard({ job, onSelectJob }) {
  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: 1,
        mt: 1,
        bgcolor: "#f9f9f9",
        cursor: "pointer",
        ":hover": { boxShadow: 4 },
      }}
      onClick={() => {
        onSelectJob(job);
        // console.log("jobsssssssss", job);
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight="bold">
          {job.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {job.experience}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {job.workLocation}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function JobCardList() {
  // const [jobs, setJobs] = React.useState([]);
  const [selectedjob, setSelectedJob] = React.useState({});
  const { searchQuery } = useContext(SearchContext);
  const [error, setError] = React.useState("");
  const { jobs, setJobs } = useContext(JobsContext);

  const fetchJobs = useCallback(async () => {
    console.log("searchQuery", searchQuery);
    try {
      let response;
      if (!searchQuery) {
        response = await axios.get("http://localhost:5000/api/job");
      } else {
        response = await axios.get(
          `http://localhost:5000/api/jobSearch/search?title=${searchQuery}`
        );
      }
      if (response.status === 200) {
        setJobs(response.data.jobs);
        setSelectedJob(response.data.jobs[0]);
        console.log(`jobs ${searchQuery}`, response.data.jobs);
        setError(null);
      }
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "an error occur");
      console.log(error.message);
    }
  }, [searchQuery, setJobs]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <Box>
        {error && <Alert severity="error">{error}</Alert>}
        <Box sx={{ maxWidth: 500 }}>
          <Grid container spacing={2}>
            {jobs.map((job, index) => (
              <Grid item xs={12} key={index}>
                <JobCard job={job} onSelectJob={(job) => setSelectedJob(job)} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
      <JobDetailCard job={selectedjob} />
    </Box>
  );
}
