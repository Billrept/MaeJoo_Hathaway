import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { useTranslation } from 'react-i18next';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const StockGraph = ({ prices, dates, ratio }) => {
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
        tension: 0.1, // Increased tension to smooth out the line
        pointRadius: 0, // Hides the circles
        pointHoverRadius: 6, // Shows larger circles on hover
        hitRadius: 10,
      },
    ],
  };

  // Define the chart options with custom font applied
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: ratio,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: "'Prompt', sans-serif", // Apply font to the legend
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: t('titleText'),
        font: {
          family: "'Prompt', sans-serif", // Apply font to the title
          size: 14,
        },
      },
      tooltip: {
        titleFont: {
          family: "'Prompt', sans-serif", // Apply font to the tooltips
          size: 14,
        },
        bodyFont: {
          family: "'Prompt', sans-serif", // Apply font to the tooltips
          size: 12,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Hide grid lines on the x-axis
        },
        ticks: {
          autoSkip: true, // Automatically skip labels to avoid clutter
          maxTicksLimit: 10, // Maximum number of labels to show on the x-axis
          font: {
            family: "'Prompt', sans-serif", // Apply font to the x-axis labels
            size: 12,
          },
        },
      },
      y: {
        grid: {
          display: false, // Hide grid lines on the y-axis
        },
        ticks: {
          font: {
            family: "'Prompt', sans-serif", // Apply font to the y-axis labels
            size: 12,
          },
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
