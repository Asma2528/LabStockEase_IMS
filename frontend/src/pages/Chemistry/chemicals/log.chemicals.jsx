import { useState } from 'react';
import BreadCrumbs from '../../../components/BreadCrumbs';
import Model from './log.model.chemicals';
import ChemicalsLogCard from './log.card.chemicals';
import { useSearchChemicalsLogsQuery } from "../../../provider/queries/Chemicals.query";
import { useDeleteChemicalsLogMutation } from '../../../provider/queries/Chemicals.query';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { toast } from 'sonner';
import { Button } from 'primereact/button';

const ChemicalsLogsPage = () => {
    const [visible, setVisible] = useState(false);
    const [searchParams, setSearchParams] = useState({
        item_id: '',
        user_email: '',
        date_start: '',
        date_end: ''
    });


    const [selectedItem, setSelectedItem] = useState(null);
    const [dialogVisible, setDialogVisible] = useState(false);

    const { data: logs, isLoading, isFetching } = useSearchChemicalsLogsQuery(searchParams);
    const [deleteChemicalsLog] = useDeleteChemicalsLogMutation();

    const deleteHandler = (_id) => {
        setDialogVisible(true);
        confirmDialog({
            message: "Are you sure you want to delete the log?",
            header: 'Confirm Deletion',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'reject',
            footer: (
                <div className="p-dialog-footer">
                    <Button 
                        label="Yes, Delete it" 
                        icon="pi pi-check" 
                        className="p-button-danger rounded-md bg-red-500 text-white inline-flex items-center p-2 justify-center pr-4" 
                        onClick={async () => {
                            try {
                                const { data, error } = await deleteChemicalsLog(_id);
                                if (error) {
                                    toast.error(error.data.message);
                                    return;
                                }
                                toast.success(data.msg);
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
                        className="p-button-secondary p-2 rounded-md bg-blue-900 text-white inline-flex items-center ml-2 pr-4" 
                        onClick={() => { 
                            toast.info("Deletion canceled for " + _id);
                            setDialogVisible(false);
                        }}
                    />
                </div>
            ),
        });
    };
    
    

    return (
        <>
            <div className="w-full flex flex-wrap justify-evenly mt-10">
                <BreadCrumbs PageLink='/Chemicals' PageName='Chemical Log' />

                <div className="mb-3 flex justify-end w-[85%] mx-auto gap-x-6">
                    <button
                        onClick={() => setVisible(!visible)}
                        className="px-4 rounded-md py-2 bg-blue-900 text-white inline-flex items-center gap-x-2"
                    >
                        Issue Item
                    </button>
                </div>

                <div className="w-full pt-10">
                    <div className="relative overflow-x-auto shadow">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                            <thead className="text-xs text-gray-700 border-b uppercase bg-gray-50">
                                <tr className="border-b">
                                    <th scope="col" className="px-4 py-2">Item Code</th>
                                    <th scope="col" className="px-4 py-2">Item Name</th>
                                    <th scope="col" className="px-4 py-2">Issued Quantity</th>
                                    <th scope="col" className="px-4 py-2">Date Issued</th>
                                    <th scope="col" className="px-4 py-2">User</th>
                                    <th scope="col" className="px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
    {isLoading || isFetching ? (
        <tr>
            <td colSpan="6" className="text-center px-4 py-2">
               Loading..
            </td>
        </tr>
    ) : logs?.length > 0 ? (
        logs.map(log => (
            <ChemicalsLogCard key={log._id} data={log} onDelete={() => {
                setSelectedItem(log._id);
                deleteHandler(log._id);
            }}/>
        ))
    ) : (
        <tr>
            <td colSpan="6" className="text-center px-4 py-2">No log items found</td>
        </tr>
    )}
</tbody>

                        </table>
                    </div>
                </div>

                <Model visible={visible} setVisible={setVisible} />
                <ConfirmDialog 
                    visible={dialogVisible} 
                    onHide={() => setDialogVisible(false)} 
                    acceptClassName='p-button-danger p-dialog-footer' 
                    contentClassName='py-4' 
                />
            </div>
        </>
    );
};

export default ChemicalsLogsPage;