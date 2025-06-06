LOCK_FILE="/tmp/shopam_deploy.lock"

if [ -e "$LOCK_FILE" ]; then
  echo "Another deployment is running."
  exit 1
fi

trap "rm -f $LOCK_FILE" EXIT
touch $LOCK_FILE

# Your deploy logic here...


#!/bin/bash

echo "🚀 Deploying Shopam..."

# Navigate to your project root
cd /var/www/nodejs/shopam || {
  echo "❌ Failed to cd into /var/www/nodejs/shopam"
  exit 1
}

# Pull latest changes
echo "📦 Pulling latest code..."
git pull origin main || {
  echo "❌ Git pull failed"
  exit 1
}

# Build client (if present)
if [ -d "client" ]; then
  echo "🧱 Building frontend..."
  cd client || {
    echo "❌ Failed to cd into client folder"
    exit 1
  }

  npm install && npm run build || {
    echo "❌ Client build failed"
    exit 1
  }

  mv dist/* /var/www/clients/client0/web14/web/ || {
    echo "❌ Failed to move built files to app dir"
    exit 1
  }

  # Go back to root project dir
  cd ..
fi

# Update server
echo "🔧 Updating server..."
cd server || {
  echo "❌ Failed to cd into server folder"
  exit 1
}

npm install || {
  echo "❌ npm install failed"
  exit 1
}

# Restart or start server using PM2
echo "♻️ Restarting server..."

if pm2 list | grep -q "Shopam"; then
  pm2 restart app --name Shopam || {
    echo "❌ Server restart failed"
    exit 1
  }
else
  echo "⚠️ PM2 process 'Shopam' not found. Starting it..."
  pm2 start app.js --name Shopam || {
    echo "❌ Failed to start server"
    exit 1
  }
fi

echo "✅ Deployment complete!"
