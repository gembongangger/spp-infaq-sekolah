#!/bin/bash

# Warna untuk output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Memulai proses unggah ke GitHub...${NC}"

# Cek apakah folder ini adalah repositori git
if [ ! -d .git ]; then
    echo -e "${RED}❌ Error: Folder ini bukan repositori Git.${NC}"
    exit 1
fi

# Ambil pesan commit dari argumen atau minta input
COMMIT_MSG=$1
if [ -z "$COMMIT_MSG" ]; then
    echo -e "${BLUE}📝 Masukkan keterangan (commit message):${NC}"
    read COMMIT_MSG
fi

# Jika pesan masih kosong, gunakan default
if [ -z "$COMMIT_MSG" ]; then
    COMMIT_MSG="Update: $(date +'%Y-%m-%d %H:%M:%S')"
fi

# Proses Git
echo -e "${BLUE}📦 Menambahkan perubahan...${NC}"
git add .

echo -e "${BLUE}💾 Melakukan commit: \"$COMMIT_MSG\"${NC}"
git commit -m "$COMMIT_MSG"

echo -e "${BLUE}📤 Mengunggah ke branch main...${NC}"
if git push origin main; then
    echo -e "${GREEN}✅ Berhasil diunggah ke GitHub!${NC}"
else
    echo -e "${RED}❌ Gagal mengunggah ke GitHub. Periksa koneksi atau konflik. ${NC}"
    exit 1
fi
