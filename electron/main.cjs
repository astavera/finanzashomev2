const { app, BrowserWindow, shell, screen } = require("electron");
const fs = require("fs");
const path = require("path");

const isDev = !app.isPackaged;
const appIconPath = path.join(__dirname, "../build/icon.ico");

// Rutas de datos (evita errores de cache en Windows)
const userDataPath = path.join(app.getPath("appData"), "FinanzasHome");
app.setPath("userData", userDataPath);
app.setPath("sessionData", path.join(userDataPath, "session"));
app.setAppUserModelId("com.finanzashome.desktop");

const windowStatePath = path.join(userDataPath, "window-state.json");

function readWindowState() {
  const fallback = {
    width: 1360,
    height: 860,
    minWidth: 980,
    minHeight: 680,
    isMaximized: false,
  };

  try {
    const raw = fs.readFileSync(windowStatePath, "utf8");
    const parsed = JSON.parse(raw);

    return {
      ...fallback,
      ...parsed,
    };
  } catch {
    return fallback;
  }
}

function clampWindowBounds(state) {
  const display = screen.getPrimaryDisplay();
  const { width: workWidth, height: workHeight } = display.workAreaSize;

  return {
    ...state,
    width: Math.min(Math.max(state.width, state.minWidth), workWidth),
    height: Math.min(Math.max(state.height, state.minHeight), workHeight),
  };
}

function saveWindowState(win) {
  try {
    fs.mkdirSync(userDataPath, { recursive: true });

    const bounds = win.getBounds();
    const nextState = {
      width: bounds.width,
      height: bounds.height,
      minWidth: 980,
      minHeight: 680,
      isMaximized: win.isMaximized(),
    };

    fs.writeFileSync(windowStatePath, JSON.stringify(nextState, null, 2), "utf8");
  } catch {
    // Ignore state persistence failures to avoid blocking app close.
  }
}

function createWindow() {
  const windowState = clampWindowBounds(readWindowState());
  const win = new BrowserWindow({
    width: windowState.width,
    height: windowState.height,
    minWidth: windowState.minWidth,
    minHeight: windowState.minHeight,
    backgroundColor: "#0b1020",
    autoHideMenuBar: true,
    icon: appIconPath,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  if (isDev) {
    win.loadURL("http://localhost:8080");
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  // Abrir links externos en el navegador
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  win.once("ready-to-show", () => {
    if (windowState.isMaximized) {
      win.maximize();
    }

    win.show();
  });

  win.on("close", () => {
    saveWindowState(win);
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
