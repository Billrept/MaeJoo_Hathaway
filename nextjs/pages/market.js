    import React, { useState, useEffect } from 'react';
    import axios from 'axios';
    import { Typography, Box, TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, ButtonGroup, Button } from '@mui/material';
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
    ]

    const timeOptions = {
        week: 7,
        month: 30,
        threeMonths: 90,
        sixMonths: 180,
        year: 365,
        all: Infinity
    };

    const Market = () => {
        const isDarkMode = useBearStore((state) => state.isDarkMode);
        
        // Fetch user_id from localStorage
        const [userId, setUserId] = useState(null);
        
        const [stockData, setStockData] = useState({ prices: [], dates: [] });
        const [search, setSearch] = useState('');
        const [selectedRange, setSelectedRange] = useState('all');
        const [predictedPrice, setPredictedPrice] = useState(null);
        const [predictedVolatility, setPredictedVolatility] = useState(null);

        const [rows, setRows] = useState(
            tickers.map(ticker => ({
                ticker: ticker,
                pricing: 0,  // Initial placeholder for pricing
                favorited: false  // Initial favorite state
            }))
        );

        useEffect(() => {
            // Fetch user_id from localStorage when component mounts
            const storedUserId = localStorage.getItem('user_id');
            if (storedUserId) {
                setUserId(storedUserId);  // Set userId from localStorage
            }

            const fetchStockPricesAndFavorites = async () => {
                try {
                    const [stockPricesResponse, favoritesResponse] = await Promise.all([
                        axios.post('http://localhost:8000/stocks/prices'),
                        axios.get(`http://localhost:8000/stocks/${storedUserId}/favorites`)  // Fetch user favorites
                    ]);

                    const stockPrices = stockPricesResponse.data;
                    const favoriteStocks = favoritesResponse.data;

                    const updatedRows = rows.map(row => {
                        const stock = stockPrices.find(stock => stock.ticker === row.ticker);
                        const isFavorited = favoriteStocks.some(favorite => favorite.ticker === row.ticker); // Check if stock is favorited
                        return {
                            ...row,
                            pricing: stock ? stock.current_price : row.pricing,  // Update price if found
                            favorited: isFavorited  // Mark as favorited if it exists in the user's favorites
                        };
                    });
                    setRows(updatedRows);
                } catch (error) {
                    console.error('Error fetching stock prices or favorites:', error);
                }
            };

            if (storedUserId) {
                fetchStockPricesAndFavorites();
            }
        }, []); // Empty dependency array to run once on mount

        // Function to add stock to favorites
        const handleAddFavorite = async (ticker) => {
            try {
                await axios.post(`http://localhost:8000/stocks/${ticker}/${userId}/add-favorite`);
                console.log("Favorite added successfully");
            } catch (error) {
                console.error('Error adding stock to favorites:', error);
            }
        };

        // Function to remove stock from favorites
        const handleRemoveFavorite = async (ticker) => {
            try {
                await axios.post(`http://localhost:8000/stocks/${ticker}/${userId}/remove-favorite`);
                console.log("Favorite removed successfully");
            } catch (error) {
                console.error('Error removing stock from favorites:', error);
            }
        };

        // Toggle favorite icon and API call
        const handleToggleFavorite = (ticker, isFavorited) => {
            setRows(prevRows => {
                return prevRows.map(row => {
                    if (row.ticker === ticker) {
                        if (!row.favorited) {
                            handleAddFavorite(ticker);  // Add to favorites if not favorited
                        } else {
                            handleRemoveFavorite(ticker);  // Remove from favorites if favorited
                        }
                        return { ...row, favorited: !row.favorited };  // Toggle favorite
                    }
                    return row;
                });
            });
        };

        const filteredRows = rows.filter(row =>
            row.ticker.toLowerCase().includes(search.toLowerCase())
        );

        const handleRowClick = async (row) => {
            try {
                changeGraph(row);
                changePrediction(row);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const changeGraph = async (row) => {
            try {
                const response = await axios.get(`http://localhost:8000/stocks/${row.ticker}/history`);
                const historyData = response.data;

                // Extract dates and prices
                const dates = historyData.map(item => item.date);
                const prices = historyData.map(item => item.close_price);

                setStockData({ dates, prices });
            } catch (error) {
                console.error('Error fetching stock history data:', error);
            }
        };

        const changePrediction = async (row) => {
            try {
                const response = await axios.get(`http://localhost:8000/stocks/${row.ticker}/prediction`);
                const { predicted_price, predicted_volatility } = response.data;

                // Store the predicted price and volatility in state
                setPredictedPrice(predicted_price);
                setPredictedVolatility(predicted_volatility);
            } catch (error) {
                console.error('Error fetching prediction:', error);
            }
        };

        const getFilteredGraphData = () => {
            const { dates, prices } = stockData;
            const daysToShow = timeOptions[selectedRange];

            if (dates.length <= daysToShow) return stockData;

            const filteredDates = dates.slice(-daysToShow);
            const filteredPrices = prices.slice(-daysToShow);

            return { dates: filteredDates, prices: filteredPrices };
        };

        const filteredGraphData = getFilteredGraphData();

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
                <Box sx={{ display: 'flex', justifyContent: 'Left', marginBottom: '1rem', marginLeft:'10vw' }}>
                    <ButtonGroup
                        variant="contained"
                        aria-label="outlined primary button group"
                        sx={{
                            '& .MuiButton-root': {
                                color: '#ffffff',
                                backgroundColor: '#2da14c',
                                borderColor: '#000000', // Black border between buttons
                            },
                            '& .MuiButton-root:not(:last-of-type)': {
                                borderRight: '1px solid #000000', // Black line between buttons
                            },
                        }}
                    >
                        <Button onClick={() => setSelectedRange('week')}>7 D</Button>
                        <Button onClick={() => setSelectedRange('month')}>1 M</Button>
                        <Button onClick={() => setSelectedRange('threeMonths')}>3 M</Button>
                        <Button onClick={() => setSelectedRange('sixMonths')}>6 M</Button>
                        <Button onClick={() => setSelectedRange('year')}>1 Y</Button>
                        <Button onClick={() => setSelectedRange('all')}>All</Button>
                    </ButtonGroup>
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
                        <StockGraph prices={filteredGraphData.prices} dates={filteredGraphData.dates} />
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
                                        <TableCell align="center">Stocks</TableCell>
                                        <TableCell align="center">Current Pricing</TableCell>
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
                                            <TableCell component="th" scope="row" sx={{ display: 'flex', alignItems: 'center' }}>
                                                <IconButton 
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent row click when star is clicked
                                                        handleToggleFavorite(row.ticker, row.favorited);  // Toggle favorite
                                                    }}
                                                    size="small"
                                                >
                                                    <StarIcon sx={{ color: row.favorited ? '#FFCE2E' : 'gray' }} />
                                                </IconButton>
                                                <Typography sx={{ marginLeft: 1 }}>{row.ticker}</Typography>
                                            </TableCell>
                                            <TableCell align="center">{row.pricing}</TableCell>
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
                                    <TableCell align="center" sx={{ width: '50%' }}>
                                        {predictedPrice !== null ? predictedPrice : 'N/A'}
                                    </TableCell>
                                    <TableCell align="center" sx={{ width: '50%' }}>
                                        {predictedVolatility !== null ? predictedVolatility : 'N/A'}
                                    </TableCell>
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