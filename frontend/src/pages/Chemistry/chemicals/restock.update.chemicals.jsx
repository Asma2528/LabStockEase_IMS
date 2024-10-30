import PropTypes from 'prop-types';
import * as yup from 'yup';
import { ErrorMessage, Field, Formik } from 'formik';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { toast } from 'sonner';
import { useUpdateRestockItemMutation } from '../../../provider/queries/Chemicals.query';

const UpdateRestockModel = ({ visible, setVisible, item }) => {
    const validationSchema = yup.object({
        quantity_purchased: yup.number().required("Quantity purchased is required").positive().integer(),
        purchase_date: yup.date().required("Purchase date is required"),
        expiration_date: yup.date().required("Expiration date is required").nullable(),
        supplier: yup.string(),
        bill_number: yup.string(),
        cost_per_purchase: yup.number().positive(),
        location: yup.string(),
        barcode: yup.string(),
    });

    const initialValues = {
        quantity_purchased: item?.quantity_purchased || 0,
        purchase_date: item?.purchase_date ? new Date(item.purchase_date).toISOString().slice(0, 10) : '',
    expiration_date: item?.expiration_date ? new Date(item.expiration_date).toISOString().slice(0, 10) : '',
        supplier: item?.supplier || '',
        bill_number: item?.bill_number || '',
        cost_per_purchase: item?.cost_per_purchase || 0,
        location: item?.location || '',
        barcode: item?.barcode || '',
    };

    const [updateRestockItem, updateRestockResponse] = useUpdateRestockItemMutation();

    const onSubmitHandler = async (values) => {
        console.log("Updated refill values: ", values);
        try {
            const response = await updateRestockItem({
                data: values,
                id: item._id,
            });

            if (response.error) {
                toast.error(response.error.data.message || 'Update failed');
                return;
            }

            toast.success('Restock item updated successfully');
            setVisible(false);
        } catch (error) {
            toast.error('An unexpected error occurred');
        }
    };

    return (
        <Dialog header="Update Restock Item" draggable={false} visible={visible} className='w-[90%] mx-auto lg:mx-0 lg:w-1/2' onHide={() => setVisible(false)}>
            <Formik onSubmit={onSubmitHandler} initialValues={initialValues} validationSchema={validationSchema}>
                {({ handleSubmit }) => (
                    <form onSubmit={handleSubmit} className="w-full">
                        <div className="mb-3">
                            <label htmlFor="quantity_purchased">Quantity Purchased <span className="text-red-500 text-sm">*</span></label>
                            <Field name="quantity_purchased" id="quantity_purchased" type="number" className="w-full px-5 py-2 rounded-md outline-none border-1 border" placeholder="Enter Quantity Purchased" />
                            <ErrorMessage name='quantity_purchased' component={'p'} className='text-red-500 text-sm' />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="purchase_date">Purchase Date <span className="text-red-500 text-sm">*</span></label>
                            <Field name="purchase_date" id="purchase_date" type="date" className="w-full px-5 py-2 rounded-md outline-none border-1 border" />
                            <ErrorMessage name='purchase_date' component={'p'} className='text-red-500 text-sm' />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="expiration_date">Expiration Date <span className="text-red-500 text-sm">*</span></label>
                            <Field name="expiration_date" id="expiration_date" type="date" className="w-full px-5 py-2 rounded-md outline-none border-1 border" />
                            <ErrorMessage name='expiration_date' component={'p'} className='text-red-500 text-sm' />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="supplier">Supplier</label>
                            <Field name="supplier" id="supplier" type="text" className="w-full px-5 py-2 rounded-md outline-none border-1 border" placeholder="Enter Supplier" />
                            <ErrorMessage name='supplier' component={'p'} className='text-red-500 text-sm' />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="bill_number">Bill Number</label>
                            <Field name="bill_number" id="bill_number" type="text" className="w-full px-5 py-2 rounded-md outline-none border-1 border" placeholder="Enter Bill Number" />
                            <ErrorMessage name='bill_number' component={'p'} className='text-red-500 text-sm' />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="cost_per_purchase">Cost Per Purchase</label>
                            <Field name="cost_per_purchase" id="cost_per_purchase" type="number" className="w-full px-5 py-2 rounded-md outline-none border-1 border" placeholder="Enter Cost Per Purchase" />
                            <ErrorMessage name='cost_per_purchase' component={'p'} className='text-red-500 text-sm' />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="location">Location</label>
                            <Field name="location" id="location" type="text" className="w-full px-5 py-2 rounded-md outline-none border-1 border" placeholder="Enter Location" />
                            <ErrorMessage name='location' component={'p'} className='text-red-500 text-sm' />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="barcode">Barcode</label>
                            <Field name="barcode" id="barcode" type="text" className="w-full px-5 py-2 rounded-md outline-none border-1 border" placeholder="Enter Barcode" />
                            <ErrorMessage name='barcode' component={'p'} className='text-red-500 text-sm' />
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" loading={updateRestockResponse.isLoading} className="px-4 rounded-md py-2 bg-blue-900 text-white inline-flex items-center gap-x-2">
                                Update Restock Item
                            </Button>
                        </div>
                    </form>
                )}
            </Formik>
        </Dialog>
    );
};

// PropTypes validation
UpdateRestockModel.propTypes = {
    visible: PropTypes.bool.isRequired,
    setVisible: PropTypes.func.isRequired,
    item: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        quantity_purchased: PropTypes.number,
        purchase_date: PropTypes.string,
        expiration_date: PropTypes.string,
        supplier: PropTypes.string,
        bill_number: PropTypes.string,
        cost_per_purchase: PropTypes.number,
        location: PropTypes.string,
        barcode: PropTypes.string,
    }).isRequired,
};

export default UpdateRestockModel;
