const electron = require('electron');
const path = require('path');
const url = require('url');

const {app} = electron;
const {BrowserWindow} = electron;
const nativeImage = electron.nativeImage;

if (process.env.DEV) {
  const {
    default: installExtension,
    REDUX_DEVTOOLS,
    REACT_DEVELOPER_TOOLS,
  } = require('electron-devtools-installer');

  app.whenReady().then(() => {
    installExtension(REDUX_DEVTOOLS).then((name) =>
      console.log(`Added Extension:  ${name}`),
    );
    installExtension(REACT_DEVELOPER_TOOLS).then((name) =>
      console.log(`Added Extension:  ${name}`),
    );
  });
}

const icon = nativeImage.createFromPath(
    path.join(__dirname, 'app_icon.png')
);
let mainWindow;
/**
 * Create Window.
 */
const createWindow = () => {
  const startUrl = process.env.DEV ?
    'http://localhost:3000' :
    url.format({
      pathname: path.join(__dirname, '/../build/index.html'),
      protocol: 'file:',
      slashes: true,
    });
  mainWindow = new BrowserWindow({
    show: false,
    icon,
    webPreferences: {
      webSecurity: true,
      nodeIntegration: true,
      enableRemoteModule: true,
      nativeWindowOpen: true,
    },
    width: 900,
    height: 600,
    minWidth: 900,
    minHeight: 600,
  });
  // mainWindow.maximize();
  mainWindow.show();

  mainWindow.loadURL(startUrl);
  // process.env.DEV && mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
};

app.on('ready', async () => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
