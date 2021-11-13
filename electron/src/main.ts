import { app, BrowserWindow, ipcMain } from 'electron';
import * as remote from '@electron/remote/main';
import * as path from 'path';
import * as url from 'url';

const setupEvents = require('./setupEvents');

var win: BrowserWindow;
var splash: BrowserWindow;

function createWindow() {
  remote.initialize();
  if (setupEvents.handleSquirrelEvent()) {
    return false; 
  }
  splash = new BrowserWindow({ 
    width: 448, 
    height: 240, 
    fullscreen: false, 
    webPreferences: { 
      nodeIntegration: true,
      webSecurity: false,
      devTools: false 
    },
    icon: path.join(__dirname, 'icon.png'),
    darkTheme: true, 
    frame: false, 
    titleBarStyle: 'hidden',
    alwaysOnTop: true,
    fullscreenable: false,
    maximizable: false,
    minimizable: false,
    movable: false,
    backgroundColor: '#FFFFFF',
    transparent: false,
    resizable: false,
    show: false
  });
  splash.loadURL(url.format({pathname: path.join(__dirname, './splash/index.html'), protocol: 'file:', slashes: true }) );
  splash.on('closed', ()=>{ splash = null; });
  splash.webContents.once('dom-ready', ()=>{
    splash.show();
    win = new BrowserWindow({
      fullscreen: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        webSecurity: false,
        enableRemoteModule: true,
        devTools: true
      },
      icon: path.join(__dirname, 'icon.png'),
      darkTheme: false,
      frame: false,
      titleBarStyle: 'hidden',
      show: false,
      minWidth: 886,
      minHeight: 619,
      fullscreenable: false
    });
    win.loadURL(url.format({pathname: path.join(__dirname, './www/index.html'), protocol: 'file:', slashes: true }));
    win.on('closed', ()=>{ win = null; });
    
    win.webContents.once('dom-ready', ()=>{
      setTimeout(()=>{
        win.show();
        splash.destroy();
      }, 1000);
    });
  });
  ipcMain.on('reload', (e)=>{
    win.destroy();
    app.relaunch();
  });
}

app.on('ready', createWindow);
app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});