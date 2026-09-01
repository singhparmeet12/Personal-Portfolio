#!/bin/bash
# Build script for Vercel Python Django deployment
echo "Creating staticfiles directory..."
mkdir -p staticfiles

echo "Building project packages..."
python3 -m pip install -r requirements.txt --break-system-packages

echo "Collecting static files..."
python3 manage.py collectstatic --noinput --clear || true

echo "Ensuring staticfiles output directory exists..."
mkdir -p staticfiles

echo "Build completed successfully!"


