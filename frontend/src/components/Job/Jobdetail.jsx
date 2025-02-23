import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  autocompleteClasses,
  Divider,
  Dialog,
  DialogActions,
  TextField,
  DialogContent,
  DialogTitle,
  Alert,
} from "@mui/material";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import SchoolIcon from "@mui/icons-material/School";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import { applyApplication } from "../../services/appServices";

// const skills = ["iOS", "Python", "Jenkins"];
// const education = "Bachelor's degree";

export default function JobDetailCard({ job }) {
  const [openForm, setOpenForm] = useState(false);
  const [message, setmessage] = useState("");
  const [appSuccess, setAppsuccess] = useState("");
  const [appError, setAppError] = useState("");
  const OpenApplicationForm = () => {
    setOpenForm(true);
  };
  const closeApplicationForm = () => {
    setOpenForm(false);
  };

  const handleAppSubmit = async () => {
    console.log("message", message);
    try {
      const data = {
        jobId: job.id,
        content: message,
      };

      const response = await applyApplication(data);
      console.log("res", response);

      if (response.status === 201) {
        setAppsuccess("Applied to jobPost");
        console.log("posted application", response);
        setTimeout(() => {
          setAppsuccess("");
          setOpenForm(false);
        }, 2000);
      }
    } catch (error) {
      console.log("from the applying the job", error);
      setAppError(error);
    }
  };
  console.log(job);
  return (
    <Card
      sx={{
        maxWidth: autocompleteClasses,
        mt: 1,
        p: 2,
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <CardContent>
        {/* Job Title Section */}
        <Typography variant="h5" fontWeight="bold">
          {job.title} || Full Stack Engineer (Developer Insights & Automation)
          (Remote - US)
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          ${job.salary} • {job.workLocation}
          <Typography
            variant="subtitle1"
            color="text.secondary"
            onClick={() => {
              console.log("from company name link");
            }}
            sx={{
              "&:hover": {
                textDecoration: "underline",
                cursor: "pointer",
              },
            }}
          >
            {job.companyName}
          </Typography>
        </Typography>

        {/* Apply and Save Buttons */}
        <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={OpenApplicationForm}
          >
            Apply now
          </Button>
          <Button variant="outlined">Save</Button>
        </Box>
        <Dialog
          open={openForm}
          onClose={closeApplicationForm}
          fullWidth
          aria-labelledby="application-dialog-title"
        >
          <DialogTitle id="application-dialog-title">
            Submit Job Application
          </DialogTitle>

          <DialogContent>
            <Box component="form" sx={{ mt: 2 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="message"
                label="Cover Letter / Message"
                value={message}
                onChange={(e) => setmessage(e.target.value)}
                placeholder="Write a message to the employer..."
                sx={{ mb: 2 }}
              />
            </Box>
          </DialogContent>
          {appSuccess && <Alert severity="success">{appSuccess}</Alert>}
          {appError && <Alert serverity="error">{appError}</Alert>}
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={closeApplicationForm} color="error">
              Cancel
            </Button>
            <Button
              onClick={handleAppSubmit}
              variant="contained"
              color="primary"
            >
              Submit Application
            </Button>
          </DialogActions>
        </Dialog>
        <Divider
          variant="middle"
          sx={{ my: 3, borderBottomWidth: 2, borderColor: "#333" }}
        />
        {/* Profile Insights */}
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Profile insights
        </Typography>

        {/* Skills Section */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "flex-end",
            flexWrap: "wrap",
          }}
        >
          <TipsAndUpdatesIcon />
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Skills
          </Typography>
        </Box>
        {/* <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", px: 3 }}>
          {job.skills.map((skill, index) => (
            <Chip key={index} label={skill} color="primary" sx={{ px: 1 }} />
          ))}
        </Box> */}

        <Typography variant="body2" sx={{ mt: 1, px: 3 }}>
          Do you have experience in these skills?
        </Typography>

        {/* Education Section */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "flex-end",
            flexWrap: "wrap",
          }}
        >
          <SchoolIcon />
          <Typography variant="subtitle1" sx={{ mt: 3 }}>
            Education
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", px: 3 }}>
          <Chip label={job.education} color="secondary" sx={{ px: 1 }} />
        </Box>
        <Typography variant="body2" sx={{ mt: 1, px: 3 }}>
          Do you have a {job.education}?
        </Typography>
        <Divider
          variant="middle"
          sx={{ my: 3, borderBottomWidth: 2, borderColor: "#333" }}
        />
        {/* Job details */}
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Job details
        </Typography>
        <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
          <WorkHistoryOutlinedIcon />
          <Typography variant="subtitle1" sx={{ mt: 1 }}>
            Experience
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", px: 3 }}>
          <Chip label={job.experience} color="primary" sx={{ px: 1 }} />
        </Box>
        <Typography variant="body2" sx={{ mt: 1, px: 3 }}>
          Do you have a {job.education} exprience?
        </Typography>
        <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
          <AccessTimeOutlinedIcon />
          <Typography variant="subtitle1" sx={{ mt: 1 }}>
            job type
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", px: 3 }}>
          <Chip label={job.jobtype} color="primary" sx={{ px: 1 }} />
        </Box>
        <Divider
          variant="middle"
          sx={{ my: 3, borderBottomWidth: 2, borderColor: "#333" }}
        />
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Full Job description
        </Typography>
        <Box sx={{ maxWidth: "880px" }}>
          <Typography variant="h7" sx={{ mt: 1 }}>
            {job.content} Yelp is looking for a Full Stack Engineer to join our
            Developer Insights & Automation team. This team is responsible for
            building tools and services that help Yelp engineers understand and
            improve their code. You’ll work with a team of engineers to build
            tools that help Yelp engineers write better code, faster. You’ll
            build tools that help Yelp engineers understand the impact of their
            changes, and automate repetitive tasks. You’ll work with a team of
            engineers to build tools t hat help Yelp engineers write better
            code, faster.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
