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

  // Fetch the list of user-tracked stocks when the component mounts
  useEffect(() => {
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
  }, [userId]);

  // Handle adding a new tracked stock
  const handleTrackedStock = async (e) => {
    e.preventDefault();
    try {
      // Fetch the tracked stock data
      const response = await axios.get('http://localhost:8000/auth/track-stock', { params: { stockSearch } });
      const trackedStockInfo = response.data;

      const newStock = [
        trackedStockInfo.ticker,
        trackedStockInfo.pricing,
        trackedStockInfo.pred_price,
        trackedStockInfo.pred_vola
      ];

      setRows((prevRows) => [...prevRows, newStock]);

      setStockSearch('');
      console.log('New stock added: ', trackedStockInfo);

    } catch (error) {
      console.error('Error adding new stock: ', error);
      setError('Failed to add new stock. Please try again.');
    }
  };

  // Handle fetching and displaying stock history when a row is clicked
  const handleRowClick = async (row) => {
    try {
      setSelectedRow(`${row[0]}`);

      // Fetch the past stock data based on the selected stock ticker
      const response = await axios.get(`http://localhost:8000/stocks/${row[0]}/history`);
      setStockData(response.data);
    } catch (error) {
      console.error('Error fetching stock data: ', error);
    }
  };

  // Filter stocks based on the search input
  const filteredRows = rows.filter((row) =>
    row[0].toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box marginTop="8rem" marginRight="10vw" marginLeft="10vw">
      <Typography variant="h4">Your Stocks</Typography>
      <Typography variant="h6">{selectedRow}</Typography>
      
      {/* Display the stock graph */}
      <StockGraph prices={stockData.map(d => d.close)} dates={stockData.map(d => d.trade_date)} />

      {/* Search bar */}
      <TextField
        label="Search"
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
            {filteredRows.map((row) => (
              <TableRow key={row[0]} onClick={() => handleRowClick(row)} sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}>
                <TableCell component="th" scope="row">{row[0]}</TableCell>
                <TableCell align="right">{row[1]}</TableCell>
                <TableCell align="right">{row[2]}</TableCell>
                <TableCell align="right">{row[3]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Form to add a new stock */}
      <form onSubmit={handleTrackedStock}>
        <TextField
          label="Stock ticker"
          variant="outlined"
          margin="normal"
          value={stockSearch}
          onChange={(e) => setStockSearch(e.target.value)}
          required
          style={{ marginTop: '2rem', minWidth: '30vw' }}
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button
          type="submit"
          variant="contained"
          style={{ marginTop: '40px', marginLeft: '20px', backgroundColor: '#68BB59', color: '#ffffff' }}
        >
          Add new stock
        </Button>
      </form>
    </Box>
  );
};

export default Dashboard;
