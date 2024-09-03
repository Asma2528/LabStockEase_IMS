import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import { LuView } from 'react-icons/lu';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { toast } from 'sonner';
import { Button } from 'primereact/button';
// import UpdateModel from './UpdateModel.chemistry';
import { useDeleteChemistryItemMutation } from '../../../provider/queries/Chemistry.query';

const ChemistryCard = ({ data }) => {
    const [visible, setVisible] = useState(false);
    const [DeleteChemistryItem, DeleteChemistryItemResponse] = useDeleteChemistryItemMutation();

    const deleteHandler = async (_id) => {
        confirmDialog({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    const { data, error } = await DeleteChemistryItem(_id);
                    if (error) {
                        toast.error(error.data.message);
                        return;
                    }
                    // eslint-disable-next-line react/prop-types
                    toast.success(data.msg); // Using data.msg from mutation response, not a prop
                } catch (e) {
                    toast.error(e.message);
                }
            },
            reject: () => {
                console.log("reject for " + _id);
            }
        });
    };

    return (
        <>
            <tr className="bg-white border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">{data.item_name}</td>
                <td className="px-4 py-2">{data.company}</td>
                <td className="px-4 py-2">{new Date(data.date_added).toLocaleDateString()}</td>
                <td className="px-4 py-2">{data.BillNo}</td>
                <td className="px-4 py-2">{data.total_quantity}</td>
                <td className="px-4 py-2">{data.current_quantity}</td>
                <td className="px-4 py-2">
                    <div className="flex items-center">
                        <button onClick={() => setVisible(true)} title="View" className="p-3 bg-indigo-500 text-white rounded-sm mx-2">
                            <LuView className="text-xl" />
                        </button>
                        <button onClick={() => setVisible(true)} title="Edit" className="p-3 bg-yellow-300 text-white rounded-sm mx-2">
                            <FaRegEdit className="text-xl" />
                        </button>
                        <Button 
                            loading={DeleteChemistryItemResponse.isLoading}
                            onClick={() => deleteHandler(data._id)} 
                            title="Delete" 
                            className="p-3 bg-red-500 text-white rounded-sm mx-2">
                            <FaRegTrashAlt className="text-xl" />
                        </Button>
                    </div>
                </td>
            </tr>

        {/*}    <UpdateModel visible={visible} setVisible={setVisible} _id={data._id} />*/}
            <ConfirmDialog acceptClassName='p-button-danger' contentClassName='py-2' />
        </>
    );
};

// Define PropTypes
ChemistryCard.propTypes = {
    data: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        item_name: PropTypes.string.isRequired,
        company: PropTypes.string.isRequired,
        date_added: PropTypes.string.isRequired,
        purpose: PropTypes.string.isRequired,
        BillNo: PropTypes.string.isRequired,
        total_quantity: PropTypes.number.isRequired,
        issued_quantity: PropTypes.number.isRequired,
        current_quantity: PropTypes.number.isRequired,
        min_stock_level: PropTypes.number.isRequired,
        unit_of_measure: PropTypes.string.isRequired,
        last_updated_date: PropTypes.string.isRequired,
        expiration_date: PropTypes.string.isRequired,
        location: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        barcode: PropTypes.string.isRequired,
        low_stock_alert: PropTypes.bool.isRequired,
        expiration_alert_date: PropTypes.string
    }).isRequired,
};

export default ChemistryCard;
