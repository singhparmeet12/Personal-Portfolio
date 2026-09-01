#!/bin/bash
# Build script for Vercel Python Django deployment
echo "Building project packages..."
python3 -m pip install -r requirements.txt --break-system-packages

echo "Collecting static files..."
python3 manage.py collectstatic --noinput --clear

echo "Applying database migrations..."
python3 manage.py migrate --noinput || true

echo "Build completed successfully!"

