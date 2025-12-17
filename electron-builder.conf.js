const fs = require('fs');
const path = require('path');
const { Arch } = require('electron-builder');
const pkg = require('./package.json');

/**
 * electron-builder 配置
 * 复用 package.json 中的 build 配置，并在 afterPack 阶段
 * 将 dist/mac/<app>.app/Contents/Resources/app.asar.unpacked/node_modules/trtc-electron-sdk
 * 下的 trtc_electron_sdk.node 替换为 x64 目录下的版本。
 */
module.exports = {
  // 复用 package.json 中原有的 build 配置
  ...pkg.build,

  /**
   * 在打包好的应用目录中替换 trtc_electron_sdk.node
   */
  afterPack: async (context) => {
    const { electronPlatformName, appOutDir, arch } = context;

    // 只在 mac x64 打包时处理
    if (electronPlatformName !== 'darwin' || arch !== Arch.x64) {
      console.log('[afterPack] 非 mac x64 构建，跳过 trtc_electron_sdk.node 替换');
      return;
    }

    // app 名称（例如 tcic-demo 或带空格的名字），由 electron-builder 计算
    const appFilename = context.packager.appInfo.productFilename;

    // dist/mac/<appFilename>.app
    const appBundlePath = path.join(appOutDir, `${appFilename}.app`);

    // dist/mac/<app>.app/Contents/Resources/app.asar.unpacked/node_modules/trtc-electron-sdk/build/Release
    const sdkReleaseDir = path.join(
      appBundlePath,
      'Contents',
      'Resources',
      'app.asar.unpacked',
      'node_modules',
      'trtc-electron-sdk',
      'build',
      'Release'
    );

    const sourceNodePath = path.join(sdkReleaseDir, 'x64', 'trtc_electron_sdk.node');
    const targetNodePath = path.join(sdkReleaseDir, 'trtc_electron_sdk.node');

    if (!fs.existsSync(sourceNodePath)) {
      console.warn('[afterPack] x64 trtc_electron_sdk.node 不存在，跳过替换：', sourceNodePath);
      return;
    }

    if (!fs.existsSync(sdkReleaseDir)) {
      console.warn('[afterPack] trtc-electron-sdk build/Release 目录不存在，跳过替换：', sdkReleaseDir);
      return;
    }

    try {
      console.log('[afterPack] 替换 trtc_electron_sdk.node 为 x64 版本');
      await fs.promises.copyFile(sourceNodePath, targetNodePath);
      console.log('[afterPack] 替换成功：', sourceNodePath, '->', targetNodePath);
    } catch (error) {
      console.error('[afterPack] 替换 trtc_electron_sdk.node 失败：', error);
    }
  },
};
