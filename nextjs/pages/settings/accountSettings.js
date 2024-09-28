import React, { useState, useEffect } from 'react';

const AccountSettings = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isEditing, setIsEditing] = useState({ username: false, email: false, password: false });

    // Fetch current user data from API on mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('/auth/user/me', { // Assuming this endpoint exists to fetch user data
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setUsername(data.username);
                    setEmail(data.email);
                } else {
                    alert('Failed to fetch user data');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    // Update the user profile data
    const handleUpdate = async (field, value) => {
        try {
            const response = await fetch('/auth/user/update', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ [field]: value })
            });

            const data = await response.json();
            if (response.ok) {
                alert(`${field} updated successfully!`);
            } else {
                alert(`Failed to update ${field}: ${data.detail}`);
            }
        } catch (error) {
            console.error(`Error updating ${field}:`, error);
            alert(`Error updating ${field}. Please try again.`);
        }
    };

    return (
        <div className="account-settings">
            <h2>Security</h2>

            {/* Username Section */}
            <div>
                <label>Username:</label>
                {!isEditing.username ? (
                    <span>{username} <button onClick={() => setIsEditing({ ...isEditing, username: true })}>Edit</button></span>
                ) : (
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onBlur={() => {
                            if (username) {
                                handleUpdate('username', username);
                                setIsEditing({ ...isEditing, username: false });
                            } else {
                                alert('Username cannot be empty');
                            }
                        }}
                    />
                )}
            </div>
            
            {/* Email Section */}
            <div>
                <label>Email:</label>
                {!isEditing.email ? (
                    <span>{email} <button onClick={() => setIsEditing({ ...isEditing, email: true })}>Edit</button></span>
                ) : (
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => {
                            if (email) {
                                handleUpdate('email', email);
                                setIsEditing({ ...isEditing, email: false });
                            } else {
                                alert('Email cannot be empty');
                            }
                        }}
                    />
                )}
            </div>

            {/* Password Section */}
            <div>
                <label>Password:</label>
                {!isEditing.password ? (
                    <span>•••••• <button onClick={() => setIsEditing({ ...isEditing, password: true })}>Edit</button></span>
                ) : (
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => {
                            if (password) {
                                handleUpdate('password', password);
                                setIsEditing({ ...isEditing, password: false });
                            } else {
                                alert('Password cannot be empty');
                            }
                        }}
                    />
                )}
            </div>

            {/* Add other sections like 2FA, SMS OTP, etc. */}
        </div>
    );
};

export default AccountSettings;
