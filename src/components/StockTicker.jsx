import React, { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

Chart.register(LineElement, PointElement, CategoryScale, LinearScale);

const getRandomPrice = (prevPrice) => {
  const change = (Math.random() - 0.5) * 0.5; // Small change
  return +(prevPrice + change).toFixed(2);
};

const StockGraph = ({ title }) => {
  const chartRef = useRef(null);
  const [price, setPrice] = useState(100 + Math.random() * 50); // start random price
  const [volume, setVolume] = useState(1000 + Math.random() * 500);

  const [data, setData] = useState({
    labels: Array.from({ length: 20 }, (_, i) => i),
    datasets: [
      {
        label: title,
        data: Array(20).fill(price),
        borderColor: "#4ade80", // Green
        backgroundColor: "transparent",
        tension: 0.3, // Smooth curve
        pointRadius: 0,
      },
    ],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const newPrice = getRandomPrice(price);
      const newVolume = Math.floor(1000 + Math.random() * 500);

      const updatedData = [...data.datasets[0].data.slice(1), newPrice];

      setData((prev) => ({
        ...prev,
        datasets: [
          {
            ...prev.datasets[0],
            data: updatedData,
          },
        ],
      }));

      setPrice(newPrice);
      setVolume(newVolume);
    }, 1000); // update every second

    return () => clearInterval(interval);
  }, [data, price]);

  return (
    <div className="bg-zinc-900 p-4 rounded-xl w-[250px] shadow-md text-white border border-zinc-700">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-sm font-bold">{title}</h3>
          <p className="text-green-400 text-xs">Price: ${price}</p>
          <p className="text-blue-400 text-xs">Volume: {volume}</p>
        </div>
      </div>
      <Line
        ref={chartRef}
        data={data}
        options={{
          responsive: true,
          animation: {
            duration: 800,
            easing: "easeOutQuad",
          },
          scales: {
            x: {
              display: false,
            },
            y: {
              display: false,
              min: price - 5,
              max: price + 5,
            },
          },
          plugins: {
            legend: { display: false },
          },
        }}
      />
    </div>
  );
};

export default StockGraph;
