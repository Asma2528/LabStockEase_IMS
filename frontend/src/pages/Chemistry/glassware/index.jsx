import { useState } from 'react';
import BreadCrumbs from '../../../components/BreadCrumbs';
import Model from './model.glassware';
import { GoPlus } from "react-icons/go";
import { useGetAllGlasswareItemsQuery } from '../../../provider/queries/Glassware.query';
import Loader from '../../../components/Loader';
import GlasswareCard from './Card.glassware';
import { useNavigate } from 'react-router-dom';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { toast } from 'sonner';
import { Button } from 'primereact/button';
import { useDeleteGlasswareItemMutation } from '../../../provider/queries/Glassware.query';

const GlasswarePage = () => {
    const [visible, setVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [dialogVisible, setDialogVisible] = useState(false);

    const navigate = useNavigate();
    const [Search, setSearch] = useState('');

    // Fetch all items without pagination
    const { isLoading, data, isFetching } = useGetAllGlasswareItemsQuery({
        query: Search
    });


    const onSubmitHandler = (e) => {
        e.preventDefault();
        navigate(`/Glassware?query=${Search}`);
    };

    const [DeleteGlasswareItem] = useDeleteGlasswareItemMutation();

    const deleteHandler = (_id) => {
    setDialogVisible(true);
    confirmDialog({
        message: `Are you sure you want to delete the item "${data.item_name}"?`,
        header: 'Confirm Deletion',
        icon: 'pi pi-exclamation-triangle',
        defaultFocus: 'reject',
        breakpoints: { '960px': '75vw', '640px': '90vw' },
        footer: (
            <div className="p-dialog-footer">
                <Button 
                    label="Yes, Delete it" 
                    icon="pi pi-check" 
                    className="p-button-danger rounded-md bg-red-500 text-white inline-flex items-center p-2 justify-center pr-4" 
                    onClick={async () => {
                        try {
                            const { data, error } = await DeleteGlasswareItem(_id);
                            if (error) {
                                toast.error(error.data.message);
                                return;
                            }
                            toast.success(data.msg);
                        } catch (e) {
                            toast.error(e.message);
                        } finally {
                            setDialogVisible(false); // Close the dialog
                        }
                    }} 
                />
                <Button 
                    label="No, Keep it" 
                    icon="pi pi-times" 
                    className="p-button-secondary p-2 rounded-md bg-blue-900 text-white inline-flex items-center ml-2 pr-4" 
                    onClick={() => { 
                        toast.info("Deletion canceled for " + _id);
                        setDialogVisible(false); // Close the dialog
                    }}
                />
            </div>
        ),
    });
};


    return (
        <>
        <div className="w-full flex flex-wrap justify-evenly mt-10">
            <BreadCrumbs PageLink='/Glassware' PageName='Glassware' />

            <div className="mb-3 flex justify-end w-[85%] mx-auto">
                <button
                    onClick={() => setVisible(!visible)}
                    className="px-4 rounded-md py-2 bg-blue-900 text-white inline-flex items-center gap-x-2"
                >
                    Add Item < GoPlus />
                </button>
            </div>

            <form onSubmit={onSubmitHandler} className="mb-3 flex justify-end w-[90%] mx-auto">
                <input
                    value={Search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-[90%] mx-auto lg:mx-0 lg:w-1/2 rounded-sm border py-3 px-5 outline-none"
                    placeholder="Search Item"
                />
            </form>

            <div className="w-full pt-10">
                {isLoading || isFetching ? (
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                        <tbody>
                            <Loader />
                        </tbody>
                    </table>
                ) : (
                    <div className="relative overflow-x-auto shadow">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                            <thead className="text-xs text-gray-700 border-b uppercase bg-gray-50">
                                <tr className="border-b">
                                    <th scope="col" className="px-4 py-2">Item Name</th>
                                    <th scope="col" className="px-4 py-2">Company/Brand</th>
                                    <th scope="col" className="px-4 py-2">Date Created</th>
                                    <th scope="col" className="px-4 py-2">Bill No</th>
                                    <th scope="col" className="px-4 py-2">Total Quantity</th>
                                    <th scope="col" className="px-4 py-2">Current Quantity</th>
                                    <th scope="col" className="px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.items.length > 0 ? (
                                    data.items.map((c) => (
                                        <GlasswareCard
                                            key={c._id}
                                            data={c}
                                            onDelete={() => {
                                                setSelectedItem(c._id);
                                                deleteHandler(c._id);
                                            }}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center px-4 py-2">No items found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
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

export default GlasswarePage;
