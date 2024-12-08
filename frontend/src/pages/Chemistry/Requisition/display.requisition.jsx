import { Dialog } from 'primereact/dialog';
import PropTypes from 'prop-types';

const ViewItem = ({ visible, setVisible, requisition }) => {

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <Dialog
            header="View Requisition"
            position="top"
            visible={visible}
            className="w-full md:w-[70%] lg:w-1/2"
            onHide={() => setVisible(false)}
            draggable={false}
        >
            <div className="w-full">
                <div className="mb-3">
                    <label htmlFor="item_name">Item Name</label>
                    <input id="item_name" type="text" className="w-full px-5 py-2 rounded-md outline-none border-1 border" value={requisition.item_name} disabled />
                </div>

                <div className="mb-3">
                    <label htmlFor="quantity_required">Quantity Required</label>
                    <input id="quantity_required" type="number" className="w-full px-5 py-2 rounded-md outline-none border-1 border" value={requisition.quantity_required} disabled />
                </div>

                <div className="mb-3">
                    <label htmlFor="purpose">Purpose</label>
                    <input id="purpose" type="text" className="w-full px-5 py-2 rounded-md outline-none border-1 border" value={requisition.purpose} disabled />
                </div>

                <div className="mb-3">
                    <label htmlFor="date_of_requirement">Date of Requirement</label>
                    <input id="date_of_requirement" type="text" className="w-full px-5 py-2 rounded-md outline-none border-1 border" value={formatDate(requisition.date_of_requirement)} disabled />
                </div>

                <div className="mb-3">
                    <label htmlFor="status">Status</label>
                    <input id="status" type="text" className="w-full px-5 py-2 rounded-md outline-none border-1 border" value={requisition.status} disabled />
                </div>


                <div className="mb-3">
                    <label htmlFor="status">Remarks</label>
                    <input id="status" type="text" className="w-full px-5 py-2 rounded-md outline-none border-1 border" value={requisition.remarks} disabled />
                </div>

                <div className="mb-3">
                    <label htmlFor="createdAt">Created At</label>
                    <input id="createdAt" type="text" className="w-full px-5 py-2 rounded-md outline-none border-1 border" value={formatDate(requisition.createdAt)} disabled />
                </div>

                <div className="mb-3">
                    <label htmlFor="updatedAt">Last Updated At</label>
                    <input id="updatedAt" type="text" className="w-full px-5 py-2 rounded-md outline-none border-1 border" value={formatDate(requisition.updatedAt)} disabled />
                </div>
            </div>
        </Dialog>
    );
};

ViewItem.propTypes = {
    visible: PropTypes.bool.isRequired,
    setVisible: PropTypes.func.isRequired,
    requisition: PropTypes.shape({
        item_name: PropTypes.string,
        quantity_required: PropTypes.number,
        purpose: PropTypes.string,
        date_of_requirement: PropTypes.string,
        status: PropTypes.string,
        remarks: PropTypes.string,
        createdAt: PropTypes.string,
        updatedAt: PropTypes.string,
    }).isRequired,
};

export default ViewItem;
