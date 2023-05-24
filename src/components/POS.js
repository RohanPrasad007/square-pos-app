import React, { useState } from "react";
import generatePDF from "../service/Invoice";
import { Watch } from "react-loader-spinner";

function POS() {
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
  const [loading, setLoading] = useState(false);

  const save = async () => {
    alert("do you save");
    setLoading(true);
    items.pop();
    let paymentLink = await window.api.makeOrder(items);
    const bill = {
      invoiceNo: "INV-001",
      date: new Date(),
      customer: {
        name: "Raj",
        vehicleNo: "MH-12-1234",
        vehicleModel: "Activa",
        phoneNo: "9812345678",
      },
      items: items,
      payemntLink: paymentLink,
    };
    generatePDF(bill);
    setItems([
      {
        description: "",
        partNo: "",
        quantity: "",
        mrp: "",
        discount: "",
        amount: "",
      },
    ]);
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
  };

  const handleKeyPress = (e, rowIndex, field) => {
    if (e.key === "Enter") {
      if (field === "description" && e.target.value === "") {
        save();
      } else {
        let nextRowIndex = rowIndex;
        let nextField = "";

        switch (field) {
          case "description":
            nextField = "quantity";
            break;
          case "quantity":
            nextField = "mrp";
            break;
          case "mrp":
            nextField = "discount";
            break;
          case "discount":
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

  return (
    <div className="p-4">
      <table className="min-w-full divide-y divide-gray-200 ">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              MRP
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Discount %
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  id={`cell-${rowIndex}-${"description"}`}
                  className="w-full"
                  type="text"
                  value={row.description}
                  onChange={(e) =>
                    handleInputChange(e, rowIndex, "description")
                  }
                  onKeyDown={(e) => handleKeyPress(e, rowIndex, "description")}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  id={`cell-${rowIndex}-${"quantity"}`}
                  className="w-full"
                  type="number"
                  value={row.quantity}
                  onChange={(e) => handleInputChange(e, rowIndex, "quantity")}
                  onKeyDown={(e) => handleKeyPress(e, rowIndex, "quantity")}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  id={`cell-${rowIndex}-${"mrp"}`}
                  className="w-full"
                  type="number"
                  value={row.mrp}
                  onChange={(e) => handleInputChange(e, rowIndex, "mrp")}
                  onKeyDown={(e) => handleKeyPress(e, rowIndex, "mrp")}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  id={`cell-${rowIndex}-${"discount"}`}
                  className="w-full"
                  type="number"
                  value={row.discount}
                  onChange={(e) => handleInputChange(e, rowIndex, "discount")}
                  onKeyDown={(e) => handleKeyPress(e, rowIndex, "discount")}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  id={`cell-${rowIndex}-${"amount"}`}
                  className="w-full"
                  type="number"
                  value={row.amount}
                  onKeyDown={(e) => handleKeyPress(e, rowIndex, "amount")}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && (
        <div className="flex justify-center items-center absolute top-0 left-0 w-screen	h-screen bg-gray-200 opacity-70">
          <Watch
            height="80"
            width="80"
            radius="48"
            color="#4fa94d"
            ariaLabel="watch-loading"
            wrapperStyle={{}}
            wrapperClassName=""
            visible={true}
          />
        </div>
      )}
    </div>
  );
}

export default POS;
