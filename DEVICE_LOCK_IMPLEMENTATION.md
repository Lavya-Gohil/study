# Device Locking Feature Implementation

## Overview
The app now includes a **Device Lock Study Mode** that creates an immersive, distraction-free study environment.

## Current Implementation (Web/Desktop)
✅ **Fullscreen Mode**: Automatically enters fullscreen when study session starts
✅ **Visual Lock**: Black fullscreen interface with only timer and controls visible
✅ **Session Timer**: Countdown timer with pause/end controls
✅ **Subject-based Sessions**: Click any subject → Set duration → Lock device

## Mobile Implementation (APK - Capacitor Required)

### 1. Install Capacitor Plugins
```bash
npm install @capacitor/app @capacitor/haptics @capacitor/status-bar @capacitor-community/keep-awake
npm install capacitor-plugin-do-not-disturb
```

### 2. Add to AndroidManifest.xml
```xml
<!-- Do Not Disturb Permission -->
<uses-permission android:name="android.permission.ACCESS_NOTIFICATION_POLICY" />
<uses-permission android:name="android.permission.WAKE_LOCK" />
<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
```

### 3. Implement Native Android Lock (Kiosk Mode)

Update `src/app/dashboard/page.tsx`:

```typescript
import { Plugins } from '@capacitor/core';
import KeepAwake from '@capacitor-community/keep-awake';

// When session starts
const startSession = async () => {
  // Enable Do Not Disturb
  try {
    await Plugins.DoNotDisturb.enable();
  } catch (error) {
    console.error('DND not available');
  }

  // Keep screen awake
  await KeepAwake.keepAwake();

  // Hide status bar
  await Plugins.StatusBar.hide();

  // Start your timer
  setTimeRemaining(sessionDuration * 60);
  setIsSessionActive(true);
};

// When session ends
const endSession = async () => {
  // Disable Do Not Disturb
  try {
    await Plugins.DoNotDisturb.disable();
  } catch (error) {
    console.error('DND error');
  }

  // Allow screen sleep
  await KeepAwake.allowSleep();

  // Show status bar
  await Plugins.StatusBar.show();

  setIsSessionActive(false);
};
```

### 4. Android Kiosk Mode (Advanced)

For true device locking, create a native Android module:

**android/app/src/main/java/LockTaskManager.java**
```java
package com.studyapp;

import android.app.Activity;
import android.app.ActivityManager;
import android.content.Context;
import com.getcapacitor.Plugin;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "LockTask")
public class LockTaskPlugin extends Plugin {
    
    @PluginMethod
    public void startLockTask(PluginCall call) {
        Activity activity = getActivity();
        activity.startLockTask();
        call.resolve();
    }
    
    @PluginMethod
    public void stopLockTask(PluginCall call) {
        Activity activity = getActivity();
        activity.stopLockTask();
        call.resolve();
    }
}
```

Register in **MainActivity.java**:
```java
import com.studyapp.LockTaskPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        registerPlugin(LockTaskPlugin.class);
    }
}
```

### 5. Windows Implementation (Electron Required)

For Windows EXE, add to Electron main process:

```javascript
const { BrowserWindow } = require('electron');

let studyWindow;

function createStudyWindow() {
  studyWindow = new BrowserWindow({
    fullscreen: true,
    kiosk: true, // Locks user to app
    alwaysOnTop: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  
  studyWindow.setAlwaysOnTop(true, 'screen-saver');
}

// Listen for IPC from renderer
ipcMain.on('start-lock-mode', () => {
  createStudyWindow();
  // Optionally: Block Windows key, Alt+Tab, etc.
});

ipcMain.on('end-lock-mode', () => {
  studyWindow.close();
});
```

## Features

### Current Features ✅
- Fullscreen lock interface
- Timer countdown (customizable 5-120 minutes)
- Pause/Resume functionality
- Emergency end session button
- Subject-based tracking
- Session history saved to database

### Mobile-Specific Features (After Capacitor Setup) 🚀
- **Do Not Disturb Mode**: Blocks all notifications
- **Screen Lock**: Prevents home button/back button
- **Keep Awake**: Screen stays on during session
- **Kiosk Mode**: App becomes exclusive interface
- **Status Bar Hidden**: Full immersion

### Desktop-Specific Features (After Electron Setup) 💻
- **Kiosk Mode**: True fullscreen lock
- **Always on Top**: Can't minimize or switch apps
- **Keyboard Blocking**: Disable Alt+Tab, Windows key
- **Multi-monitor Support**: Lock all screens

## User Flow

1. **Select Subject**: User clicks on subject card (e.g., "Mathematics")
2. **Set Duration**: Modal appears, user sets duration (15/25/45/60/90/120 min or custom)
3. **Start Session**: Device enters lock mode
   - Fullscreen black screen
   - Large timer display
   - Only pause/end buttons available
4. **During Session**: 
   - All notifications blocked (mobile)
   - Can't exit app (mobile/desktop with native)
   - Timer counts down
5. **End Session**: 
   - Manual end or timer completes
   - Device unlocks
   - Session time saved to database
   - Stats updated

## Database Schema

Session tracking uses existing `FocusSession` model:
```prisma
model FocusSession {
  id          String   @id @default(cuid())
  userId      String
  subject     String
  duration    Int      // minutes
  completedAt DateTime
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## API Endpoints

### POST /api/focus-session
Start a new focus session
```json
{
  "subject": "Mathematics",
  "duration": 45
}
```

### PATCH /api/focus-session
Update session with actual duration
```json
{
  "subject": "Mathematics",
  "actualDuration": 42
}
```

## UI Design Philosophy

**Minimalist Focus Mode**:
- Pure black background (#000000)
- White text only
- No decorations or distractions
- Large, clear typography (9xl for timer)
- Minimal controls (2 buttons only)
- Centered layout
- Zero animations during session

This creates a **calm, focused environment** that encourages deep work.

## Installation for Full Device Lock

### For Mobile APK:
```bash
# Install Capacitor if not done
npm install @capacitor/core @capacitor/cli
npx cap init

# Add Android platform
npm install @capacitor/android
npx cap add android

# Install lock plugins
npm install @capacitor-community/keep-awake
npm install capacitor-plugin-do-not-disturb

# Sync and build
npx cap sync
npx cap open android
# Build APK in Android Studio
```

### For Windows EXE:
```bash
# Install Electron
npm install --save-dev electron electron-builder

# Create electron main file
# (See Electron implementation above)

# Build
npm run electron:build
```

## Testing

1. **Web Testing**: Already working at http://localhost:3000
2. **Mobile Testing**: Use Android Studio emulator after Capacitor setup
3. **Desktop Testing**: Run `npm run electron:dev` after Electron setup

## Notes

- **Permissions**: Mobile users must grant "Do Not Disturb" and "Draw over other apps" permissions on first use
- **Emergency Exit**: Users can always force-quit the app from system settings
- **Battery**: Keep Awake mode will drain battery faster
- **Compliance**: Ensure your app store listing clearly states the locking behavior
