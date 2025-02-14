import React, { useState } from "react";
import {
  Dialog,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  MenuItem,
} from "@mui/material";

import { postJob } from "../../services/jobServices";

const PostJobModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    salary: 0,
    experience: "", // Default value
    education: "",
    jobtype: "", // Default value
    workLocation: "", // Default value
    skills: [],
  });
  // const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSkillsChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      skills: value.split(",").map((skill) => skill.trim()),
    });
  };

  const handleSave = async () => {
    const finalData = { ...formData };
    if (finalData.skills.length > 5) {
      setError("Skills should be max 5");
      return;
    }
    if (formData.salary) {
      formData.salary = Number(formData.salary);
    }

    console.log("final data for job post", finalData);
    try {
      // API call to save job data
      const response = await postJob(finalData);
      if (response.status === 200) {
        console.log("Job posted successfully");
        setSuccess("Job posted successfully");
      }
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
    setTimeout(() => {
      setSuccess(null);
      setError(null);
      onClose();
    }, 30000);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" component="h2">
          Post a Job
        </Typography>
        <TextField
          margin="normal"
          fullWidth
          name="title"
          label="Job Title"
          value={formData.title}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          fullWidth
          name="content"
          label="Job Description"
          value={formData.content}
          onChange={handleChange}
          multiline
          rows={4}
        />
        <TextField
          margin="normal"
          fullWidth
          name="salary"
          label="Salary"
          type="number"
          inputProps={{
            min: 0,
            onKeyDown: (e) => {
              if (e.key === "-") e.preventDefault();
            },
          }}
          value={formData.salary}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          fullWidth
          select
          name="experience"
          label="Experience Level"
          value={formData.experience}
          onChange={handleChange}
        >
          <MenuItem value="ENTRYLevel">Entry Level</MenuItem>
          <MenuItem value="MIDLevel">Mid Level</MenuItem>
          <MenuItem value="SENIOR">Senior Level</MenuItem>
        </TextField>
        <TextField
          margin="normal"
          fullWidth
          select
          name="education"
          label="Education Requirements"
          value={formData.education}
          onChange={handleChange}
        >
          <MenuItem value="BACHELOR">Bachelor</MenuItem>
          <MenuItem value="MASTER">Master</MenuItem>
          <MenuItem value="PHD">PhD</MenuItem>
        </TextField>
        <TextField
          margin="normal"
          fullWidth
          select
          name="jobtype"
          label="Job Type"
          value={formData.jobtype}
          onChange={handleChange}
        >
          <MenuItem value="FULLTIME">Full Time</MenuItem>
          <MenuItem value="PARTTIME">Part Time</MenuItem>
          <MenuItem value="FREELANCE">Freelance</MenuItem>
          <MenuItem value="INTERSHIP">Internship</MenuItem>
        </TextField>
        <TextField
          margin="normal"
          fullWidth
          select
          name="workLocation"
          label="work Location"
          value={formData.workLocation}
          onChange={handleChange}
        >
          <MenuItem value="ONSITE">Onsite</MenuItem>
          <MenuItem value="REMOTE">Remote</MenuItem>
          <MenuItem value="HYBRID">Hybrid</MenuItem>
        </TextField>
        <TextField
          margin="normal"
          fullWidth
          name="skills"
          label="Skills (comma separated max 5)"
          value={formData.skills.join(", ")}
          onChange={handleSkillsChange}
        />

        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          sx={{ mt: 2, float: "right" }}
        >
          Post Job
        </Button>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
      </Box>
    </Dialog>
  );
};

export default PostJobModal;
