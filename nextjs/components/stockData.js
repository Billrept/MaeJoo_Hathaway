import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { useTranslation } from 'react-i18next';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const StockGraph = ({ prices, dates, ratio}) => {

  const { t } = useTranslation(['stockGraph']);

  const data = {
    labels: dates,
    datasets: [
      {
        label: t('labelText'),
        data: prices,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.1,  // Increased tension to smooth out the line
        pointRadius: 0,  // Hides the circles
        pointHoverRadius: 6, // Shows larger circles on hover
        hitRadius: 10
      },
    ],
  };

  // Define the chart options
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: ratio,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: t('titleText'),
      },
    },
    scales: {
      x: {
        grid: {
          display: false,  // Hide grid lines on the x-axis
        },
        ticks: {
          autoSkip: true,  // Automatically skip labels to avoid clutter
          maxTicksLimit: 10,  // Maximum number of labels to show on the x-axis
        },
      },
      y: {
        grid: {
          display: false,  // Hide grid lines on the y-axis
        },
      },
    },
    interaction: {
      mode: 'nearest', // Show the nearest point on the x-axis
      axis: 'x', // Focus on the x-axis to display the nearest data point
      intersect: false, // Ensure it shows the point even if the mouse is not directly on the line
    },
  };

  return <Line data={data} options={options} />;
};

export default StockGraph;
