import React from 'react';
import Chart from 'react-apexcharts';

const RadialGaugeChart = ({ risk = 42 }) => {
  const series = [risk]; // Dynamic risk percentage

  const options = {
    chart: {
      type: 'radialBar',
      offsetY: -20,
      sparkline: {
        enabled: true
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          show: false // hides background track so it looks floating
        },
        dataLabels: {
          name: {
            show: false
          },
          value: {
            offsetY: 0,
            fontSize: '24px',
            fontWeight: 800,
            color: '#F43F5E', // --danger
            formatter: function (val) {
              return val + "%";
            }
          }
        }
      }
    },
    colors: ['#F43F5E'], // --danger
    stroke: {
      lineCap: 'round'
    }
  };

  return (
    <div className="w-full flex justify-center h-32 overflow-hidden mt-4">
      <Chart options={options} series={series} type="radialBar" height="250" />
    </div>
  );
};

export default RadialGaugeChart;
