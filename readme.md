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
⚠️ 注意：虚拟背景需要在打包后才能生效，开发时虚拟背景无效
#### 自定义虚拟背景

如果需要自定义虚拟背景，请在项目下创建 img目录，并提供图片和一个 virtual-bg.js用于返回图片路径信息
在打包时将 img目录打包到 resource目录下，具体方法可参考这个分支: https://github.com/InteractiveClassroom/tcic-electron-demo/tree/feat/xmagic
