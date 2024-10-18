import { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { useGetDashboardDataQuery } from '../../../../provider/queries/Chemistry.dashboard.query';
import { toast } from 'sonner';

export default function PieChartDemo() {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    const { data: dashboardData = {}, error, isLoading } = useGetDashboardDataQuery();

    // Extract the necessary summaries from the data
    const chemicalsSummary = dashboardData.chemicalsSummary || {};
    const reagentsSummary = dashboardData.reagentsSummary || {};
    const glasswareSummary = dashboardData.glasswareSummary || {};
    const measuringSummary = dashboardData.measuringSummary || {};
    const othersSummary = dashboardData.othersSummary || {};
    useEffect(() => {
        const data = {
            labels: ['Chemicals', 'Reagents', 'Glassware', 'Measuring', 'Others'],
            datasets: [
                {
                    data: [
                        chemicalsSummary.totalCount, 
                        reagentsSummary.totalCount, 
                        glasswareSummary.totalCount, 
                        measuringSummary.totalCount, 
                        othersSummary.totalCount
                    ],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)', 
                        'rgba(169, 222, 249, 0.9)', 
                        'rgba(179, 162, 213, 0.5)',
                        'rgba(250, 223, 173, 0.5)',
                        'rgba(194, 255, 196, 0.5)'
                    ],
                    hoverBackgroundColor: [
                        'rgba(255, 99, 132, 0.6)',  
                        'rgba(133, 222, 249, 0.9)',  
                        'rgba(179, 162, 213, 0.7)',
                        'rgba(250, 223, 173, 0.7)',
                        'rgba(194, 255, 196, 0.9)'
                    ]
                }
            ]
        };
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
    }, [dashboardData]);

    if (isLoading) return <div>Loading...</div>;
    if (error) {
        toast.error("Error fetching dashboard data");
        console.error(error);
        return <div>Error fetching data</div>;
    }


    return (
        <Chart type="pie" data={chartData} options={chartOptions} className="w-full lg:w-1/3" />
    );
}
