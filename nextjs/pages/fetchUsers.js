import React, { useState } from "react";
import axios from "axios";
import { Box, Button, Typography } from "@mui/material";

const FetchUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  // Function to fetch users
  const fetchUsers = async () => {
    try {
        console.log("Fetching users...");
      const response = await axios.get("http://localhost:8000/api/users");
      console.log("Data fetched:", response.data);
      setUsers(response.data);
      setError(null); // Clear any previous errors
    } catch (error) {
      setError("Error fetching users.");
      console.error("Error fetching users:", error);
    }
  };

  return (
    <Box>
      <Button variant="contained" color="primary" onClick={fetchUsers}>
        Get Users
      </Button>
      {error && <Typography color="error">{error}</Typography>}
      <ul>
        {users.map((user) => (
          <li key={user.user_id}>
            <Typography variant="body1">Username : {user.username} password :{user.password_hash} email:{user.email}</Typography>
          </li>
        ))}
      </ul>
    </Box>
  );
};

export default FetchUsers;

