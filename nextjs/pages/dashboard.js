import React, { useState } from 'react';
import Grid from "@mui/material/Grid2";
import { TextField, Card, CardContent, Typography, Container, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { create } from 'lodash';
import { Line } from 'react-chartjs-2';

//Put function to insert data here
function createData(ticker, pricing, pred_price, pred_vola) {
    return { ticker, pricing, pred_price, pred_vola };
}

const rows = [
    createData('AAAA', 12.34, 50.00, 99.99),
    createData('ABCD', 54.32, 32.10, 76.54),
    createData('BBBB', 23.45, 60.00, 89.99),
    createData('CCCC', 445.53, 62.78, 96.21)
];

const Dashboard = () => {
  const [search, setSearch] = useState('');

  const filteredRows = rows.filter((row) => 
    row.ticker.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box marginTop='8rem' marginRight='10vw' marginLeft='10vw'>
        <Typography variant='h4'>Your stocks</Typography>

        {/* Create a graph */}
        <Box component="img" src='/images/placeholder.jpg' alt='graph' display="block" marginTop='50px' marginBottom='50px'/>

        <TextField
            label="Search"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ bgcolor: '#fff', width: '300px', marginTop: '1rem' }}
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
                    <TableRow key={row.ticker}>
                    <TableCell component="th" scope="row">
                        {row.ticker}
                    </TableCell>
                    <TableCell align="right">{row.pricing}</TableCell>
                    <TableCell align="right">{row.pred_price}</TableCell>
                    <TableCell align="right">{row.pred_vola}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
    </Box>
  );
};

export default Dashboard;
