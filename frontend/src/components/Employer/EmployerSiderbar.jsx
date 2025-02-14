import React from "react";
import { AppBar, Box, Button, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import { Business, LocationOn } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import EditProfileModal from "./EditProfile";
import PostJobModal from "./PostJob";

function EmployerSidebar() {
  // const [jobType, setJobType] = React.useState("");
  // const [location, setLocation] = React.useState("");
  // const [experience, setExperience] = React.useState("");
  // const [salary, setSalary] = React.useState("");
  // const [education, setEducation] = React.useState("");
  const [openEditProfile, setOpenEditProfile] = React.useState(false);
  const [openPostJOb, setOpenPostJOb] = React.useState(false);
  const navigate = useNavigate();

  const handleOpenEditProfile = () => {
    setOpenEditProfile(true);
  };
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#fff",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        border: "2px solid #333",
        borderRadius: "8px",
        padding: "16px",
        width: "300px",
      }}
    >
      <Typography
        variant="h6"
        sx={{ color: "#333", marginBottom: "16px", fontWeight: "bold" }}
      >
        companyName
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Business color="action" />
          <Typography variant="body1" color="#333">
            company.industry
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LocationOn color="action" />
          <Typography variant="body1" color="#333">
            company.location
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<EditIcon />}
          onClick={handleOpenEditProfile}
        >
          Edit profile
        </Button>
        <EditProfileModal
          open={openEditProfile}
          onClose={() => setOpenEditProfile(false)}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<VisibilityIcon />}
          onClick={() => navigate("/employer-profile")}
        >
          View profile
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<BusinessCenterIcon />}
          onClick={() => setOpenPostJOb(true)}
        >
          Post Job
        </Button>
        <PostJobModal
          open={openPostJOb}
          onClose={() => setOpenPostJOb(false)}
        />
      </Box>
    </AppBar>
  );
}

export default EmployerSidebar;
