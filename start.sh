#!/bin/bash

# Production startup script for SvelteKit Backend
# Usage: ./start.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "==================================="
echo "Sistem Informasi Infaq & Jariyah"
echo "SvelteKit Backend"
echo "==================================="
echo ""

# Check if build exists
if [ ! -d "build" ]; then
    echo "❌ Build not found. Running build..."
    npm run build
fi

# Check if database exists
if [ ! -f "../data/infaq_jariyah.db" ]; then
    echo "❌ Database not found. Please run migration first."
    echo "   cd flask_backend && python export_to_sqlite.py"
    exit 1
fi

echo "✅ Starting production server..."
echo ""

# Start the server
node build
