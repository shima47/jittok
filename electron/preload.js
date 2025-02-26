// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  showMsg: (msg) => ipcRenderer.invoke('showMsg', msg),
});