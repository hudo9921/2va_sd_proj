import React, { useCallback } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import BrowserNotSupportedIcon from "@mui/icons-material/BrowserNotSupported";
import { useNavigate } from 'react-router-dom';
import { Routes } from "../../constants";

const styles = {
  backgroundColor: "#1e1e1e",
  height: "100vh",
  width: "75%",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  alignItems: "center",
  color: "white",
  fontSize: "10rem",
};

type Props = {};

const PageNotFound = (props: Props) => {
  const navigate = useNavigate();

  const handleLinkClick = useCallback(() => {
    navigate(Routes.HOME);
  }, [navigate]);
  
  return (
    <Box sx={styles}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          pb: "20px",
        }}
      >
        <BrowserNotSupportedIcon sx={{ fontSize: "10rem" }} />
        <Box>404</Box>
      </Box>
      <Button
        variant="contained"
        sx={{ bgcolor: "#b65dff", "&:hover": { bgcolor: "#7b3ead" } }}
        onClick={handleLinkClick}
      >
        Go to Home
      </Button>
    </Box>
  );
};

export default PageNotFound;
