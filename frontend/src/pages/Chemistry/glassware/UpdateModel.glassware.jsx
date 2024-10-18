import PropTypes from 'prop-types';
import * as yup from 'yup';
import { ErrorMessage, Field, Formik } from 'formik';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { toast } from 'sonner';
import { useUpdateGlasswareItemMutation } from '../../../provider/queries/Glassware.query';


const UpdateModel = ({ visible, setVisible, item }) => {
  

    // Define validation schema
    const validationSchema = yup.object({
        item_code: yup.string().required("Item code is required"),
        item_name: yup.string().required("Item Name is required"),
        company: yup.string().required("Company is required"),
        purpose: yup.string().required("Purpose is required"),
        BillNo: yup.string().required("Bill Number is required"),
        total_quantity: yup.number().required("Total Quantity is required").positive().integer(),
        current_quantity: yup.number().required("Current Quantity is required").positive().integer(),
        min_stock_level: yup.number().required("Minimum Stock Level is required").positive().integer(),
        unit_of_measure: yup.string().required("Unit of Measure is required"),

        location: yup.string().required("Location is required"),
        status: yup.string().required("Status is required"),
        description: yup.string(),
        barcode: yup.string(),
        low_stock_alert: yup.boolean(),
 
    });

    // Set initial values, handling cases where item might be undefined
    const initialValues = {
        item_code: item?.item_code|| '',
        item_name: item?.item_name || '',
        company: item?.company || '',
        purpose: item?.purpose || '',
        BillNo: item?.BillNo || '',
        total_quantity: item?.total_quantity || 0,
        current_quantity: item?.current_quantity || 0,
        min_stock_level: item?.min_stock_level || 0,
        unit_of_measure: item?.unit_of_measure || '',

        location: item?.location || '',
        status: item?.status || '',
        description: item?.description || '',
        barcode: item?.barcode || '',
        low_stock_alert: item?.low_stock_alert || false,

    };

    const [updateGlasswareItem, updateGlasswareResponse] = useUpdateGlasswareItemMutation();
    

    const onSubmitHandler = async (values) => {
        try {
         
            values.current_quantity = values.total_quantity;

            const formattedValues = {
                ...values,
            };
    
     
    
            const response = await updateGlasswareItem({
                data: formattedValues,
                id: item._id,
            });
    
            if (response.error) {
                console.error('Error in response:', response.error);
                toast.error(response.error.data.message || 'Update failed');
                return;
            }
    
            toast.success('Item updated successfully');
            setVisible(false);
        } catch (error) {
            console.error('Unexpected error:', error);
            toast.error('An unexpected error occurred');
        }
    };
    


    return (
        <Dialog header="Update Item" draggable={false} visible={visible} className='w-[90%] mx-auto lg:mx-0 lg:w-1/2' onHide={() => setVisible(false)}>
            <Formik onSubmit={onSubmitHandler} initialValues={initialValues} validationSchema={validationSchema}>
                {({ handleSubmit }) => (
                    <form onSubmit={handleSubmit} className="w-full">
                      
                      <div className="mb-3">
                            <label htmlFor="item_code">Item Code <span className="text-red-500 text-sm">*</span></label>
                            <Field name="item_code" id="item_code" type="text" className="w-full px-5 py-2 rounded-md outline-none border-1 border" placeholder="Enter Item Code" />
                            <ErrorMessage name='item_code' component={'p'} className='text-red-500 text-sm' />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="item_name">Item Name <span className="text-red-500 text-sm">*</span></label>
                            <Field name="item_name" id="item_name" type="text" className="w-full px-5 py-2 rounded-md outline-none border-1 border" placeholder="Enter Item Name" />
                            <ErrorMessage name='item_name' component={'p'} className='text-red-500 text-sm' />
                        </div>
                        
                        {/* Company */}
                        <div className="mb-3">
                                <label htmlFor="company">Company/Brand <span className="text-red-500 text-sm">*</span></label>
                                <Field name="company" id="company" type="text" className="w-full px-5 py-2 rounded-md outline-none border-1 border" placeholder="Enter Company/Brand" />
                                <ErrorMessage name='company' component={'p'} className='text-red-500 text-sm' />
                            </div>


                            {/* Purpose */}
                            <div className="mb-3">
                                <label htmlFor="purpose">Purpose</label>
                                <Field name="purpose" id="purpose" type="text" className="w-full px-5 py-2 rounded-md outline-none border-1 border" placeholder="Enter Purpose" />
                                <ErrorMessage name='purpose' component={'p'} className='text-red-500 text-sm' />
                            </div>

                            {/* Bill Number */}
                            <div className="mb-3">
                                <label htmlFor="BillNo">Bill Number <span className="text-red-500 text-sm">*</span></label>
                                <Field name="BillNo" id="BillNo" type="text" className="w-full px-5 py-2 rounded-md outline-none border-1 border" placeholder="Enter Bill Number" />
                                <ErrorMessage name='BillNo' component={'p'} className='text-red-500 text-sm' />
                            </div>

                            {/* Total Quantity */}
                            <div className="mb-3">
                                <label htmlFor="total_quantity">Total Quantity <span className="text-red-500 text-sm">*</span></label>
                                <Field name="total_quantity" id="total_quantity" type="number" className="w-full px-5 py-2 rounded-md outline-none border-1 border" placeholder="Enter Total Quantity" />
                                <ErrorMessage name='total_quantity' component={'p'} className='text-red-500 text-sm' />
                            </div>

                            {/* Minimum Stock Level */}
                            <div className="mb-3">
                                <label htmlFor="min_stock_level">Minimum Stock Level <span className="text-red-500 text-sm">*</span></label>
                                <Field name="min_stock_level" id="min_stock_level" type="number" className="w-full px-5 py-2 rounded-md outline-none border-1 border" placeholder="Enter Minimum Stock Level" />
                                <ErrorMessage name='min_stock_level' component={'p'} className='text-red-500 text-sm' />
                            </div>

                           
                            <div className="mb-3">
                            <label htmlFor="unit_of_measure">
                                Unit of Measure <span className="text-red-500 text-sm">*</span>
                            </label>
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
                                <option value="meters" label="Meters (m) " />
                            </Field>
                            <ErrorMessage
                                name="unit_of_measure"
                                component="p"
                                className="text-red-500 text-sm"
                            />
                        </div>


     

                            {/* Location */}
                            <div className="mb-3">
                                <label htmlFor="location">Location <span className="text-red-500 text-sm">*</span></label>
                                <Field name="location" id="location" type="text" className="w-full px-5 py-2 rounded-md outline-none border-1 border" placeholder="Enter Location" />
                                <ErrorMessage name='location' component={'p'} className='text-red-500 text-sm' />
                            </div>

                            {/* Status */}
                            <div className="mb-3">
                                <label htmlFor="status">Status <span className="text-red-500 text-sm">*</span></label>
                                <Field as="select" name="status" id="status" className="w-full px-5 py-2 rounded-md outline-none border-1 border" disabled>
                                    <option value="">Select Status</option>
                                    <option value="In Stock">In Stock</option>
                                    <option value="Out of Stock">Out of Stock</option>
                                </Field>
                                <ErrorMessage name='status' component={'p'} className='text-red-500 text-sm' />
                            </div>


                            {/* Description */}
                            <div className="mb-3">
                                <label htmlFor="description">Description</label>
                                <Field name="description" id="description" type="text" className="w-full px-5 py-2 rounded-md outline-none border-1 border" placeholder="Enter Description" />
                                <ErrorMessage name='description' component={'p'} className='text-red-500 text-sm' />
                            </div>

                            {/* Barcode */}
                            <div className="mb-3">
                                <label htmlFor="barcode">Barcode</label>
                                <Field name="barcode" id="barcode" type="text" className="w-full px-5 py-2 rounded-md outline-none border-1 border" placeholder="Enter Barcode" />
                                <ErrorMessage name='barcode' component={'p'} className='text-red-500 text-sm' />
                            </div>

                            {/* Low Stock Alert */}
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


           


                        <div className="flex justify-end">
                            <Button
                            type="submit"
                                loading={updateGlasswareResponse.isLoading}
                                className="px-4 rounded-md py-2 bg-blue-900 text-white inline-flex items-center gap-x-2">
                                Update Item
                            </Button>
                        </div>
                    </form>
                )}
            </Formik>
        </Dialog>
    );
};

// PropTypes validation
UpdateModel.propTypes = {
    visible: PropTypes.bool.isRequired,
    setVisible: PropTypes.func.isRequired,
    item: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        item_code: PropTypes.string,
        item_name: PropTypes.string,
        company: PropTypes.string,
        purpose: PropTypes.string,
        BillNo: PropTypes.string,
        total_quantity: PropTypes.number,
        issued_quantity: PropTypes.number,
        current_quantity: PropTypes.number,
        min_stock_level: PropTypes.number,
        unit_of_measure: PropTypes.string,
        location: PropTypes.string,
        status: PropTypes.string,
        description: PropTypes.string,
        barcode: PropTypes.string,
        low_stock_alert: PropTypes.bool,

    }),
};

export default UpdateModel;
