import React, { useState } from "react";
import {
  Dialog,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { updateEmployerProfile } from "../../services/authServices";

const EditProfileModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    companyName: "",
    bio: "",
    companyType: "",
    noEmployees: "",
    location: "",
    companyurl: "",
    photo: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setFormData({
      ...formData,
      photo: file,
    });
  };

  const handleSave = async () => {
    // Handle file upload before saving
    const finalData = {
      ...formData,
      photo: selectedFile,
    };
    // send finalData to API
    console.log(finalData);
    try {
      // API call to save data
      const response = await updateEmployerProfile(finalData);
      if (response.status === 200) {
        console.log("Profile updated successfully");
        setSuccess("Profile updated successfully");
      }
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
    setTimeout(() => {
      setSuccess(null);
      setError(null);
      onClose();
    }, 1000);
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
          Edit Profile
        </Typography>
        <TextField
          margin="normal"
          fullWidth
          name="companyName"
          label="Company Name"
          value={formData.companyName}
          onChange={handleChange}
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
          name="companyType"
          label="Company Type"
          value={formData.companyType}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          fullWidth
          name="noEmployees"
          label="Number of Employees"
          type="number"
          value={formData.noEmployees}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          fullWidth
          name="location"
          label="Location"
          value={formData.location}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          fullWidth
          name="companyurl"
          label="Company URL (Website) optional"
          value={formData.companyurl}
          onChange={handleChange}
        />

        <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 2 }}>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="company-photo-upload"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="company-photo-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUploadIcon />}
            >
              Upload Company Photo
            </Button>
          </label>
          {selectedFile && (
            <Typography variant="body2" color="textSecondary">
              {selectedFile.name}
            </Typography>
          )}
        </Box>

        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          sx={{ mt: 2, float: "right" }}
        >
          Save
        </Button>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
      </Box>
    </Dialog>
  );
};

export default EditProfileModal;
