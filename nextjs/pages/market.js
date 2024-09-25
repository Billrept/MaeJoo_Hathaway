import { Typography, Box, TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useState, useEffect } from 'react';
import StockGraph from './stockData/stockData';
import Grid from '@mui/material/Grid2';

const market = () => {
    const [stockData, setStockData] = useState('');
    const [search, setSearch] = useState('');
    const [ rows, setRows ] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          try{
    
            console.log('User Id : ', );
    
            // *** function to get all stocks, wanted in 2D arrays specifically { ticker: str, pricing: float, pred_price: float, pred_vola: float } but can be in different order
    
            const response = await axios.get('http://localhost:8000/auth/all-stocks')
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

    const filteredRows = rows.filter((row) => 
        row[0].toLowerCase().includes(search.toLowerCase())
    );

    const handleRowClick = async (row) => {

        try{
            setSelectedRow(`${row[0]}`);
    
            const response = await axios.get('http://localhost:8000/auth/graph', { input : row[0] });
            setStockData(response.data);
        } catch(error){
            console.error('Error fetching data: ', error)
        }
      };

    return (
        <Box sx={{minHeight:'100vh', marginTop:'8rem', marginRight:'10vw', marginLeft:'10vw', bgcolor: 'background.default'}} >
            <Typography variant='h3'>Market</Typography>
            <Typography></Typography>
            <Grid container wrap="nowrap" direction="row" alignItems="center" justifyContent="space-around">
                <Grid item size={{}}></Grid>
            </Grid>

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

        </Box>
    )
};

export default market;