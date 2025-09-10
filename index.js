const TCIC = require('tcic-electron-sdk');
const path = require('path');
const { app, BrowserWindow, ipcMain, Menu } = require('electron');

function createWindow () {   
  app.commandLine.appendSwitch('ignore-certificate-errors');
  // 创建浏览器窗口
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  Menu.setApplicationMenu(null);
  // 加载index.html文件
  win.loadFile('index.html');
  win.webContents.openDevTools(); 
}


ipcMain.on('toClass', (event, arg) => {
  event.reply('toClass', 'ok'); // 回复消息
  TCIC.initialize({
    classId: arg.classid,
    userId: arg.userid,
    token: arg.token,
  });
});
app.whenReady().then(createWindow);
console.log('TCIC START', TCIC);
