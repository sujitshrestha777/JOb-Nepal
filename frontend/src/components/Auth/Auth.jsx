import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Backdrop,
  Alert,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { signIn, signUp } from "../../services/authServices";
import { AuthContext } from "../../context/Context";

const AuthModal = ({ open, onClose, isEmployer }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { setRole } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleformDatachange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError(null);
    setSuccess(null);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      if (isSignUp) {
        console.log(isSignUp);
        if (formData.password !== formData.confirmPassword) {
          console.log(isSignUp);
          setError("Passwords do not match");
          return;
        }
        const response = await signUp(formData, isEmployer);
        if (response === "signup success") {
          setSuccess(response);
          setRole(localStorage.getItem("role"));
          onClose();
          navigate(isEmployer ? "/employer" : "/");
        }
      } else {
        const response = await signIn({
          email: formData.email,
          password: formData.password,
        });
        if (response === "signin success") {
          setSuccess(response);
          setRole(localStorage.getItem("role"));
          onClose();
          navigate(isEmployer ? "/employer" : "/");
        }
      }
      // onClose();
      // window.location.href = isEmployer ? "/employer/dashboard" : "/dashboard";
    } catch (err) {
      console.log("error__________________", err);
      setError(err.message);
    }
  };

  return (
    <>
      <Backdrop
        open={open}
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(4px)",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      />
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
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent component="form" onSubmit={handleSubmit}>
          <Box component="form" sx={{ mt: 2 }}>
            {isSignUp && (
              <TextField
                fullWidth
                name="name"
                label="Full Name"
                margin="normal"
                value={formData.name}
                onChange={handleformDatachange}
                required
                variant="outlined"
              />
            )}

            <TextField
              fullWidth
              name="email"
              label="Email"
              margin="normal"
              value={formData.email}
              onChange={handleformDatachange}
              required
              type="email"
              variant="outlined"
            />

            <TextField
              fullWidth
              name="password"
              label="Password"
              margin="normal"
              value={formData.password}
              onChange={handleformDatachange}
              required
              type="password"
              variant="outlined"
            />

            {isSignUp && (
              <TextField
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                margin="normal"
                value={formData.confirmPassword}
                onChange={handleformDatachange}
                required
                type="password"
                variant="outlined"
              />
            )}

            <Button
              fullWidth
              variant="contained"
              type="submit"
              size="large"
              onClick={handleSubmit}
              sx={{ mt: 3, mb: 2 }}
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </Button>

            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                {isSignUp
                  ? "Already have an account?"
                  : "Don't have an account?"}
                <Button onClick={toggleMode} sx={{ ml: 1 }}>
                  {isSignUp ? "Sign In" : "Sign Up"}
                </Button>
              </Typography>
            </Box>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AuthModal;
