import React, { useState, useEffect } from 'react';
import { TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box } from '@mui/material';
import StockGraph from '../components/stockData'; // Import the graph component to display stock data
import axios from 'axios';
import { useRouter } from 'next/router';
import { useAuth } from "@/context/auth";
import useBearStore from "@/store/useBearStore";

const Dashboard = () => {
  const router = useRouter(); 

  const isDarkMode = useBearStore((state) => state.isDarkMode);

  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  const [stockData, setStockData] = useState({ prices: [], dates: [] });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRange, setSelectedRange] = useState('all');
  const [currentStock, setCurrentStock] = useState('');
  const [stocksFetched, setStocksFetched] = useState(false);
  
  const { userId, isLoggedIn, logout } = useAuth();

  const timeOptions = {
    week: 7,
    month: 30,
    threeMonths: 90,
    sixMonths: 180,
    year: 365,
    all: Infinity
  };

  // Check authentication when the component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
    } else {
      axios
        .post('http://localhost:8000/auth/verify-token', { token })
        .then((response) => {
          if (response.data.valid) {
            setIsAuthenticated(true);
          } else {
            logout();
            router.push('/login');
          }
        })
        .catch(() => {
          logout();
          router.push('/login');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [router]);

  // Fetch the user's favorite stocks and their predictions
  useEffect(() => {
    if (isAuthenticated && userId && !stocksFetched) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/stocks/${userId}/favorites`);
          const favoriteStocks = response.data;

          // Fetch predictions for each stock concurrently
          const stockPromises = favoriteStocks.map(async (stock) => {
            try {
              const predictionResponse = await axios.get(`http://localhost:8000/stocks/${stock.ticker}/prediction`);
              const priceResponse = await axios.post(`http://localhost:8000/stocks/${stock.ticker}/price`);

              const trackedStockInfo = predictionResponse.data;
              const currentPrice = priceResponse.data[0];

              return {
                ticker: trackedStockInfo.ticker,
                currentPricing: currentPrice.current_price,
                predictedPrice: trackedStockInfo.predicted_price,
                predictedVolatility: trackedStockInfo.predicted_volatility,
              };
            } catch (error) {
              console.error(`Error fetching prediction for ${stock.ticker}:`, error);
              return null;
            }
          });

          const resolvedStocks = await Promise.all(stockPromises);

          const validStocks = resolvedStocks.filter(stock => stock !== null);
          setRows(validStocks);
          setStocksFetched(true);
        } catch (error) {
          console.error('Error fetching data: ', error);
        }
      };
      fetchData();
    }
  }, [userId, isAuthenticated, stocksFetched]);

  // Filter rows based on search input
  const filteredRows = rows.filter((row) =>
    row.ticker.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const changeGraph = async (ticker) => {
    try {
      const response = await axios.get(`http://localhost:8000/stocks/${ticker}/history`);
      const historyData = response.data;

      const dates = historyData.map(item => item.date);
      const prices = historyData.map(item => item.close_price);

      setStockData({ dates, prices });
    } catch (error) {
      console.error('Error fetching stock history data:', error);
    }
  };

  const handleRowClick = async (ticker) => {
    try {
      changeGraph(ticker);
      setCurrentStock(ticker);
    } catch (error) {
      console.error('Error fetching data:', error);
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
    <Box marginY="5rem" marginX='10vw'>
      <Typography variant="h4">Dashboard</Typography>
      <StockGraph prices={filteredGraphData.prices} dates={filteredGraphData.dates}/>
      <TextField 
        label="Search" 
        variant="outlined" 
        value={search} 
        onChange={(e) => setSearch(e.target.value)} // Update search value
        sx={{ bgcolor: 'background.default', width: '300px', marginTop: '1rem', marginBottom: '1rem', transition: 'background-color 1.0s ease-in-out', }}
      />

      {/* Table for displaying stocks */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                transition: 'background-color 1.0s ease-in-out, color 1.0s ease-in-out',
              }}
            >
              <TableCell
                sx={{
                  transition: 'background-color 1.0s ease-in-out, color 1.0s ease-in-out',
                }}
              >
                Your Stocks
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  transition: 'background-color 1.0s ease-in-out, color 1.0s ease-in-out',
                }}
              >
                Current Pricing
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  transition: 'background-color 1.0s ease-in-out, color 1.0s ease-in-out',
                }}
              >
                Predicted Price
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  transition: 'background-color 1.0s ease-in-out, color 1.0s ease-in-out',
                }}
              >
                Predicted Volatility
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row) => (
              <TableRow
                key={row.ticker}
                onClick={() => handleRowClick(row.ticker)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: isDarkMode ? '#3E3E3E' : '#f5f5f5',
                  },
                  transition: 'background-color 1.0s ease-in-out, color 1.0s ease-in-out',
                }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{
                    transition: 'background-color 1.0s ease-in-out, color 1.0s ease-in-out',
                  }}
                >
                  {row.ticker}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    transition: 'background-color 1.0s ease-in-out, color 1.0s ease-in-out',
                  }}
                >
                  {row.currentPricing}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    transition: 'background-color 1.0s ease-in-out, color 1.0s ease-in-out',
                  }}
                >
                  {row.predictedPrice}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    transition: 'background-color 1.0s ease-in-out, color 1.0s ease-in-out',
                  }}
                >
                  {row.predictedVolatility}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

    </Box>
  );
};

export default Dashboard;
