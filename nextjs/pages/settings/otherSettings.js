import React from 'react';
import { Box, Typography, FormControlLabel, Switch } from '@mui/material';
import { useState, useEffect } from "react";

const OtherSettings = () => {
    const [isCashMode, setIsCashMode] = useState(false);

    useEffect(() => {
        if (isCashMode) {
          document.body.style.cursor = "url('/cashCursor.png'), auto";
          document.addEventListener("click", handleClick);
        } else {
          document.body.style.cursor = "auto";
          document.removeEventListener("click", handleClick);
        }
    
        return () => {
          document.removeEventListener("click", handleClick);
        };
      }, [isCashMode]);

    const handleClick = (e) => {
        if (!isCashMode) return;
    
        const cashCount = 10;
        for (let i = 0; i < cashCount; i++) {
          const cashSplash = document.createElement("div");
          cashSplash.classList.add("cash-splash");
          cashSplash.style.left = `${e.clientX}px`;
          cashSplash.style.top = `${e.clientY}px`;
          cashSplash.style.setProperty("--x", Math.random() * 2 - 1);
          cashSplash.style.setProperty("--y", Math.random() * 2 - 1);
          document.body.appendChild(cashSplash);
    
            setTimeout(() => {
                cashSplash.remove();
            }, 700);
        }
    };

    return(
        <Box>
        <Typography variant="h5" gutterBottom>Other settings</Typography>
        <FormControlLabel
                sx={{ marginRight: '80px' }}
                control={
                    <Switch
                    checked={isCashMode}
                    onChange={() => setIsCashMode(!isCashMode)}
                    color="primary"
                    sx={{ marginRight: "10px" }}
                    />
                }
                label="Cash Mode"
            />
        </Box>
    )
};

export default OtherSettings;