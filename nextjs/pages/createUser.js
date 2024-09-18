import { useState } from "react";
import axios from "axios";

const CreateUser = () => {
  const [username, setUsername] = useState("");
  const [password_hash, setPassword_hash] = useState("");
  const [email, setEmail] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const handleCreateUser = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/users", {
        username: username,
        password_hash: password_hash,
        email: email,
      });

      if (response.status === 201) {
        setResponseMessage("User created successfully!");
      } else {
        setResponseMessage("Failed to create user.");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      setResponseMessage("An error occurred.");
    }
  };

  return (
    <div>
      <h1>Create User</h1>
      <form onSubmit={handleCreateUser}>
        <div>
          <label>Username: </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password: </label>
          <input
            type="text"
            value={password_hash}
            onChange={(e) => setPassword_hash(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create User</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default CreateUser;
