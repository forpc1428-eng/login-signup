@echo off
echo ================================================
echo   Atlas Access - 3D Lanyard Asset Downloader
echo ================================================
echo.

REM Check if curl is available
where curl >nul 2>&1
if %errorlevel% neq 0 (
    echo X curl is not installed. Please install curl first.
    exit /b 1
)

REM Create components directory if it doesn't exist
if not exist "src\components" mkdir "src\components"

REM Download card.glb
echo Downloading card.glb...
curl -f -o src\components\card.glb https://image.buouui.com/file/card.glb
if %errorlevel% equ 0 (
    echo card.glb downloaded successfully
) else (
    echo Primary source failed, trying alternative...
    curl -f -o src\components\card.glb https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/5huRVDzcoDwnbgrKUo1Lzs/53b6dd7d6b4ffcdbd338fa60265949e1/tag.glb
    if %errorlevel% equ 0 (
        echo card.glb downloaded from alternative source
    ) else (
        echo Failed to download card.glb. Please download manually:
        echo    https://image.buouui.com/file/card.glb
    )
)

echo.
echo Downloading lanyard.png...
curl -f -o src\components\lanyard.png https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/SOT1hmCesOHxEYxL7vkoZ/c57b29c85912047c414311723320c16b/band.jpg
if %errorlevel% equ 0 (
    echo lanyard.png downloaded successfully
) else (
    echo Failed to download lanyard.png. Please download manually:
    echo    https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/SOT1hmCesOHxEYxL7vkoZ/c57b29c85912047c414311723320c16b/band.jpg
)

echo.
echo ================================================
echo   Verification
echo ================================================

if exist "src\components\card.glb" (
    echo card.glb exists
) else (
    echo card.glb not found
)

if exist "src\components\lanyard.png" (
    echo lanyard.png exists
) else (
    echo lanyard.png not found
)

echo.
echo ================================================
echo   Next Steps
echo ================================================
echo.
echo 1. Restart your dev server:
echo    npm run dev
echo.
echo 2. Log in to Atlas Access
echo 3. Click '3D View' to see the lanyard!
echo.
echo ================================================

pause
