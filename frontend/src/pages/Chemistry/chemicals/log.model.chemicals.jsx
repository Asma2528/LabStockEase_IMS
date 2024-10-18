import { Dialog } from "primereact/dialog";
import { Formik, ErrorMessage, Field } from "formik";
import * as yup from "yup";
import { Button } from "primereact/button";
import { toast } from "sonner";
import PropTypes from "prop-types";
import { useLogIssuedQuantityMutation, useGetAllChemicalsItemsQuery } from "../../../provider/queries/Chemicals.query";
import { useSelector } from 'react-redux';
import { useEffect } from "react";


const Model = ({ visible, setVisible }) => {


  const { data: chemicalsData, isLoading: isChemicalsLoading, error } = useGetAllChemicalsItemsQuery( {query: ''});

  // Handle error fetching chemicals data
  if (error) {
    console.error("Error fetching chemicals:", error);
  }

  // Log chemicals data on change
  useEffect(() => {
    if (chemicalsData) {
      console.log("Chemicals Data:", chemicalsData);
    }
  }, [chemicalsData]);

  const [logIssuedQuantity, { isLoading }] = useLogIssuedQuantityMutation();
  const user = useSelector((state) => state.user);
  const today = new Date();

  // Validation schema with yup
  const validationSchema = yup.object({
    item_code: yup.string().required("Item code is required"),
    issued_quantity: yup
      .number()
      .required("Issued quantity is required")
      .positive("Quantity must be positive")
      .integer("Quantity must be an integer")
      .test(
        "is-less-than-current",
        "Issued quantity cannot be more than the current quantity",
        function (value) {
          if (this.parent.current_quantity == null) return false;
          return value <= this.parent.current_quantity;
        }
      ),
    date_issued: yup.date().required("Date issued is required"),
  });

  const initialValues = {
    item_code: "",
    item_name: "",
    issued_quantity: 0,
    date_issued: today.toISOString().split("T")[0],
    current_quantity: 0,
    item_id: "",
  };

  const handleItemCodeChange = (e, setFieldValue) => {
    const selectedItem = chemicalsData?.items?.find(
      (item) => item.item_code === e.target.value
    );
    if (selectedItem) {
      setFieldValue("item_name", selectedItem.item_name || "");
      setFieldValue("current_quantity", selectedItem.current_quantity || 0);
      setFieldValue("item_id", selectedItem._id);
    }
  };

  const onSubmitHandler = async (values, { resetForm }) => {
    try {
 
      const response = await logIssuedQuantity({
        item_id: values.item_id.trim(),
        issued_quantity: values.issued_quantity,
        date_issued: values.date_issued,
        user_email: user.email, 
      });

      // Check if response contains error
      if (response.error) {
        toast.error(response.error.data.message || "Failed to log issued quantity");
        return;
      }



      toast.success("Issued Quantity Logged Successfully");
      resetForm();
      setVisible(false);
    } catch (e) {
      toast.error(e.message || "An error occurred");
    }
  };

  return (
    <Dialog
      header="Log Issued Quantity"
      position="top"
      visible={visible}
      className="w-full md:w-[70%] lg:w-1/2"
      onHide={() => setVisible(false)}
      draggable={false}
    >
      <Formik
        onSubmit={onSubmitHandler}
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        {({ handleSubmit, setFieldValue }) => (
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-3">
              <label htmlFor="item_code">
                Item Code <span className="text-red-500 text-sm">*</span>
              </label>
              <Field
                as="select"
                name="item_code"
                id="item_code"
                className="w-full px-5 py-2 rounded-md outline-none border-1 border"
                onChange={(e) => {
                  handleItemCodeChange(e, setFieldValue);
                  setFieldValue("item_code", e.target.value);
                }}
              >
                <option value="" disabled>
                  Select Item Code
                </option>
                {isChemicalsLoading ? (
                  <option disabled>Loading items...</option>
                ) : (
                  chemicalsData?.items?.map((item) => (
                    <option key={item._id} value={item.item_code}>
                      {item.item_code}
                    </option>
                  ))
                )}
              </Field>
              <ErrorMessage
                name="item_code"
                component="p"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Read-only fields */}
            <div className="mb-3">
              <label htmlFor="item_name">Item Name</label>
              <Field
                name="item_name"
                id="item_name"
                type="text"
                className="w-full px-5 py-2 rounded-md outline-none border-1 border"
                readOnly
              />
            </div>

            <div className="mb-3">
              <label htmlFor="current_quantity">Current Quantity</label>
              <Field
                name="current_quantity"
                id="current_quantity"
                type="number"
                className="w-full px-5 py-2 rounded-md outline-none border-1 border"
                readOnly
              />
            </div>

            <div className="mb-3">
              <label htmlFor="issued_quantity">
                Issued Quantity <span className="text-red-500 text-sm">*</span>
              </label>
              <Field
                name="issued_quantity"
                id="issued_quantity"
                type="number"
                className="w-full px-5 py-2 rounded-md outline-none border-1 border"
              />
              <ErrorMessage
                name="issued_quantity"
                component="p"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="date_issued">
                Date Issued <span className="text-red-500 text-sm">*</span>
              </label>
              <Field
                name="date_issued"
                id="date_issued"
                type="date"
                className="w-full px-5 py-2 rounded-md outline-none border-1 border"
              />
            </div>


            <Button
              type="submit"
              className="w-full bg-blue-900 text-center text-white py-3 flex items-center justify-center"
              disabled={isLoading || isChemicalsLoading}
            >
              {isLoading ? "Logging..." : "Add Log"}
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
