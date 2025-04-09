import { app, BrowserWindow } from 'electron';
import { USER_AGENT, GEFORCE_NOW_URL, NVIDIA_LOGIN_URL } from './constants.js';

const setAppFlags = () => {
  app.commandLine.appendSwitch(
    'disable-features',
    'UseChromeOSDirectVideoDecoder'
  );
  app.commandLine.appendSwitch('enable-accelerated-mjpeg-decode');
  app.commandLine.appendSwitch('enable-accelerated-video');
  app.commandLine.appendSwitch('ignore-gpu-blocklist');
  app.commandLine.appendSwitch('enable-native-gpu-memory-buffers');
  app.commandLine.appendSwitch('enable-gpu-rasterization');
  app.commandLine.appendSwitch('enable-zero-copy');
  app.commandLine.appendSwitch('enable-gpu-memory-buffer-video-frames');
  app.commandLine.appendSwitch('use-gl', 'angle');

  app.userAgentFallback = USER_AGENT
}

const createWindow = () => {
  setAppFlags()

  const mainWindow = new BrowserWindow({
    title: "Geforce Now",
    autoHideMenuBar: true,
  });

  mainWindow.loadURL(GEFORCE_NOW_URL)

  mainWindow.webContents.setWindowOpenHandler(() => {
    return { action: "deny" }
  })
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on("web-contents-created", (_, contents) => {
  contents.on("will-navigate", (event, navigationURL) => {
      const parsedURL = new URL(navigationURL)

      if (parsedURL.origin !== GEFORCE_NOW_URL) {
          if (parsedURL.origin !== NVIDIA_LOGIN_URL) {
            event.preventDefault()
          }
      }
  })
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
