import React from 'react';
import Chart from 'chart.js/auto';
import { Line } from 'react-chartjs-2';

// const ctx = document.getElementById('myChart').getContext('2d');
// const gradientFill = ctx.createLinearGradient(500, 0, 100, 0);

const data = {
  labels: [
    '1 HR',
    '2 HR',
    '3 HR',
    '4 HR',
    '5 HR',
    '6 HR',
    '7 HR',
    '8 HR',
    '9 HR',
    '10 HR',
    '11 HR',
    '12 HR',
    '13 HR',
    '14 HR',
    '15 HR',
    '16 HR',
    '17 HR',
    '18 HR',
    '19 HR',
    '20 HR',
    '21 HR',
    '22 HR',
    '23 HR',
    '24 HR',
  ],
  datasets: [
    {
      label: ['Azure Function Invocations'],
      data: [
        65, 59, 80, 81, 56, 55, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0,
      ],
      position: 'right',
      fill: true,
      backgroundColor: '#35b7e8',
      // backgroundColor: '#B2E6FF',
      // background: 'linear-gradient(#e66465, #9198e5)',
      borderColor: '#0085cf',
      lineTension: 0.44,
      radius: 4,
    },
  ],
};

const options = {
  plugins: {
    title: {
      display: true,
      text: 'Azure Function Calls',
      align: 'start',
      font: {
        size: 30,
        family: 'Helvetica',
        weight: 'bold',
      },
    },

    legend: {
      display: false,
      position: 'right',
      align: 'start',
    },
  },
  scales: {
    y: {
      position: 'right',
      grid: {
        display: true,
      },
      ticks: {
        callback: function (value, index, ticks) {
          return '$' + value;
        },
      },
      title: {
        display: true,
        text: 'Number of Invocations',
        color: '#0085cf',
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },

  // animations: {
  //   tension: {
  //     duration: 1700,
  //     easing: 'easeInOutExpo',
  //     from: 0.1,
  //     to: 0,
  //     loop: true,
  //   },
  // },
};

function lineChart() {
  return (
    <div>
      <Line id='myChart' data={data} options={options} />
    </div>
  );
}

export default lineChart;
