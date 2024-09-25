import { Typography, Box, TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import React, { useState, useEffect } from 'react';
import StockGraph from './stockData/stockData';
import StarIcon from '@mui/icons-material/Star'; // Import StarIcon from Material UI
import useBearStore from "@/store/useBearStore";

const Market = () => {
    const isDarkMode = useBearStore((state) => state.isDarkMode);
    const [stockData, setStockData] = useState('');
    const [search, setSearch] = useState('');
    const [rows, setRows] = useState([
        // Temporary stock data
        { ticker: "AAPL", pricing: 150.50, favorited: false },
        { ticker: "GOOGL", pricing: 2800.75, favorited: false },
        { ticker: "TSLA", pricing: 750.30, favorited: false },
        { ticker: "MSFT", pricing: 299.50, favorited: false },
    ]);

    // const handleToggleFavorite = async (ticker) => {
    //     setRows(prevRows => 
    //         prevRows.map(row => 
    //             row.ticker === ticker ? { ...row, favorited: !row.favorited } : row
    //         )
    //     );
    
    //     try {
    //         const userId = localStorage.getItem('userId');  // Assuming userId is stored in localStorage
    //         const response = await axios.post('http://localhost:8000/auth/favorite', { ticker, userId });
    
    //         console.log('Ticker added to favorites: ', response.data);
    //     } catch (error) {
    //         console.error('Error adding stock to favorites: ', error);
    //         setRows(prevRows => 
    //             prevRows.map(row => 
    //                 row.ticker === ticker ? { ...row, favorited: !row.favorited } : row
    //             )
    //         );
    //     }
    // };

    const handleToggleFavorite = (ticker) => {
        setRows(prevRows => prevRows.map(row => 
            row.ticker === ticker ? { ...row, favorited: !row.favorited } : row
        ));
    };
    

    const filteredRows = rows.filter(row =>
        row.ticker.toLowerCase().includes(search.toLowerCase())
    );

    const handleRowClick = async (row) => {
        try {
            setSelectedRow(`${row.ticker}`);
            const response = await axios.get('http://localhost:8000/auth/graph', { input: row.ticker });
            setStockData(response.data);
        } catch (error) {
            console.error('Error fetching graph data:', error);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '10vw', paddingLeft: '10vw', paddingTop:'50px',paddingBottom:'20px' }}>
                <Typography variant='h3' gutterBottom>
                    Market
                </Typography>
                
                <TextField
                    label="Search"
                    variant="outlined"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ bgcolor: 'background.default', width: '300px', marginTop: '1rem', marginBottom: '1rem' }}
                />
            </Box>
            <Box 
                sx={{ 
                    display: 'flex', 
                    paddingRight: '10vw', 
                    paddingLeft: '10vw', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start', 
                    gap: 2,
                    transition: "background-color 1.5s ease-in-out",
                }}
            >
                <Box 
                    component={Paper} 
                    sx={{ 
                        width: '65vw', 
                        padding: '1rem', 
                        height: '500px'
                    }}
                >
                    <StockGraph prices={stockData[0]} dates={stockData[1]} />
                </Box>
                <Box 
                    component={Paper} 
                    sx={{ 
                        width: '30vw', 
                        height: '500px', 
                        overflowY: 'auto',
                    }}
                >
                    <TableContainer>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" sx={{ width: '50%' }}>Stocks</TableCell>
                                    <TableCell align="center" sx={{ width: '50%' }}>Current Pricing</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredRows.map((row) => (
                                    <TableRow 
                                    key={row.ticker} 
                                    onClick={() => handleRowClick(row)} 
                                    sx={{ 
                                      cursor: 'pointer', 
                                      '&:hover': { backgroundColor: isDarkMode ? '#3E3E3E' : '#f5f5f5' } 
                                    }}
                                  >
                                  
                                        <TableCell component="th" scope="row" align="center" sx={{ width: '50%', display: 'flex', alignItems: 'center' }}>
                                            <IconButton onClick={() => handleToggleFavorite(row.ticker)}>
                                                <StarIcon sx={{ color: row.favorited ? '#FFCE2E' : 'gray' }} />
                                            </IconButton>
                                            {row.ticker}
                                        </TableCell>
                                        <TableCell align="center" sx={{ width: '50%' }}>{row.pricing}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
            <Box sx={{ 
                    display: 'block', 
                    paddingTop:'40px',
                    paddingRight: '10vw', 
                    paddingLeft: '10vw', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start', 
                    gap: 2,
                    transition: "background-color 1.5s ease-in-out",
                }}>
                <Box component={Paper}>
                    <TableContainer>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" sx={{ width: '50%' }}>Estimated Price</TableCell>
                                    <TableCell align="center" sx={{ width: '50%' }}>Estimated Volatility</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell align="center" sx={{ width: '50%' }}></TableCell>
                                    <TableCell align="center" sx={{ width: '50%' }}></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </Box>
    );
};

export default Market;
