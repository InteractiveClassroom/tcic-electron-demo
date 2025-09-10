## TCIC electron demo

### start 

```
npm i
npm start
```
### build

注意不要用 pnpm，实测打包会有问题

```
npm run build
```

### 虚拟背景
如果需要用到虚拟背景，请安装`trtc-electron-plugin-xmagic`插件
```
npm i trtc-electron-plugin-xmagic --save
```
同时在项目根目录下新建'.profile'文件，并配置美颜sdk的 licenseKey
```
XMagicLicenseURL=https://license.vod2.myqcloud.com/license/xxxxxxxxx/v_cube.license
XMagicLicenseKey=xxxxx
```
