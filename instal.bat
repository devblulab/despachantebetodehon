@echo off
setlocal

REM Caminho onde ficará o Android SDK
set "SDK_ROOT=%USERPROFILE%\AppData\Local\Android\Sdk"
set "CMD_TOOLS_PATH=%SDK_ROOT%\cmdline-tools\latest"

REM URL do Command Line Tools (Windows)
set "CMD_TOOLS_ZIP=https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip"
set "ZIP_FILE=%TEMP%\cmdline-tools.zip"

REM Baixar o command line tools se não existir
if not exist "%CMD_TOOLS_PATH%\bin\sdkmanager.bat" (
    echo [INFO] Baixando Android Command Line Tools...
    powershell -Command "Invoke-WebRequest -Uri %CMD_TOOLS_ZIP% -OutFile '%ZIP_FILE%'"
    mkdir "%CMD_TOOLS_PATH%"
    tar -xf "%ZIP_FILE%" -C "%CMD_TOOLS_PATH%\.." 2>nul
    REM Move para pasta 'latest' se necessário
    if exist "%CMD_TOOLS_PATH%\..\cmdline-tools\bin" (
        move "%CMD_TOOLS_PATH%\..\cmdline-tools" "%CMD_TOOLS_PATH%"
    )
)

REM Adicionar ao PATH só para esta execução
set "PATH=%CMD_TOOLS_PATH%\bin;%PATH%"

echo [INFO] Instalando plataformas e build-tools necessárias...
call sdkmanager.bat "platform-tools" "platforms;android-33" "build-tools;30.0.3"

echo.
echo [INFO] Aceitando todas as licenças...
call sdkmanager.bat --licenses

echo.
echo [INFO] Listando componentes instalados...
call sdkmanager.bat --list

echo.
echo [SUCESSO] Android SDK instalado e pronto!
pause
endlocal
