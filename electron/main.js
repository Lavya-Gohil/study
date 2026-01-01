const { app, BrowserWindow } = require('electron')
const path = require('path')
const { spawn } = require('child_process')

let mainWindow
let nextServer

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 768,
    title: 'Acadot - Master Your Focus',
    icon: path.join(__dirname, '../public/logo.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      devTools: !app.isPackaged
    },
    autoHideMenuBar: true,
    backgroundColor: '#f6f7fb'
  })

  // Start Next.js server in production mode
  if (app.isPackaged) {
    const appPath = path.join(process.resourcesPath, 'app')
    const nextBin = path.join(appPath, 'node_modules', '.bin', 'next.cmd')
    
    nextServer = spawn(nextBin, ['start', '-p', '3456'], {
      cwd: appPath,
      env: { ...process.env, NODE_ENV: 'production' },
      windowsHide: true
    })
  } else {
    const appPath = path.join(__dirname, '..')
    const nextBin = path.join(appPath, 'node_modules', '.bin', 'next.cmd')
    
    nextServer = spawn(nextBin, ['start', '-p', '3456'], {
      cwd: appPath,
      env: { ...process.env, NODE_ENV: 'production' },
      windowsHide: true
    })
  }

  nextServer.stdout.on('data', (data) => {
    console.log(`Next.js: ${data}`)
    
    // Load localhost once server is ready
    if (data.toString().includes('Ready') || data.toString().includes('started')) {
      mainWindow.loadURL('http://localhost:3456')
    }
  })

  nextServer.stderr.on('data', (data) => {
    console.error(`Next.js Error: ${data}`)
  })

  // Fallback: load after 3 seconds if no ready message
  setTimeout(() => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.loadURL('http://localhost:3456')
    }
  }, 3000)

  // Open external links in browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    require('electron').shell.openExternal(url)
    return { action: 'deny' }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (nextServer) {
    nextServer.kill()
  }
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  if (nextServer) {
    nextServer.kill()
  }
})
