import { useGetDashboardDataQuery } from '../../../provider/queries/Chemistry.dashboard.query';
import BarChart from "./components/BarChart";
import PieChart from "./components/PieChart";
import BreadCrumbs from '../../../components/BreadCrumbs';
import { useRef } from 'react';
import { SplitButton } from 'primereact/splitbutton';
import { toast } from 'sonner';

const HomePage = () => {
    const toastRef = useRef(null);

    const { data: dashboardData = {}, error, isLoading } = useGetDashboardDataQuery();

    const items = [
        {
            label: 'Excel Sheet',
            command: () => {
                toastRef.current.show({ severity: 'success', summary: 'Excel Sheet', detail: 'Data Downloaded' });
            }
        },
        {
            label: 'Pdf',
            command: () => {
                toastRef.current.show({ severity: 'warn', summary: 'Pdf', detail: 'Data Downloaded' });
            }
        }
    ];

    const save = () => {
        toastRef.current.show({ severity: 'success', summary: 'Success', detail: 'Data Saved' });
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) {
        toast.error("Error fetching dashboard data");
        console.error(error);
        return <div>Error fetching data</div>;
    }

    console.log("Dashboard Data:", dashboardData);

    // Extract the necessary summaries from the data
    const chemicalsSummary = dashboardData.chemicalsSummary || {};
    const reagentsSummary = dashboardData.reagentsSummary || {};
    const glasswareSummary = dashboardData.glasswareSummary || {};
    const measuringSummary = dashboardData.measuringSummary || {};
    const othersSummary = dashboardData.othersSummary || {};

    // Calculate total items and quantities
    const totalItemsCount = chemicalsSummary.totalCount + reagentsSummary.totalCount + glasswareSummary.totalCount + measuringSummary.totalCount + othersSummary.totalCount || 0;
    const totalItemsQuantity = chemicalsSummary.totalQuantity + reagentsSummary.totalQuantity + glasswareSummary.totalQuantity + measuringSummary.totalQuantity + othersSummary.totalQuantity || 0;

    // Use the data directly for the remaining metrics
    const lowStockCount = dashboardData.lowStockCount || 'N/A';
    const nearExpiryCount = dashboardData.nearExpiryCount || 'N/A';
    const zeroStockCount = dashboardData.zeroStockCount || 'N/A';
    const expiredItemsCount = dashboardData.expiredItemsCount || 'N/A';
    const inStockCount = dashboardData.inStockCount || 'N/A';

    return (
        <div>
            <div className="w-full flex flex-wrap justify-evenly mt-10">
                <BreadCrumbs PageLink='/Chemicals' PageName='Chemicals' />

                <div className="w-full flex justify-end mb-10 mr-10 font-normal">
                    <div className="card bg-slate-300 rounded-lg p-2">
                        <SplitButton label="Download Reports" icon="pi pi-plus" onClick={save} model={items} />
                    </div>
                </div>

                <div className="cards w-full flex flex-wrap gap-x-16 ml-10">
                    <div className="card w-80 h-56 rounded-md">
                        <h2 className="font-bold text-lg p-1">Urgent Actions</h2>
                        <div className="bg-rose-100 text-black border-2 border-rose-300 shadow-none h-40 rounded-md p-5">
                            <h3 className="m-0">Low Stock Quantity:</h3>
                            <p className="m-0 font-semibold">{lowStockCount}</p>
                            <h3 className="mt-5">Near Expiry Quantity:</h3>
                            <p className="m-0 font-semibold">{nearExpiryCount}</p>
                        </div>
                    </div>

                    <div className="card w-80 h-56 rounded-md">
                        <h2 className="font-bold text-lg p-1">Stock Details</h2>
                        <div className="bg-blue-100 text-black border-2 border-blue-300 shadow-none h-40 rounded-md p-5">
                            <h3 className="m-0">Zero Stock Products:</h3>
                            <p className="m-0 font-semibold">{zeroStockCount}</p>
                            <h3 className="mt-5">In Stock Products:</h3>
                            <p className="m-0 font-semibold">{inStockCount}</p>
                        </div>
                    </div>

                    <div className="card w-80 h-56 rounded-md">
                        <h2 className="font-bold text-lg p-1">Item Details</h2>
                        <div className="bg-emerald-50 text-black border-2 border-emerald-200 shadow-none h-40 rounded-md p-5">
                            <h3 className="m-0">Total Count of All Items:</h3>
                            <p className="m-0 font-semibold">{totalItemsCount}</p>
                            <h3 className="mt-5">Total Quantity of All Items:</h3>
                            <p className="m-0 font-semibold">{totalItemsQuantity}</p>
                        </div>
                    </div>

                    <div className="card w-80 h-56 rounded-md">
                        <h2 className="font-bold text-lg p-1">Out of Stock & Expiration</h2>
                        <div className="bg-yellow-100 text-black border-2 border-yellow-300 shadow-none h-40 rounded-md p-5">
                            <h3 className="m-0">Out of Stock Items:</h3>
                            <p className="m-0 font-semibold">{zeroStockCount}</p>
                            <h3 className="mt-5">Expired Items:</h3>
                            <p className="m-0 font-semibold">{expiredItemsCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-fit flex flex-wrap my-10 ml-10 gap-x-10 items-center">
                <h2 className="font-bold text-lg w-full">Item Quantity by Category</h2>
                <BarChart />
                <h2 className="font-bold text-lg w-full mt-10">Item Count by Category</h2>
                <PieChart />
            </div>

            <div className="w-full flex flex-wrap flex-col my-10 gap-y-2">
                <h1 className="font-bold">Low Stock Items:</h1>
                <div className="relative overflow-x-auto shadow">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                        <thead className="text-xs text-black border-b uppercase bg-gray-50">
                            <tr className="border-b">
                                <th scope="col" className="px-4 py-2">Item Name</th>
                                <th scope="col" className="px-4 py-2">Location</th>
                                <th scope="col" className="px-4 py-2">Barcode</th>
                                <th scope="col" className="px-4 py-2">Total Quantity</th>
                                <th scope="col" className="px-4 py-2">Current Quantity</th>
                                <th scope="col" className="px-4 py-2">Minimum Stock Level</th>
                                <th scope="col" className="px-4 py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Render Low Stock Items here */}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="w-full flex flex-wrap flex-col my-10 gap-y-2">
                <h1 className="font-bold">Near Expiry Items:</h1>
                <div className="relative overflow-x-auto shadow">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                        <thead className="text-xs text-black border-b uppercase bg-gray-50">
                            <tr className="border-b">
                                <th scope="col" className="px-4 py-2">Item Name</th>
                                <th scope="col" className="px-4 py-2">Location</th>
                                <th scope="col" className="px-4 py-2">Barcode</th>
                                <th scope="col" className="px-4 py-2">Total Quantity</th>
                                <th scope="col" className="px-4 py-2">Current Quantity</th>
                                <th scope="col" className="px-4 py-2">Expiration Date</th>
                                <th scope="col" className="px-4 py-2">Expiration Alert Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Render Near Expiry Items here */}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default HomePage;