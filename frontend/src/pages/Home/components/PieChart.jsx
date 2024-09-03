import { useState, useEffect } from 'react';
    import { Chart } from 'primereact/chart';

    export default function PieChartDemo() {
        const [chartData, setChartData] = useState({});
        const [chartOptions, setChartOptions] = useState({});

        useEffect(() => {
            const documentStyle = getComputedStyle(document.documentElement);
            const data = {
                labels: ['A', 'B', 'C'],
                datasets: [
                    {
                        data: [540, 325, 702],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.5)', 
                            'rgba(169, 222, 249, 0.9)', 
                            'rgba(179, 162, 213, 0.5)'  
                        ],
                        hoverBackgroundColor: [
                            'rgba(255, 99, 132, 0.6)',  
                            'rgba(133, 222, 249, 0.9)',  
                            'rgba(179, 162, 213, 0.7)'   
                        ]
                    }
                ]
            }
            const options = {
                plugins: {
                    legend: {
                        labels: {
                            usePointStyle: true
                        }
                    }
                }
            };

            setChartData(data);
            setChartOptions(options);
        }, []);

        return ( 
                <Chart type="pie" data={chartData} options={chartOptions} className="w-full lg:w-1/3" />

        )
    }