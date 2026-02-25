#!/bin/bash
# Render deployment initialization script
# This script runs migrations and collects static files

echo "=== Agenda Tarefas - Render Deployment ==="
echo ""
echo "📦 Running migrations..."
cd backend
python manage.py migrate

echo ""
echo "📁 Collecting static files..."
python manage.py collectstatic --noinput

echo ""
echo "🚀 Deployment initialization complete!"
echo "App is ready to start with gunicorn setup.wsgi --log-file -"
