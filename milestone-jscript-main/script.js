const fetchData = () => {
    const data = fetch('./Data_Dashboard.json')
        .then(response => response.json())

    return data;
}

fetchData()
.then((res) => console.log(res))

fetchData()
    .then(data =>{
        const orders = data.map(item => parseInt(item.Total_Order));

                // Menghitung total order
                const totalOrders = orders.reduce((sum, current) => sum + current, 0);
                console.log('Total Orders:', totalOrders);
                document.querySelector('.totalOrder').textContent = `Total Orders: ${totalOrders}`;
        
                // Menghitung total revenue
                const totalRevenue = data.reduce((sum, current) => sum + parseFloat(current.Revenue), 0);
                console.log('Total Revenue:', totalRevenue);
                document.querySelector('.totalRevenue').textContent = `Total Revenue: ${totalRevenue.toFixed(2)}`;

                // Menghitung total sales
                const totalSales = data.reduce((sum, current) => sum + parseInt(current.Sales), 0);
                console.log('Total Sales:', totalSales);
                document.querySelector('.totalSales').textContent = `Total Sales: ${totalSales}`;

                // Mengelompokkan data berdasarkan bulan
                const monthDataRevenue = {};
                data.forEach(item => {
                    const month = new Date(item.Date).toLocaleString('en-us', { month: 'short' });
                    monthDataRevenue[month] = (monthDataRevenue[month] || 0) + parseFloat(item.Revenue);
                });

                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const revenues = months.map(month => monthDataRevenue[month] || 0);
                console.log(revenues)
                //  Line Chart untuk revenue per bulan
                const revCtx = document.getElementById('revChart').getContext('2d');
                const revenueChart = new Chart(revCtx, {
                    type: 'line',
                    data: {
                        labels: months,
                        datasets: [{
                            label: 'Revenue per Bulan',
                            data: revenues,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true,
                            }
                        }
                    }
                });
                
                //  data line chart sales per bulan
                const monthDataSales = {};
                data.forEach(item => {
                    const month = new Date(item.Date).toLocaleString('en-us', { month: 'short' });
                    monthDataSales[month] = (monthDataSales[month] || 0) + parseFloat(item.Sales);
                });

                const sales = months.map(month => monthDataSales[month] || 0);

                //  Line Chart untuk sales per bulaN
                const salCtx = document.getElementById('salChart').getContext('2d');
                const salesChart = new Chart(salCtx, {
                    type: 'line',
                    data: {
                        labels: months,
                        datasets: [{
                            label: 'Sales per Bulan',
                            data: sales,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true,
                            }
                        }
                    }
           });
                // pie chart size pizza
                const salesBySize = data.reduce((acc, item) => {
                    if (!acc[item.Size]) {
                        acc[item.Size] = 0;
                    }
                    acc[item.Size] += parseInt(item.Sales, 10);
                    return acc;
                }, {});
    
                // Menyiapkan data untuk Chart.js
                const sizes = Object.keys(salesBySize);
                const saless = Object.values(salesBySize);
                const sizCtx = document.getElementById('sizChart').getContext('2d');
                const sizeChart = new Chart(sizCtx,{
                    type: 'pie',
                    data: {
                        labels: sizes,
                        datasets: [{
                            label: 'Size of Pizza',
                            data: saless,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: [
                                'rgb(255, 99, 132)',
                                'rgb(54, 162, 235)',
                                'rgb(255, 205, 86)',
                                'rgb(75, 192, 192)',
                                'rgb(153, 102, 255)'
                            ],
                            borderWidth: 1,
                            hoverOffset: 4,
                        }]
                    },
                    options: {
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        let label = context.label || '';
                                        if (label) {
                                            label += ': ';
                                        }
                                        if (context.parsed !== null) {
                                            label += context.parsed;
                                        }
                                        return label;
                                    }
                                }
                            },
                            labels: {
                                render: 'percentage', // Menampilkan persentase
                                precision: 0 // Jumlah desimal untuk persentase
                            }
                        }
                    },

                });
                // membuat diagram batang group bar chart
                const categories = ['Classic', 'Veggie', 'Chicken', 'Supreme'];
                const salesData = {};

                // Inisialisasi data penjualan untuk setiap kategori dan bulan
                categories.forEach(category => {
                    salesData[category] = Array(12).fill(0);
                });

                data.forEach(item => {
                    const monthIndex = new Date(item.Date).getMonth();
                    if (salesData[item.Category]) {
                        salesData[item.Category][monthIndex] += parseInt(item.Sales);
                    }
                });
                const backgroundColors = [
                    'rgba(255, 99, 132, 1)', 
                    'rgba(54, 162, 235, 1)', 
                    'rgba(255, 205, 86, 1)', 
                    'rgba(75, 192, 192, 1)' 
                ];
                const borderColors = [
                    'rgb(255, 99, 132)', 
                    'rgb(54, 162, 235)', 
                    'rgb(255, 205, 86)', 
                    'rgb(75, 192, 192)' 
                ];

                // data group bar chart
                const datasets = categories.map((category, index) => ({
                    label: category,
                    data: salesData[category],
                    backgroundColor: backgroundColors[index],
                    borderColors: borderColors[index],
                    borderWidth: 1
                }));

                const chartData = {
                    labels: months,
                    datasets: datasets
                };
                const catCtx = document.getElementById('catChart').getContext('2d');
                const categoryChart = new Chart(catCtx,{
                    type: 'bar',
                    data: chartData,
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                        }
                    }
                });
               
                const categoryDropdown = document.getElementById('categoryDropdown');
                const sizeDropdown = document.getElementById('sizeDropdown');

                // filtering
                categoryDropdown.addEventListener('change', () => {
                    const selectedCategory = categoryDropdown.value;
                    let filteredData;
    
                    if (selectedCategory === 'all') {
                        filteredData = data;
                    } else {
                        filteredData = data.filter(item => item.Category === selectedCategory);
                    }
                    console.log('Selected Category:', selectedCategory);
                    console.log('Filtered Data:', filteredData);
                    updateCharts(filteredData);
                });

                sizeDropdown.addEventListener('change', () => {
                    const selectedSize = sizeDropdown.value;
                    let filteredData;
    
                    if (selectedSize === 'all') {
                        filteredData = data;
                    } else {
                        filteredData = data.filter(item => item.Size === selectedSize);
                    }
                    console.log('Selected Size', selectedSize);
                    console.log(filteredData);
                    updateCharts(filteredData);
                });

            function updateCharts(filteredData){
                // Total
                const totalOrders = filteredData.reduce((sum, current) => sum + parseInt(current.Total_Order), 0);
                document.querySelector('.totalOrder').textContent = `Total Order: ${totalOrders}`;

                const totalRevenue = filteredData.reduce((sum, current) => sum + parseFloat(current.Revenue), 0);
                document.querySelector('.totalRevenue').textContent = `Total Revenue: ${totalRevenue.toFixed(2)}`;

                const totalSales = filteredData.reduce((sum, current) => sum + parseInt(current.Sales), 0);
                document.querySelector('.totalSales').textContent = `Total Sales: ${totalSales}`;
                
                // line chart
                const monthDataRevenue = {};
                const monthDataSales = {};

                filteredData.forEach(item => {
                    const month = new Date(item.Date).toLocaleString('en-us', { month: 'short' });
                    if (!monthDataRevenue[month]) monthDataRevenue[month] = 0;
                    if (!monthDataSales[month]) monthDataSales[month] = 0;
                    monthDataRevenue[month] += parseFloat(item.Revenue);
                    monthDataSales[month] += parseInt(item.Sales);
                });

                const revenues = months.map(month => monthDataRevenue[month] || 0);
                const sales = months.map(month => monthDataSales[month] || 0);

                revenueChart.data.datasets[0].data = revenues;
                revenueChart.update();

                salesChart.data.datasets[0].data = sales;
                salesChart.update();

                // size pizza
                const salesBySize = filteredData.reduce((acc, item) => {
                    if (!acc[item.Size]) {
                        acc[item.Size] = 0;
                    }
                    acc[item.Size] += parseInt(item.Sales, 10);
                    return acc;
                }, {});

                const sizes = Object.keys(salesBySize)
                const saless = Object.values(salesBySize);
                sizeChart.data.labels = sizes;
                sizeChart.data.datasets[0].data = saless;
                sizeChart.update();

                // category
                const salesData = {};
                categories.forEach(category => {
                    salesData[category] = Array(12).fill(0);
                });

                filteredData.forEach(item => {
                    const monthIndex = new Date(item.Date).getMonth();
                    if (salesData[item.Category]) {
                        salesData[item.Category][monthIndex] += parseInt(item.Sales);
                    }
                });

                const datasets = categories.map((category, index) => ({
                    label: category,
                    data: salesData[category],
                    backgroundColor: backgroundColors[index],
                    borderColors: borderColors[index],
                    borderWidth: 1
                }));

                const chartData = {
                    labels: months,
                    datasets: datasets
                };
                categoryChart.data = chartData;
                categoryChart.update();
                }

       });
       

const menuToogle = document.querySelector('.menu-toggle input');
const nav = document.querySelector('.navbar .menu');

menuToogle.addEventListener('click', function () {
    nav.classList.toggle('slide');
})
