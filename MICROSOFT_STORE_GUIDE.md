# Acadot - Microsoft Store Publishing Guide

## 📦 Build for Microsoft Store

### Prerequisites
1. ✅ Node.js installed
2. ✅ All dependencies installed (`npm install`)
3. ✅ Next.js app built
4. ✅ Electron configured
5. ✅ electron-builder installed

### Build Steps

#### 1. Build the Next.js App
```powershell
npm run build
```

#### 2. Build Windows MSIX Package (for Microsoft Store)
```powershell
npm run build:win:store
```

This will create an `.appx` file in the `dist/` folder.

#### 3. Alternative: Build Portable/Installer
```powershell
# For NSIS installer
npm run build:win

# For portable version
npm run build:win:portable
```

### 📁 Output Files
After building, you'll find in the `dist/` folder:
- `Acadot Setup 1.0.0.exe` - NSIS installer
- `Acadot 1.0.0.appx` - Microsoft Store package
- `Acadot 1.0.0.exe` - Portable version

### 🏪 Microsoft Store Submission

#### Required Assets
Before submitting to Microsoft Store, you need:

1. **App Icon** (Required)
   - Replace `build/icon.ico` with your actual 256x256 icon
   - Create icons: 44x44, 50x50, 150x150, 310x150, 310x310 (PNG format)

2. **Screenshots** (4-10 required)
   - Resolution: 1366x768 or higher
   - Show main features: Dashboard, Focus Timer, Analytics, Notes

3. **Store Listing**
   - App Name: Acadot
   - Description: Master Your Focus - AI-powered study app
   - Category: Education
   - Age Rating: 3+

#### Steps to Submit:

1. **Partner Center Setup**
   - Go to: https://partner.microsoft.com/dashboard
   - Create a Developer account ($19 one-time fee)
   - Reserve app name "Acadot"

2. **Update Publisher Certificate**
   - In Partner Center, get your Publisher Display Name
   - Update `package.json` → `build.appx.publisher`
   - Example: `"CN=ABCD1234-5678-90AB-CDEF-GHIJKLMNOPQR"`

3. **Rebuild with Correct Certificate**
   ```powershell
   npm run build:win:store
   ```

4. **Upload Package**
   - Go to Partner Center → Your App → Submissions
   - Upload the `.appx` file from `dist/` folder
   - Fill in store listing details
   - Add screenshots
   - Set pricing (Free recommended)
   - Submit for certification

### ⚙️ Configuration

#### Environment Variables
Make sure your `.env` file is configured:
```env
DATABASE_URL=your-production-database-url
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3456
```

#### Database
- Use Supabase for production
- Update connection strings in `.env`
- Run migrations: `npx prisma migrate deploy`

### 🔧 Troubleshooting

**Icon not showing?**
- Convert your PNG to ICO format
- Use online tool: https://icoconvert.com/
- Place in `build/icon.ico`

**Build fails?**
```powershell
# Clean and rebuild
Remove-Item -Recurse -Force .next, dist
npm run build
npm run build:win:store
```

**App won't start?**
- Check if Next.js built successfully (`.next` folder exists)
- Verify all dependencies are in `package.json`
- Test with: `npm run electron`

### 📝 Checklist Before Publishing

- [ ] Replace `build/icon.ico` with your actual app icon
- [ ] Update `package.json` → `author` field
- [ ] Update `package.json` → `build.appx.publisher` with your Publisher Certificate
- [ ] Update `package.json` → `build.appx.publisherDisplayName`
- [ ] Test the app locally: `npm run electron`
- [ ] Build: `npm run build:win:store`
- [ ] Prepare 4-10 screenshots
- [ ] Write compelling store description
- [ ] Set up Partner Center account
- [ ] Submit `.appx` file from `dist/` folder

### 🎯 After Publishing

**Updating the App:**
1. Increment version in `package.json`
2. Rebuild: `npm run build:win:store`
3. Submit new `.appx` to Partner Center
4. Users get automatic updates through Microsoft Store

### 📧 Support
- For build issues, check the console output
- For store submission, visit Microsoft Partner Center support
- For app bugs, check the `electron/main.js` logs

---

**Good luck with your Microsoft Store launch! 🚀**
