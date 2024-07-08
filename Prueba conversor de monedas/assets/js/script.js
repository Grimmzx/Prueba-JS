
let myChart;

document.getElementById('convert').addEventListener('click', async () => {
    const amount = document.getElementById('amount').value;
    const currency = document.getElementById('currency').value;
    const result = document.getElementById('result');

    if (!amount || !currency) {
        result.textContent = 'Por favor, ingrese un monto y seleccione una moneda.';
        return;
    }

    try {
        const response = await fetch('./assets/data/mindicador.json');
        if (!response.ok) {
            throw new Error('Error al obtener los datos');
        }
        const data = await response.json();
        if (!data[currency]) {
            throw new Error('Moneda no encontrada en los datos');
        }
        const rate = data[currency].valor;
        const convertedAmount = (amount / rate).toFixed(2);
        result.textContent = `Resultado: $${convertedAmount}`;

        if (myChart) {
            myChart.destroy();
        }
        generateChart(data, currency);
    } catch (error) {
        result.textContent = `Error: ${error.message}`;
    }
});

async function generateChart(data, currencyCode) {
    try {
        if (!data[currencyCode] || !data[currencyCode].serie) {
            throw new Error('Datos históricos no encontrados');
        }
        const chartData = data[currencyCode].serie.slice(0, 10).reverse();
        const labels = chartData.map(item => item.fecha.substring(0, 10));
        const values = chartData.map(item => item.valor);

        const ctx = document.getElementById('chart').getContext('2d');
        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `Historial últimos 10 días (${currencyCode.toUpperCase()})`,
                    data: values,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } catch (error) {
        document.getElementById('result').textContent = `Error: ${error.message}`;
    }
}
