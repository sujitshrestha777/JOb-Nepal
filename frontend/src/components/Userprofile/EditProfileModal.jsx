import React, { useState, useEffect } from "react";
import {
  Dialog,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  MenuItem,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { UserprofileUpdate } from "../../services/profile";

const EditProfileModal = ({ open, onClose, initialData }) => {
  const [formData, setFormData] = useState({
    skills: [],
    bio: "",
    location: "",
    resumeUrl: "",
    photoUrl: "",
    education: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData((prevData) => ({
        ...prevData,
        ...initialData,
        skills: Array.isArray(initialData.skills) ? initialData.skills : [],
      }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSkillsChange = (e) => {
    const { value } = e.target;
    const skillsArray = value.split(",").map((skill) => skill.trim());
    setFormData((prevData) => ({
      ...prevData,
      skills: skillsArray.slice(0, 5), // Limit to 5 skills
    }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (type === "photo") {
      if (!file.type.startsWith("image/")) {
        setError("Please upload a valid image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setError("Image file size should be less than 5MB");
        return;
      }
      setSelectedFile(file);
    } else {
      if (file.type !== "application/pdf") {
        setError("Please upload a PDF file");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        setError("Resume file size should be less than 10MB");
        return;
      }
      setSelectedResume(file);
    }
    setError(null);
  };

  const handleSave = async () => {
    try {
      setError(null);

      if (formData.skills.length > 5) {
        setError("Skills should be max 5");
        return;
      }

      const data = new FormData();

      // Add basic form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "skills" && Array.isArray(value)) {
          value.forEach((skill) => {
            data.append("skills[]", skill);
          });
        } else if (value !== null && value !== undefined) {
          data.append(key, value);
        }
      });

      // Add files if selected
      if (selectedFile) {
        data.append("photo", selectedFile, selectedFile.name);
      }
      if (selectedResume) {
        data.append("resume", selectedResume, selectedResume.name);
      }

      // Log FormData contents for debugging
      for (let pair of data.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await UserprofileUpdate(data);

      if (response.status === 200) {
        setSuccess("Profile updated successfully");
        // Reset file selections after successful upload
        setSelectedFile(null);
        setSelectedResume(null);

        setTimeout(() => {
          setSuccess(null);
          onClose();
        }, 6000);
      }
    } catch (error) {
      setError(error.message || "Failed to update profile");
    }
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
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Edit Profile
        </Typography>

        <TextField
          margin="normal"
          fullWidth
          name="skills"
          label="Skills (comma separated max 5)"
          value={formData.skills.join(",")}
          onChange={handleSkillsChange}
          helperText={`${formData.skills.length}/5 skills added`}
        />

        <TextField
          margin="normal"
          fullWidth
          name="bio"
          label="Bio"
          value={formData.bio}
          onChange={handleChange}
          multiline
          rows={2}
        />

        <TextField
          margin="normal"
          fullWidth
          name="education"
          label="Education"
          value={formData.education}
          onChange={handleChange}
          select
        >
          <MenuItem value="Bachelors">Bachelors</MenuItem>
          <MenuItem value="Masters">Masters</MenuItem>
          <MenuItem value="PhD">PhD</MenuItem>
        </TextField>

        <TextField
          margin="normal"
          fullWidth
          name="location"
          label="Location"
          value={formData.location}
          onChange={handleChange}
        />

        <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 2 }}>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="photo-upload"
            type="file"
            onChange={(e) => handleFileChange(e, "photo")}
          />
          <label htmlFor="photo-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUploadIcon />}
            >
              Upload Photo
            </Button>
          </label>
          {selectedFile && (
            <Typography variant="body2" color="textSecondary">
              {selectedFile.name}
            </Typography>
          )}
        </Box>

        <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 2 }}>
          <input
            accept=".pdf"
            style={{ display: "none" }}
            id="resume-upload"
            type="file"
            onChange={(e) => handleFileChange(e, "resume")}
          />
          <label htmlFor="resume-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUploadIcon />}
            >
              Upload Resume (PDF)
            </Button>
          </label>
          {selectedResume && (
            <Typography variant="body2" color="textSecondary">
              {selectedResume.name}
            </Typography>
          )}
        </Box>

        {(error || success) && (
          <Box sx={{ mt: 2 }}>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
          </Box>
        )}

        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          sx={{ mt: 2, float: "right" }}
        >
          Save Changes
        </Button>
      </Box>
    </Dialog>
  );
};

export default EditProfileModal;
