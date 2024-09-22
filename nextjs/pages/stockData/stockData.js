import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);


const StockGraph = ({ prices, dates }) => {

    const data = {
      labels: dates,
      datasets: [
        {
          label: 'Stock Price',
          data: prices,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
          tension:0,
        },
      ],
    };

// const StockGraph = ({ prices }) => {

//   const data = {
//     labels: prices.map((_, index) => `Day ${index + 1}`),
//     datasets: [
//       {
//         label: 'Stock Price',
//         data: prices,
//         borderColor: 'rgba(75, 192, 192, 1)',
//         backgroundColor: 'rgba(75, 192, 192, 0.2)',
//         fill: true,
//         tension:0,
//       },
//     ],
//   };

  // Define the chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Stock Price over Time',
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default StockGraph;
