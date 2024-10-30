import { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Formik, ErrorMessage, Field } from 'formik';
import * as yup from 'yup';
import { Button } from 'primereact/button';
import { toast } from 'sonner';
import { useAddRestockItemMutation, useGetAllChemicalsItemsQuery } from '../../../provider/queries/Chemicals.query';  
import Select from 'react-select';
import PropTypes from 'prop-types';

const RestockModel = ({ visible, setVisible }) => {
    const [addRestockItem, { isLoading }] = useAddRestockItemMutation();
    const [chemicalOptions, setChemicalOptions] = useState([]);
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [selectedChemical, setSelectedChemical] = useState(null);

    // Fetch all chemicals initially
    const { data: chemicalsData } = useGetAllChemicalsItemsQuery({ query: '' });

    // Update the chemicalOptions when data is available
    useEffect(() => {
      
        if (chemicalsData?.items) { // Access the items array
            const options = chemicalsData.items.map(chemical => ({
                value: chemical._id,
                label: `${chemical.item_code} - ${chemical.item_name}`,
            }));
            setChemicalOptions(options);
            setFilteredOptions(options); // Initialize filtered options with all options
        }
    }, [chemicalsData]);

    // Validation schema for form inputs
    const validationSchema = yup.object({
        chemical: yup.string().required("Chemical is required"),
        quantity_purchased: yup.number().required("Quantity purchased is required").positive().integer(),
        purchase_date: yup.date().required("Purchase date is required"),
        expiration_date: yup.date().required("Expiration date is required"),
        supplier: yup.string(),
        bill_number: yup.string(),
        cost_per_purchase: yup.number().positive(),
        location: yup.string(),
        barcode: yup.string(),
    });

    const initialValues = {
        chemical: selectedChemical?.value || '', // Ensure chemical is selected
        quantity_purchased: '',
        purchase_date: '',
        expiration_date: '',
        supplier: '',
        bill_number: '',
        cost_per_purchase: '',
        location: '',
        barcode: '',
    };

    const onSubmitHandler = async (values, { resetForm }) => {
        try {
     
            const response = await addRestockItem({ 
                ...values, 
                chemical: selectedChemical?.value,
            });
            if (response.error) {
                toast.error(response.error.data.message || 'Failed to add restock item');
                return;
            }
            toast.success("Restock Item Added Successfully");
            resetForm();
            setVisible(false);
        } catch (e) {
            toast.error(e.message || 'An error occurred');
        }
    };

    // Handle selection of a chemical
    const handleChemicalSelect = (selectedOption) => {
        setSelectedChemical(selectedOption);
    };

    // Handle search term filtering
    const handleSearchInputChange = (inputValue) => {
        const filtered = chemicalOptions.filter(option =>
            option.label.toLowerCase().includes(inputValue.toLowerCase())
        );
        setFilteredOptions(filtered);
    };

    return (
        <Dialog header="Add Restock Item" position='top' visible={visible} className="w-full md:w-[70%] lg:w-1/2" onHide={() => setVisible(false)} draggable={false}>
            <Formik
                onSubmit={onSubmitHandler}
                initialValues={initialValues}
                validationSchema={validationSchema}
                enableReinitialize={true} // Allow form to reset when values change
            >
                {({ handleSubmit, setFieldValue }) => (
                    <form onSubmit={handleSubmit} className="w-full">
                        {/* Item Code / Name Dropdown */}
                        <div className="mb-3">
                            <label htmlFor="item_code">Search by Item Code / Name</label>
                            <Select
                                options={filteredOptions}
                                onInputChange={handleSearchInputChange}
                                onChange={handleChemicalSelect}
                                placeholder="Search by item code or name"
                                value={selectedChemical} // Ensure Select dropdown value is in sync
                            />
                            <ErrorMessage name='chemical' component={'p'} className='text-red-500 text-sm' />
                        </div>

                        {/* Quantity Purchased */}
                        <div className="mb-3">
                            <label htmlFor="quantity_purchased">Quantity Purchased <span className="text-red-500 text-sm">*</span></label>
                            <Field name="quantity_purchased" id="quantity_purchased" type="number" className="w-full px-5 py-2 rounded-md outline-none border-1 border" placeholder="Enter Quantity Purchased" />
                            <ErrorMessage name='quantity_purchased' component={'p'} className='text-red-500 text-sm' />
                        </div>

                        {/* Purchase Date */}
                        <div className="mb-3">
                            <label htmlFor="purchase_date">Purchase Date <span className="text-red-500 text-sm">*</span></label>
                            <Field name="purchase_date" id="purchase_date" type="date" className="w-full px-5 py-2 rounded-md outline-none border-1 border" />
                            <ErrorMessage name='purchase_date' component={'p'} className='text-red-500 text-sm' />
                        </div>

                        {/* Expiration Date */}
                        <div className="mb-3">
                            <label htmlFor="expiration_date">Expiration Date <span className="text-red-500 text-sm">*</span></label>
                            <Field 
                                name="expiration_date" 
                                id="expiration_date" 
                                type="date" 
                                className="w-full px-5 py-2 rounded-md outline-none border-1 border" 
                            />
                            <ErrorMessage name='expiration_date' component={'p'} className='text-red-500 text-sm' />
                        </div>

                         {/* Supplier, Bill Number, Cost per Purchase, Location, Barcode */}
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

                        <Button type="submit" className='w-full bg-blue-900 text-center text-white py-3 flex items-center justify-center' disabled={isLoading}>
                            {isLoading ? 'Adding...' : 'Add Restock Item'}
                        </Button>
                    </form>
                )}
            </Formik>
        </Dialog>
    );
};

// PropTypes validation
RestockModel.propTypes = {
    visible: PropTypes.bool.isRequired,
    setVisible: PropTypes.func.isRequired,
};

export default RestockModel;
