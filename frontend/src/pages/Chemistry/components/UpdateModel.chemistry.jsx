// import React from 'react';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import { ErrorMessage, Field, Formik } from 'formik';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { toast } from 'sonner';
import { useGetChemistryItemQuery, useUpdateChemistryItemMutation } from '../../../provider/queries/Chemistry.query';
import Loader from '../../../components/Loader';

const UpdateModel = ({ visible, setVisible, _id }) => {
    const { isLoading, data } = useGetChemistryItemQuery(_id);
    const [updateChemistry, updateChemistryResponse] = useUpdateChemistryItemMutation();

    if (isLoading) {
        return <Loader />;
    }

    const validationSchema = yup.object({
        item_name: yup.string().required("Item Name is required"),
        company: yup.string().required("Company is required"),
        date_added: yup.date().required("Date Added is required"),
        purpose: yup.string().required("Purpose is required"),
        BillNo: yup.string().required("Bill Number is required"),
        total_quantity: yup.number().required("Total Quantity is required").positive().integer(),
        issued_quantity: yup.number().required("Issued Quantity is required").positive().integer(),
        current_quantity: yup.number().required("Current Quantity is required").positive().integer(),
        min_stock_level: yup.number().required("Minimum Stock Level is required").positive().integer(),
        unit_of_measure: yup.string().required("Unit of Measure is required"),
        last_updated_date: yup.date().required("Last Updated Date is required"),
        expiration_date: yup.date().required("Expiration Date is required"),
        location: yup.string().required("Location is required"),
        status: yup.string().required("Status is required"),
        description: yup.string(),
        barcode: yup.string(),
        low_stock_alert: yup.boolean(),
        expiration_alert_date: yup.date(),
    });

    const initialValues = {
        item_name: data?.chemistry.item_name || '',
        company: data?.chemistry.company || '',
        date_added: data?.chemistry.date_added ? new Date(data.chemistry.date_added) : new Date(),
        purpose: data?.chemistry.purpose || '',
        BillNo: data?.chemistry.BillNo || '',
        total_quantity: data?.chemistry.total_quantity || 0,
        issued_quantity: data?.chemistry.issued_quantity || 0,
        current_quantity: data?.chemistry.current_quantity || 0,
        min_stock_level: data?.chemistry.min_stock_level || 0,
        unit_of_measure: data?.chemistry.unit_of_measure || '',
        last_updated_date: data?.chemistry.last_updated_date ? new Date(data.chemistry.last_updated_date) : new Date(),
        expiration_date: data?.chemistry.expiration_date ? new Date(data.chemistry.expiration_date) : new Date(),
        location: data?.chemistry.location || '',
        status: data?.chemistry.status || '',
        description: data?.chemistry.description || '',
        barcode: data?.chemistry.barcode || '',
        low_stock_alert: data?.chemistry.low_stock_alert || false,
        expiration_alert_date: data?.chemistry.expiration_alert_date ? new Date(data.chemistry.expiration_alert_date) : null,
    };

    const onSubmitHandler = async (values, { setValues }) => {
        try {
            const { data, error } = await updateChemistry({ data: values, _id });

            if (error) {
                toast.error(error.data.message);
                return;
            }

            setValues({
                ...values,
                date_added: new Date(values.date_added),
                last_updated_date: new Date(values.last_updated_date),
                expiration_date: new Date(values.expiration_date),
                expiration_alert_date: values.expiration_alert_date ? new Date(values.expiration_alert_date) : null,
            });

            toast.success(data.msg);
            setVisible(false);
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <>
        <Dialog draggable={false} visible={visible} className='w-[90%] mx-auto lg:mx-0 lg:w-1/2' onHide={() => setVisible(false)}>
            <Formik onSubmit={onSubmitHandler} initialValues={initialValues} validationSchema={validationSchema}>
                {({ values, setFieldValue, handleSubmit }) => (
                    <form onSubmit={handleSubmit} className="w-full">
                        <div className="mb-3">
                            <label htmlFor="item_name">Item Name <span className="text-red-500 text-sm">*</span></label>
                            <Field name="item_name" id="item_name" type="text" placeholder='Enter Item Name' className="w-full my-2 border outline-none py-3 px-4" />
                            <ErrorMessage name='item_name' className='text-red-500 capitalize' component='p' />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="company">Company <span className="text-red-500 text-sm">*</span></label>
                            <Field name="company" id="company" type="text" placeholder='Enter Company' className="w-full my-2 border outline-none py-3 px-4" />
                            <ErrorMessage name='company' className='text-red-500 capitalize' component='p' />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="date_added">Date Added <span className="text-red-500 text-sm">*</span></label>
                            <Calendar id='date_added' className='w-full my-2 border outline-none py-3 px-4 ring-0' maxDate={new Date()} inputClassName='outline-none ring-0' placeholder='Enter Date Added' dateFormat='dd/mm/yy' value={values.date_added} onChange={(e) => setFieldValue('date_added', e.value)} />
                            <ErrorMessage name='date_added' className='text-red-500 capitalize' component='p' />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="purpose">Purpose <span className="text-red-500 text-sm">*</span></label>
                            <Field name="purpose" id="purpose" type="text" placeholder='Enter Purpose' className="w-full my-2 border outline-none py-3 px-4" />
                            <ErrorMessage name='purpose' className='text-red-500 capitalize' component='p' />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="BillNo">Bill Number <span className="text-red-500 text-sm">*</span></label>
                            <Field name="BillNo" id="BillNo" type="text" placeholder='Enter Bill Number' className="w-full my-2 border outline-none py-3 px-4" />
                            <ErrorMessage name='BillNo' className='text-red-500 capitalize' component='p' />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="total_quantity">Total Quantity <span className="text-red-500 text-sm">*</span></label>
                            <Field name="total_quantity" id="total_quantity" type="number" placeholder='Enter Total Quantity' className="w-full my-2 border outline-none py-3 px-4" />
                            <ErrorMessage name='total_quantity' className='text-red-500 capitalize' component='p' />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="issued_quantity">Issued Quantity <span className="text-red-500 text-sm">*</span></label>
                            <Field name="issued_quantity" id="issued_quantity" type="number" placeholder='Enter Issued Quantity' className="w-full my-2 border outline-none py-3 px-4" />
                            <ErrorMessage name='issued_quantity' className='text-red-500 capitalize' component='p' />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="current_quantity">Current Quantity <span className="text-red-500 text-sm">*</span></label>
                            <Field name="current_quantity" id="current_quantity" type="number" placeholder='Enter Current Quantity' className="w-full my-2 border outline-none py-3 px-4" />
                            <ErrorMessage name='current_quantity' className='text-red-500 capitalize' component='p' />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="min_stock_level">Minimum Stock Level <span className="text-red-500 text-sm">*</span></label>
                            <Field name="min_stock_level" id="min_stock_level" type="number" placeholder='Enter Minimum Stock Level' className="w-full my-2 border outline-none py-3 px-4" />
                            <ErrorMessage name='min_stock_level' className='text-red-500 capitalize' component='p' />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="unit_of_measure">Unit of Measure <span className="text-red-500 text-sm">*</span></label>
                            <Field name="unit_of_measure" id="unit_of_measure" type="text" placeholder='Enter Unit of Measure' className="w-full my-2 border outline-none py-3 px-4" />
                            <ErrorMessage name='unit_of_measure' className='text-red-500 capitalize' component='p' />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="last_updated_date">Last Updated Date <span className="text-red-500 text-sm">*</span></label>
                            <Calendar id='last_updated_date' className='w-full my-2 border outline-none py-3 px-4 ring-0' maxDate={new Date()} inputClassName='outline-none ring-0' placeholder='Enter Last Updated Date' dateFormat='dd/mm/yy' value={values.last_updated_date} onChange={(e) => setFieldValue('last_updated_date', e.value)} />
                            <ErrorMessage name='last_updated_date' className='text-red-500 capitalize' component='p' />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="expiration_date">Expiration Date <span className="text-red-500 text-sm">*</span></label>
                            <Calendar id='expiration_date' className='w-full my-2 border outline-none py-3 px-4 ring-0' maxDate={new Date()} inputClassName='outline-none ring-0' placeholder='Enter Expiration Date' dateFormat='dd/mm/yy' value={values.expiration_date} onChange={(e) => setFieldValue('expiration_date', e.value)} />
                            <ErrorMessage name='expiration_date' className='text-red-500 capitalize' component='p' />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="location">Location <span className="text-red-500 text-sm">*</span></label>
                            <Field name="location" id="location" type="text" placeholder='Enter Location' className="w-full my-2 border outline-none py-3 px-4" />
                            <ErrorMessage name='location' className='text-red-500 capitalize' component='p' />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="status">Status <span className="text-red-500 text-sm">*</span></label>
                            <Field name="status" id="status" type="text" placeholder='Enter Status' className="w-full my-2 border outline-none py-3 px-4" />
                            <ErrorMessage name='status' className='text-red-500 capitalize' component='p' />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="description">Description</label>
                            <Field name="description" id="description" type="text" placeholder='Enter Description' className="w-full my-2 border outline-none py-3 px-4" />
                            <ErrorMessage name='description' className='text-red-500 capitalize' component='p' />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="barcode">Barcode</label>
                            <Field name="barcode" id="barcode" type="text" placeholder='Enter Barcode' className="w-full my-2 border outline-none py-3 px-4" />
                            <ErrorMessage name='barcode' className='text-red-500 capitalize' component='p' />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="low_stock_alert">Low Stock Alert</label>
                            <Field name="low_stock_alert" id="low_stock_alert" type="checkbox" />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="expiration_alert_date">Expiration Alert Date</label>
                            <Calendar id='expiration_alert_date' className='w-full my-2 border outline-none py-3 px-4 ring-0' maxDate={new Date()} inputClassName='outline-none ring-0' placeholder='Enter Expiration Alert Date' dateFormat='dd/mm/yy' value={values.expiration_alert_date} onChange={(e) => setFieldValue('expiration_alert_date', e.value)} />
                            <ErrorMessage name='expiration_alert_date' className='text-red-500 capitalize' component='p' />
                        </div>

                        <div className="flex justify-end">
                            <Button
                                loading={updateChemistryResponse.isLoading}
                                className="text-white px-5 rounded-sm bg-indigo-500 py-3 text-center">Update Chemistry Item</Button>
                        </div>
                    </form>
                )}
            </Formik>
        </Dialog>
        </>
    );
};

// PropTypes validation
UpdateModel.propTypes = {
    visible: PropTypes.bool.isRequired,
    setVisible: PropTypes.func.isRequired,
    _id: PropTypes.string.isRequired
};

export default UpdateModel;
