import { useState } from "react";
import BreadCrumbs from "../../../components/BreadCrumbs";
import RestockModel from "./restock.models.chemicals";
import { GoPlus } from "react-icons/go";
import {
  useGetAllRestockItemsQuery,
  useDeleteRestockItemMutation,
} from "../../../provider/queries/Chemicals.query";
import RestockCard from "./restock.card.chemicals";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { toast } from "sonner";
import { Button } from "primereact/button";

const ChemicalsRestockPage = () => {
  const [visible, setVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [searchParams, setSearchParams] = useState({
    chemical: "",
    purchase_date: "",
    expiration_date: "",
    bill_number: "",
    location: "",
    barcode: "",
  });

  const { data, isLoading, isFetching, refetch } =
    useGetAllRestockItemsQuery(searchParams);

  // Handle search input changes
  const onSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    refetch();
  };

  const [deleteRestockItem] = useDeleteRestockItemMutation();

  const deleteHandler = (_id) => {
    confirmDialog({
      message: `Are you sure you want to delete this restock item?`,
      header: "Confirm Deletion",
      icon: "pi pi-exclamation-triangle",
      footer: (
        <div className="p-dialog-footer">
          <Button
            label="Yes, Delete it"
            icon="pi pi-check"
            className="p-button-danger"
            onClick={async () => {
              try {
                const { data, error } = await deleteRestockItem(_id);
                if (error) {
                  toast.error(error.data.message);
                  return;
                }
                toast.success(data.msg);
                refetch();
              } catch (e) {
                toast.error(e.message);
              } finally {
                setDialogVisible(false);
              }
            }}
          />
          <Button
            label="No, Keep it"
            icon="pi pi-times"
            className="p-button-secondary"
            onClick={() => setDialogVisible(false)}
          />
        </div>
      ),
    });
  };

  return (
    <>
      <div className="w-full flex flex-wrap justify-evenly mt-10">
        <BreadCrumbs PageLink="/Restock" PageName="Restock Items" />

        <div className="mb-3 flex justify-end w-[85%] mx-auto gap-x-6">
          <button
            onClick={() => setVisible(!visible)}
            className="px-4 rounded-md py-2 bg-blue-900 text-white inline-flex items-center gap-x-2"
          >
            Register Restock Item <GoPlus />
          </button>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="mt-10 flex justify-end w-[90%] mx-auto gap-x-4"
        >
          <input
            name="chemical"
            placeholder="Chemical"
            className="w-1/6 p-2 border rounded"
            onChange={onSearchChange}
          />
          <input
            name="purchase_date"
            type="text"
            placeholder="Purchase Date"
            className="w-1/6 p-2 border rounded"
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => (e.target.type = "text")}
            onChange={onSearchChange}
          />
          <input
            name="bill_number"
            placeholder="Bill Number"
            className="w-1/6 p-2 border rounded"
            onChange={onSearchChange}
          />
          <input
            name="location"
            placeholder="Location"
            className="w-1/6 p-2 border rounded"
            onChange={onSearchChange}
          />
          <input
            name="barcode"
            placeholder="Barcode"
            className="w-1/6 p-2 border rounded"
            onChange={onSearchChange}
          />
        </form>

        <div className="w-full pt-10">
          <div className="relative overflow-x-auto shadow">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 border-b uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-2">Chemical</th>
                  <th className="px-4 py-2">Quantity Purchased</th>
                  <th className="px-4 py-2">Purchase Date</th>
                  <th className="px-4 py-2">Supplier</th>
                  <th className="px-4 py-2">Bill Number</th>
                  <th className="px-4 py-2">Cost Per Purchase</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading || isFetching ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      Loading..
                    </td>
                  </tr>
                ) : data && Array.isArray(data) && data.length > 0 ? (
                  data.map((c) => (
                    <RestockCard
                      key={c._id}
                      data={c}
                      onDelete={() => deleteHandler(c._id)}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center px-4 py-2">
                      No items found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <RestockModel visible={visible} setVisible={setVisible} />
        <ConfirmDialog
          visible={dialogVisible}
          onHide={() => setDialogVisible(false)}
        />
      </div>
    </>
  );
};

export default ChemicalsRestockPage;
