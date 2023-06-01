import React, { useEffect, useState } from "react";
import generatePDF from "../service/Invoice";

function Invioces({ setLoading }) {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const getDate = async () => {
      setLoading(true);
      let invoices = await window.api.getInvoices();
      setInvoices(invoices);
      setLoading(false);
    };
    getDate();
  }, []);

  const print = async (invoice) => {
    setLoading(true);
    let customer = await window.api.getCustomer(
      invoice.primaryRecipient.customerId
    );
    let vehicleNo = "";
    let vehicleModel = "";
    if (customer) {
      const note = JSON.parse(customer.note);
      vehicleNo = note.vehicleNumber;
      vehicleModel = note.vehicaleName;
    }

    let items = await window.api.getOrder(invoice.orderId);
    const bill = {
      invoiceNo: invoice.invoiceNumber,
      date: new Date(invoice.createdAt),
      customer: {
        name: invoice.primaryRecipient.givenName,
        vehicleNo: vehicleNo,
        vehicleModel: vehicleModel,
        phoneNo: invoice.primaryRecipient.phoneNumber,
      },
      items: items,
    };
    generatePDF(bill);
    setLoading(false);
  };

  return (
    <div className="px-4 pt-8 mb-8">
      <div className="rounded-lg overflow-hidden divide-gray-200">
        <table className="min-w-full divide-y">
          <thead className="bg-[#E75B4E] text-white">
            <tr>
              <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">
                Invoice No
              </th>
              <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">
                Customer Name
              </th>
              <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y bg-[#ECF2FC]">
            {invoices.map((invoice) => (
              <tr>
                <td className="px-6 py-3">{invoice.invoiceNumber}</td>
                <td className="px-6 py-3">
                  {new Date(invoice.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-3">
                  {invoice.primaryRecipient.givenName}
                </td>
                <td className="px-6 py-3">
                  <button
                    className="py-2 px-4 rounded-lg text-white font-semibold shadow-md bg-[#316789] hover:bg-white hover:text-[#316789] transition-all duration-200 ease-linear"
                    onClick={() => print(invoice)}
                  >
                    Print
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Invioces;
