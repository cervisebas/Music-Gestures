const { createWindowsInstaller } = require('electron-winstaller');
const path = require('path');
var pkg = require('../build/package.json');

getInstallerConfig()
  .then(createWindowsInstaller)
  .catch((error) => {
    console.error(error.message || error);
    process.exit(1);
  });

function getInstallerConfig() {
  console.log('creating windows installer');
  return Promise.resolve({
    appDirectory: `./electron/electron-packager/${pkg.name}-win32-ia32/`,
    authors: pkg.author,
    noMsi: true,
    outputDirectory: './electron/windows-installer',
    exe: `${pkg.name}.exe`,
    setupExe: `${pkg.name}-${pkg.version}.exe`,
    setupMsi: `${pkg.name}-${pkg.version}.msi`,
    setupIcon: 'electron/build-res/icon.ico'
  });
}