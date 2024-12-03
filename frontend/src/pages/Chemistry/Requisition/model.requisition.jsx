import { Dialog } from 'primereact/dialog';
import { Formik, ErrorMessage, Field } from 'formik';
import * as yup from 'yup';
import { Button } from 'primereact/button';
import { toast } from 'sonner';
import PropTypes from 'prop-types';
import { useCreateRequisitionMutation } from '../../../provider/queries/ChemistryRequisition.query';

const Model = ({ visible, setVisible }) => {
    const [createRequisition, { isLoading }] = useCreateRequisitionMutation();

    const validationSchema = yup.object({
        item_name: yup.string().required("Item name is required"),
        quantity_required: yup.number().required("Quantity is required").positive().integer(),
        purpose: yup.string().required("Purpose is required"),
        date_of_requirement: yup.date().required("Date of requirement is required"),
    });

    const initialValues = {
        item_name: '',
        quantity_required: 0,
        purpose: '',
        date_of_requirement: '',
    };

    const onSubmitHandler = async (values, { resetForm }) => {
        console.log(values);
        try {
            const response = await createRequisition(values);
            if (response.error) {
                toast.error(response.error.data.message || 'Failed to create requisition');
                return;
            }
            toast.success("Requisition Created Successfully");
            resetForm();
            setVisible(false);
        } catch (e) {
            toast.error(e.message || 'An error occurred');
        }
    };

    return (
        <Dialog header="Create Requisition" position='top' visible={visible} className="w-full md:w-[70%] lg:w-1/2" onHide={() => setVisible(false)} draggable={false}>
            <Formik onSubmit={onSubmitHandler} initialValues={initialValues} validationSchema={validationSchema}>
                {({ handleSubmit }) => (
                    <form onSubmit={handleSubmit} className="w-full">
                        <div className="mb-3">
                            <label htmlFor="item_name">Item Name <span className="text-red-500 text-sm">*</span></label>
                            <Field name="item_name" id="item_name" type="text" className="w-full px-5 py-2 rounded-md outline-none border-1 border" placeholder="Enter Item Name" />
                            <ErrorMessage name='item_name' component={'p'} className='text-red-500 text-sm' />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="quantity_required">Quantity Required <span className="text-red-500 text-sm">*</span></label>
                            <Field name="quantity_required" id="quantity_required" type="number" className="w-full px-5 py-2 rounded-md outline-none border-1 border" placeholder="Enter Quantity" />
                            <ErrorMessage name='quantity_required' component={'p'} className='text-red-500 text-sm' />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="purpose">Purpose <span className="text-red-500 text-sm">*</span></label>
                            <Field name="purpose" id="purpose" type="text" className="w-full px-5 py-2 rounded-md outline-none border-1 border" placeholder="Enter Purpose" />
                            <ErrorMessage name='purpose' component={'p'} className='text-red-500 text-sm' />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="date_of_requirement">Date of Requirement <span className="text-red-500 text-sm">*</span></label>
                            <Field name="date_of_requirement" id="date_of_requirement" type="date" className="w-full px-5 py-2 rounded-md outline-none border-1 border" />
                            <ErrorMessage name='date_of_requirement' component={'p'} className='text-red-500 text-sm' />
                        </div>

                        <Button type="submit" className='w-full bg-blue-900 text-center text-white py-3 flex items-center justify-center' disabled={isLoading}>
                            {isLoading ? 'Creating...' : 'Create Requisition'}
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
