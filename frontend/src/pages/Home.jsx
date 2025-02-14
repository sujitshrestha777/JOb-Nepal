// Home.jsx
import React from "react";
import { Box } from "@mui/material";
import Sidebar from "../components/Sidebar/Sidebar";
import JobCardList from "../components/Job/Joblist";
// import JobDetailCard from "../components/Job/Jobdetail";
// import Sidebar from "../components/Sidebar/Sidebar";
// import ProductGrid from "../components/Product/ProductGrid";

const Home = () => {
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
          <Sidebar />
        </Box>
        <Box>
          <JobCardList />
        </Box>
        {/* <Box><JobDetailCard /></Box> */}
      </Box>
    </Box>
  );
};

export default Home;
