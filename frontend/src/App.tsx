import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { ArrowDropUp, ArrowDropDown } from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const App: React.FC = () => {
  const [price, setPrice] = useState<number | null>(null);
  const [lastPrice, setLastPrice] = useState<number | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const [priceHistory, setPriceHistory] = useState<{time: Date, price: number}[]>([]);

  const fetchPrice = async () => {
    try {
      const fetchedPrice = await backend.getBitcoinPrice();
      const fetchedTime = await backend.getLastUpdateTime();
      if (fetchedPrice && fetchedPrice.length > 0) {
        const newPrice = Number(fetchedPrice[0]);
        setLastPrice(price);
        setPrice(newPrice);
        setLastUpdateTime(new Date(Number(fetchedTime) / 1000000));
        setPriceHistory(prev => [...prev, {time: new Date(), price: newPrice}].slice(-20));
      }
    } catch (error) {
      console.error('Error fetching Bitcoin price:', error);
    }
  };

  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, 60000); // Fetch every minute
    return () => clearInterval(interval);
  }, []);

  const priceChange = price && lastPrice ? price - lastPrice : 0;
  const priceChangeColor = priceChange >= 0 ? '#2ecc71' : '#e74c3c';

  const chartData = {
    labels: priceHistory.map(entry => entry.time.toLocaleTimeString()),
    datasets: [
      {
        label: 'Bitcoin Price',
        data: priceHistory.map(entry => entry.price),
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.2)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Bitcoin Price History',
      },
    },
  };

  return (
    <Box sx={{ textAlign: 'center', p: 3 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, maxWidth: 400, margin: 'auto' }}>
        <Typography variant="h4" gutterBottom>
          Bitcoin Price Tracker
        </Typography>
        {price ? (
          <>
            <Typography variant="h3" component="div" gutterBottom>
              ${price.toFixed(2)}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
              {priceChange >= 0 ? <ArrowDropUp sx={{ color: priceChangeColor }} /> : <ArrowDropDown sx={{ color: priceChangeColor }} />}
              <Typography variant="body1" sx={{ color: priceChangeColor }}>
                ${Math.abs(priceChange).toFixed(2)}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Last updated: {lastUpdateTime?.toLocaleString()}
            </Typography>
          </>
        ) : (
          <CircularProgress />
        )}
      </Paper>
      <Box sx={{ mt: 4, maxWidth: 600, margin: 'auto' }}>
        <Line options={chartOptions} data={chartData} />
      </Box>
    </Box>
  );
};

export default App;