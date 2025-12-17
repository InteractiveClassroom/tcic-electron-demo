const TCIC = require('tcic-electron-sdk');
const path = require('path');
const { session } = require('electron');
const { app, BrowserWindow, ipcMain, Menu } = require('electron');


let homeWindow;
let useWebMode = false;

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

// 自定义 js 与主进程通信
// TCIC.SDK.instance.sendCustomMessage({xxx: 11111})
// TCIC.SDK.instance.on(TCIC.TMainEvent.Recv_Custom_Msg, (evt) => console.log('custom msg', evt));

// 主进程
ipcMain.on('onRecvCustomMessage', (event, arg) => {
  console.log('onRecvCustomMessage', arg);
  if (tcicWindow) {
    console.log('sendCustomMessage');
    const tcicViews = tcicWindow.getBrowserViews();
    console.log('tcicViews', tcicViews);
    tcicViews[0].webContents.send('sendCustomMessage', `[main process] ${JSON.stringify(arg)}`);
  }
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
