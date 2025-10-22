#!/bin/bash

# Deploy Firebase Cloud Functions for Ashlyn Retreat
# This script helps you deploy the secure Gemini AI cloud functions

echo "=========================================="
echo "Firebase Cloud Functions Deployment"
echo "Ashlyn Retreat - Secure Gemini AI"
echo "=========================================="
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found!"
    echo "Installing Firebase CLI..."
    npm install -g firebase-tools
    echo "✅ Firebase CLI installed"
else
    echo "✅ Firebase CLI found"
fi

# Check if logged in
echo ""
echo "Checking Firebase login status..."
firebase login:list

# Check if project is linked
echo ""
echo "Current Firebase project:"
firebase use

# Prompt for API key if not set
echo ""
echo "=========================================="
echo "Step 1: Set Gemini API Key"
echo "=========================================="
read -p "Enter your Gemini API key (or press Enter to skip): " APIKEY

if [ ! -z "$APIKEY" ]; then
    echo "Setting Gemini API key..."
    firebase functions:config:set gemini.apikey="$APIKEY"
    echo "✅ API key set"
else
    echo "⚠️  Skipped - make sure to set it manually:"
    echo "   firebase functions:config:set gemini.apikey=\"YOUR_KEY\""
fi

# Deploy functions
echo ""
echo "=========================================="
echo "Step 2: Deploy Cloud Functions"
echo "=========================================="
read -p "Deploy functions now? (y/n): " DEPLOY

if [ "$DEPLOY" = "y" ] || [ "$DEPLOY" = "Y" ]; then
    echo "Deploying functions..."
    firebase deploy --only functions

    if [ $? -eq 0 ]; then
        echo ""
        echo "=========================================="
        echo "✅ Deployment Successful!"
        echo "=========================================="
        echo ""
        echo "Next steps:"
        echo "1. Update js/gemini-config.js:"
        echo "   Set useCloudFunctions: true"
        echo ""
        echo "2. Hard refresh your browser (Ctrl+F5)"
        echo ""
        echo "3. Test 'Get AI Insights' button"
        echo ""
        echo "4. View logs:"
        echo "   firebase functions:log"
        echo ""
    else
        echo ""
        echo "❌ Deployment failed"
        echo "Check error messages above"
    fi
else
    echo "⚠️  Deployment skipped"
    echo "Deploy manually with: firebase deploy --only functions"
fi

echo ""
echo "=========================================="
echo "Deployment script complete"
echo "=========================================="
