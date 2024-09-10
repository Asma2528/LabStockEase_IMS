import { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { useGetDashboardDataQuery } from '../../../../provider/queries/Chemistry.dashboard.query';
import { toast } from 'sonner';

export default function BasicChart() {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    const { data: dashboardData = {}, error, isLoading } = useGetDashboardDataQuery();

    // Extract the necessary summaries from the data
    const chemicalsSummary = dashboardData.chemicalsSummary || {};
    const reagentsSummary = dashboardData.reagentsSummary || {};
    const glasswareSummary = dashboardData.glasswareSummary || {};
    const measuringSummary = dashboardData.measuringSummary || {};
    const othersSummary = dashboardData.othersSummary || {};

    if (isLoading) return <div>Loading...</div>;
    if (error) {
        toast.error("Error fetching dashboard data");
        console.error(error);
        return <div>Error fetching data</div>;
    }

    useEffect(() => {
        const data = {
            labels: ['Chemicals', 'Reagents', 'Glassware', 'Measuring', 'Others'],
            datasets: [
                {
                    label: 'Total Quantity',
                    data: [
                        chemicalsSummary.totalQuantity, 
                        reagentsSummary.totalQuantity, 
                        glasswareSummary.totalQuantity, 
                        measuringSummary.totalQuantity, 
                        othersSummary.totalQuantity
                    ],
                    backgroundColor: [
                        'rgba(252, 246, 96, 0.3)',
                        'rgba(136, 132, 255, 0.2)',
                        'rgba(215, 188, 232, 0.2)',
                        'rgba(198, 235, 190, 0.2)',
                        'rgba(255, 99, 132, 0.2)'  // Added color for 'Others'
                    ],
                    borderColor: [
                        'rgb(252, 246, 97)',
                        'rgb(136, 109, 255)',
                        'rgb(215, 151, 232)',
                        'rgb(156, 235, 190)',
                        'rgb(255, 99, 132)'  // Added color for 'Others'
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
    }, [chemicalsSummary.totalQuantity, reagentsSummary.totalQuantity, glasswareSummary.totalQuantity, measuringSummary.totalQuantity, othersSummary.totalQuantity]);

    return (
        <Chart type="bar" className='w-full lg:w-1/2' data={chartData} options={chartOptions} />
    );
}
