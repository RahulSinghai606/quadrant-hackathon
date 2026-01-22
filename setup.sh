#!/bin/bash

echo "=========================================="
echo "🏥 MediVision AI - Setup Script"
echo "=========================================="
echo ""

# Check Python version
python_version=$(python3 --version 2>&1 | awk '{print $2}')
echo "✓ Python version: $python_version"

# Create virtual environment
echo ""
echo "Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo ""
echo "Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo ""
echo "Installing dependencies..."
pip install -r requirements.txt

echo ""
echo "=========================================="
echo "✅ Setup complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Configure your .env file with API keys"
echo "2. Activate the environment: source venv/bin/activate"
echo "3. Run the application: python app.py"
echo ""
echo "Need help? Check README.md for detailed instructions"
echo ""
