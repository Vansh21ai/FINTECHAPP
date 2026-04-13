import React from 'react';
import Chart from 'react-apexcharts';

const RiskLineChart = () => {
  const series = [
    {
      name: 'Your Portfolio',
      data: [31, 40, 28, 51, 42, 109, 100]
    },
    {
      name: 'Safe Baseline',
      data: [11, 32, 45, 32, 34, 52, 41]
    }
  ];

  const options = {
    chart: {
      type: 'line',
      sparkline: {
        enabled: true
      },
      fontFamily: 'inherit',
    },
    colors: ['#F43F5E', '#0EA5E9'], // --danger, --accent-secondary
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    tooltip: {
      theme: 'light',
      marker: {
        show: false,
      },
      y: {
        formatter: (val) => `${val}% Volatility`
      }
    }
  };

  return (
    <div className="w-full h-full mt-2">
      <Chart options={options} series={series} type="line" height="100%" />
    </div>
  );
};

export default RiskLineChart;
