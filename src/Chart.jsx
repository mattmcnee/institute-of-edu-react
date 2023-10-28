import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

const ChartLayout = ({setTitle}) => {
  setTitle("Chart Demo");
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Initial chart data
  const [chartData, setChartData] = useState({
    labels: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    datasets: [{
      label: '# of Votes',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)'
      ],
      borderWidth: 1
    }]
  });


  const handleButtonClick = () => {
    // Generate two random integers from 1 to 6, sum them
    const random1 = Math.floor(Math.random() * 6) + 1;
    const random2 = Math.floor(Math.random() * 6) + 1;
    const total = random1 + random2;

    // Increment the value of the corresponding bar by 1
    const newData = [...chartData.datasets[0].data];
    newData[total - 2] += 1; // Subtract 2 from total because the labels start from 'Two'

    // Update the chart data
    setChartData(prevData => ({
      ...prevData,
      datasets: [{
        ...prevData.datasets[0],
        data: newData
      }]
    }));
  };

  useEffect(() => {
    // Cleanup previous chart instance before creating a new one
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');


    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: {
        scales: {
          x: {
            type: 'category',
            labels: chartData.labels, 
            beginAtZero: true,
            title: {
              display: true,
              text: 'Dice Total'
            }            
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Times Rolled'
            }
          }
        }
      }
    });

    // Cleanup the chart when the component is unmounted
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData]);

  return (
    <div style={{ width: '400px', height: '500px', overflowY: 'auto', margin: '0 auto', textAlign: 'center' }}>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleButtonClick}>Increment Random Bar</button>
      </div>
      <canvas ref={chartRef} width={400} height={400}></canvas>
    </div>
  );
};

export default ChartLayout;
