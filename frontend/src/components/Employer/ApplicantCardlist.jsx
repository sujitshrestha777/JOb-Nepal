import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, Grid } from "@mui/material";
import { getApplications } from "../../services/appServices";
import ApplicantDetailCard from "./ApplicantDetailCard";
// import ApplicantDetailCard from "./ApplicantDetailCard";

// const appData = [
//   {
//     title: "Full Stack Engineer",
//     company: "john Doe",
//     location: "San Francisco, CA",
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

function ApplicantCard({ app, onSelectApp }) {
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
        onSelectApp(app);
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight="bold">
          {app?.job?.title || "title"}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {app?.user?.name || "name"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {app.user?.userProfile?.location || "location"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {app?.content || "some content to s=display"}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function ApplicantCardList() {
  const [applications, setApplication] = useState([{}]);
  const [selectedApp, setSelectedApp] = useState({});
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await getApplications();
        if (response.status === 201) {
          setApplication(response.data.applications);
          setSelectedApp(response.data.applications[0]);
        }
      } catch (error) {
        console.log("error from fetching from the application", error);
      }
    };
    fetchApplicants();
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "row", height: "100vh" }}>
      <Box sx={{ maxWidth: 500 }}>
        <Grid container spacing={2}>
          {applications.map((app, index) => (
            <Grid item xs={12} key={index}>
              <ApplicantCard
                app={app}
                onSelectApp={(app) => {
                  setSelectedApp(app);
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ width: "800px" }}>
        <ApplicantDetailCard app={selectedApp} />
      </Box>
    </Box>
  );
}
