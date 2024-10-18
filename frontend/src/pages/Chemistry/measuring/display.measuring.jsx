import { Dialog } from 'primereact/dialog';
import PropTypes from 'prop-types';

const ViewItem = ({ visible, setVisible, item }) => {
    // Function to format date
    const formatDate = (dateString) => {
 
        const date = new Date(dateString);

    
        if (isNaN(date.getTime())) {
            console.error("Invalid date:", dateString); // Log if date parsing fails
            return "Invalid Date";
        }
    
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long', // 'short' for abbreviated month
            day: 'numeric'
        });
    };
    

    return (
        <Dialog
            header="View Item"
            position="top"
            visible={visible}
            className="w-full md:w-[70%] lg:w-1/2"
            onHide={() => setVisible(false)}
            draggable={false}
        >
          <div className="w-full">
                    {/* Item Code */}
                    <div className="mb-3">
                    <label htmlFor="item_code">Item Code </label>
                    <input
                        id="item_code"
                        type="text"
                        className="w-full px-5 py-2 rounded-md outline-none border-1 border"
                        value={item.item_code}
                        disabled
                    />
                </div>

                {/* Item Name */}
                <div className="mb-3">
                    <label htmlFor="item_name">Item Name</label>
                    <input
                        id="item_name"
                        type="text"
                        className="w-full px-5 py-2 rounded-md outline-none border-1 border"
                        value={item.item_name}
                        disabled
                    />
                </div>

                {/* Company */}
                <div className="mb-3">
                    <label htmlFor="company">Company/Brand</label>
                    <input
                        id="company"
                        type="text"
                        className="w-full px-5 py-2 rounded-md outline-none border-1 border"
                        value={item.company}
                        disabled
                    />
                </div>

                {/* Date Added */}
                <div className="mb-3">
                    <label htmlFor="date_added">Date Created</label>
                    <input
                        id="date_added"
                        className="w-full px-5 py-2 rounded-md outline-none border-1 border"
                        value={formatDate(item.createdAt)}
                        disabled
                    />
                </div>

                {/* Purpose */}
                <div className="mb-3">
                    <label htmlFor="purpose">Purpose</label>
                    <input
                        id="purpose"
                        type="text"
                        className="w-full px-5 py-2 rounded-md outline-none border-1 border"
                        value={item.purpose}
                        disabled
                    />
                </div>

                {/* Bill Number */}
                <div className="mb-3">
                    <label htmlFor="BillNo">Bill Number</label>
                    <input
                        id="BillNo"
                        type="text"
                        className="w-full px-5 py-2 rounded-md outline-none border-1 border"
                        value={item.BillNo}
                        disabled
                    />
                </div>

                {/* Total Quantity */}
                <div className="mb-3">
                    <label htmlFor="total_quantity">Total Quantity</label>
                    <input
                        id="total_quantity"
                        type="number"
                        className="w-full px-5 py-2 rounded-md outline-none border-1 border"
                        value={item.total_quantity}
                        disabled
                    />
                </div>


                {/* Current Quantity */}
                <div className="mb-3">
                    <label htmlFor="current_quantity">Current Quantity</label>
                    <input
                        id="current_quantity"
                        type="number"
                        className="w-full px-5 py-2 rounded-md outline-none border-1 border"
                        value={item.current_quantity}
                        disabled
                    />
                </div>

                {/* Minimum Stock Level */}
                <div className="mb-3">
                    <label htmlFor="min_stock_level">Minimum Stock Level</label>
                    <input
                        id="min_stock_level"
                        type="number"
                        className="w-full px-5 py-2 rounded-md outline-none border-1 border"
                        value={item.min_stock_level}
                        disabled
                    />
                </div>

                {/* Unit of Measure */}
                <div className="mb-3">
                    <label htmlFor="unit_of_measure">Unit of Measure</label>
                    <input
                        id="unit_of_measure"
                        type="text"
                        className="w-full px-5 py-2 rounded-md outline-none border-1 border"
                        value={item.unit_of_measure}
                        disabled
                    />
                </div>

                {/* Last Updated Date */}
                <div className="mb-3">
                    <label htmlFor="last_updated_date">Last Updated Date</label>
                    <input
                        id="last_updated_date"
                        className="w-full px-5 py-2 rounded-md outline-none border-1 border"
                        value={formatDate(item.updatedAt)}
                        disabled
                    />
                </div>


                {/* Location */}
                <div className="mb-3">
                    <label htmlFor="location">Location</label>
                    <input
                        id="location"
                        type="text"
                        className="w-full px-5 py-2 rounded-md outline-none border-1 border"
                        value={item.location}
                        disabled
                    />
                </div>

                {/* Status */}
                <div className="mb-3">
                    <label htmlFor="status">Status</label>
                    <input
                        id="status"
                        type="text"
                        className="w-full px-5 py-2 rounded-md outline-none border-1 border"
                        value={item.status}
                        disabled
                    />
                </div>

                {/* Description */}
                <div className="mb-3">
                    <label htmlFor="description">Description</label>
                    <input
                        id="description"
                        type="text"
                        className="w-full px-5 py-2 rounded-md outline-none border-1 border"
                        value={item.description}
                        disabled
                    />
                </div>

                {/* Barcode */}
                <div className="mb-3">
                    <label htmlFor="barcode">Barcode</label>
                    <input
                        id="barcode"
                        type="text"
                        className="w-full px-5 py-2 rounded-md outline-none border-1 border"
                        value={item.barcode}
                        disabled
                    />
                </div>

                {/* Low Stock Alert */}
                <div className="mb-3">
                    <label className="pr-3" htmlFor="low_stock_alert">Low Stock Alert</label>
                    <input
                        id="low_stock_alert"
                        type="checkbox"
                        className="w-4 h-4 rounded-md outline-none border-1 border mr-2"
                        checked={item.low_stock_alert}
                        disabled
                    />
                </div>

            </div>
        </Dialog>
    );
};

// PropTypes validation
ViewItem.propTypes = {
    visible: PropTypes.bool.isRequired,
    setVisible: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
};

export default ViewItem;
