# 🎉 Acadot - Ready for Microsoft Store!

## ✅ Setup Complete!

Your app is now configured and ready to be packaged for the Microsoft Store.

### 📦 What's Been Set Up

1. ✅ **Electron Wrapper** - Your Next.js app wrapped in Electron
2. ✅ **electron-builder** - Configured for Windows MSIX packaging
3. ✅ **Build Scripts** - Ready to create store-ready packages
4. ✅ **Production Build** - Next.js app built successfully

### 🚀 Quick Start

#### Build for Microsoft Store:
```powershell
npm run build:win:store
```

This creates an `.appx` file in the `dist/` folder ready for Microsoft Store submission.

#### Alternative Builds:
```powershell
# Standard Windows installer
npm run build:win

# Portable .exe
npm run build:win:portable
```

### ⚠️ Important: Before Building

1. **Replace Icon** 
   - Add your app icon to: `build/icon.ico`
   - Format: 256x256 ICO file
   - Get free converter: https://icoconvert.com/

2. **Update Publisher Info**
   - Get your certificate from Microsoft Partner Center
   - Update in `package.json`:
   ```json
   "build": {
     "appx": {
       "publisher": "CN=YOUR-CERTIFICATE-HERE"
     }
   }
   ```

3. **Test Locally First**
   ```powershell
   npm start
   # Then in another terminal:
   npm run electron
   ```

### 📋 Files Structure

```
APP/
├── electron/
│   ├── main.js          # Electron main process
│   └── preload.js       # Preload scripts
├── build/
│   └── icon.ico         # App icon (REPLACE THIS!)
├── dist/                # Build output folder
└── MICROSOFT_STORE_GUIDE.md  # Full publishing guide
```

### 🏪 Publishing Steps

1. **Build the package**
   ```powershell
   npm run build:win:store
   ```

2. **Find your .appx file**
   - Location: `dist/Acadot 1.0.0.appx`

3. **Go to Microsoft Partner Center**
   - https://partner.microsoft.com/dashboard
   - Create account ($19 one-time)
   - Reserve name "Acadot"

4. **Upload & Submit**
   - Upload the `.appx` file
   - Add screenshots (4-10 required)
   - Fill store listing
   - Submit for certification

### 📸 Screenshots Needed

Take screenshots of:
- Dashboard with study stats
- Focus timer in action
- Analytics page
- Notes feature
- Settings page

Minimum resolution: 1366x768

### 💡 Tips

- **First time?** Read `MICROSOFT_STORE_GUIDE.md` for detailed instructions
- **Icon missing?** App will use default icon until you replace `build/icon.ico`
- **Build errors?** Check console output and ensure all dependencies are installed
- **Testing?** Run `npm run electron` to test the packaged app locally

### 🛠️ Troubleshooting

**Build fails?**
```powershell
# Clean rebuild
Remove-Item -Recurse -Force .next, dist
npm run build
npm run build:win:store
```

**Database connection issues?**
- Ensure `.env` has correct DATABASE_URL for production
- Update to Supabase URL (already configured)

**Icon not showing?**
- Replace `build/icon.ico` with your actual icon
- Must be ICO format, 256x256 pixels

### 📞 Next Steps

1. Replace `build/icon.ico` with your app icon
2. Update publisher certificate in `package.json`
3. Run `npm run build:win:store`
4. Submit to Microsoft Store

**Good luck! 🚀**

---

For complete instructions, see: `MICROSOFT_STORE_GUIDE.md`
