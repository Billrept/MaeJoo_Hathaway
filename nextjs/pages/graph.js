import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Box, Button, TextField, Typography } from '@mui/material';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default function StockChart() {
  const [stockPrices, setStockPrices] = useState([]);
  const [labels, setLabels] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const handleAddStockPrice = () => {
    if (!inputValue || isNaN(inputValue)) {
      setError('Please enter a valid number');
      return;
    }
    const newLabels = [...labels, `Day ${labels.length + 1}`];
    const newStockPrices = [...stockPrices, Number(inputValue)];
    
    setLabels(newLabels);
    setStockPrices(newStockPrices);
    setInputValue('');
    setError('');
  };

  // Data for the graph
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Stock Price',
        data: stockPrices,
        fill: false,
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Stock Price Tracker
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', marginBottom: 4 }}>
        <TextField
          label="Enter Stock Price"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          variant="outlined"
        />
        <Button variant="contained" onClick={handleAddStockPrice}>
          Add
        </Button>
      </Box>

      {error && <Typography color="error">{error}</Typography>}

      {stockPrices.length > 0 && (
        <Box>
          <Line data={data} />
        </Box>
      )}
    </Box>
  );
}
