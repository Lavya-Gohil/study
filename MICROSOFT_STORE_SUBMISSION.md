# Microsoft Store Submission Guide - Acadot

## 📦 Package Details

### Package URL
After building, upload the installer to a publicly accessible URL (your website, Google Drive with direct link, etc.)

**Example:** `https://yourdomain.com/downloads/acadot-setup-1.0.0.exe`

**File Location:** `dist/Acadot Setup 1.0.0.exe`

---

### Architecture
**✅ x64** (selected)

---

### Installer Parameters
**Silent install parameter:** `/S`

NSIS installers use `/S` for silent installation.

---

### Languages
**✅ English (United States)** - en-US

---

### App Type
**✅ EXE** (selected)

---

## 📋 EXE Return Code Values

### Standard Install Scenarios

| Scenario | EXE Return Code Value |
|----------|---------------------|
| **Installation cancelled by user** | `2` |
| **Application already exists** | `0` |
| **Installation already in progress** | `1` |
| **Disk space is full** | `112` |
| **Reboot required** | `3010` |
| **Network failure** | `12029` |
| **Package rejected during installation** | `1619` |
| **Installation successful** | `0` |

---

## 📝 Submission Steps

1. **Build the installer**
   ```powershell
   npm run build:win
   ```
   Output: `dist/Acadot Setup 1.0.0.exe`

2. **Upload installer to a public URL**
   - Use your own hosting
   - Or GitHub Releases: https://github.com/your-username/your-repo/releases
   - Or Google Drive with direct download link

3. **Get the direct download URL**
   - Must be HTTPS
   - Must be a direct download link (not a landing page)
   - Must be versioned (e.g., `/downloads/1.0.0/setup.exe`)

4. **Fill out Microsoft Store form**
   - **Package URL:** Your HTTPS download link
   - **Architecture:** x64
   - **Installer parameters:** `/S`
   - **Languages:** English (United States)
   - **App type:** EXE
   - **Return codes:** Use values from table above

5. **Submit for certification**
   - Microsoft will download and test your installer
   - Certification takes 24-48 hours
   - They may request changes

---

## 🔧 Testing Your Installer

### Test Silent Install
```powershell
# Run installer silently
.\dist\"Acadot Setup 1.0.0.exe" /S

# Check if installed
Get-ItemProperty HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\* | Where-Object {$_.DisplayName -like "*Acadot*"}
```

### Test Normal Install
```powershell
# Run installer with UI
.\dist\"Acadot Setup 1.0.0.exe"
```

---

## 📸 Required Store Assets

### Screenshots (4-10 required)
- **Resolution:** 1366x768 or higher
- **Format:** PNG or JPG
- **Show:** Dashboard, Focus Timer, Analytics, Notes, Doubts

### App Icon
- **Size:** 300x300 pixels minimum
- **Format:** PNG with transparency
- **Current:** `build/icon.ico`

### Description
```
Master Your Focus - AI-Powered Study Companion

Acadot helps students achieve their academic goals with:

✨ AI-Powered Study Assistance
• Get instant answers to your doubts
• Personalized study plans
• Smart practice questions

⏱️ Focus Timer & Analytics
• Track your study sessions
• Analyze your productivity
• Build daily study streaks

📝 Smart Note Taking
• Organize your notes by subject
• Quick access to study materials
• Integrated with your study plan

🎯 Perfect For:
• High school students
• College students
• Competitive exam preparation (JEE, NEET, etc.)

Start your journey to academic excellence today!
```

---

## ⚠️ Important Notes

1. **Update URL for each version**
   - When you update the app, increment version in `package.json`
   - Rebuild and upload to a NEW versioned URL
   - Example: `v1.0.0/setup.exe` → `v1.0.1/setup.exe`

2. **HTTPS Required**
   - Microsoft Store only accepts HTTPS URLs
   - Self-signed certificates not accepted

3. **Keep installer available**
   - Don't delete old installers immediately
   - Microsoft may re-verify at any time

4. **Testing**
   - Test on clean Windows VM before submitting
   - Verify silent install works
   - Check app runs after installation

---

## 🚀 After Approval

Once approved, users can:
- Download from Microsoft Store
- Get automatic updates when you submit new versions
- Install on Windows 10/11 devices

**Update Process:**
1. Increment version in `package.json`
2. Rebuild: `npm run build:win`
3. Upload new installer to new versioned URL
4. Update package URL in Partner Center
5. Submit for certification

---

## 📧 Support

If certification fails:
- Check return codes match NSIS standards
- Verify installer works on clean Windows install
- Ensure all dependencies are included
- Review Microsoft's feedback in Partner Center

---

**Good luck with your submission! 🎉**
