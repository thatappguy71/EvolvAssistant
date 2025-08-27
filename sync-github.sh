#!/bin/bash

echo "🔄 Starting GitHub sync..."

# Set up GitHub authentication with token
echo "Setting up authentication..."
git remote set-url origin https://${GITHUB_TOKEN}@github.com/thatappguy71/EvolvAssistant.git

# Configure git user (if not already configured)
git config user.email "evolv@replit.user" 2>/dev/null
git config user.name "Evolv Replit" 2>/dev/null

# Pull latest changes from GitHub
echo "Pulling latest changes from GitHub..."
git pull origin main --rebase 2>/dev/null || echo "No remote changes to pull"

# Stage all changes
echo "Staging changes..."
git add -A

# Create commit with timestamp
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
git commit -m "Sync: $TIMESTAMP" 2>/dev/null || {
    echo "✅ No changes to commit - already up to date!"
    exit 0
}

# Push to GitHub
echo "Pushing to GitHub..."
if git push origin main 2>&1; then
    echo "✅ Successfully synced to GitHub!"
    echo "Timestamp: $TIMESTAMP"
else
    echo "❌ Failed to push. Please check your GitHub token and repository permissions."
    exit 1
fi