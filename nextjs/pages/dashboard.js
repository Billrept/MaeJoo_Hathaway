import React, { useState, useEffect } from 'react';
import Grid from "@mui/material/Grid2";
import { TextField, Card, CardContent, Typography, Container, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { create } from 'lodash';
import { Line } from 'react-chartjs-2';
import StockGraph from './stockData/stockData';
import axios from 'axios';
import { useRouter } from 'next/router';

const Dashboard = () => {
  const router = useRouter();
  const {userId} = router.query;

  const [ rows, setRows ] = useState([]);
  const [ search, setSearch ] = useState('');
  const [ selectedRow, setSelectedRow ] = useState('');
  const [ stockData, setStockData] = useState([]);
  const [ stockSearch, setStockSearch ] = useState('');
  const [ error, setError ] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try{

        console.log('User Id : ', );

        //Temporary data for testing (in place for API)
        // const newRows = [
        //     ['AAAA', 12.34, 50.00, 99.99],
        //     ['ABCD', 54.32, 32.10, 76.54],
        //     ['BBBB', 23.45, 60.00, 89.99],
        //     ['CCCC', 445.53, 62.78, 96.21]
        // ];
        // setRows(newRows);

        // *** function to get user-tracked ticker, wanted in 2D arrays specifically { ticker: str, pricing: float, pred_price: float, pred_vola: float } but can be in different order

        const response = await axios.get('http://localhost:8000/auth/user-stocks', {input : userId})
        const newRows = response.data.map(item => [
            item.ticker,
            item.pricing,
            item.pred_price,
            item.pred_vola
        ]);
        setRows(newRows);
        console.log('Data fetched: ', response.data);

      } catch(error){
        console.error('Error fetching data: ', error);
      }
    };
    fetchData();
  }, []);

  const handleTrackedStock = async (e) => {
    e.preventDefault();
    try {
      // Fetch the tracked stock data
      const response = await axios.get('http://localhost:8000/auth/track-stock', { params: { input: stockSearch } });
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

  const handleRowClick = async (row) => {

    try{
        setSelectedRow(`${row[0]}`);

        //function to get past stock data
        const response = await axios.get('http://localhost:8000/auth/graph', { input1: userId, input2 : row[0] });
        setStockData(response.data);
    } catch(error){
        console.error('Error fetching data: ', error)
    }
  };

//   const stockPrices = [198, 188, 184, 190, 197, 194, 190, 194, 192, 186, 187, 192, 192, 193, 185, 
//     192, 186, 182, 192, 183, 191, 189, 182, 175, 171, 175, 172, 182, 174, 170, 
//     169, 159, 161, 157, 164, 154, 153, 147, 152, 162, 163, 158, 150, 145, 140, 
//     136, 133, 137, 138, 145, 135, 136, 146, 144, 141, 147, 140, 148, 158, 165, 
//     156, 154, 148, 142, 133, 126, 126, 136, 142, 148, 147, 139, 131, 132, 141, 
//     141, 131, 141, 138, 129, 132, 136, 138, 128, 127, 127, 133, 135, 135, 130, 
//     140, 139, 144, 139, 142, 144, 139, 143, 138, 137];
    

  const filteredRows = rows.filter((row) => 
    row[0].toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box marginTop='8rem' marginRight='10vw' marginLeft='10vw' >
        <Typography variant='h4'>Your stocks</Typography>
        <h2>{selectedRow}</h2>
        <StockGraph prices={stockData[0]} dates={stockData[1]} />

        <TextField
            label="Search"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ bgcolor: 'background.default', width: '300px', marginTop: '1rem', marginBottom: '1rem' }}
        />
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Your stocks</TableCell>
                        <TableCell align='right'>Current Pricing</TableCell>
                        <TableCell align='right'>Predicted Price</TableCell>
                        <TableCell align='right'>Predicted Volatility</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {filteredRows.map((row) => (
                    <TableRow key={row[0]} onClick={() => handleRowClick(row)} sx={{ cursor: 'pointer', '&:hover': {backgroundColor: '#f5f5f5',}}}>
                        <TableCell component="th" scope="row">{row[0]}</TableCell>
                        <TableCell align="right">{row[1]}</TableCell>
                        <TableCell align="right">{row[2]}</TableCell>
                        <TableCell align="right">{row[3]}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
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
