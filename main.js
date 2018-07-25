const electron = require('electron')
const app = electron.app
var express = require('./board');
const BrowserWindow = electron.BrowserWindow;

const path = require('path')
const url = require('url')

let mainWindow;

function createWindow() {
 //   express();
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    });

   mainWindow.loadURL('http://localhost:3000');
   mainWindow.focus();

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})

app.on('activate', function () {

    if (mainWindow === null) {
        createWindow();
    }
});