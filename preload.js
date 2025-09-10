const { ipcRenderer, contextBridge } = require('electron');
contextBridge.exposeInMainWorld('sdk', {
  createClass: ({
    classid,
    userid,
    token
  }) => {
    ipcRenderer.send('toClass', {
      classid,
      userid,
      token
    });
  },
  // 除函数之外，我们也可以暴露变量
});

contextBridge.exposeInMainWorld('joinClassBySign', (params) => {
  console.log('joinClassBySign', params);
  ipcRenderer.send('toClass', params);
});
