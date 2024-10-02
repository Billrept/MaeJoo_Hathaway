import React, { useState, useEffect } from 'react';
import { TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box, ButtonGroup, Button } from '@mui/material';
import StockGraph from '../components/stockData'; 
import axios from 'axios';
import { useRouter } from 'next/router';
import { useAuth } from "@/context/auth";
import useBearStore from "@/store/useBearStore";
import { useTranslation } from 'react-i18next';

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
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  const { t } = useTranslation(['common']);

  const { userId, isLoggedIn, logout } = useAuth();

  const timeOptions = {
    week: 7,
    month: 30,
    threeMonths: 90,
    sixMonths: 180,
    year: 365,
    all: Infinity
  };

  const handleMouseLeave = () => {
    setTransitionEnabled(false);  // Disable transition
    setTimeout(() => {
      setTransitionEnabled(true);  // Re-enable transition after 1 second
    }, 1000);  // 1000ms = 1 second
  };

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

  useEffect(() => {
    if (isAuthenticated && userId && !stocksFetched) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/stocks/${userId}/favorites`);
          const favoriteStocks = response.data;

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

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Modify the sorting function to handle both string and numeric values
  const sortedRows = React.useMemo(() => {
    if (sortConfig.key) {
      const sorted = [...rows].sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
  
        // Handle percentage or numeric columns like currentPricing and change
        if (sortConfig.key === 'currentPricing' || sortConfig.key === 'change') {
          aValue = parseFloat(aValue.toString().replace('%', '')) || 0; // Convert to a float, handle NaN
          bValue = parseFloat(bValue.toString().replace('%', '')) || 0;
        }
  
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
      return sorted;
    }
    return rows;
  }, [rows, sortConfig]);

  const filteredRows = sortedRows.filter((row) =>
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
      <Typography variant="h4">{t('dashboardTitle')}</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop:'2rem', marginBottom: '1rem', alignItems: 'center'}} >
        <Typography variant="subtitle1" color="textSecondary" sx={{transition: 'color 1.0s ease-in-out'}}>
          {currentStock ? `${t('displayedStock')} ${currentStock}` : t('missingStock')}
        </Typography>

        <ButtonGroup
          variant="contained"
          aria-label="outlined primary button group"
          sx={{
            '& .MuiButton-root': {
              color: '#ffffff',
              backgroundColor: '#2da14c',
              borderColor: '#000000',
              '&:hover': {
                backgroundColor: '#1e7d36',
              },
            },
            '& .MuiButton-root.Mui-selected': {
              backgroundColor: '#145524',
            },
          }}
        >
          <Button onClick={() => setSelectedRange('week')} className={selectedRange === 'week' ? 'Mui-selected' : ''}>{t('7dButton')}</Button>
          <Button onClick={() => setSelectedRange('month')} className={selectedRange === 'month' ? 'Mui-selected' : ''}>{t('1mButton')}</Button>
          <Button onClick={() => setSelectedRange('threeMonths')} className={selectedRange === 'threeMonths' ? 'Mui-selected' : ''}>{t('3mButton')}</Button>
          <Button onClick={() => setSelectedRange('sixMonths')} className={selectedRange === 'sixMonths' ? 'Mui-selected' : ''}>{t('6mButton')}</Button>
          <Button onClick={() => setSelectedRange('year')} className={selectedRange === 'year' ? 'Mui-selected' : ''}>{t('1yButton')}</Button>
          <Button onClick={() => setSelectedRange('all')} className={selectedRange === 'all' ? 'Mui-selected' : ''}>{t('allButton')}</Button>
        </ButtonGroup>
      </Box>
      <Box component={Paper} sx={{padding:'1rem', transition: 'background-color 1.0s ease-in-out'}}>
        <StockGraph prices={filteredGraphData.prices} dates={filteredGraphData.dates} ratio={3.5}/>
      </Box>
      <TextField 
        label={t('search')}
        variant="outlined" 
        value={search} 
        onChange={(e) => setSearch(e.target.value)} 
        sx={{ bgcolor: 'background.default', width: '300px', marginTop: '1rem', marginBottom: '1rem', transition: 'background-color 1.0s ease-in-out', }}
      />

      <Box component={Paper} sx={{ transition: 'background-color 1.0s ease-in-out', }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead >
              <TableRow sx={{ transition: 'background-color 1.0s ease-in-out, color 1.0s ease-in-out', }}>
                {/* Column headers with sort and hover effect */}
                <TableCell
                  onMouseLeave={handleMouseLeave}
                  sx={{
                    color: isDarkMode ? '#ffffff' : '#000000',
                    transition: transitionEnabled ? 'background-color 1.0s ease-in-out, color 1.0s ease-in-out' : 'none',
                    width: '20%',
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: isDarkMode ? '#444' : '#ddd', transition:'none' },
                  }}
                  onClick={() => handleSort('ticker')}
                >
                  {t('stock')} {sortConfig.key === "ticker" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                </TableCell>

                <TableCell
                  align="right"
                  onMouseLeave={handleMouseLeave}
                  sx={{
                    color: isDarkMode ? '#ffffff' : '#000000',
                    transition: transitionEnabled ? 'background-color 1.0s ease-in-out, color 1.0s ease-in-out' : 'none',
                    width: '20%',
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: isDarkMode ? '#444' : '#ddd', transition:'none' },
                  }}
                  onClick={() => handleSort('currentPricing')}
                >
                  {t('currentPricing')} {sortConfig.key === "currentPricing" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                </TableCell>

                <TableCell
                  align="right"
                  onMouseLeave={handleMouseLeave}
                  sx={{
                    color: isDarkMode ? '#ffffff' : '#000000',
                    transition: transitionEnabled ? 'background-color 1.0s ease-in-out, color 1.0s ease-in-out' : 'none',
                    width: '20%',
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: isDarkMode ? '#444' : '#ddd', transition:'none' },
                  }}
                  onClick={() => handleSort('predictedPrice')}
                >
                  {t('predictedPrice')} {sortConfig.key === "predictedPrice" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                </TableCell>

                <TableCell
                  align="right"
                  onMouseLeave={handleMouseLeave}
                  sx={{
                    color: isDarkMode ? '#ffffff' : '#000000',
                    transition: transitionEnabled ? 'background-color 1.0s ease-in-out, color 1.0s ease-in-out' : 'none',
                    width: '20%',
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: isDarkMode ? '#444' : '#ddd', transition:'none' },
                  }}
                  onClick={() => handleSort('change')}
                >
                  {t('change')} {sortConfig.key === "change" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                </TableCell>

                <TableCell
                  align="right"
                  onMouseLeave={handleMouseLeave}
                  sx={{
                    color: isDarkMode ? '#ffffff' : '#000000',
                    transition: transitionEnabled ? 'background-color 1.0s ease-in-out, color 1.0s ease-in-out' : 'none',
                    width: '20%',
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: isDarkMode ? '#444' : '#ddd', transition:'none' },
                  }}
                  onClick={() => handleSort('predictedVolatility')}
                >
                  {t('predictedVolatility')} {sortConfig.key === "predictedVolatility" && (sortConfig.direction === "asc" ? "▲" : "▼")}
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
                    '&:hover': { backgroundColor: isDarkMode ? '#3E3E3E' : '#f5f5f5' },
                  }}
                >
                  <TableCell sx={{ transition: 'background-color 1.0s ease-in-out, color 1.0s ease-in-out', width: '20%' }}>
                    {row.ticker}
                  </TableCell>
                  <TableCell align="right" sx={{ transition: 'background-color 1.0s ease-in-out, color 1.0s ease-in-out', width: '20%' }}>
                    {row.currentPricing}
                  </TableCell>
                  <TableCell align="right" sx={{ transition: 'background-color 1.0s ease-in-out, color 1.0s ease-in-out', width: '20%' }}>
                    {row.predictedPrice}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      transition: 'background-color 1.0s ease-in-out, color 1.0s ease-in-out',
                      color: row.currentPricing && row.predictedPrice
                        ? ((Number(row.predictedPrice) - Number(row.currentPricing)) / Number(row.currentPricing)) > 0
                          ? 'green'
                          : 'red'
                        : 'inherit',
                      width: '20%',
                    }}
                  >
                    {row.currentPricing && row.predictedPrice
                      ? ((Number(row.predictedPrice) - Number(row.currentPricing)) / Number(row.currentPricing) * 100).toFixed(2) + '%'
                      : 'N/A'}
                  </TableCell>
                  <TableCell align="right" sx={{ transition: 'background-color 1.0s ease-in-out, color 1.0s ease-in-out', width: '20%' }}>
                    {row.predictedVolatility}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Dashboard;
