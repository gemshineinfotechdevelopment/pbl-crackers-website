#!/usr/bin/env bash
# ==============================================================================
# PBL Crackers Website - VPS Deployment & Update Script
# Subdomain: pbl-crackers.gemshine.tech
# Backend Port: 5019
# Usage on VPS: bash deploy.sh
# ==============================================================================

set -e

echo "🚀 [1/5] Pulling latest code from Git..."
git pull origin main || echo "Git pull skipped or working tree clean."

echo "📦 [2/5] Installing frontend dependencies..."
npm install

echo "📦 [3/5] Installing backend dependencies..."
npm --prefix server install

echo "🔨 [4/5] Building React frontend (Vite)..."
npm run build

echo "🔄 [5/5] Reloading PM2 backend service (Port 5019: pbl-crackers-backend)..."
pm2 reload ecosystem.config.cjs || pm2 start ecosystem.config.cjs
pm2 save

echo "=========================================================="
echo "✅ PBL Crackers Website deployed successfully!"
echo "🌐 Frontend: https://pbl-crackers.gemshine.tech"
echo "🔌 Backend API: http://127.0.0.1:5019/api/health"
echo "=========================================================="
