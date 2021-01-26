const electron = require('electron');
const path = require('path');
const url = require('url');
const {ipcMain} = require('electron');
const loadBalancer = require('electron-load-balancer');

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
function createWindow() {
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
      nodeIntegration: true,
      enableRemoteModule: true,
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
    loadBalancer.stopAll();
    mainWindow = null;
  });
}

app.on('ready', createWindow);

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

/* ---------- Custom code starts here ------------ */

// 1. Register background tasks (the keys will be used for reference later)
loadBalancer.register(ipcMain, {
  preemptive_loop: '/background_tasks/preemptive_loop.html',
  fire_once: '/background_tasks/fire_once.html',
},
{debug: false},
);

// 2. Set up event listeners to bounce message from background to UI
ipcMain.on('PREEMPTIVE_LOOP_RESULT', (event, args) => {
  mainWindow.webContents.send('PREEMPTIVE_LOOP_RESULT', args);
});
ipcMain.on('FIRE_ONCE_RESULT', (event, args) => {
  mainWindow.webContents.send('FIRE_ONCE_RESULT', args);
});
