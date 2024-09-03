import  { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';

export default function BasicChart() {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const data = {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            datasets: [
                {
                    label: 'Sales',
                    data: [540, 325, 702, 620],
                    backgroundColor: [
                        'rgba(252, 246, 96, 0.3)',
                        'rgba(136, 132, 255, 0.2)',
                        'rgba(215, 188, 232, 0.2)',
                        'rgba(198, 235, 190, 0.2)'
                    ],
                    borderColor: [
                        'rgb(252, 246, 97)',
                        'rgb(136, 109, 255)',
                        'rgb(215, 151, 232)',
                        'rgb(156, 235, 190)'
                    ],
                    borderWidth: 1
                }
            ]
        };
        const options = {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    }, []);

    return ( 
            <Chart type="bar" width='' className=' w-full lg:w-1/2 ' data={chartData} options={chartOptions} />

    )
}