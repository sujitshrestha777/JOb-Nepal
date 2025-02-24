import React, { useState, useEffect, useContext } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  Box,
  IconButton,
  Badge,
  Button,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import AuthModal from "../Auth/Auth";
import { useNavigate } from "react-router-dom";
import { AuthContext, SearchContext } from "../../context/Context";
import axios from "axios";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [Employeer, setIsEmployeer] = useState(false);
  const [logEmployeer, setlogEmployeer] = useState(false);
  const [logJobseeker, setlogJobseeker] = useState(false);
  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState([]);
  const { setSearchQuery } = useContext(SearchContext);
  const { role, setRole } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleHomeClick = () => {
    if (role === "USER") {
      navigate("/");
    }
    navigate("/employer");
  };
  const handleChange = (e) => {
    setSearch(e.target.value);
  };
  const handleSearch = () => {
    console.log(search);
    setSearchQuery(search);
  };

  const handleOpen = (IsEmployeer) => {
    setOpen(true);
    setIsEmployeer(IsEmployeer);
  };
  const handleClose = () => setOpen(false);
  const handleCloseNotification = () => {
    setAnchorEl(null);
  };

  const handleOpenNotification = async (event) => {
    setAnchorEl(event.currentTarget);
    try {
      const notificationsRes = await axios.get(
        "http://localhost:5000/api/notification/lists",
        {
          headers: {
            "Content-Type": "applicaion/json",
            Authorization: localStorage.getItem("jwtToken"),
          },
        }
      );
      if (notificationsRes.status === 201) {
        console.log("notification data", notificationsRes.data.appResult);
        setNotifications(notificationsRes.data.appResult);
      }
    } catch (error) {}
  };
  useEffect(() => {
    const Role = localStorage.getItem("role");
    if (Role === "EMPLOYER") {
      setlogEmployeer(true);
      setlogJobseeker(false);
      setRole("EMPLOYER");
    } else if (Role === "USER") {
      setlogJobseeker(true);
      setlogEmployeer(false);
      setRole("USER");
    } else {
      setlogEmployeer(false);
      setlogJobseeker(false);
    }
    console.log(Role, logEmployeer, logJobseeker);
    console.log("role", Role);
    console.log("UserId", localStorage.getItem("jobportalID"));
  }, [logEmployeer, logJobseeker, setRole, role]);

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#fff",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        border: "2px solid #333",
        borderRadius: "5px",
        padding: "4px 0px",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
          onClick={handleHomeClick}
        >
          <img
            src="/logo.png"
            alt="Logo"
            style={{ height: "40px", padding: "2px", marginRight: "4px" }}
          />
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
            JOb-Nepal
          </Typography>
        </Box>

        {/* Search Bar */}
        <Box
          sx={{
            display: "flex",
            flex: "auto",
            margin: "0 20px",
            alignItems: "center",
            backgroundColor: "#f5f5f5",
            borderRadius: "4px",
            padding: "5px",
          }}
        >
          <InputBase
            placeholder="Search "
            sx={{ flex: 1, paddingLeft: 2, color: "#333" }}
            type="text"
            value={search} // Bind value to product state
            onChange={handleChange} // Update state on change
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleSearch();
              }
            }} // Handle Enter key press
          />
          <IconButton onClick={handleSearch}>
            <SearchIcon />
          </IconButton>
        </Box>

        {/* Right Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {!logJobseeker && (
            <Button
              variant="contained"
              onClick={() => {
                handleOpen(false);
              }}
              sx={{
                padding: "10px 10px",

                borderRadius: "5px",
              }}
            >
              job seeker/apply job
            </Button>
          )}
          <AuthModal open={open} onClose={handleClose} isEmployer={Employeer} />
          {!logEmployeer && (
            <Button
              onClick={() => {
                handleOpen(true);
              }}
            >
              {" "}
              Employer/Post Job
            </Button>
          )}

          {(logEmployeer || logJobseeker) && (
            <Button
              startIcon={<AccountCircleIcon />}
              sx={{ textTransform: "none", color: "#333" }}
              onClick={() => {
                logEmployeer
                  ? navigate("/Employer-profile")
                  : navigate("/user-profile");
              }}
            >
              Welcome({logEmployeer ? "Employer" : "Jobseeker"})
            </Button>
          )}

          {/* Noification */}
          <IconButton onClick={handleOpenNotification}>
            <Badge color="primary">
              <NotificationsIcon fontSize="30px" sx={{ color: "#333" }} />
            </Badge>
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseNotification}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              sx: { p: 2, width: 400, mt: 1, borderRadius: 2 },
            }}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            {notifications.map((noti, index) => (
              <MenuItem
                key={index}
                sx={{ display: "flex", direction: "column" }}
                onClick={() => {
                  navigate(
                    `/Employer-profile/${noti.job.employer.employerProfile.id}`
                  );
                }}
              >
                <Stack direction="column" spacing={1}>
                  <Typography variant="h6">
                    You have been {noti.status}
                  </Typography>
                  <Typography variant="body6">
                    for {noti.job.title} at{" "}
                    {noti.job.employer.employerProfile.companyName}
                  </Typography>
                </Stack>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
