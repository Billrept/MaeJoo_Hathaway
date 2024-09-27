import React, { useState, useEffect } from 'react';
import { TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography, Box } from '@mui/material';
import StockGraph from './stockData/stockData'; // Import the graph component to display stock data
import axios from 'axios';
import { useRouter } from 'next/router';

const Dashboard = () => {
  const router = useRouter();
  const { userId } = router.query; // Extract userId from the URL

  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedRow, setSelectedRow] = useState('');
  const [stockData, setStockData] = useState([]);
  const [stockSearch, setStockSearch] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication when the component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/login'); // Redirect to login if no token
    } else {
      axios.post('http://localhost:8000/auth/verify-token', { token })
        .then(response => {
          if (response.data.valid) {
            setIsAuthenticated(true); // Token is valid, allow access
          } else {
            router.push('/login'); // Redirect if token is invalid
          }
        })
        .catch(() => {
          router.push('/login'); // Redirect on error
        });
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        try {
          console.log('User Id: ', userId);
          // Fetch user-tracked stocks using the userId
          const response = await axios.get('http://localhost:8000/auth/user-stocks', { params: { userId } });
          const newRows = response.data.map(item => [
            item.ticker,
            item.pricing,
            item.pred_price,
            item.pred_vola
          ]);
          setRows(newRows);
          console.log('Data fetched: ', response.data);
        } catch (error) {
          console.error('Error fetching data: ', error);
        }
      };
      fetchData();
    }
  }, [userId, isAuthenticated]);

  const handleTrackedStock = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('http://localhost:8000/auth/track-stock', { params: { stockSearch } });
      const trackedStockInfo = response.data;

      const newStock = [
        trackedStockInfo.ticker,
        trackedStockInfo.pricing,
        trackedStockInfo.pred_price,
        trackedStockInfo.pred_vola
      ];

      setRows([...rows, newStock]);
      setError('');
    } catch (err) {
      setError('Error tracking stock');
    }
  };

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <Box marginTop='8rem' marginRight='10vw' marginLeft='10vw'>
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
              <TableRow key={row[0]} onClick={() => setSelectedRow(row)} sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}>
                <TableCell component="th" scope="row">{row[0]}</TableCell>
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