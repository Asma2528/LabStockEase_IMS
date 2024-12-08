import { useState, useEffect, useMemo } from 'react';
import BreadCrumbs from '../../../components/BreadCrumbs';
import { useGetAllRequisitionsQuery, useApproveRequisitionMutation } from '../../../provider/queries/ChemistryRequisition.query';
import Loader from '../../../components/Loader';
import { toast } from 'sonner';
import {  ConfirmDialog } from 'primereact/confirmdialog';
import { Button } from 'primereact/button';
import React from 'react';
import { FaRegEdit} from 'react-icons/fa';
import { LuView } from 'react-icons/lu';


const ChemistryAdminRequisitionPage = () => {
    const [searchParams, setSearchParams] = useState({
        item_name: '',
        purpose: '',
        date_of_requirement: '',
        createdAt: '',
        faculty_email: '',
        status: ''
    });

    const { isLoading, data, refetch } = useGetAllRequisitionsQuery(searchParams);
    const [approveRequisition] = useApproveRequisitionMutation();
    const [statusValue, setStatusValue] = useState('');
    const [expandedRow, setExpandedRow] = useState(null);
    const [remark, setRemarks] = useState('');
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [selectedRequisitionId, setSelectedRequisitionId] = useState(null); // New state for selected requisition ID

    const requisitions = useMemo(() => data?.requisitions || [], [data]);

    const handleStatusChange = (id, newStatus) => {
        setStatusValue(newStatus);  // Set the new status
        setSelectedRequisitionId(id);  // Store the requisition ID to update
        setRemarks('');  // Clear remark when status is being changed
        setIsDialogVisible(true);  // Show the dialog
    };

    const handleDialogConfirm = async () => {


        try {
            const response = await approveRequisition({
                id: selectedRequisitionId,
                updateData: { status: statusValue, remark }
            });

            if (response.error) {
                toast.error('Failed to update status');
            } else {
                toast.success('Status updated successfully');
                refetch();  // Refetch requisitions after update
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setIsDialogVisible(false);  // Close the dialog after the action
            setSelectedRequisitionId(null); // Clear the selected requisition ID
        }
    };

    const toggleExpandRow = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

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


    return (
        <div className="w-full flex flex-wrap justify-evenly mt-10">
            <BreadCrumbs PageLink='/AdminRequisitions' PageName='Admin Requisitions' />
            
        {/* Search Fields */}
<div className="mt-10 flex justify-center w-full mx-auto">
    <form className="flex flex-wrap justify-center gap-x-2 gap-y-2 mb-4 w-full">
        <input
            name="item_name"
            placeholder="Item Name"
            className="w-1/6 p-1 border rounded"
            onChange={handleSearchChange}
            value={searchParams.item_name || ''}
        />
        <input
            name="purpose"
            placeholder="Purpose"
            className="w-1/6 p-1 border rounded"
            onChange={handleSearchChange}
            value={searchParams.purpose}
        />
        <input
            name="date_of_requirement"
            type="text"
            placeholder="Date of Requirement"
            className="w-1/6 p-1 border rounded"
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => (e.target.type = "text")}
            onChange={handleSearchChange}
            value={searchParams.date_of_requirement || ''}
        />
        <input
           name="createdAt"
            type="text"
            placeholder="Requested On"
            className="w-1/6 p-1 border rounded"
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => (e.target.type = "text")}
            onChange={handleSearchChange}
             value={searchParams.createdAt || ''} 
        />
        <input
            name="faculty_email"
            placeholder="Faculty Email"
            className="w-1/6 p-1 border rounded"
            onChange={handleSearchChange}
            value={searchParams.faculty_email || ''}
        />
        <select
            name="status"
            className="w-1/7 p-2 border rounded"
            onChange={handleSearchChange}
            value={searchParams.status || ''}
        >
            <option value="">Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Issued">Issued</option>
        </select>
    </form>
</div>


            <div className="w-full pt-4">
                {isLoading ? (
                    <Loader />
                ) : (
                    <div className="relative overflow-x-auto max-w-full shadow">
                        <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 border-b uppercase bg-gray-50">
    <tr>
        <th className="px-4 py-2">Item Name</th>
        <th className="px-4 py-2">Quantity Required</th>
        <th className="px-4 py-2">Requested On</th>
        <th className="px-4 py-2">Date of Requirement</th>
        <th className="px-4 py-2">Faculty Email</th>   
        <th className="px-4 py-2">Issued By</th>
        <th className="px-4 py-2">Status</th>
        <th className="px-4 py-2 text-center">Actions</th>
    </tr>
</thead>

                            <tbody>
    {requisitions.length > 0 ? (
        requisitions.map((requisition) => (
            <React.Fragment key={requisition._id}>
                <tr className="border-b text-gray-900 hover:bg-gray-100">
                    <td className="px-4 py-2">{requisition.item_name}</td>
                    <td className="px-4 py-2">{requisition.quantity_required}</td>
                    <td className="px-4 py-2">{new Date(requisition.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{new Date(requisition.date_of_requirement).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{requisition.faculty_email}</td>
                    <td className="px-4 py-2">{requisition.issued_by || 'N/A'}</td>
                    <td className="px-4 py-2">
                    {requisition.status}
                      
                    </td>
                    {/* Button to toggle row expansion */}
                    <td className="px-4 py-2 text-center">
                    <div className="flex items-center">
    {/* View Button */}
    <Button
        onClick={() => toggleExpandRow(requisition._id)}
        title="View"
        className="p-3 bg-indigo-500 text-white rounded-sm mx-2"
    >
        <LuView className="text-xl" />
    </Button>

    {/* Edit Button */}
<Button
    onClick={() => handleStatusChange(requisition._id)}
    title="Edit"
    className={`p-3 ${
        ["Approved", "Rejected", "Issued"].includes(requisition.status)
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-lime-400"
    } text-white rounded-sm mx-2`}
    disabled={["Approved", "Rejected", "Issued"].includes(requisition.status)} // Disable for specific statuses
>
    <FaRegEdit className="text-xl" />
</Button>

    </div>
</td>

                </tr>

                {/* Expanded Row */}
                {expandedRow === requisition._id && (
                    <tr>
                      
    <td colSpan="10" className="p-4 bg-gray-100">
        <div className="space-y-2 text-gray-600"> {/* Added text-red-600 class for red text */}
            <p><strong>Item Name:</strong> {requisition.item_name}</p>
            <p><strong>Quantity Required:</strong> {requisition.quantity_required}</p>
            <p><strong>Purpose:</strong> {requisition.purpose}</p>
            <p><strong>Requested on:</strong> {new Date(requisition.createdAt).toLocaleDateString()}</p>
            <p><strong>Date of Requirement:</strong> {new Date(requisition.date_of_requirement).toLocaleDateString()}</p>
            <p><strong>Requested By:</strong> {requisition.faculty_email}</p>
            <p><strong>Approved By:</strong> {requisition.approved_by || 'N/A'}</p>
            <p><strong>Issued By:</strong> {requisition.issued_by || 'N/A'}</p>
            <p><strong>Remarks:</strong> {requisition.remark || 'N/A'}</p>
            <p><strong>Status:</strong> {requisition.status}</p>
          
        </div>
    </td>
</tr>

                  
                )}
            </React.Fragment>
        ))
    ) : (
        <tr>
            <td colSpan="10" className="text-center px-4 py-2">No requisitions found</td>
        </tr>
    )}
</tbody>


                        </table>
                    </div>
                )}
            </div>
            <ConfirmDialog
    visible={isDialogVisible}
    onHide={() => setIsDialogVisible(false)}
    message={
        <>
            <p>Are you sure you want to change the status to <strong>{statusValue}</strong>?</p>
            <div className="mt-4">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Select New Status
                </label>
                <select
                    id="status"
                    value={statusValue} // Use the state directly
                    onChange={(e) => setStatusValue(e.target.value)} // Update statusValue
                    className="mt-1 p-2 border rounded w-full"
                >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Issued">Issued</option>
                </select>

                <label htmlFor="remark" className="block text-sm font-medium text-gray-700 mt-4">
                    Remarks (if any)
                </label>
                <input
                    id="remark"
                    type="text"
                    className="mt-1 p-2 border rounded w-full"
                    placeholder="Enter remark here"
                    onChange={(e) => setRemarks(e.target.value)}
                    value={remark}
                />
            </div>
        </>
    }
    header="Confirm Status Change"
    icon="pi pi-exclamation-triangle"
    breakpoints={{ '960px': '75vw', '640px': '90vw' }}
    footer={
        <div className="p-dialog-footer flex justify-end gap-2">
            <Button
                label="No"
                icon="pi pi-times"
                className="p-button-secondary py-2 px-4 rounded-md bg-red-500 text-white inline-flex items-center"
                onClick={() => setIsDialogVisible(false)}
            />
            <Button
                label="Yes"
                icon="pi pi-check"
                className="p-button-danger py-2 px-4 rounded-md bg-green-600 text-white inline-flex items-center"
                onClick={handleDialogConfirm}
            />
        </div>
    }
/>

</div>
    );
};

export default ChemistryAdminRequisitionPage;
