import { Dialog } from 'primereact/dialog';
import { Formik, ErrorMessage, Field } from 'formik';
import * as yup from 'yup';
import { Button } from 'primereact/button';
import { toast } from 'sonner';
import PropTypes from 'prop-types';
import { useAddReagentsItemMutation } from '../../../provider/queries/Reagents.query';

const Model = ({ visible, setVisible }) => {
    const [addReagentsItem, { isLoading }] = useAddReagentsItemMutation();

    const today = new Date();
    const validationSchema = yup.object({
        item_code: yup.string(),
        item_name: yup.string().required("Item name is required"),
        company: yup.string().required("Company/Brand is required"),
        purpose: yup.string(),
        BillNo: yup.string().required("Bill No is required"),
        total_quantity: yup.number().required("Total quantity is required").positive().integer(),
        min_stock_level: yup.number().required("Minimum stock level is required").positive().integer(),
        unit_of_measure: yup.string().required("Unit of measurement is required"),
        expiration_date: yup.date().required("Expiration date is required"),
        location: yup.string().required("Location is required"),
        description: yup.string(),
        barcode: yup.string(),
        low_stock_alert: yup.boolean(),
        expiration_alert_date: yup.date().required("Expiration alert date is required"),
    });

    const initialValues = {
        item_code: '',
        item_name: '',
        company: '',
        purpose: '',
        BillNo: '',
        total_quantity: 0,
        current_quantity: 0, // This will be set in onSubmitHandler
        min_stock_level: 0,
        unit_of_measure: '',
        expiration_date: today.toISOString().split('T')[0], // Convert to 'YYYY-MM-DD'
        location: '',
        status: 'In Stock', // Default status
        description: '',
        barcode: '',
        low_stock_alert: true,
        expiration_alert_date: today.toISOString().split('T')[0] // Convert to 'YYYY-MM-DD'
    };

    const onSubmitHandler = async (values, { resetForm }) => {
        // Set current_quantity to total_quantity before submission
        values.current_quantity = values.total_quantity;

        try {
            const response = await addReagentsItem(values);
            if (response.error) {
                toast.error(response.error.data.message || 'Failed to add item');
                return;
            }
            toast.success("Reagents Item Added Successfully");
            resetForm();
            setVisible(false);
        } catch (e) {
            toast.error(e.message || 'An error occurred');
        }
    };

    return (
        <Dialog header="Add Item" position='top' visible={visible} className="w-full md:w-[70%] lg:w-1/2" onHide={() => setVisible(false)} draggable={false}>
            <Formik onSubmit={onSubmitHandler} initialValues={initialValues} validationSchema={validationSchema}>
                {({ handleSubmit }) => (
                    <form onSubmit={handleSubmit} className="w-full">
                      
                        <div className="mb-3">
                            <label htmlFor="item_code">Item Code <span className="text-red-500 text-sm">*</span></label>
                            <Field name="item_code" id="item_name" type="text" className="w-full px-5 py-2 rounded-md outline-none border-1 border" placeholder="Enter Item Name" />
                            <ErrorMessage name='item_code' component={'p'} className='text-red-500 text-sm' />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="item_name">Item Name <span className="text-red-500 text-sm">*</span></label>
                            <Field name="item_name" id="item_name" type="text" className="w-full px-5 py-2 rounded-md outline-none border-1 border" placeholder="Enter Item Name" />
                            <ErrorMessage name='item_name' component={'p'} className='text-red-500 text-sm' />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="company">Company/Brand <span className="text-red-500 text-sm">*</span></label>
                            <Field name="company" id="company" type="text" className="w-full px-5 py-2 rounded-md outline-none border-1 border" placeholder="Enter Company/Brand" />
                            <ErrorMessage name='company' component={'p'} className='text-red-500 text-sm' />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="purpose">Purpose</label>
                            <Field name="purpose" id="purpose" type="text" className="w-full px-5 py-2 rounded-md outline-none border-1 border" placeholder="Enter Purpose" />
                            <ErrorMessage name='purpose' component={'p'} className='text-red-500 text-sm' />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="BillNo">Bill Number <span className="text-red-500 text-sm">*</span></label>
                            <Field name="BillNo" id="BillNo" type="text" className="w-full px-5 py-2 rounded-md outline-none border-1 border" placeholder="Enter Bill Number" />
                            <ErrorMessage name='BillNo' component={'p'} className='text-red-500 text-sm' />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="total_quantity">Total Quantity <span className="text-red-500 text-sm">*</span></label>
                            <Field name="total_quantity" id="total_quantity" type="number" className="w-full px-5 py-2 rounded-md outline-none border-1 border" placeholder="Enter Total Quantity" />
                            <ErrorMessage name='total_quantity' component={'p'} className='text-red-500 text-sm' />
                        </div>

                        {/* Current Quantity is hidden and set to total_quantity in onSubmitHandler */}

                        <div className="mb-3">
                            <label htmlFor="min_stock_level">Minimum Stock Level <span className="text-red-500 text-sm">*</span></label>
                            <Field name="min_stock_level" id="min_stock_level" type="number" className="w-full px-5 py-2 rounded-md outline-none border-1 border" placeholder="Enter Minimum Stock Level" />
                            <ErrorMessage name='min_stock_level' component={'p'} className='text-red-500 text-sm' />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="unit_of_measure">Unit of Measure <span className="text-red-500 text-sm">*</span></label>
                            <Field
                                name="unit_of_measure"
                                id="unit_of_measure"
                                as="select"
                                className="w-full px-5 py-2 rounded-md outline-none border-1 border"
                            >
                                <option value="" label="Select unit" />
                                <option value="ml" label="Milliliter (ml)" />
                                <option value="l" label="Liter (l)" />
                                <option value="g" label="Gram (g)" />
                                <option value="kg" label="Kilogram (kg)" />
                                <option value="m^3" label="Cubic Meter (m³)" />
                                <option value="pcs" label="Pieces (pcs)" />
                                <option value="sets" label="Sets" />
                                <option value="boxes" label="Boxes" />
                                <option value="packs" label="Packs" />
                                <option value="meters" label="Meters (m)" />
                            </Field>
                            <ErrorMessage name="unit_of_measure" component="p" className="text-red-500 text-sm" />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="expiration_date">Expiration Date <span className="text-red-500 text-sm">*</span></label>
                            <Field name="expiration_date" id="expiration_date" type="date" className="w-full px-5 py-2 rounded-md outline-none border-1 border" />
                            <ErrorMessage name='expiration_date' component={'p'} className='text-red-500 text-sm' />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="location">Location <span className="text-red-500 text-sm">*</span></label>
                            <Field name="location" id="location" type="text" className="w-full px-5 py-2 rounded-md outline-none border-1 border" placeholder="Enter Location" />
                            <ErrorMessage name='location' component={'p'} className='text-red-500 text-sm' />
                        </div>

                        {/* Status is hidden and defaults to "In Stock" in initialValues */}

                        <div className="mb-3">
                            <label htmlFor="description">Description</label>
                            <Field name="description" id="description" type="text" className="w-full px-5 py-2 rounded-md outline-none border-1 border" placeholder="Enter Description" />
                            <ErrorMessage name='description' component={'p'} className='text-red-500 text-sm' />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="barcode">Barcode</label>
                            <Field name="barcode" id="barcode" type="text" className="w-full px-5 py-2 rounded-md outline-none border-1 border" placeholder="Enter Barcode" />
                            <ErrorMessage name='barcode' component={'p'} className='text-red-500 text-sm' />
                        </div>

                        <div className="mb-3 flex items-center">
                            <Field
                                name="low_stock_alert"
                                id="low_stock_alert"
                                type="checkbox"
                                className="w-4 h-4 rounded-md outline-none border-1 border mr-2"
                            />
                            <label htmlFor="low_stock_alert" className="text-sm">Yes, I want alerts</label>
                            <ErrorMessage name='low_stock_alert' component={'p'} className='text-red-500 text-sm ml-2' />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="expiration_alert_date">Expiration Alert Date</label>
                            <Field name="expiration_alert_date" id="expiration_alert_date" type="date" className="w-full px-5 py-2 rounded-md outline-none border-1 border" />
                            <ErrorMessage name='expiration_alert_date' component={'p'} className='text-red-500 text-sm' />
                        </div>

                        <Button type="submit" className='w-full bg-blue-900 text-center text-white py-3 flex items-center justify-center' disabled={isLoading}>
                            {isLoading ? 'Adding...' : 'Add Item'}
                        </Button>
                    </form>
                )}
            </Formik>
        </Dialog>
    );
};

// PropTypes validation
Model.propTypes = {
    visible: PropTypes.bool.isRequired,
    setVisible: PropTypes.func.isRequired,
};

export default Model;
