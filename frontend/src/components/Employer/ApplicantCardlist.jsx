import React from "react";
import { Card, CardContent, Typography, Box, Grid } from "@mui/material";

const jobData = [
  {
    title: "Full Stack Engineer",
    company: "john Doe",
    location: "San Francisco, CA",
  },
  {
    title: "Full Stack Engineer II - Creator Engagement",
    company: "Teachable",
    location: "Remote",
  },
  {
    title: "Full Stack Engineer II - Creator Engagement",
    company: "Teachable",
    location: "Remote",
  },
  {
    title: "Full Stack Engineer II - Creator Engagement",
    company: "Teachable",
    location: "Remote",
  },
  {
    title: "Full Stack Engineer II - Creator Engagement",
    company: "Teachable",
    location: "Remote",
  },
  {
    title: "Full Stack Engineer (Developer Insights & Automation)",
    company: "Yelp",
    location: "Remote - US",
  },
  {
    title: "CampusPress Site Specialist",
    company: "Incsub",
    location: "Remote",
  },
];

function ApplicantCard({ job }) {
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
    >
      <CardContent>
        <Typography variant="h6" fontWeight="bold">
          {job.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {job.company}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {job.location}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          i want to apply for this job iam very enthusiastic to work with you
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function ApplicantCardList() {
  return (
    <Box sx={{ maxWidth: 500 }}>
      <Grid container spacing={2}>
        {jobData.map((job, index) => (
          <Grid item xs={12} key={index}>
            <ApplicantCard job={job} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
