import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Resetpassword = () => {
  const [form, setForm] = useState({ newPassword: "" });
  const [loading, setLoading] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.post(
        "http://localhost:5000/api/users/reset-password",
        { newPassword: form.newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.success) {
        toast.success("Password reset successful!", {
          position: "top-right",
          style: { background: "#4caf50", color: "#fff" },
        });
        setForm({ email: "", newPassword: "" });
      } else {
        toast.error(res.data.error || "Reset failed", {
          position: "top-right",
          style: { background: "#f44336", color: "#fff" },
        });
      }
    } catch (err) {
      toast.error("Server error");
    }
    setLoading(false);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
      bgcolor="#ebe9e9"
    >
      <Paper elevation={3} sx={{ p: 4, width: 350 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Reset Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="New Password"
            type={isShowPassword ? "text" : "password"}
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            fullWidth
            margin="normal"
            size="small"
            autoComplete="new-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setIsShowPassword((show) => !show)}
                    edge="end"
                  >
                    {isShowPassword ? <FaEyeSlash /> : <FaEye />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ mt: 2 }}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Resetpassword;
