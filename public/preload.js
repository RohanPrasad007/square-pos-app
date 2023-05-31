const { contextBridge, ipcRenderer } = require("electron");

const WINDOW_API = {
  makeOrder: (invoice, customerId) =>
    ipcRenderer.invoke("makeOrder", invoice, customerId),
  addCustomer: (customer) => ipcRenderer.invoke("addCustomer", customer),
  getCustomers: () => ipcRenderer.invoke("getCustomers"),
};

contextBridge.exposeInMainWorld("api", WINDOW_API);
