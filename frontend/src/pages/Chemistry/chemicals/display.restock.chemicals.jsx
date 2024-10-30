import { Dialog } from 'primereact/dialog';
import PropTypes from 'prop-types';

const ViewRestockItem = ({ visible, setVisible, item }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return "Invalid Date";
        }
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <Dialog
            header="View Restock Item"
            position="top"
            visible={visible}
            className="w-full md:w-[70%] lg:w-1/2"
            onHide={() => setVisible(false)}
            draggable={false}
        >
            <div className="w-full">
                <div className="mb-3">
                    <label htmlFor="chemical">Chemical</label>
                    <input id="chemical" type="text" className="w-full px-5 py-2 rounded-md outline-none border-1 border" value={`${item.chemical.item_code} : ${item.chemical.item_name}`} disabled />
                </div>
    

                <div className="mb-3">
                    <label htmlFor="quantity_purchased">Quantity Purchased</label>
                    <input id="quantity_purchased" type="number" className="w-full px-5 py-2 rounded-md outline-none border-1 border" value={item.quantity_purchased} disabled />
                </div>

                <div className="mb-3">
                    <label htmlFor="purchase_date">Purchase Date</label>
                    <input id="purchase_date" type="text" className="w-full px-5 py-2 rounded-md outline-none border-1 border" value={formatDate(item.purchase_date)} disabled />
                </div>

                <div className="mb-3">
                    <label htmlFor="supplier">Supplier</label>
                    <input id="supplier" type="text" className="w-full px-5 py-2 rounded-md outline-none border-1 border" value={item.supplier || 'N/A'} disabled />
                </div>

                <div className="mb-3">
                    <label htmlFor="bill_number">Bill Number</label>
                    <input id="bill_number" type="text" className="w-full px-5 py-2 rounded-md outline-none border-1 border" value={item.bill_number || 'N/A'} disabled />
                </div>

                <div className="mb-3">
                    <label htmlFor="cost_per_purchase">Cost Per Purchase</label>
                    <input id="cost_per_purchase" type="number" className="w-full px-5 py-2 rounded-md outline-none border-1 border" value={item.cost_per_purchase || 'N/A'} disabled />
                </div>

                <div className="mb-3">
                    <label htmlFor="location">Location</label>
                    <input id="location" type="text" className="w-full px-5 py-2 rounded-md outline-none border-1 border" value={item.location || 'N/A'} disabled />
                </div>

                <div className="mb-3">
                    <label htmlFor="barcode">Barcode</label>
                    <input id="barcode" type="text" className="w-full px-5 py-2 rounded-md outline-none border-1 border" value={item.barcode || 'N/A'} disabled />
                </div>
            </div>
        </Dialog>
    );
};

// PropTypes validation
ViewRestockItem.propTypes = {
    visible: PropTypes.bool.isRequired,
    setVisible: PropTypes.func.isRequired,
    item: PropTypes.shape({
        chemical: PropTypes.shape({
            item_code: PropTypes.string.isRequired,
            item_name: PropTypes.string.isRequired,
        }).isRequired,
        quantity_purchased: PropTypes.number.isRequired,
        purchase_date: PropTypes.string.isRequired,
        supplier: PropTypes.string,
        bill_number: PropTypes.string,
        cost_per_purchase: PropTypes.number,
        location: PropTypes.string,
        barcode: PropTypes.string,
    }).isRequired,
};


export default ViewRestockItem;
