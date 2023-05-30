import jsPDF from "jspdf";
import "jspdf-autotable";

// create a function to generate the PDF
function generatePDF(bill) {
  // create a new PDF document
  const doc = new jsPDF();

  doc.addImage("./assets/logo.png", "PNG", 15, 10, 100, 20);
  doc.setFontSize(10);
  doc.text("Invoice", 195, 45, null, null, "right");
  doc.text(`Invoice No: ${bill.invoiceNo}`, 195, 50, null, null, "right");
  doc.text(
    `Date : ${bill.date.toLocaleDateString("en-IN")}`,
    195,
    55,
    null,
    null,
    "right"
  );

  doc.text(
    "Shop No.- 04, Sachi Apartment, Behind Shetkari Samaj Hall\nSec-04 A, Koparkhairane, Navi Mumbai-400709\nPhone- 9004703190",
    15,
    45
  );

  doc.text(
    `Bill To:\n${bill.customer.name}\n${bill.customer.vehicleNo}\n${bill.customer.vehicleModel}\nPhone - ${bill.customer.phoneNo}`,
    15,
    60
  );

  // define the table headers and data
  const headers = [
    "Sr No",
    "Description",
    "QTY",
    "MRP",
    "Discount",
    "Discounted Price",
    "You Save",
    "Amount",
  ];

  const [data, amount, save] = getData(bill.items);

  // set the position of the first line of text
  let y = 85;

  // add the table headers to the PDF
  doc.autoTable({
    head: [headers],
    body: data,
    // showFoot: "lastPage",
    foot: [["", "", "Total", "", "", "", `${save}`, `${amount}`]],
    startY: y,
    headStyles: {
      fillColor: "#E75B4E",
      textColor: "#ffffff",
    },
    footStyles: {
      fillColor: "#316789",
      textColor: "#ffffff",
    },
  });

  // Add text to the bottom of the PDF
  const thankYou = "Glad To Serve You.";
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor("#000000");
  doc.text(
    thankYou,
    doc.internal.pageSize.getWidth() / 2,
    doc.autoTable.previous.finalY + 10,
    { align: "center" }
  );

  const pageHeight = doc.internal.pageSize.getHeight();
  const yPos = pageHeight - 10;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Pay online", 15, yPos);
  doc.text(`To pay your invoice go to ${bill.payemntLink}`, 15, yPos + 5);

  doc.autoPrint();
  doc.output("dataurlnewwindow");
}

const getData = (items) => {
  let totalAmount = 0;
  let totalSave = 0;
  let data = [];
  items.forEach((element, i) => {
    let discountePrice = element.mrp - (element.mrp * element.discount) / 100;
    let youSave = ((element.mrp * element.discount) / 100) * element.quantity;
    let amount = discountePrice * element.quantity;

    let row = [];
    row.push(i + 1);
    row.push(element.description);
    row.push(element.quantity);
    row.push(element.mrp);
    row.push(element.discount);
    row.push(discountePrice.toFixed(2));
    row.push(youSave.toFixed(2));
    row.push(amount.toFixed(2));

    data.push(row);
    totalAmount = totalAmount + amount;
    totalSave = totalSave + youSave;
  });
  return [data, totalAmount.toFixed(2), totalSave.toFixed(2)];
};

export default generatePDF;
