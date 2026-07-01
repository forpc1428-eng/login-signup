#!/bin/bash

echo "================================================"
echo "  Atlas Access - 3D Lanyard Asset Downloader"
echo "================================================"
echo ""

# Check if curl is available
if ! command -v curl &> /dev/null; then
    echo "❌ curl is not installed. Please install curl first."
    exit 1
fi

# Create components directory if it doesn't exist
mkdir -p src/components

# Download card.glb
echo "📥 Downloading card.glb..."
if curl -f -o src/components/card.glb https://image.buouui.com/file/card.glb; then
    echo "✅ card.glb downloaded successfully"
else
    echo "⚠️  Primary source failed, trying alternative..."
    if curl -f -o src/components/card.glb https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/5huRVDzcoDwnbgrKUo1Lzs/53b6dd7d6b4ffcdbd338fa60265949e1/tag.glb; then
        echo "✅ card.glb downloaded from alternative source"
    else
        echo "❌ Failed to download card.glb. Please download manually:"
        echo "   https://image.buouui.com/file/card.glb"
    fi
fi

# Download lanyard.png
echo ""
echo "📥 Downloading lanyard.png..."
if curl -f -o src/components/lanyard.png https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/SOT1hmCesOHxEYxL7vkoZ/c57b29c85912047c414311723320c16b/band.jpg; then
    echo "✅ lanyard.png downloaded successfully"
else
    echo "❌ Failed to download lanyard.png. Please download manually:"
    echo "   https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/SOT1hmCesOHxEYxL7vkoZ/c57b29c85912047c414311723320c16b/band.jpg"
fi

# Verify downloads
echo ""
echo "================================================"
echo "  Verification"
echo "================================================"

if [ -f "src/components/card.glb" ]; then
    size=$(du -h src/components/card.glb | cut -f1)
    echo "✅ card.glb exists ($size)"
else
    echo "❌ card.glb not found"
fi

if [ -f "src/components/lanyard.png" ]; then
    size=$(du -h src/components/lanyard.png | cut -f1)
    echo "✅ lanyard.png exists ($size)"
else
    echo "❌ lanyard.png not found"
fi

echo ""
echo "================================================"
echo "  Next Steps"
echo "================================================"
echo ""
echo "1. Restart your dev server:"
echo "   npm run dev"
echo ""
echo "2. Log in to Atlas Access"
echo "3. Click '3D View' to see the lanyard!"
echo ""
echo "================================================"
