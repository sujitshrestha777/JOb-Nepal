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

const EmployerProfile = () => {
  // Example data - in real app, this would come from props or API
  const [company, setCompany] = useState({
    companyName: "",
    bio: "",
    companyType: "",
    noEmployees: "",
    location: " ",
    companyurl: "",
    companyphotourl: "",
  });

  useEffect(() => {
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
    fetchEmployerProfile();
  }, []);

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
            }}
            src={`http://localhost:5000/${company.companyphotourl}`}
            alt={`${company.companyName} Logo`}
          />
          <Typography
            variant="h1"
            sx={{
              color: "white",
              fontSize: "4rem",
              opacity: 0.5,
            }}
          >
            {company.companyName.charAt(0)}
          </Typography>
        </Box>

        {/* Main Content */}
        <Box sx={{ p: 4 }}>
          <Stack spacing={4}>
            {/* Company Name and Basic Info */}
            <Box>
              <Typography variant="h3" gutterBottom>
                {company.companyName}
              </Typography>
              <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Business color="action" />
                  <Typography variant="body1">{company.companyType}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocationOn color="action" />
                  <Typography variant="body1">{company.location}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <People color="action" />
                  <Typography variant="body1">{company.noEmployees}</Typography>
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
                {company.bio}
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
            {company.companyurl && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <WebIcon color="action" />
                <Link
                  href={company.companyurl}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                >
                  Visit Company Website
                </Link>
              </Box>
            )}
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default EmployerProfile;
