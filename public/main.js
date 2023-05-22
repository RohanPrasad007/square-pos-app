const { app, BrowserWindow, ipcMain } = require("electron");
const isDev = require("electron-is-dev");
const fs = require("fs");
const path = require("path");

let mainWindow;

const createWindow = async () => {
  // Create the browser window.
//   const iconPath = path.join(__dirname, "/logo_white.png");

  mainWindow = new BrowserWindow({
    // icon: iconPath,
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
