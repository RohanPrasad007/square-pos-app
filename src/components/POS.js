import React, { useEffect, useState } from "react";
import generatePDF from "../service/Invoice";
import { Autocomplete, Dialog, InputAdornment, TextField } from "@mui/material";
import Alert from "./Alert";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import AddCustomer from "./AddCustomer";

function POS({ setLoading }) {
  const [items, setItems] = useState([
    {
      description: "",
      partNo: "",
      quantity: "",
      mrp: "",
      discount: "",
      amount: "",
    },
  ]);
  const [activeRowIndex, setActiveRowIndex] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [openAlert, setOpenAlert] = useState(false);
  const [openAddCustomer, setOpenAddCustomer] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    getCustomers();
    document.getElementById("cell-0-description").focus();
  }, []);

  const getCustomers = async () => {
    setLoading(true);
    const customers = await window.api.getCustomers();
    setCustomers(customers);
    setLoading(false);
  };

  const save = async () => {
    setLoading(true);
    items.pop();
    let [paymentLink, invoiceNo] = await window.api.makeOrder(
      items,
      selectedCustomer.id
    );
    const note = JSON.parse(selectedCustomer.note);
    const bill = {
      invoiceNo: invoiceNo,
      date: new Date(),
      customer: {
        name: selectedCustomer.givenName,
        vehicleNo: note.vehicleNumber,
        vehicleModel: note.vehicaleName,
        phoneNo: selectedCustomer.phoneNumber,
      },
      items: items,
      payemntLink: paymentLink,
    };
    generatePDF(bill);
    setItems([
      {
        description: "",
        quantity: "",
        mrp: "",
        discount: "",
        amount: "",
      },
    ]);
    setTotalAmount(0);
    setLoading(false);
  };

  const handleInputChange = (e, rowIndex, field) => {
    const updatedItems = [...items];
    updatedItems[rowIndex][field] = e.target.value;

    const quantity = parseInt(updatedItems[rowIndex]["quantity"]) || 0;
    const mrp = parseFloat(updatedItems[rowIndex]["mrp"]) || 0;
    const discount = parseFloat(updatedItems[rowIndex]["discount"]) || 0;
    const amount = (quantity * mrp * (100 - discount)) / 100;
    updatedItems[rowIndex]["amount"] = amount.toFixed(2);

    setItems(updatedItems);
    let total = 0;
    updatedItems.forEach((element) => {
      total += parseFloat(element["amount"]);
    });
    setTotalAmount(total);
  };

  const handleKeyPress = (e, rowIndex, field) => {
    if (e.key === "Enter") {
      if (field === "description" && e.target.value === "") {
        handleOpenAlert();
      } else {
        let nextRowIndex = rowIndex;
        let nextField = "";

        switch (field) {
          case "description":
            nextField = "quantity";
            break;
          case "quantity":
            if (e.target.value === "") {
              items[rowIndex]["quantity"] = 0;
              setItems([...items]);
            }
            nextField = "mrp";
            break;
          case "mrp":
            if (e.target.value === "") {
              items[rowIndex]["mrp"] = 0;
              setItems([...items]);
            }
            nextField = "discount";
            break;
          case "discount":
            if (e.target.value === "") {
              items[rowIndex]["discount"] = 0;
              setItems([...items]);
            }
            nextField = "amount";
            break;
          case "amount":
            nextRowIndex += 1;
            nextField = "description";
            break;
          default:
            break;
        }

        if (nextRowIndex === items.length) {
          const newLine = {
            description: "",
            quantity: "",
            mrp: "",
            discount: "",
            amount: "",
          };
          setItems([...items, newLine]);
        }

        const nextCell = document.querySelector(
          `#cell-${nextRowIndex}-${nextField}`
        );
        if (nextCell) {
          nextCell.focus();
        }
      }
    } else if (
      e.key === "Backspace" &&
      (e.target.value === "" || field === "amount")
    ) {
      let previousRowIndex = rowIndex;
      let previousField = "";

      switch (field) {
        case "description":
          previousField = "amount";
          previousRowIndex -= 1;
          break;
        case "quantity":
          previousField = "description";
          break;
        case "mrp":
          previousField = "quantity";
          break;
        case "discount":
          previousField = "mrp";
          break;
        case "amount":
          previousField = "discount";
          break;
        default:
          break;
      }

      const previousCell = document.querySelector(
        `#cell-${previousRowIndex}-${previousField}`
      );
      if (previousCell) {
        previousCell.focus();
      }
    }
  };

  const handleOpenAlert = () => {
    setOpenAlert(true);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const handleOpenAddCustomer = () => {
    setOpenAddCustomer(true);
  };

  const handleCloseAddCustomer = () => {
    setOpenAddCustomer(false);
  };

  const handleCustomerChange = (event, value) => {
    setSelectedCustomer(value);
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-4 pb-8 pt-4">
        <div className="flex-1">
          <Autocomplete
            id="search-input"
            options={customers}
            getOptionLabel={(option) =>
              `${option.givenName} - ${option.phoneNumber}`
            }
            value={selectedCustomer}
            onChange={handleCustomerChange}
            renderInput={(params) => (
              <div>
                <TextField
                  {...params}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  className="block w-full rounded-md bg-white border border-gray-300 shadow-sm !p-3  sm:text-sm"
                  variant="standard"
                  placeholder="Search Customer"
                />
              </div>
            )}
          />
        </div>
        <div
          className="text-[#305169] cursor-pointer"
          onClick={() => handleOpenAddCustomer()}
        >
          <AddCircleOutlinedIcon fontSize="large" />
        </div>
      </div>
      <div className="rounded-lg overflow-hidden divide-gray-200">
        <table className="min-w-full divide-y">
          <thead className="bg-[#E75B4E] text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                MRP
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Discount %
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y bg-[#EAEDF2]">
            {items.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`h-10 ${
                  activeRowIndex === rowIndex ? "bg-white rounded-xl" : ""
                }`}
              >
                <td className="h-10 whitespace-nowrap">
                  <input
                    id={`cell-${rowIndex}-${"description"}`}
                    className={`w-full h-full px-6  outline-none focus:border-2 focus:border-[#316789
                    ] focus:shadow-2xl rounded-lg  ${
                      activeRowIndex === rowIndex ? "bg-white" : "bg-[#EAEDF2]"
                    }`}
                    type="text"
                    value={row.description}
                    onFocus={() => setActiveRowIndex(rowIndex)}
                    onChange={(e) =>
                      handleInputChange(e, rowIndex, "description")
                    }
                    onKeyDown={(e) =>
                      handleKeyPress(e, rowIndex, "description")
                    }
                  />
                </td>
                <td className="h-10 whitespace-nowrap">
                  <input
                    id={`cell-${rowIndex}-${"quantity"}`}
                    className={`w-full h-full px-6  outline-none focus:border-2 focus:border-[#316789
                    ] focus:shadow-2xl rounded-lg  ${
                      activeRowIndex === rowIndex ? "bg-white" : "bg-[#EAEDF2]"
                    }`}
                    type="number"
                    value={row.quantity}
                    onFocus={() => setActiveRowIndex(rowIndex)}
                    onChange={(e) => handleInputChange(e, rowIndex, "quantity")}
                    onKeyDown={(e) => handleKeyPress(e, rowIndex, "quantity")}
                  />
                </td>
                <td className="h-10 whitespace-nowrap">
                  <input
                    id={`cell-${rowIndex}-${"mrp"}`}
                    className={`w-full h-full px-6  outline-none focus:border-2 focus:border-[#316789
                    ] focus:shadow-2xl rounded-lg  ${
                      activeRowIndex === rowIndex ? "bg-white" : "bg-[#EAEDF2]"
                    }`}
                    type="number"
                    value={row.mrp}
                    onFocus={() => setActiveRowIndex(rowIndex)}
                    onChange={(e) => handleInputChange(e, rowIndex, "mrp")}
                    onKeyDown={(e) => handleKeyPress(e, rowIndex, "mrp")}
                  />
                </td>
                <td className="h-10 whitespace-nowrap">
                  <input
                    id={`cell-${rowIndex}-${"discount"}`}
                    className={`w-full h-full px-6  outline-none focus:border-2 focus:border-[#316789
                    ] focus:shadow-2xl rounded-lg  ${
                      activeRowIndex === rowIndex ? "bg-white" : "bg-[#EAEDF2]"
                    }`}
                    type="number"
                    value={row.discount}
                    onFocus={() => setActiveRowIndex(rowIndex)}
                    onChange={(e) => handleInputChange(e, rowIndex, "discount")}
                    onKeyDown={(e) => handleKeyPress(e, rowIndex, "discount")}
                  />
                </td>
                <td className="h-10 whitespace-nowrap">
                  <input
                    id={`cell-${rowIndex}-${"amount"}`}
                    className={`w-full h-full px-6  outline-none focus:border-2 focus:border-[#316789
                    ] focus:shadow-2xl rounded-lg  ${
                      activeRowIndex === rowIndex ? "bg-white" : "bg-[#EAEDF2]"
                    }`}
                    type="number"
                    value={row.amount}
                    onKeyDown={(e) => handleKeyPress(e, rowIndex, "amount")}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="bg-[#316789] text-white text-xl py-4 px-6 flex justify-end gap-20 items-center">
          <div>Total Amount</div>
          <div>${totalAmount.toFixed(2)}</div>
        </div>
      </div>
      <Dialog
        onClose={handleCloseAlert}
        open={openAlert}
        PaperProps={{
          style: {
            backgroundColor: "transparent",
          },
        }}
      >
        <Alert save={save} handleCloseAlert={handleCloseAlert} />
      </Dialog>

      <Dialog
        onClose={handleCloseAddCustomer}
        open={openAddCustomer}
        PaperProps={{
          style: {
            backgroundColor: "transparent",
          },
        }}
        maxWidth="lg"
      >
        <AddCustomer
          handleCloseAddCustomer={handleCloseAddCustomer}
          setLoading={setLoading}
          getCustomers={getCustomers}
        />
      </Dialog>
    </div>
  );
}

export default POS;
