import React, { useEffect } from 'react';

const TradingViewChart = ({ ticker, width = '100%', height = '500px' }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.TradingView) {
        new window.TradingView.widget({
          width: width,   // Ensure width adapts to container
          height: height, // Ensure height fits the desired dimensions
          symbol: ticker,
          interval: 'D',
          timezone: 'Etc/UTC',
          theme: 'light',  // Adjust theme as per preference
          style: '1',  // Candlestick chart
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: 'tradingview_widget',
        });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [ticker]);

  return <div id="tradingview_widget" style={{ width: width, height: height }} />;
};

export default TradingViewChart;
