import { useState, useEffect, useMemo } from 'react';
import BreadCrumbs from '../../../components/BreadCrumbs';
import { useGetApprovedAndIssuedRequisitionsQuery, useChangeStatusToIssuedMutation } from '../../../provider/queries/ChemistryRequisition.query';
import Loader from '../../../components/Loader';
import { toast } from 'sonner';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { Button } from 'primereact/button';

const ChemistryApprovedRequisitionPage = () => {
    const [searchParams, setSearchParams] = useState({
        item_name: '',
        purpose: '',
        date_of_requirement: '',
        createdAt: '',
        faculty_email: '',
        status:''
    });

    const { isLoading, data, refetch } = useGetApprovedAndIssuedRequisitionsQuery(searchParams);
    const [changeStatus] = useChangeStatusToIssuedMutation();
    const [editingRequisitionId, setEditingRequisitionId] = useState(null);
    const [statusValue, setStatusValue] = useState('');

    const requisitions = useMemo(() => data?.requisitions || [], [data]);

    useEffect(() => {
        if (editingRequisitionId) {
            const requisition = requisitions.find(req => req._id === editingRequisitionId);
            setStatusValue(requisition ? requisition.status : '');
        }
    }, [editingRequisitionId, requisitions]);

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchParams((prevParams) => ({
            ...prevParams,
            [name]: value,
        }));
    };

    useEffect(() => {
        refetch();
    }, [refetch, searchParams]);

    const handleStatusChange = (id, newStatus) => {
        confirmDialog({
            message: `Are you sure you want to change the status to "${newStatus}"?`,
            header: 'Confirm Status Change',
            icon: 'pi pi-exclamation-triangle',
            footer: (
                <div className="p-dialog-footer flex justify-end gap-2">
                    <Button
                        label="No"
                        icon="pi pi-times"
                        className="p-button-secondary p-2 rounded-md bg-red-500 text-white"
                        onClick={() => {
                            toast.info('Status change canceled');
                            setEditingRequisitionId(null);
                        }}
                    />
                    <Button
                        label="Yes"
                        icon="pi pi-check"
                        className="p-button-success p-2 rounded-md bg-green-600 text-white"
                        onClick={async () => {
                            try {
                                const response = await changeStatus({ id, status: newStatus });
                                if (response.error) {
                                    toast.error('Failed to update status');
                                } else {
                                    toast.success('Status updated to "Issued" successfully');
                                    refetch();
                                }
                            } catch (error) {
                                toast.error('An unexpected error occurred');
                            }
                        }}
                    />
                </div>
            ),
        });
    };

    return (
        <div className="w-full flex flex-wrap justify-evenly mt-10">
            <BreadCrumbs PageLink='/ApprovedRequisitions' PageName='Approved Requisitions' />

            {/* Search Fields */}
            <div className="mt-10 flex justify-center w-full mx-auto">
                <form className="flex flex-wrap justify-center gap-x-2 gap-y-2 mb-4 w-full">
                    {/* Search inputs */}
                    <input name="item_name" placeholder="Item Name" className="w-1/6 p-1 border rounded" onChange={handleSearchChange} value={searchParams.item_name || ''} />
                    <input name="purpose" placeholder="Purpose" className="w-1/6 p-1 border rounded" onChange={handleSearchChange} value={searchParams.purpose || ''} />
                    <input name="date_of_requirement" type="text" placeholder="Date of Requirement" className="w-1/6 p-1 border rounded" onFocus={(e) => (e.target.type = "date")} onBlur={(e) => (e.target.type = "text")} onChange={handleSearchChange} value={searchParams.date_of_requirement || ''} />
                    <input name="createdAt" type="text" placeholder="Requested On" className="w-1/6 p-1 border rounded" onFocus={(e) => (e.target.type = "date")} onBlur={(e) => (e.target.type = "text")} onChange={handleSearchChange} value={searchParams.createdAt || ''} />
                    <input name="faculty_email" placeholder="Faculty Email" className="w-1/6 p-1 border rounded" onChange={handleSearchChange} value={searchParams.faculty_email || ''} />
                    <select name="status" className="w-1/7 p-2 border rounded text-slate-400 focus:text-black" onChange={handleSearchChange} placeholder="Select Status " value={searchParams.status || ''}>
                        <option value="">Select Status</option>
                        <option value="Approved">Approved</option>
                        <option value="Issued">Issued</option>
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
                                    <th className="px-4 py-2">Date of Requirement</th>
                                    <th className="px-4 py-2">Faculty Email</th>
                                    <th className="px-4 py-2">Requested On</th>
                                    <th className="px-4 py-2">Approved By</th>
                                    <th className="px-4 py-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requisitions.length > 0 ? (
                                    requisitions.map((requisition) => (
                                        <tr key={requisition._id} className="border-b text-gray-900 hover:bg-gray-100">
                                            <td className="px-4 py-2">{requisition.item_name}</td>
                                            <td className="px-4 py-2">{requisition.purpose}</td>
                                            <td className="px-4 py-2">{requisition.quantity_required}</td>
                                            <td className="px-4 py-2">{new Date(requisition.date_of_requirement).toLocaleDateString()}</td>
                                            <td className="px-4 py-2">{requisition.faculty_email}</td>
                                            <td className="px-4 py-2">{new Date(requisition.createdAt).toLocaleDateString()}</td>
                                            <td className="px-4 py-2">{requisition.approved_by}</td>
                                            <td className="px-4 py-2">
                                                <select value={requisition._id === editingRequisitionId ? statusValue : requisition.status} onChange={(e) => {
                                                    if (requisition.status === 'Issued') {
                                                        toast.error('Cannot modify the status once issued');
                                                    } else {
                                                        setEditingRequisitionId(requisition._id);
                                                        handleStatusChange(requisition._id, e.target.value);
                                                    }
                                                }} className="p-2 border rounded" disabled={requisition.status === 'Issued'}>
                                                    <option value="Approved">Approved</option>
                                                    <option value="Issued">Issued</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center px-4 py-2">No requisitions found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <ConfirmDialog />
        </div>
    );
};

export default ChemistryApprovedRequisitionPage;
