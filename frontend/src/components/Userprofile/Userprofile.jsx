import React, { useEffect } from "react";
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
} from "@mui/material";
import { LocationOn, School, Description, Email } from "@mui/icons-material";
import EditProfileModal from "./EditProfileModal";
import { GetProfile } from "../../services/profile";

const UserProfile = ({ userType }) => {
  const [openEditProfile, setEditProfile] = React.useState(false);
  const [profiles, setProfileData] = React.useState({});
  const [refresh, setRefresh] = React.useState(false);

  useEffect(() => {
    console.log("userType insider the uesrProfile");
    // fetch user profile data
    const fetchProfile = async () => {
      try {
        const response = await GetProfile();
        if (response.status === 200) {
          const data = response.data.user;
          const userProfile = {
            ...data,
            userProfile: {
              ...data.userProfile,
              photoUrl: data.userProfile?.photoUrl.replace(/\\/g, "/"),
            },
          };
          setProfileData(userProfile);
          console.log("profile fetch data", data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfile();
  }, [refresh]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: "flex", gap: 4, alignItems: "flex-start" }}>
          {/* Profile Image */}
          <Avatar
            src={`http://localhost:5000/${profiles.userProfile?.photoUrl}`}
            sx={{ width: 150, height: 150 }}
            alt={profiles.name}
          />

          {/* Main Info */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" gutterBottom>
              {profiles.name || "your name?"}
            </Typography>

            <Stack spacing={2}>
              {profiles.userProfile?.bio && (
                <Typography variant="body1" color="text.secondary">
                  {profiles.userProfile.bio || "your bio?"}
                </Typography>
              )}

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocationOn color="action" />
                <Typography variant="body2">
                  {profiles.userProfile?.location || "your location?"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Email color="action" />
                <Typography variant="body2">
                  {profiles.email || "your email address"}
                </Typography>
              </Box>

              {profiles.userProfile?.resumeUrl ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Description color="action" />
                  <Link
                    href={`http://localhost:5000/${profiles.userProfile?.resumeUrl}`}
                    underline="hover"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Resume
                  </Link>
                </Box>
              ) : (
                <Box display={"flex"} gap={1}>
                  <Description color="action" />
                  <Typography> your Resume</Typography>
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
            {profiles.userProfile?.skills?.length
              ? profiles.userProfile?.skills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    variant="outlined"
                    sx={{ m: 0.5 }}
                  />
                ))
              : Array.from({ length: 5 }, (_, i) => (
                  <Chip
                    key={i}
                    label={`skill${i + 1}`}
                    variant="outlined"
                    sx={{ m: 0.5 }}
                  />
                ))}
          </Stack>
        </Box>

        {/* Education Section */}
        <Box
          sx={{
            position: "relative",
          }}
        >
          <Box>
            <Typography variant="h6" gutterBottom>
              Education
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <School color="action" />
              <Typography variant="body2">
                {profiles.userProfile?.education || "your education"}
              </Typography>
            </Box>
          </Box>
          {userType === "user" ? (
            <Button
              variant="contained"
              color="primary"
              sx={{ height: 40, position: "absolute", bottom: 0, right: 0 }}
              onClick={() => setEditProfile(true)}
            >
              Edit Profile
            </Button>
          ) : userType === "employer" ? (
            <Button
              variant="contained"
              color="secondary"
              sx={{ height: 40, position: "absolute", bottom: 0, right: 0 }}
            >
              accept
            </Button>
          ) : null}
          <EditProfileModal
            open={openEditProfile}
            onClose={() => {
              setEditProfile(false);
              setRefresh((prev) => !prev);
            }}
          />
        </Box>
      </Paper>
    </Container>
  );
};

export default UserProfile;
