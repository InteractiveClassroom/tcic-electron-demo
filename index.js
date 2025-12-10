const TCIC = require('tcic-electron-sdk');
const path = require('path');
const { session } = require('electron');
const { app, BrowserWindow, ipcMain, Menu } = require('electron');


let homeWindow;

function createWindow () {   
  app.commandLine.appendSwitch('ignore-certificate-errors');
  // 创建浏览器窗口
  homeWindow = new BrowserWindow({
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
  homeWindow.loadFile('index.html');
  homeWindow.webContents.openDevTools(); 
}

let useWebMode = false;

ipcMain.on('useWebMode', (event, arg) => {
  event.reply('useWebMode', 'ok'); // 回复消息
  console.log('useWebMode', arg);
  useWebMode = true;
});


ipcMain.on('toClass', (event, arg) => {
  event.reply('toClass', 'ok'); // 回复消息
  if (useWebMode) {
    homeWindow.loadURL(`https://class.qcloudclass.com/latest/class.html?classid=${arg.classid}&userid=${arg.userid}&token=${arg.token}&electronIframe=true`);
    return;
  } 
  TCIC.initialize({
    classId: arg.classid,
    userId: arg.userid,
    token: arg.token,
    // 主窗口 domReady 时触发
    onReady: (mainWindow) => {
      console.log('TCIC ready', mainWindow);
      session.defaultSession.cookies.set({
        url: 'https://class.qcloudclass.com',
        name: 'custom_token',
        value: 'custom.value',
      });
    },
  });
});
app.whenReady().then(createWindow);
console.log('TCIC START', TCIC);
