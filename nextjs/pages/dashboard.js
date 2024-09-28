import React, { useState, useEffect } from 'react';
import { TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box } from '@mui/material';
import StockGraph from './stockData/stockData'; // Import the graph component to display stock data
import axios from 'axios';
import { useRouter } from 'next/router';
import { useAuth } from "@/context/auth";

const Dashboard = () => {
  const router = useRouter(); 
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedRow, setSelectedRow] = useState('');
  const [stockData, setStockData] = useState([]);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Loading state to track authentication
  const { userId, isLoggedIn, logout } = useAuth();

  // Check authentication when the component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      // No token, redirect to login
      router.push('/login');
    } else {
      axios
        .post('http://localhost:8000/auth/verify-token', { token })
        .then((response) => {
          if (response.data.valid) {
            setIsAuthenticated(true);
          } else {
            // Invalid token, clear it and redirect to login
            logout();
            router.push('/login');
          }
        })
        .catch(() => {
          // Catch any other errors and log out the user
          logout();
          router.push('/login');
        })
        .finally(() => {
          setIsLoading(false); // Stop the loading state
        });
    }
  }, [router]);

  // Fetch the user's favorite stocks and their predictions
  useEffect(() => {
    if (isAuthenticated && userId) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/stocks/${userId}/favorites`);
          const favoriteStocks = response.data;

          // Fetch predictions for each stock concurrently
          const stockPromises = favoriteStocks.map((stock) => handleTrackedStock(stock.ticker));
          await Promise.all(stockPromises);
        } catch (error) {
          console.error('Error fetching data: ', error);
        }
      };
      fetchData();
    }
  }, [userId, isAuthenticated]);

  const handleTrackedStock = async (ticker) => {
    try {
      const response = await axios.get(`http://localhost:8000/stocks/${ticker}/prediction`);
      const trackedStockInfo = response.data;

      const newStock = [
        trackedStockInfo.ticker,
        trackedStockInfo.pricing,
        trackedStockInfo.pred_price,
        trackedStockInfo.pred_vola,
      ];

      setRows((prevRows) => [...prevRows, newStock]); // Append the new stock data to the previous rows
    } catch (err) {
      setError('Error tracking stock');
    }
  };

  // Show loading screen while authentication is in progress
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If not authenticated, show nothing (or you can redirect or show an error message)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box marginTop="8rem" marginRight="10vw" marginLeft="10vw">
      <Typography variant="h4">Dashboard</Typography>
      <h2>{selectedRow}</h2>
      <StockGraph prices={stockData[0]} dates={stockData[1]} />
      <TextField
        label="Search stocks"
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ bgcolor: 'background.default', width: '300px', marginTop: '1rem', marginBottom: '1rem' }}
      />

      {/* Table for displaying stocks */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Your Stocks</TableCell>
              <TableCell align="right">Current Pricing</TableCell>
              <TableCell align="right">Predicted Price</TableCell>
              <TableCell align="right">Predicted Volatility</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row[0]}
                onClick={() => setSelectedRow(row)}
                sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}
              >
                <TableCell component="th" scope="row">
                  {row[0]}
                </TableCell>
                <TableCell align="right">{row[1]}</TableCell>
                <TableCell align="right">{row[2]}</TableCell>
                <TableCell align="right">{row[3]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Dashboard;
