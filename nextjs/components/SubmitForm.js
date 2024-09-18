import React, { useState } from "react";
import axios from "axios";
import { Box, TextField, Button } from "@mui/material";

export default function SubmitForm() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    axios
      .post("/api/testbutton", { title })
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        console.error("Error posting data", error);
      });
  }

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <TextField 
          label="Title"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          required
        />
        <Button type="submit" color="primary">
          Submit
        </Button>
      </form>
      <p>Response from API: {message}</p>
    </Box>
  );
}
