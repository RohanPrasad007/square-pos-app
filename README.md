## App Overview

This Electron app for the two-wheeler spare part shop is a project made for the Square Developer Hackathon 2023. It is a point-of-sale (POS) solution designed to streamline the billing process and improve customer transactions. It offers a user-friendly interface that enables quick and efficient bill creation and printing.

## Getting Started

### Installation

To install the app follow these steps:

#### Option 1: Download the Installation Package

1. Download the installation package for the app from the provided Google Drive link [Link](https://drive.google.com/drive/folders/1GtJczdnv2a4ow3avEk703qfMclQX_KUR?usp=sharing).
2. Locate the downloaded file and double-click it to start the installation process.
3. Follow the on-screen instructions to complete the installation.

#### Option 2: Clone the Repository and Run the Command

1. Clone the repository from [GitHub repository](https://github.com/RohanPrasad007/square-pos-app) to your local machine.
2. Open a command prompt or terminal and navigate to the cloned repository's directory.
3. Run the following command to install the necessary dependencies:
   `npm install `
4. Once the dependencies are installed, run the following command to start the Electron app:
   `npm run electron:serve `

### System Requirements

The Electron app is designed for Windows operating systems.

Note: Please ensure that you have a stable internet connection during app usage for seamless integration with the Square ecosystem.

## User Guide

### Point of Sale (POS) Page

The Point of Sale (POS) page in the Electron app is where users can create bills and manage customer details. Follow these steps to use the POS functionality effectively:

1. **Customer Selection**

   - Search and select an existing customer: Enter the customer's name or phone number with country code in the input field to search for and select an existing customer from the database.
   - Add a new customer: If the customer is not in the database, click the "Add Customer" button to create a new customer profile. Fill in the required details and save the customer information.

2. **Item Entry**
   - Enter item details: In the table below, enter the item description, MRP, and any applicable discounts.
   - Move between fields: Press Enter to move to the next field after entering the description or other item details.
   - Save the invoice: Once all items are added, navigate to the last row and leave the description input field empty. Press Enter to open a dialogue asking if you want to save the invoice. Press "Yes" or use the shortcut (e.g., press "Y") to save the invoice and generate a PDF for printing.

### Invoice Page

The Invoice page allows users to manage and print invoices. Follow these steps to utilize the Invoice page effectively:

1. **View Invoice List**

   - Access the Invoice page: Navigate to the Invoice page from the main menu.
   - View all invoices: The Invoice page displays a list of all invoices generated using the app.

2. **Print Invoice**
   - Select an invoice: Choose the desired invoice from the list.
   - Print the invoice: Click the "Print" button associated with the selected invoice. The invoice PDF will open, ready for printing.

### Video Demo

For a visual walkthrough of the app's functionality, watch the YouTube video demo available at the following link: [YouTube Video Demo](https://youtu.be/2Rw0pV6tBKU)

We hope this User Guide helps you effectively utilize the features of the Electron app.

## Developer Guide

The Developer Guide section provides information and guidelines for developers who want to understand and extend your Electron app's functionality.

### Technologies and Frameworks Used

- Electron
- React
- Tailwind CSS
- Square API
- jsPDF

### Prerequisites

Before working with the app's source code, ensure that you have the following:

- Node.js installed on your development machine.

### Codebase Structure

The codebase of the Electron app is structured as follows:

- **public** folder:

  - **main.js**: The main file of the Electron app.
  - **preload.js**: Contains preload code for Electron.

- **src** folder:
  - **App.js**: The main React app file.
  - **components**: Contains reusable React components used in the app, including:
    - AddCustomer.js
    - Alert.js
    - Header.js
    - Invoices.js
    - Loader.js
    - POS.js
  - **service**: Contains the `Invoice.js` file, which includes code to generate PDF invoices using jsPDF.

### Square API Integration

The Electron app integrates with the Square API to provide various functionalities related to managing customers, creating orders, and generating invoices. The following Square API endpoints are utilized in the application:

#### Create Invoice

The `createInvoice` function is used to create an invoice for a given order and customer. It performs the following steps:

1. Generates a unique idempotency key using the `uuid` library.
2. Calculates the invoice number and the due date for the invoice.
3. Calls the `createInvoice` endpoint of the Square API with the necessary invoice data, including the location, order, customer, payment requests, delivery method, invoice number, and accepted payment methods.
4. Retrieves the payment link for the created invoice using the `publicInvoice` function.
5. Returns the payment link and invoice number.

#### Create Order

The `makeOrder` function is responsible for creating an order with line items and discounts. It follows these steps:

1. Generates a unique idempotency key using the `uuid` library.
2. Processes each item in the invoice and applies discounts if available.
3. Constructs the line items array with information such as the item name, quantity, metadata, applied discounts, and base price.
4. Calls the `createOrder` endpoint of the Square API with the location, customer ID, line items, and discounts.
5. Invokes the `createInvoice` function to generate an invoice and retrieve the payment link and invoice number.
6. Returns the payment link and invoice number.

#### Add Customer

The `addCustomer` function is used to create a new customer in the Square API. It performs the following steps:

1. Generates a unique idempotency key using the `uuid` library.
2. Constructs a JSON object for the customer's note based on the provided information.
3. Calls the `createCustomer` endpoint of the Square API with the necessary customer data, including the idempotency key, name, email address, address, phone number, and note.
4. Returns the created customer object.

#### Get Customers

The `getCustomers` function retrieves a list of all customers from the Square API. It performs a simple call to the `listCustomers` endpoint and returns the list of customers.

#### Get Invoices

The `getInvoices` function fetches a list of invoices from the Square API. It calls the `listInvoices` endpoint with the appropriate location ID and returns the list of invoices.

#### Get Customer

The `getCustomer` function retrieves a specific customer from the Square API based on the provided customer ID. It calls the `retrieveCustomer` endpoint and returns the customer object.

#### Get Order

The `getOrder` function fetches the details of a specific order from the Square API based on the provided order ID. It performs the following steps:

1. Calls the `retrieveOrder` endpoint of the Square API with the order ID.
2. Parses the line items from the order response and constructs an array of items containing the description, quantity, MRP, discount, and amount.
3. Returns the array of items.

These functions utilize the appropriate endpoints of the Square API to interact with customer data, create orders, and generate invoices within the Electron app.

Please refer to the Square API documentation for detailed information on each endpoint and its parameters.

We hope this Developer Guide provides the necessary information for developers to understand and extend the functionality of the Electron app.

### Conclusion

In conclusion, the Electron app developed by Rohan Prasad and designed by Swapnil Angarkhe provides a user-friendly interface for managing customers, creating orders, and generating invoices. The app seamlessly integrates with the Square API to leverage its powerful features and capabilities.

**Authors:**

- Rohan Prasad

  - GitHub: [github.com/RohanPrasad007](https://github.com/RohanPrasad007)

- Swapnil Angarkhe
  - GitHub: [github.com/swapnilAngarkhe](https://github.com/swapnilAngarkhe)

Rohan Prasad, as the developer, implemented the Electron framework along with React, Tailwind CSS, and the Square API to build the app's functionality. Swapnil Angarkhe, as the designer, contributed to the app's user interface and overall design aesthetic.
