const ctx = document.getElementById('myChart');

const labels = Array(7).fill('').map((el, i) => i+1);
const data = {
  labels: labels,
  datasets: [{
    label: 'My First Dataset',
    data: [65, 59, 80, 81, 56, 55, 40],
    fill: false,
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
  },
  {
    label: 'My Second Dataset',
    data: [65, 59, 80, 81, 56, 55, 40].map(el => Math.floor(el*0.8)),
    fill: false,
    borderColor: 'rgb(201, 50, 159)',
    tension: 0.1
  },
  {
    label: 'My Thirth Dataset',
    data: [65, 59, 80, 81, 56, 55, 40].map(el => Math.floor(el*0.5)),
    fill: false,
    borderColor: 'rgb(7, 58, 240)',
    tension: 0.1
  },
  ]
};

const config = {
  type: 'line',
  data: data,
};


new Chart(ctx, config);
