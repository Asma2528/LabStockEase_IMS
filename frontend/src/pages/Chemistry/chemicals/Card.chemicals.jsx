import PropTypes from 'prop-types';
import { useState } from 'react';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import { LuView } from 'react-icons/lu';
import { Button } from 'primereact/button';
import ViewItem from './display.chemicals'; // Import the ViewItem component
import UpdateItem from './UpdateModel.chemicals';

const ChemicalsCard = ({ data, onDelete }) => {
    const [visible, setVisible] = useState(false); // State for controlling the dialog visibility


    
    const [updateVisible, updateSetVisible] = useState(false); 

    const handleViewClick = () => {
        setVisible(true); // Show the dialog when the view button is clicked
    };

    const handleUpdateClick = () => {
        updateSetVisible(true); // Show the dialog when the view button is clicked
    };

    return (
        <>
            <tr className="bg-white border-b hover:bg-gray-50 text-gray-900 whitespace-nowrap">
            <td className="px-4 py-2 font-medium ">{data.item_code}</td>
                <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">{data.item_name}</td>
                <td className="px-4 py-2">{data.company}</td>
                <td className="px-4 py-2">{data.total_quantity}</td>
                <td className="px-4 py-2">{data.current_quantity}</td>
                <td className="px-4 py-2">{data.status}</td>
                <td className="px-4 py-2">
                    <div className="flex items-center">
                        <Button 
                            onClick={handleViewClick} // Attach the click handler
                            title="View" 
                            className="p-3 bg-indigo-500 text-white rounded-sm mx-2"
                        >
                            <LuView className="text-xl" />
                        </Button>
                        <Button onClick={handleUpdateClick}  title="Edit" className="p-3 bg-lime-400 text-white rounded-sm mx-2">
                            <FaRegEdit className="text-xl" />
                        </Button>
                        <Button 
                            onClick={onDelete} 
                            title="Delete" 
                            className="p-3 bg-red-500 text-white rounded-sm mx-2"
                        >
                            <FaRegTrashAlt className="text-xl" />
                        </Button>
                    </div>
                </td>
            </tr>

            {/* View Item Dialog */}
            <ViewItem 
                visible={visible} 
                setVisible={setVisible} 
                item={data} 
            />

            <UpdateItem 
                visible={updateVisible} 
                setVisible={updateSetVisible} 
                item={data} 
            />

        </>
    );
};

// Define PropTypes
ChemicalsCard.propTypes = {
    data: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        item_code: PropTypes.string,
        item_name: PropTypes.string.isRequired,
        company: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        purpose: PropTypes.string.isRequired,
        BillNo: PropTypes.string.isRequired,
        total_quantity: PropTypes.number.isRequired,
        current_quantity: PropTypes.number.isRequired,
        min_stock_level: PropTypes.number.isRequired,
        unit_of_measure: PropTypes.string.isRequired,
        updatedAt: PropTypes.string.isRequired,
        expiration_date: PropTypes.string,
        location: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        barcode: PropTypes.string.isRequired,
        low_stock_alert: PropTypes.bool.isRequired,
        expiration_alert_date: PropTypes.string
    }).isRequired,
    onDelete: PropTypes.func.isRequired
};

export default ChemicalsCard;
