const path = require("path");
const { app, BrowserWindow, ipcMain } = require("electron");
const { listTasks } = require("./commandAllowlist");
const { startTask, cancelTask } = require("./taskRunner");

function createWindow() {
  const win = new BrowserWindow({
    width: 920,
    height: 620,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js")
    }
  });

  ipcMain.handle("task:list", () => listTasks());
  ipcMain.handle("task:start", (_event, payload) => startTask(payload.taskId, (item) => win.webContents.send("task:event", item)));
  ipcMain.handle("task:cancel", (_event, payload) => cancelTask(payload.runId, (item) => win.webContents.send("task:event", item)));

  win.loadFile(path.join(__dirname, "../renderer/index.html"));
}

app.whenReady().then(createWindow);

