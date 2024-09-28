import React, { useState, useEffect } from 'react';
    import axios from 'axios';
    import { Typography, Box, TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, ButtonGroup, Button,Snackbar,CircularProgress } from '@mui/material';
    import StarIcon from '@mui/icons-material/Star';
    import useBearStore from "@/store/useBearStore";
    import StockGraph from '../components/stockData';

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
        
        const [userId, setUserId] = useState(null);
        const [stockData, setStockData] = useState({ prices: [], dates: [] });
        const [search, setSearch] = useState('');
        const [selectedRange, setSelectedRange] = useState('all');
        const [predictedPrice, setPredictedPrice] = useState(null);
        const [predictedVolatility, setPredictedVolatility] = useState(null);
        const [snackbarMessage, setSnackbarMessage] = useState('');
        const [currentStock, setCurrentStock] = useState('');

        const [rows, setRows] = useState(
            tickers.map(ticker => ({
                ticker: ticker,
                pricing: 0,
                favorited: false,
                isLoading: false
            }))
        );

        useEffect(() => {
            const storedUserId = localStorage.getItem('user_id');
            if (storedUserId) {
                setUserId(storedUserId);
            }

            const fetchStockPricesAndFavorites = async () => {
                try {
                    const [stockPricesResponse, favoritesResponse] = await Promise.all([
                        axios.post('http://localhost:8000/stocks/prices'),
                        axios.get(`http://localhost:8000/stocks/${storedUserId}/favorites`)
                    ]);

                    const stockPrices = stockPricesResponse.data;
                    const favoriteStocks = favoritesResponse.data;

                    const updatedRows = rows.map(row => {
                        const stock = stockPrices.find(stock => stock.ticker === row.ticker);
                        const isFavorited = favoriteStocks.some(favorite => favorite.ticker === row.ticker);
                        return {
                            ...row,
                            pricing: stock ? stock.current_price : row.pricing,
                            favorited: isFavorited
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
        }, []);

        const handleAddFavorite = async (ticker) => {
            try {
                await axios.post(`http://localhost:8000/stocks/${ticker}/${userId}/add-favorite`);
                console.log("Favorite added successfully");
            } catch (error) {
                console.error('Error adding stock to favorites:', error);
            }
        };

        const handleRemoveFavorite = async (ticker) => {
            try {
                await axios.delete(`http://localhost:8000/stocks/${ticker}/${userId}/remove-favorite`);
                console.log("Favorite removed successfully");
            } catch (error) {
                console.error('Error removing stock from favorites:', error);
            }
        };

        const handleToggleFavorite = (ticker, isFavorited) => {
            setRows(prevRows => prevRows.map(row => {
                if (row.ticker === ticker) {
                    row.isLoading = true;
                }
                return row;
            }));
        
            setTimeout(async () => {
                if (isFavorited) {
                    await handleRemoveFavorite(ticker);
                    setSnackbarMessage(`${ticker} removed from favorites`);
                } else {
                    await handleAddFavorite(ticker);
                    setSnackbarMessage(`${ticker} added to favorites`);
                }
        
                setRows(prevRows => prevRows.map(row => {
                    if (row.ticker === ticker) {
                        row.favorited = !isFavorited;
                        row.isLoading = false;
                    }
                    return row;
                }));
            }, 500);
        };
        

        const filteredRows = rows.filter(row =>
            row.ticker.toLowerCase().includes(search.toLowerCase())
        );

        const handleRowClick = async (row) => {
            try {
                changeGraph(row);
                changePrediction(row);
                setCurrentStock(row);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const changeGraph = async (row) => {
            try {
                const response = await axios.get(`http://localhost:8000/stocks/${row.ticker}/history`);
                const historyData = response.data;

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

        const handleCloseSnackbar = () => {
            setSnackbarMessage('');
        };
        

        return (
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', transition: 'background-color 1.5s ease-in-out, color 1.5s ease-in-out' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '10vw', paddingLeft: '10vw', paddingTop:'50px',paddingBottom:'20px' }}>
                    <Typography variant='h3' gutterBottom>
                        Market
                    </Typography>
                    <TextField label="Search" variant="outlined" value={search} onChange={(e) => setSearch(e.target.value)}
                        sx={{ bgcolor: 'background.default', width: '300px', marginTop: '1rem', marginBottom: '1rem', transition: 'background-color 1.5s ease-in-out', }}
                    />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', marginLeft: '10vw', marginRight: '34.8vw', alignItems: 'center'}} >
                    <Typography variant="subtitle1" color="textSecondary">
                        {currentStock ?`Current Stock: ${currentStock.ticker}` : 'No stock selected'}
                    </Typography>

                    <ButtonGroup
                        variant="contained"
                        aria-label="outlined primary button group"
                        sx={{
                        '& .MuiButton-root': {
                            color: '#ffffff',
                            backgroundColor: '#2da14c',
                            borderColor: '#000000', // Black border between buttons
                            '&:hover': {
                            backgroundColor: '#1e7d36', // Color on hover
                            },
                        },
                        '& .MuiButton-root.Mui-selected': {
                            backgroundColor: '#145524', // Change color for selected buttons
                        },
                        }}
                    >
                        <Button
                        onClick={() => setSelectedRange('week')}
                        className={selectedRange === 'week' ? 'Mui-selected' : ''}
                        >
                        7 D
                        </Button>
                        <Button
                        onClick={() => setSelectedRange('month')}
                        className={selectedRange === 'month' ? 'Mui-selected' : ''}
                        >
                        1 M
                        </Button>
                        <Button
                        onClick={() => setSelectedRange('threeMonths')}
                        className={selectedRange === 'threeMonths' ? 'Mui-selected' : ''}
                        >
                        3 M
                        </Button>
                        <Button
                        onClick={() => setSelectedRange('sixMonths')}
                        className={selectedRange === 'sixMonths' ? 'Mui-selected' : ''}
                        >
                        6 M
                        </Button>
                        <Button
                        onClick={() => setSelectedRange('year')}
                        className={selectedRange === 'year' ? 'Mui-selected' : ''}
                        >
                        1 Y
                        </Button>
                        <Button
                        onClick={() => setSelectedRange('all')}
                        className={selectedRange === 'all' ? 'Mui-selected' : ''}
                        >
                        All
                        </Button>
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
                            height:'56vh',
                            transition: 'background-color 1.5s ease-in-out',
                        }}
                    >
                        <StockGraph prices={filteredGraphData.prices} dates={filteredGraphData.dates}/>
                    </Box>
                    <Box 
                        component={Paper} 
                        sx={{ 
                            width: '30vw', 
                            height: '56vh', 
                            overflowY: 'auto',
                            transition: 'background-color 1.5s ease-in-out',
                        }}
                    >
                    <TableContainer>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow
                                    sx={{
                                        transition: 'background-color 1.5s ease-in-out, color 1.5s ease-in-out', // Smooth transition for header row background and color
                                    }}
                                >
                                    <TableCell
                                        align="center"
                                        sx={{
                                            transition: 'background-color 1.5s ease-in-out, color 1.5s ease-in-out', // Smooth transition for header cell background and color
                                        }}
                                    >
                                        Stocks
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{
                                            transition: 'background-color 1.5s ease-in-out, color 1.5s ease-in-out', // Smooth transition for header cell background and color
                                        }}
                                    >
                                        Current Pricing
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredRows.map((row) => (
                                    <TableRow 
                                        key={row.ticker} 
                                        onClick={() => handleRowClick(row)} 
                                        sx={{ 
                                            cursor: 'pointer', 
                                            '&:hover': { backgroundColor: isDarkMode ? '#3E3E3E' : '#f5f5f5' },
                                        }}
                                    >
                                        <TableCell 
                                            component="th" 
                                            scope="row" 
                                            sx={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                transition: 'color 1.5s ease-in-out', // Transition for color
                                            }}
                                        >
                                            <IconButton
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleToggleFavorite(row.ticker, row.favorited);
                                                }}
                                                size="small"
                                                disabled={row.isLoading}
                                            >
                                                {row.isLoading ? (
                                                    <CircularProgress size={20} />
                                                ) : (
                                                    <StarIcon sx={{ color: row.favorited ? '#FFCE2E' : 'gray' }} />
                                                )}
                                            </IconButton>
                                            <Typography sx={{ marginLeft: 1 }}>{row.ticker}</Typography>
                                        </TableCell>
                                        <TableCell 
                                            align="center"
                                            sx={{ 
                                                transition: 'background-color 1.5s ease-in-out, color 1.5s ease-in-out', // Smooth transition for color and background
                                            }}
                                        >
                                            {row.pricing}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: 'block',
                        paddingTop: '40px',
                        paddingRight: '10vw',
                        paddingLeft: '10vw',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: 2,
                        transition: 'background-color 1.5s ease-in-out',
                    }}
                    >
                    <Box component={Paper}>
                        <TableContainer>
                        <Table stickyHeader>
                            {/* Table Head with Transition */}
                            <TableHead>
                            <TableRow
                                sx={{
                                transition: 'background-color 1.5s ease-in-out, color 1.5s ease-in-out',
                                }}
                            >
                                <TableCell
                                align="center"
                                sx={{
                                    width: '50%',
                                    color: isDarkMode ? '#ffffff' : '#000000', // Adjust text color
                                    transition: 'background-color 1.5s ease-in-out, color 1.5s ease-in-out',
                                }}
                                >
                                Estimated Price
                                </TableCell>
                                <TableCell
                                align="center"
                                sx={{
                                    width: '50%',
                                    color: isDarkMode ? '#ffffff' : '#000000',
                                    transition: 'background-color 1.5s ease-in-out, color 1.5s ease-in-out',
                                }}
                                >
                                Estimated Volatility
                                </TableCell>
                            </TableRow>
                            </TableHead>

                            {/* Table Body with Transition */}
                            <TableBody>
                            <TableRow
                                sx={{
                                transition: 'background-color 1.5s ease-in-out, color 1.5s ease-in-out',
                                backgroundColor: isDarkMode ? '#2B2B2B' : '#ffffff', // Adjust based on dark mode
                                }}
                            >
                                <TableCell
                                align="center"
                                sx={{
                                    width: '50%',
                                    transition: 'background-color 1.5s ease-in-out, color 1.5s ease-in-out',
                                }}
                                >
                                <Typography>
                                    {predictedPrice !== null ? predictedPrice : 'N/A'}
                                </Typography>
                                </TableCell>
                                <TableCell
                                align="center"
                                sx={{
                                    width: '50%',
                                    transition: 'background-color 1.5s ease-in-out, color 1.5s ease-in-out',
                                }}
                                >
                                <Typography>
                                    {predictedVolatility !== null ? predictedVolatility : 'N/A'}
                                </Typography>
                                </TableCell>
                            </TableRow>
                            </TableBody>
                        </Table>
                        </TableContainer>
                    </Box>
                    </Box>
                <Snackbar
                    open={!!snackbarMessage}
                    autoHideDuration={3000}
                    onClose={handleCloseSnackbar}
                    message={snackbarMessage}
                />
            </Box>
        );
    };

    export default Market;