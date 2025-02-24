import React, { useEffect, useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  Paper,
  Chip,
  Stack,
  Divider,
  Link,
  Container,
  Button,
  Alert,
} from "@mui/material";
import { LocationOn, School, Description, Email } from "@mui/icons-material";
import axios from "axios";

const ApplicantDetailCard = ({ app }) => {
  // Example data - in real app, this would come from props or API
  // console.log("app in aplicantdetailCard", app);
  const [appStatusSuccess, setAppStatusSuccess] = useState("");
  const [appStatusError, setAppStatusError] = useState("");
  useEffect(() => {
    setAppStatusError("");
    setAppStatusSuccess("");
  }, [app]);
  const handleAppliaction = async (status) => {
    setAppStatusError("");
    setAppStatusSuccess("");
    try {
      const data = {
        status,
      };
      console.log("status", data);
      const response = await axios.put(
        `http://localhost:5000/api/application/${app.id}/status`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("jwtToken"),
          },
        }
      );
      if (response.status === 201) {
        console.log("response from aapliaction", response.data);
        if (response.data.status === "ACCEPTED") {
          setAppStatusSuccess(response.data.status);
          return;
        }
        setAppStatusError("REJECTED");
      }
    } catch (error) {
      console.log("error from accept/reject application", error);
      setAppStatusError(error);
    }
  };

  const profile = {
    name: "John Doe",
    bio: "Full Stack Developer with 5 years of experience in building scalable web applications",
    location: "San Francisco, CA",
    email: "john.doe@example.com",
    photoUrl: "/api/placeholder/150/150",
    resumeUrl: "https://example.com/resume",
    skills: ["React", "Node.js", "TypeScript", "MongoDB", "AWS"],
    education: [
      {
        degree: "BS Computer Science",
        school: "University of California",
        year: "2019",
      },
    ],
  };
  const photoUrl = app.user?.userProfile?.photoUrl.replace(/\\/g, "/");
  console.log(photoUrl);

  return (
    <Container maxWidth="md" sx={{ py: 1 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: "flex", gap: 4, alignItems: "flex-start" }}>
          {/* Profile Image */}
          <Avatar
            src={`http://localhost:5000/${photoUrl}`}
            sx={{ width: 150, height: 150 }}
            alt={profile.name}
          />

          {/* Main Info */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" gutterBottom>
              {app?.user?.name || "name"}
            </Typography>

            <Stack spacing={2}>
              <Typography variant="body1" color="text.secondary">
                {app?.user?.userProfile?.bio || profile.bio}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocationOn color="action" />
                <Typography variant="body2">
                  {app.user?.userProfile?.location || profile.location}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Email color="action" />
                <Typography variant="body2">
                  {app?.user?.email || profile.email}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Description color="action" />
                <Link
                  href={
                    `http://localhost:5000/${app.user?.userProfile?.resumeUrl}` ||
                    ""
                  }
                  underline="hover"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Resume
                </Link>
              </Box>
            </Stack>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Skills Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Skills
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {app.user?.userProfile?.skills.map((skill) => (
              <Chip
                key={skill}
                label={skill}
                variant="outlined"
                sx={{ m: 0.5 }}
              />
            ))}
          </Stack>
        </Box>

        {/* Education Section */}
        <Box sx={{ position: "relative" }}>
          <Typography variant="h6" gutterBottom>
            Education
          </Typography>
          {profile.education.map((edu, index) => (
            <Box
              key={index}
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
            >
              <School color="action" />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {app?.user?.userProfile?.education}
                </Typography>
              </Box>
            </Box>
          ))}
          <Button
            variant="contained"
            sx={{
              height: 40,
              position: "absolute",
              bottom: 0,
              right: 100,
              bgcolor: "#DFF5E5", // Light pastel green
              color: "#116530", // Dark green text
              "&:hover": { bgcolor: "#C3E8D5" }, // Slightly darker green on hover
            }}
            onClick={() => {
              handleAppliaction("ACCEPTED");
            }}
          >
            Accept
          </Button>

          <Button
            variant="contained"
            sx={{
              height: 40,
              position: "absolute",
              bottom: 0,
              right: 0,
              bgcolor: "#FDE2E4", // Light pastel red (pinkish)
              color: "#D32F2F", // Darker red text
              "&:hover": { bgcolor: "#F8CFCF" }, // Slightly darker red on hover
            }}
            onClick={() => {
              handleAppliaction("REJECTED");
            }}
          >
            Reject
          </Button>
        </Box>
        {appStatusSuccess && (
          <Alert severity="success">{appStatusSuccess}</Alert>
        )}
        {appStatusError && <Alert severity="error">{appStatusError}</Alert>}
      </Paper>
    </Container>
  );
};

export default ApplicantDetailCard;
