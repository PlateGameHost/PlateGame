from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

@app.route('/api/profile', methods=['GET'])
def get_data():
    return jsonify({
        'message': 'i love dih',
        'status': 'success'
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)