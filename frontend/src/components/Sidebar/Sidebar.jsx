import React, { useContext, useState } from "react";
import {
  AppBar,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Button,
} from "@mui/material";
import axios from "axios";
import { JobsContext } from "../../context/Context";

function JobSearchSidebar() {
  const [filters, setFilters] = useState({
    jobtype: "",
    workLocation: "",
    experience: "",
    salary: "",
    education: "",
  });
  const { setJobs } = useContext(JobsContext);

  const handleChangeFilter = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = () => {
    // Remove entries with value ""
    const filtersToSend = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== "")
    );
    if (filtersToSend.salary) {
      filtersToSend.salary = Number(filtersToSend.salary);
    }
    const fectchFilterJobs = async () => {
      try {
        const data = JSON.stringify(filtersToSend);
        console.log("data last json formate", data);

        const response = await axios.post(
          "http://localhost:5000/api/jobSearch/filter",
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          console.log("fectchFilterJobs>>>>>", response.data);
          setJobs(response.data.jobs);
        }
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    fectchFilterJobs();
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
        Job Search Filters
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Job Type */}
        <FormControl fullWidth>
          <InputLabel id="job-type-label">Job Type</InputLabel>
          <Select
            labelId="job-type-label"
            id="job-type"
            name="jobtype"
            value={filters.jobtype}
            onChange={handleChangeFilter}
            label="Job Type"
          >
            <MenuItem value="">Any</MenuItem>
            <MenuItem value="FullTIME">Full-Time</MenuItem>
            <MenuItem value="PARTTIME">Part-Time</MenuItem>
            <MenuItem value="FREELANCE">Freelance</MenuItem>
            <MenuItem value="INTERNSHIP">Internship</MenuItem>
          </Select>
        </FormControl>

        {/* Location */}
        <FormControl fullWidth>
          <InputLabel id="location-label">Location</InputLabel>
          <Select
            labelId="location-label"
            id="location"
            name="workLocation"
            value={filters.workLocation}
            onChange={handleChangeFilter}
            label="Location"
          >
            <MenuItem value="">Any</MenuItem>
            <MenuItem value="REMOTE">Remote</MenuItem>
            <MenuItem value="ONSITE">Onsite</MenuItem>
            <MenuItem value="HYBRID">Hybrid</MenuItem>
          </Select>
        </FormControl>

        {/* Experience Level */}
        <FormControl fullWidth>
          <InputLabel id="experience-label">Experience Level</InputLabel>
          <Select
            labelId="experience-label"
            id="experience"
            name="experience"
            value={filters.experience}
            onChange={handleChangeFilter}
            label="Experience Level"
          >
            <MenuItem value="">Any</MenuItem>
            <MenuItem value="ENTRYLevel">Entry Level</MenuItem>
            <MenuItem value="MIDLevel">Mid Level</MenuItem>
            <MenuItem value="SENIOR">Senior Level</MenuItem>
          </Select>
        </FormControl>

        {/* Salary */}
        <FormControl fullWidth>
          <InputLabel id="salary-label">Salary</InputLabel>
          <Select
            labelId="salary-label"
            id="salary"
            name="salary"
            value={filters.salary}
            onChange={handleChangeFilter}
            label="Salary"
          >
            <MenuItem value="">Any</MenuItem>
            <MenuItem value="10000">रु10,000+</MenuItem>
            <MenuItem value="25000">रु25,000+</MenuItem>
            <MenuItem value="50000">रु50,000+</MenuItem>
            <MenuItem value="100000">रु100,000+</MenuItem>
          </Select>
        </FormControl>

        {/* Education */}
        <FormControl fullWidth>
          <InputLabel id="education-label">Education</InputLabel>
          <Select
            labelId="education-label"
            id="education"
            name="education"
            value={filters.education}
            onChange={handleChangeFilter}
            label="Education"
          >
            <MenuItem value="">Any</MenuItem>
            <MenuItem value="bachelor">Bachelor</MenuItem>
            <MenuItem value="master">Master</MenuItem>
            <MenuItem value="phd">PhD</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
          Apply Filters
        </Button>
      </Box>
    </AppBar>
  );
}

export default JobSearchSidebar;
