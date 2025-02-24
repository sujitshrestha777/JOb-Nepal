import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Divider,
  Link,
  Stack,
} from "@mui/material";
import {
  Language as WebIcon,
  LocationOn,
  Business,
  People,
} from "@mui/icons-material";
import axios from "axios";
import { useParams } from "react-router-dom";

const EmployerProfile = () => {
  // Example data - in real app, this would come from props or API
  const [company, setCompany] = useState({
    companyName: "",
    bio: "",
    companyType: "",
    noEmployees: "",
    location: "",
    companyurl: "",
    companyphotourl: "",
  });
  const { id } = useParams();
  useEffect(() => {
    const fetchEmployerProfileId = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/user/profile/${id}`
        );
        if (response.status === 200) {
          const profileData = {
            ...response.data.user.employerProfile,
            companyphotourl:
              response.data.user.employerProfile.companyphotourl.replace(
                /\\/g,
                "/"
              ),
          };
          setCompany(profileData);
          console.log(profileData);
        }
      } catch (error) {
        console.error(error);
      }
    };
    const fetchEmployerProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/user/profile",
          {
            headers: {
              Authorization: localStorage.getItem("jwtToken"),
            },
          }
        );
        if (response.status === 200) {
          const profileData = {
            ...response.data.user.employerProfile,
            companyphotourl:
              response.data.user.employerProfile.companyphotourl.replace(
                /\\/g,
                "/"
              ),
          };
          setCompany(profileData);
          console.log(profileData);
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (id) {
      fetchEmployerProfileId();
      return;
    }
    fetchEmployerProfile();
  }, [id]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ overflow: "hidden" }}>
        {/* Header Banner */}
        <Box
          sx={{
            height: 200,
            bgcolor: "grey.800",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            component="img"
            sx={{
              height: 150,
              width: 150,
              borderRadius: "50%",
              position: "absolute",
              top: "50%",
              left: "10%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              opacity: 0.5,
            }}
            src={`http://localhost:5000/${company.companyphotourl}`}
            alt={`${company.companyName}. your company Logo`}
          />
          <Typography
            variant="h1"
            sx={{
              color: "white",
              fontSize: "4rem",
              opacity: 0.5,
            }}
          >
            {company.companyName.charAt(0) || "T"}
          </Typography>
        </Box>

        {/* Main Content */}
        <Box sx={{ p: 4 }}>
          <Stack spacing={4}>
            {/* Company Name and Basic Info */}
            <Box>
              <Typography variant="h3" gutterBottom>
                {company.companyName || "your company name"}
              </Typography>
              <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Business color="action" />
                  <Typography variant="body1">
                    {company.companyType || "company type"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocationOn color="action" />
                  <Typography variant="body1">
                    {company.location || "your company loaction"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <People color="action" />
                  <Typography variant="body1">
                    {company.noEmployees || "no of company employee"}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Divider />

            {/* About Section */}
            <Box>
              <Typography variant="h5" gutterBottom>
                About
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {company.bio || "company bio"}
              </Typography>
            </Box>

            {/* Open Positions */}
            <Box>
              <Typography variant="h5" gutterBottom>
                Open Positions
              </Typography>
              <Stack spacing={2}>
                {/* {company.openPositions.map((position) => (
                  <Paper key={position} variant="outlined" sx={{ p: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Work color="action" />
                        <Typography variant="body1">{position}</Typography>
                      </Box>
                      <Button variant="outlined" size="small">
                        Apply Now
                      </Button>
                    </Box>
                  </Paper>
                ))} */}
              </Stack>
            </Box>

            {/* Company Website */}

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <WebIcon color="action" />
              <Link
                href={company.companyurl}
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
              >
                {company.companyurl
                  ? "Visit Company Website"
                  : "your website link goes here"}
              </Link>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default EmployerProfile;
