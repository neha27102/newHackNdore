        // Mock data (replace with actual API calls in a real application)
        const mockData = {
            totalUsage: 4350,
            totalLeakage: 190,
            efficiency: 95.6,
            waterUsage: [
                { date: '2024-01', usage: 1000, leakage: 50 },
                { date: '2024-02', usage: 1100, leakage: 45 },
                { date: '2024-03', usage: 1050, leakage: 55 },
                { date: '2024-04', usage: 1200, leakage: 40 },
            ]
        };

        // Initialize chart
        let waterChart;

        // DOM elements
        const totalUsageElement = document.getElementById('totalUsage');
        const totalLeakageElement = document.getElementById('totalLeakage');
        const efficiencyElement = document.getElementById('efficiency');
        const wardSelect = document.getElementById('wardSelect');
        const metricSelect = document.getElementById('metricSelect');
        const generateReportButton = document.getElementById('generateReport');
        const usageForm = document.getElementById('usageForm');
        const leakageForm = document.getElementById('leakageForm');

        // Update metrics
        function updateMetrics() {
            totalUsageElement.textContent = `${mockData.totalUsage} KL`;
            totalLeakageElement.textContent = `${mockData.totalLeakage} KL`;
            efficiencyElement.textContent = `${mockData.efficiency}%`;
        }

        // Create or update chart
        function updateChart() {
            const ctx = document.getElementById('waterChart').getContext('2d');
            const selectedMetric = metricSelect.value;
            
            const chartData = {
                labels: mockData.waterUsage.map(d => d.date),
                datasets: [{
                    label: selectedMetric === 'usage' ? 'Water Usage (KL)' : 'Water Leakage (KL)',
                    data: mockData.waterUsage.map(d => d[selectedMetric]),
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            };

            if (waterChart) {
                waterChart.data = chartData;
                waterChart.update();
            } else {
                waterChart = new Chart(ctx, {
                    type: 'line',
                    data: chartData,
                    options: {
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }
        }

        // Event listeners
        wardSelect.addEventListener('change', updateChart);
        metricSelect.addEventListener('change', updateChart);
        generateReportButton.addEventListener('click', () => {
            alert('Report generated! (This is a placeholder for actual report generation)');
        });

        usageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const ward = document.getElementById('usageWard').value;
            const amount = document.getElementById('usageAmount').value;
            const date = document.getElementById('usageDate').value;
            alert(`Water usage reported: Ward ${ward}, Amount: ${amount} KL, Date: ${date}`);
            usageForm.reset();
        });

        leakageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const ward = document.getElementById('leakageWard').value;
            const amount = document.getElementById('leakageAmount').value;
            const location = document.getElementById('leakageLocation').value;
            const date = document.getElementById('leakageDate').value;
            alert(`Leakage reported: Ward ${ward}, Amount: ${amount} KL, Location: ${location}, Date: ${date}`);
            leakageForm.reset();
        });

        // Initial setup
        updateMetrics();
        updateChart();

        //new modified code
        document.addEventListener('DOMContentLoaded', () => {
    const usageForm = document.getElementById('usageForm');
    const leakageForm = document.getElementById('leakageForm');
    const API_URL = 'http://localhost:3000/api';

    // Function to generate bill
    async function generateBill(type, formData) {
        try {
            const response = await fetch(`${API_URL}/generate-bill`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, data: formData })
            });

            const result = await response.json();
            if (response.ok) {
                alert(`Bill generated successfully! Download it from the server at /bills/${result.file}`);
            } else {
                alert('Error generating bill');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    usageForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            ward: document.getElementById('usageWard').value,
            amount: Number(document.getElementById('usageAmount').value),
            date: document.getElementById('usageDate').value
        };

        try {
            const response = await fetch(`${API_URL}/usage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                await generateBill('usage', formData);
                usageForm.reset();
                updateMetrics();
                updateChart();
            } else {
                alert('Error reporting water usage');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    leakageForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            ward: document.getElementById('leakageWard').value,
            amount: Number(document.getElementById('leakageAmount').value),
            location: document.getElementById('leakageLocation').value,
            date: document.getElementById('leakageDate').value
        };

        try {
            const response = await fetch(`${API_URL}/leakage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                await generateBill('leakage', formData);
                leakageForm.reset();
                updateMetrics();
                updateChart();
            } else {
                alert('Error reporting water leakage');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});
