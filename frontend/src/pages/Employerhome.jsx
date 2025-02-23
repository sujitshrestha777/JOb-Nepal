// Home.jsx
import React from "react";
import { Box } from "@mui/material";

import EmployerSidebar from "../components/Employer/EmployerSiderbar";
import ApplicantCardList from "../components/Employer/ApplicantCardlist";

// import UserProfile from "../components/Userprofile/Userprofile";
// import Sidebar from "../components/Sidebar/Sidebar";
// import ProductGrid from "../components/Product/ProductGrid";

const EmployerHome = () => {
  //   const handleSearch = (filters) => {
  //     console.log("Filters:", filters);
  //   };

  return (
    <Box sx={{ marginTop: "10px" }}>
      <Box
        sx={{
          display: "flex",
          gap: "15px",
        }}
      >
        <Box sx={{ mt: "5px" }}>
          <EmployerSidebar />
        </Box>
        <Box>
          <ApplicantCardList />
        </Box>
      </Box>
    </Box>
  );
};

export default EmployerHome;
