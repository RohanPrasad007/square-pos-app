const { contextBridge, ipcRenderer } = require("electron");

const WINDOW_API = {
  makeOrder: (invoice) => ipcRenderer.invoke("makeOrder", invoice),
};

contextBridge.exposeInMainWorld("api", WINDOW_API);
