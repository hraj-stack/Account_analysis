from flask import Flask, render_template, jsonify
import os

app = Flask(__name__, 
    static_folder=os.path.dirname(__file__),
    static_url_path='',
    template_folder=os.path.dirname(__file__))

@app.route('/')
def index():
    """Serve the main index.html page"""
    return render_template('index.html')

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'service': 'Banking System'})

@app.route('/api/accounts', methods=['GET'])
def get_accounts():
    """Mock API endpoint for accounts"""
    return jsonify({
        'accounts': [
            {
                'id': 1,
                'name': 'Checking Account',
                'balance': 5250.50,
                'type': 'checking'
            },
            {
                'id': 2,
                'name': 'Savings Account',
                'balance': 25000.00,
                'type': 'savings'
            },
            {
                'id': 3,
                'name': 'Investment Account',
                'balance': 45300.75,
                'type': 'investment'
            }
        ]
    })

@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    """Mock API endpoint for transactions"""
    return jsonify({
        'transactions': [
            {
                'id': 1,
                'date': '2024-06-10',
                'description': 'Grocery Store',
                'amount': -87.50,
                'category': 'Shopping'
            },
            {
                'id': 2,
                'date': '2024-06-09',
                'description': 'Salary Deposit',
                'amount': 3500.00,
                'category': 'Income'
            },
            {
                'id': 3,
                'date': '2024-06-08',
                'description': 'Utility Payment',
                'amount': -125.00,
                'category': 'Bills'
            }
        ]
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
