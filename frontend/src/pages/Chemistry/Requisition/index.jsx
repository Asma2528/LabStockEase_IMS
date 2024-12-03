import { useState, useEffect } from 'react';
import BreadCrumbs from '../../../components/BreadCrumbs';
import Model from './model.requisition';
import { GoPlus } from "react-icons/go";
import { useGetUserRequisitionsQuery, useDeleteRequisitionMutation } from '../../../provider/queries/ChemistryRequisition.query';
import Loader from '../../../components/Loader';
import ChemistryRequisitionCard from './card.requisition';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { toast } from 'sonner';
import { Button } from 'primereact/button';

const ChemistryRequisitionPage = () => {
    const [visible, setVisible] = useState(false);
    const [searchParams, setSearchParams] = useState({ item_name: '', purpose: '', date_of_requirement: '', status: '' });
    const [dialogVisible, setDialogVisible] = useState(false);
    const [filteredData, setFilteredData] = useState([]);

    // Fetch requisitions based on searchParams
    const { isLoading, data, refetch } = useGetUserRequisitionsQuery(searchParams);

    const [deleteRequisition] = useDeleteRequisitionMutation();

    // Refetch data whenever searchParams change
    useEffect(() => {
        refetch();
    }, [refetch, searchParams]);

    // Update filteredData when API data changes
    useEffect(() => {
        if (data) {
            setFilteredData(data.requisitions || []);
        }
    }, [data]);

    // Handle form submission for search
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        refetch();
    };

    // Update searchParams state on input change
    const onSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchParams((prevParams) => ({
            ...prevParams,
            [name]: value,
        }));
    };

    // Handle deletion of a requisition
    const handleDelete = (id) => {
        setDialogVisible(true);
        confirmDialog({
            message: `Are you sure you want to delete this item?`,
            header: 'Confirm Deletion',
            icon: 'pi pi-exclamation-triangle',
            footer: (
                <div className="p-dialog-footer">
                    <Button
                        label="Yes, Delete it"
                        icon="pi pi-check"
                        className="p-button-danger"
                        onClick={async () => {
                            try {
                                const { data, error } = await deleteRequisition(id);
                                if (error) {
                                    toast.error(error.data.message);
                                    return;
                                }
                                toast.success(data.msg);
                                refetch(); // Refetch data after deletion to update the list
                            } catch (e) {
                                toast.error(e.message);
                            } finally {
                                setDialogVisible(false);
                            }
                        }}
                    />
                    <Button
                        label="No, Keep it"
                        icon="pi pi-times"
                        className="p-button-secondary"
                        onClick={() => setDialogVisible(false)}
                    />
                </div>
            ),
        });
    };

    return (
        <div className="w-full flex flex-wrap justify-evenly mt-10">
            <BreadCrumbs PageLink='/Requisition' PageName='Requisition' />

            <div className="mb-3 flex justify-end w-[85%] mx-auto gap-x-6">
                <button
                    onClick={() => setVisible(!visible)}
                    className="px-4 rounded-md py-2 bg-blue-900 text-white inline-flex items-center gap-x-2"
                >
                    New Request <GoPlus />
                </button>
            </div>

            {/* Search Bar */}
            <div className="mt-10 flex justify-center w-full mx-auto">
                <form onSubmit={handleSearchSubmit} className="flex flex-wrap justify-center gap-x-4 mb-4 w-full">
                    <input
                        name="item_name"
                        placeholder="Search by Item Name"
                        className="w-1/5 p-2 border rounded"
                        onChange={onSearchChange}
                        value={searchParams.item_name}
                    />
                    <input
                        name="purpose"
                        placeholder="Search by Purpose"
                        className="w-1/5 p-2 border rounded"
                        onChange={onSearchChange}
                        value={searchParams.purpose}
                    />
                    <input
                        name="date_of_requirement"
                        type="text"
                        placeholder="Date of Requirement"
                        className="w-1/5 p-2 border rounded"
                        onFocus={(e) => (e.target.type = "date")}
                        onBlur={(e) => (e.target.type = "text")}
                        onChange={onSearchChange}
                        value={searchParams.date_of_requirement}
                    />
                  <select
        name="status"
        className="w-1/5 p-2 border rounded text-slate-500 focus:text-black"
        onChange={onSearchChange}
        value={searchParams.status}
    >
        <option value="">Select Status</option>
        <option value="Pending" >Pending</option>
        <option value="Approved" >Approved</option>
        <option value="Rejected" >Rejected</option>
    </select>
               
                </form>
            </div>

            <div className="w-full pt-4">
                {isLoading ? (
                    <Loader />
                ) : (
                    <div className="relative overflow-x-auto shadow">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 border-b uppercase bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2">Item Name</th>
                                    <th className="px-4 py-2">Purpose</th>
                                    <th className="px-4 py-2">Quantity Required</th>
                                    <th className="px-4 py-2">Requested On</th>
                                    <th className="px-4 py-2">Date of Requirement</th>
                                    <th className="px-4 py-2">Status</th>
                                    <th className="px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.length > 0 ? (
                                    filteredData.map((requisition) => (
                                        <ChemistryRequisitionCard
                                            key={requisition._id}
                                            data={requisition}
                                            onDelete={() => handleDelete(requisition._id)}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center px-4 py-2">No requisitions found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Model visible={visible} setVisible={setVisible} />
            <ConfirmDialog visible={dialogVisible} onHide={() => setDialogVisible(false)} />
        </div>
    );
};

export default ChemistryRequisitionPage;
