@echo off
echo Starting Pixel 9a emulator...
start "" "%ANDROID_HOME%\emulator\emulator.exe" -avd Pixel_9a -netdelay none -netspeed full -gpu auto

timeout /t 10 /nobreak >nul
echo Restarting ADB...
adb kill-server
adb start-server

echo Checking ADB devices...
adb devices

echo Launching Expo...
start "" cmd /k "cd /d C:\Users\Savi\Desktop\Eclipse Workplace\flexiride-expo && npx expo start"

echo Opening VS Code...
code "C:\Users\Savi\Desktop\Eclipse Workplace\flexiride-expo"