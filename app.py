#!/usr/bin/env python3
"""
MediVision AI - Main Application Entry Point
Run this file to launch the web interface
"""
import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent))

from src.ui import launch_app

if __name__ == "__main__":
    print("=" * 60)
    print("🏥 MediVision AI - Healthcare Memory Assistant")
    print("=" * 60)
    print("\nInitializing system...")
    print("Loading models and connecting to services...\n")

    try:
        launch_app()
    except KeyboardInterrupt:
        print("\n\n👋 Shutting down MediVision AI. Goodbye!")
    except Exception as e:
        print(f"\n❌ Error starting application: {e}")
        print("\nPlease check:")
        print("1. All dependencies are installed: pip install -r requirements.txt")
        print("2. Environment variables are set correctly in .env file")
        print("3. Qdrant and Azure OpenAI services are accessible")
        sys.exit(1)
