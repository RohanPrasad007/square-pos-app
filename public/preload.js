const { contextBridge, ipcRenderer } = require("electron");

const WINDOW_API = {
  makeOrder: (invoice, customerId) =>
    ipcRenderer.invoke("makeOrder", invoice, customerId),
  addCustomer: (customer) => ipcRenderer.invoke("addCustomer", customer),
  getCustomers: () => ipcRenderer.invoke("getCustomers"),
  getInvoices: () => ipcRenderer.invoke("getInvoices"),
  getCustomer: (customerId) => ipcRenderer.invoke("getCustomer", customerId),
  getOrder: (orderId) => ipcRenderer.invoke("getOrder", orderId),
};

contextBridge.exposeInMainWorld("api", WINDOW_API);
