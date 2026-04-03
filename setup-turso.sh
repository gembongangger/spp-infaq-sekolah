#!/bin/bash

# Script untuk setup Turso database
# Pastikan Turso CLI sudah terinstall dan login

echo "🚀 Setting up Turso database: infaqsekolahdb"
echo ""

# Check if turso CLI is installed
if ! command -v turso &> /dev/null; then
    echo "❌ Turso CLI not found!"
    echo ""
    echo "Install Turso CLI first:"
    echo "  macOS: brew install tursodatabase/tap/turso"
    echo "  Linux: curl -sSfL https://get.tur.so/install.sh | bash"
    echo ""
    exit 1
fi

# Check if logged in
echo "📋 Checking Turso authentication..."
turso auth status 2>&1 | head -5
echo ""

# Import schema
echo "📦 Importing database schema..."
if [ -f "schema.sql" ]; then
    turso db shell infaqsekolahdb < schema.sql
    echo "✅ Schema imported successfully!"
else
    echo "❌ schema.sql not found!"
    exit 1
fi

echo ""
echo "🔑 Creating auth token..."
TOKEN=$(turso db tokens create infaqsekolahdb)
echo "✅ Token created!"
echo ""
echo "📝 Your connection details:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "URL: libsql://infaqsekolahdb-gembongangger.aws-ap-northeast-1.turso.io"
echo "Token: $TOKEN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⚠️  IMPORTANT: Copy the token above!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your token:"
echo "   TURSO_AUTH_TOKEN=$TOKEN"
echo ""
echo "2. Or set in Netlify dashboard when deploying"
echo ""
echo "3. Test connection:"
echo "   npm run dev"
echo ""
