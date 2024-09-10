import BarChart from "./components/BarChart";
import PieChart from "./components/PieChart";
import { useRef } from 'react';
import { SplitButton } from 'primereact/splitbutton';

const HomePage = () => {
    const toast = useRef(null);
    const items = [
        {
            label: 'Excel Sheet',
            command: () => {
                toast.current.show({ severity: 'success', summary: 'Excel Sheet', detail: 'Data Downloaded' });
            }
        },
        {
            label: 'Pdf',
            command: () => {
                toast.current.show({ severity: 'warn', summary: 'Pdf', detail: 'Data Downloaded' });
            }
        }
    ];

    const save = () => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Data Saved' });
    };

    return (
        <div>
            <div className="w-full flex flex-wrap justify-evenly mt-10">
       

                <div className="w-full flex justify-end mb-10 mr-10 font-normal">
                    <div className="card bg-slate-300 rounded-lg p-2 ">
                        <SplitButton label="Download Reports" icon="pi pi-plus" onClick={save} model={items} />
                    </div>
                </div>

                <div className="cards w-full flex flex-wrap gap-x-16 ml-10">
                    {/* Card Components */}
                    <div className="card w-80 h-56 rounded-md">
                        <h2 className="font-bold text-lg p-1">Urgent Actions</h2>
                        <div className="bg-rose-100 text-black border-2 border-rose-300 shadow-none h-40 rounded-md p-5">
                            <h3 className="m-0">Low Stock Quantity:</h3>
                            <p className="m-0 font-semibold">5</p>
                            <h3 className="mt-5">Near Expiry Quantity:</h3>
                            <p className="m-0 font-semibold">3</p>
                        </div>
                    </div>

                    {/* Additional Cards */}
                    <div className="card w-80 h-56 rounded-md">
                        <h2 className="font-bold text-lg p-1">Stock Details</h2>
                        <div className="bg-blue-100 text-black border-2 border-blue-300 shadow-none h-40 rounded-md p-5">
                            <h3 className="m-0">Zero Stock Products:</h3>
                            <p className="m-0 font-semibold">5</p>
                            <h3 className="mt-5">Most Stock Products:</h3>
                            <p className="m-0 font-semibold">3</p>
                        </div>
                    </div>

                    <div className="card w-80 h-56 rounded-md">
                        <h2 className="font-bold text-lg p-1">Item Details</h2>
                        <div className="bg-emerald-50 text-black border-2 border-emerald-200 shadow-none h-40 rounded-md p-5">
                            <h3 className="m-0">Total Count of All Items:</h3>
                            <p className="m-0 font-semibold">5</p>
                            <h3 className="mt-5">Total Quantity of All Items:</h3>
                            <p className="m-0 font-semibold">3</p>
                        </div>
                    </div>

                    <div className="card w-80 h-56 rounded-md">
                        <h2 className="font-bold text-lg p-1">Out of Stock & Expiration</h2>
                        <div className="bg-yellow-100 text-black border-2 border-yellow-300 shadow-none h-40 rounded-md p-5">
                            <h3 className="m-0">Out of Stock Items:</h3>
                            <p className="m-0 font-semibold">5</p>
                            <h3 className="mt-5">Expired Items:</h3>
                            <p className="m-0 font-semibold">1</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-auto flex flex-wrap my-10  ml-10 gap-x-10 items-center">
                <h2 className="font-bold text-lg w-full">Item Count by Category</h2>
                <BarChart />
                <PieChart />
            </div>

            <div className="w-full flex flex-wrap my-10 gap-y-2">
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
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="w-full flex flex-wrap my-10 gap-y-2">
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
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
