#!/bin/bash

# Configure git with the GitHub token
git config --global user.email "replit@user.local"
git config --global user.name "Replit User"

# Set up the remote URL with the token
git remote set-url origin https://${GITHUB_TOKEN}@github.com/thatappguy71/EvolvAssistant.git

# Pull latest changes (in case there are any)
git pull origin main --rebase 2>/dev/null || true

# Add all changes
git add -A

# Commit with a timestamp
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
git commit -m "Auto-sync: $TIMESTAMP" 2>/dev/null || echo "No changes to commit"

# Push to GitHub
git push origin main 2>&1

echo "Sync completed at $TIMESTAMP"