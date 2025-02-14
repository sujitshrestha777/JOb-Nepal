import React from "react";
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
} from "@mui/material";
import { LocationOn, School, Description, Email } from "@mui/icons-material";

const ApplicantDetailCard = () => {
  // Example data - in real app, this would come from props or API
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

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: "flex", gap: 4, alignItems: "flex-start" }}>
          {/* Profile Image */}
          <Avatar
            src={profile.photoUrl}
            sx={{ width: 150, height: 150 }}
            alt={profile.name}
          />

          {/* Main Info */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" gutterBottom>
              {profile.name}
            </Typography>

            <Stack spacing={2}>
              {profile.bio && (
                <Typography variant="body1" color="text.secondary">
                  {profile.bio}
                </Typography>
              )}

              {profile.location && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocationOn color="action" />
                  <Typography variant="body2">{profile.location}</Typography>
                </Box>
              )}

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Email color="action" />
                <Typography variant="body2">{profile.email}</Typography>
              </Box>

              {profile.resumeUrl && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Description color="action" />
                  <Link href={profile.resumeUrl} underline="hover">
                    View Resume
                  </Link>
                </Box>
              )}
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
            {profile.skills.map((skill) => (
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
        <Box>
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
                <Typography variant="body1">{edu.degree}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {edu.school} • {edu.year}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>
    </Container>
  );
};

export default ApplicantDetailCard;
