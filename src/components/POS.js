import React, { useEffect, useState } from "react";
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
  const [activeRowIndex, setActiveRowIndex] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    document.getElementById("cell-0-description").focus();
  }, []);

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
    let total = 0;
    updatedItems.forEach((element) => {
      total += parseFloat(element["amount"]);
    });
    setTotalAmount(total);
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
          <div>{totalAmount.toFixed(2)}</div>
        </div>
      </div>
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
