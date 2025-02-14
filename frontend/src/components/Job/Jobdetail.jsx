import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  autocompleteClasses,
  Divider,
} from "@mui/material";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import SchoolIcon from "@mui/icons-material/School";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";

// const skills = ["iOS", "Python", "Jenkins"];
// const education = "Bachelor's degree";

export default function JobDetailCard({ job }) {
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
          ${job.salary} • Remote
        </Typography>

        {/* Apply and Save Buttons */}
        <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
          <Button variant="contained" color="primary">
            Apply now
          </Button>
          <Button variant="outlined">Save</Button>
        </Box>
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
