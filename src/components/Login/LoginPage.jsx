import React from "react";
import { TextField, Button, Typography, Link, Box, Paper } from "@mui/material";
import backgroundImage from "../../assets/images/background.jpeg";

export default function LoginPage() {
 
  return (
    <Box
      sx={{
    width: "100vw",
    height: "100vh",
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    flexDirection: "column",
      }}
    >
     
      <Box sx={{ backgroundColor: "#2c3550", padding: 2, color: "#fff" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          <span style={{ color: "#54d2eb" }}>Task</span>
          <span style={{ color: "#f4e04d" }}>Flow</span>
          <span style={{ color: "#fff" }}> Pro</span>
        </Typography>
      </Box>

      <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            width: 320,
            backgroundColor: "rgba(0,0,0,0.6)",
            color: "white",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" align="center">
            Sign In
          </Typography>

          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{ style: { color: "#fff" } }}
            sx={{ backgroundColor: "#333" }}
          />

          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{ style: { color: "#fff" } }}
            sx={{ backgroundColor: "#333" }}
          />

          <Button variant="contained" color="primary" fullWidth>
            Sign In
          </Button>

          <Typography variant="body2" align="center">
            <Link href="#" underline="hover" color="inherit">
              Forgot password?
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}
