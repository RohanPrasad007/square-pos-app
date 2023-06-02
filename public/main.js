const { app, BrowserWindow, ipcMain } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");

const { uuid } = require("uuidv4");
const { Client, Environment } = require("square");

let mainWindow;

const createWindow = async () => {
  // Create the browser window.
  const iconPath = path.join(__dirname, "./assets/icon.png");

  mainWindow = new BrowserWindow({
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: true,
    },
  });

  mainWindow.maximize();

  // and load the index.html of the app.
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : path.join(app.getAppPath(), "build", "index.html")
  );

  // Open the DevTools.
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  const gotTheLock = app.requestSingleInstanceLock();

  if (!gotTheLock) {
    // If the app is already running, quit this instance
    app.quit();
  } else {
    // If the lock is acquired, create a new BrowserWindow instance for the app
    app.on("second-instance", (event, commandLine, workingDirectory) => {
      // If a second instance is launched, focus the existing instance's window
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
      }
    });
  }
};

app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

const client = new Client({
  environment: Environment.Sandbox,
  accessToken:
    "EAAAEJOABtcvjyz4mjpqKFZE_K05FMf7ZdJm0Xyty-7yyZWqDNFt0aqvHR20QPYn",
});

const getInovoiceNumber = async () => {
  try {
    const response = await client.invoicesApi.listInvoices(
      "L5SQC39NFMN4G",
      undefined,
      1
    );

    return (parseInt(response.result.invoices[0].invoiceNumber) + 1).toString();
  } catch (error) {
    console.log(error);
  }
};

const publicInvoice = async (invoiceId, version) => {
  const idempotencyKey = uuid();

  try {
    const response = await client.invoicesApi.publishInvoice(invoiceId, {
      version: version,
      idempotencyKey: idempotencyKey,
    });

    const paymentLink = response.result.invoice.publicUrl;
    return paymentLink;
  } catch (error) {
    console.log(error);
  }
};

const createInvoice = async (orderId, customerId) => {
  const idempotencyKey = uuid();

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const invoiceNumber = await getInovoiceNumber();

  const rfc3339Date = tomorrow.toISOString().split("T")[0];
  try {
    const response = await client.invoicesApi.createInvoice({
      invoice: {
        locationId: "L5SQC39NFMN4G",
        orderId: orderId,
        primaryRecipient: {
          customerId: customerId,
        },
        paymentRequests: [
          {
            requestType: "BALANCE",
            dueDate: rfc3339Date,
            automaticPaymentSource: "NONE",
          },
        ],
        deliveryMethod: "EMAIL",
        invoiceNumber: invoiceNumber,
        acceptedPaymentMethods: {
          card: true,
          bankAccount: true,
        },
        saleOrServiceDate: rfc3339Date,
      },
      idempotencyKey: idempotencyKey,
    });

    let payemntLink = await publicInvoice(
      response.result.invoice.id,
      response.result.invoice.version
    );
    return [payemntLink, invoiceNumber];
  } catch (error) {
    console.log(error);
  }
};

ipcMain.handle("makeOrder", async (event, invoice, customerId) => {
  const idempotencyKey = uuid();

  const lineItem = [];
  const discounts = [];

  invoice.forEach((element) => {
    let appliedDiscounts = [];
    if (element.discount !== 0) {
      const discount = {
        uid: element.discount,
        name: element.discount,
        type: "FIXED_PERCENTAGE",
        percentage: element.discount,
        scope: "LINE_ITEM",
      };
      discounts.push(discount);

      appliedDiscounts = [
        {
          discountUid: element.discount,
        },
      ];
    }

    let item = {
      name: element.description,
      quantity: element.quantity,
      metadata: {
        partNo: "ME234",
      },
      appliedDiscounts: appliedDiscounts,
      basePriceMoney: {
        amount: element.mrp * 100,
        currency: "USD",
      },
    };
    lineItem.push(item);
  });

  try {
    const response = await client.ordersApi.createOrder({
      order: {
        locationId: "L5SQC39NFMN4G",
        customerId: customerId,
        lineItems: lineItem,
        discounts: discounts,
      },
      idempotencyKey: idempotencyKey,
    });

    const [paymentLink, invoiceNumber] = await createInvoice(
      response.result.order.id,
      customerId
    );
    return [paymentLink, invoiceNumber];
  } catch (error) {
    console.log(error);
  }
});
ipcMain.handle("addCustomer", async (event, customer) => {
  const idempotencyKey = uuid();
  let note = {
    vehicleNumber: customer.vehicleNumber,
    vehicaleName: customer.vehicleName,
  };
  note = JSON.stringify(note);

  try {
    await client.customersApi.createCustomer({
      idempotencyKey: idempotencyKey,
      givenName: customer.name,
      familyName: customer.name,
      nickname: customer.name,
      emailAddress: customer.email,
      address: {
        addressLine1: customer.address,
        postalCode: customer.pincode,
        country: "US",
      },
      phoneNumber: customer.phone,
      note: note,
    });
  } catch (error) {
    console.log(error);
  }
});

ipcMain.handle("getCustomers", async () => {
  try {
    const response = await client.customersApi.listCustomers();
    return response.result.customers;
  } catch (error) {
    console.log(error);
  }
});

ipcMain.handle("getInvoices", async () => {
  try {
    const response = await client.invoicesApi.listInvoices("L5SQC39NFMN4G");
    return response.result.invoices;
  } catch (error) {
    console.log(error);
  }
});

ipcMain.handle("getCustomer", async (event, customerId) => {
  try {
    const response = await client.customersApi.retrieveCustomer(customerId);
    return response.result.customer;
  } catch (error) {
    console.log(error);
  }
});

ipcMain.handle("getOrder", async (event, orderId) => {
  try {
    const response = await client.ordersApi.retrieveOrder(orderId);

    const items = [];

    if (response.result.order.lineItems !== undefined) {
      response.result.order.lineItems.forEach((element) => {
        const item = {
          description: element.name,
          quantity: parseInt(element.quantity),
          mrp: parseInt(element.basePriceMoney.amount) / 100,
          discount: parseInt(element.appliedDiscounts[0].discountUid),
          amount: parseInt(element.totalMoney.amount) / 100,
        };
        items.push(item);
      });
    }
    return items;
  } catch (error) {
    console.log(error);
    return [];
  }
});
