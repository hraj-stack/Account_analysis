# Banking System Setup Guide

## Overview
This is a React-based banking dashboard with a Flask backend server.

## Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run the Server
```bash
python app.py
```

The server will start at: **http://localhost:5000**

### 3. Open in Browser
Navigate to `http://localhost:5000` in your web browser.

## Project Structure
```
Banking System/
├── app.py                 # Flask backend server
├── banking_system.js      # React components and UI logic
├── banking_system.py      # (Legacy - can be deleted)
├── index.html             # HTML entry point
├── main.py                # Simple Python script (not needed for web app)
├── requirements.txt       # Python dependencies
├── pyproject.toml         # Project metadata
└── README.md             # Documentation
```

## Features
- **React Frontend**: Interactive banking dashboard with design tokens
- **Flask Backend**: RESTful API endpoints
- **Mock Data**: Sample accounts and transactions data
- **Responsive Design**: Works on desktop and mobile

## Available API Endpoints
- `GET /` - Serve the main page
- `GET /api/health` - Health check
- `GET /api/accounts` - Get all accounts
- `GET /api/transactions` - Get transactions

## Development Notes
- The frontend uses React 18 with Babel transpilation
- The backend provides mock API endpoints
- To integrate real backend functionality, modify the Flask routes in `app.py`
- The app runs in debug mode by default for development

## Troubleshooting
If port 5000 is already in use, modify the port in `app.py`:
```python
app.run(debug=True, host='0.0.0.0', port=8000)  # Use port 8000 instead
```

Then access the app at: `http://localhost:8000`
