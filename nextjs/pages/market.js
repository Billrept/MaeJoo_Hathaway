import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Box, TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import useBearStore from "@/store/useBearStore";
import StockGraph from './stockData/stockData';

const tickers = [
    "AAPL", "ABNB", "ADBE", "ADI", "ADP", "ADSK", "AEP", "AMAT", "AMD", "AMGN", 
    "AMZN", "ANSS", "ARM", "ASML", "AVGO", "AZN", "BIIB", "BKNG", "BKR", "CCEP", 
    "CDNS", "CDW", "CEG", "CHTR", "CMCSA", "COST", "CPRT", "CRWD", "CSCO", "CSGP", 
    "CSX", "CTAS", "CTSH", "DASH", "DDOG", "DLTR", "DXCM", "EA", "EXC", "FANG", 
    "FAST", "FTNT", "GEHC", "GFS", "GILD", "GOOG", "GOOGL", "HON", "IDXX", "ILMN", 
    "INTC", "INTU", "ISRG", "KDP", "KHC", "KLAC", "LIN", "LRCX", "LULU", "MAR", 
    "MCHP", "MDB", "MDLZ", "MELI", "META", "MNST", "MRNA", "MRVL", "MSFT", "MU", 
    "NFLX", "NVDA", "NXPI", "ODFL", "ON", "ORLY", "PANW", "PAYX", "PCAR", "PDD", 
    "PEP", "PYPL", "QCOM", "REGN", "ROP", "ROST", "SBUX", "SMCI", "SNPS", "TEAM", 
    "TMUS", "TSLA", "TTD", "TTWO", "TXN", "VRSK", "VRTX", "WBD", "WDAY", "XEL", "ZS"
];

const Market = () => {
    const isDarkMode = useBearStore((state) => state.isDarkMode);
    const [stockData, setStockData] = useState({ prices: [], dates: [] });
    const [search, setSearch] = useState('');
    
    const [rows, setRows] = useState(
        tickers.map(ticker => ({
            ticker: ticker,
            pricing: 0,  // Initial placeholder for pricing
            favorited: false
        }))
    );

    // Fetch latest stock prices from backend
    useEffect(() => {
        const fetchStockPrices = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/stocks/prices');
                const stockPrices = response.data;
                const updatedRows = rows.map(row => {
                    const stock = stockPrices.find(stock => stock.ticker === row.ticker);
                    return {
                        ...row,
                        pricing: stock ? stock.current_price : row.pricing  // Update price if found
                    };
                });

                setRows(updatedRows);
            } catch (error) {
                console.error('Error fetching stock prices:', error);
            }
        };

        fetchStockPrices();
    }, []); // Empty dependency array to run once on mount

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
            const response = await axios.get(`http://127.0.0.1:8000/stocks/${row.ticker}/history`);
            const historyData = response.data;

            // Extract dates and prices
            const dates = historyData.map(item => item.date);
            const prices = historyData.map(item => item.close_price);

            setStockData({ dates, prices });
        } catch (error) {
            console.error('Error fetching stock history data:', error);
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
                    <StockGraph prices={stockData.prices} dates={stockData.dates} />
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
        </Box>
    );
};

export default Market;
