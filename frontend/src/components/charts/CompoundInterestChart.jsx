import React from 'react';
import Chart from 'react-apexcharts';

const CompoundInterestChart = () => {
  // Mock data for exponential compound interest growth
  const series = [{
    name: 'Total Value',
    data: [10000, 11500, 14000, 18500, 26000, 38000, 56000, 85000, 125000, 142850]
  }];

  const options = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      sparkline: { enabled: true }, // sparkline hides all axes and grids inherently
      fontFamily: 'inherit',
    },
    colors: ['#4F46E5'], // --accent-primary
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.0,
        stops: [0, 100]
      }
    },
    dataLabels: {
      enabled: false
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: (val) => `$${val.toLocaleString()}`
      }
    }
  };

  return (
    <div className="w-full h-full">
      <Chart options={options} series={series} type="area" height="100%" />
    </div>
  );
};

export default CompoundInterestChart;
