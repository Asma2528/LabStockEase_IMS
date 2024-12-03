import PropTypes from 'prop-types';
import * as yup from 'yup';
import { ErrorMessage, Field, Formik } from 'formik';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { toast } from 'sonner';
import { useUpdateRequisitionMutation } from '../../../provider/queries/ChemistryRequisition.query';
import { format } from 'date-fns';

const UpdateModel = ({ visible, setVisible, requisition }) => {
    const validationSchema = yup.object({
        item_name: yup.string().required("Item Name is required"),
        quantity_required: yup.number().required("Quantity Required is required").positive().integer(),
        purpose: yup.string().required("Purpose is required"),
        date_of_requirement: yup.date().required("Date of Requirement is required"),
    });

    const initialValues = {
        item_name: requisition?.item_name || '',
        quantity_required: requisition?.quantity_required || 0,
        purpose: requisition?.purpose || '',
        date_of_requirement: requisition?.date_of_requirement ? format(new Date(requisition.date_of_requirement), 'yyyy-MM-dd') : '',
    };

    const [updateRequisition, updateResponse] = useUpdateRequisitionMutation();

    const onSubmitHandler = async (values) => {
   
        try {
            const response = await updateRequisition({
                id: requisition._id,
                updateData: values,
            });
    

    
            if (response.error) {
                toast.error(response.error.data.message || 'Update failed');
                return;
            }
    
            if (response.data) {
                toast.success('Requisition updated successfully');
                setVisible(false);
            } else {
                toast.error('Update failed without an error message');
            }
        } catch (error) {
            console.error('Unexpected error:', error); // Add this line
            toast.error('An unexpected error occurred');
        }
    };
    

    return (
        <Dialog header="Update Requisition" visible={visible} className='w-[90%] mx-auto lg:w-1/2' onHide={() => setVisible(false)}>
            <Formik onSubmit={onSubmitHandler} initialValues={initialValues} validationSchema={validationSchema}>
                {({ handleSubmit }) => (
                    <form onSubmit={handleSubmit} className="w-full">
                        <div className="mb-3">
                            <label htmlFor="item_name">Item Name <span className="text-red-500">*</span></label>
                            <Field name="item_name" id="item_name" type="text" className="w-full px-5 py-2 rounded-md outline-none border-1 border" placeholder="Enter Item Name" />
                            <ErrorMessage name='item_name' component='p' className='text-red-500 text-sm' />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="quantity_required">Quantity Required <span className="text-red-500">*</span></label>
                            <Field name="quantity_required" id="quantity_required" type="number" className="w-full px-5 py-2 rounded-md outline-none border-1 border" placeholder="Enter Quantity Required" />
                            <ErrorMessage name='quantity_required' component='p' className='text-red-500 text-sm' />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="purpose">Purpose <span className="text-red-500">*</span></label>
                            <Field name="purpose" id="purpose" type="text" className="w-full px-5 py-2 rounded-md outline-none border-1 border" placeholder="Enter Purpose" />
                            <ErrorMessage name='purpose' component='p' className='text-red-500 text-sm' />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="date_of_requirement">Date of Requirement <span className="text-red-500">*</span></label>
                            <Field name="date_of_requirement" id="date_of_requirement" type="date" className="w-full px-5 py-2 rounded-md outline-none border-1 border" />
                            <ErrorMessage name='date_of_requirement' component='p' className='text-red-500 text-sm' />
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" loading={updateResponse.isLoading} className="px-4 rounded-md py-2 bg-blue-900 text-white">
                                Update Requisition
                            </Button>
                        </div>
                    </form>
                )}
            </Formik>
        </Dialog>
    );
};

UpdateModel.propTypes = {
    visible: PropTypes.bool.isRequired,
    setVisible: PropTypes.func.isRequired,
    requisition: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        item_name: PropTypes.string,
        quantity_required: PropTypes.number,
        purpose: PropTypes.string,
        date_of_requirement: PropTypes.string,
    }),
};

export default UpdateModel;
