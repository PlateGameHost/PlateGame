import firebase_admin
from flask import Flask, jsonify, request
from flask_cors import CORS
from firebase_admin import firestore, credentials
from datetime import datetime, timezone
import os
import traceback
from google.cloud.firestore_v1.transforms import ArrayUnion

basedir = os.path.abspath(os.path.dirname(__file__))
cred_path = os.path.join(basedir, "serviceAccountKey.json")

print(cred_path)
if os.path.exists(cred_path):
    cred = credentials.Certificate(cred_path)
    default_app = firebase_admin.initialize_app(cred)
else:
    default_app = firebase_admin.initialize_app()

app = Flask(__name__)

ALLOWED_ORIGINS = ["http://localhost:5173", "https://plate-game-f1495.web.app"]

CORS(app, resources={r"/*": {"origins": ALLOWED_ORIGINS}})

db = firestore.client()

users_ref = db.collection('users')
leagues_ref = db.collection('leagues')

@app.route('/', methods=['GET'])
def read_health():
    try:
        return jsonify({"success": True}), 200
    except Exception as e:
        traceback.print_exc()
        return f"An Error Occured: {e}"
    
@app.route('/add-user', methods=['POST'])
def create_user():
    """
        create() : Add document to Firestore collection with request body
        this is for new users upon signup, fills in general info and creates the document
        e.g. input json object: 
        {
        'general_info': {'name': 'Jack Fogerty', 'username': 'jackfogerty', 'email': 'bobsaggit678@gmail.com'},
        'uuid': uuid
        }
    """
    try:
        uuid = request.json.get('uuid')
        user_obj = {
            'general_info': request.json['general_info'],
            'leagues': {},
        }
        users_ref.document(uuid).set(user_obj)

        return jsonify({"success": True}), 200
    except Exception as e:
        traceback.print_exc()
        return f"An Error Occured: {e}"
    
@app.route('/create-league', methods=['POST'])
def create_league():
    """
        create() : Add document to Firestore collection with request body
        this is for a user creating a new league
        e.g. input json object: 
        {
        'league_name': name,
        'username': username
        }
    """
    try:
        username = request.json.get('username')
        league_name = request.json.get('league_name')

        league_id = str(username) + str(datetime.now(timezone.utc))

        league_obj = {
            'league_name': league_name,
            'league_id': league_id
        }

        users_ref.document(league_id).set(league_obj)
        return jsonify({"success": True}), 200
    
    except Exception as e:
        traceback.print_exc()
        return f"An Error Occured: {e}"
    
@app.route('/join-league', methods=['POST'])
def join_league():
    """
        create() : Add document to Firestore collection with request body
        this is for a user joining a league that already exists
        e.g. input json object: 
        {
        'league_id': id of league they want to join,
        'uuid': uuid
        }
    """
    try:
        league_id = request.json.get('league_id')
        uuid = request.json.get('uuid')

        updated_obj = {uuid: 'in league'}

        leagues_ref.document(league_id).update(updated_obj)

        return jsonify({"success": True}), 200
    except Exception as e:
        traceback.print_exc()
        return f"An Error Occured: {e}"

@app.route('/plate-found', methods=['POST'])
def plate_found():
    """
        create() : Add document to Firestore collection with request body
        this is for when a plate is found
        e.g. input json object: 
        {
        'plate_info': {'plate_num': '001', 'date': 'May 25, 2026', 'notes': 'random notes', 'img': 's3 url'},
        'uuid': uuid
        }
    """
    try:
        uuid = request.json.get('uuid')

        user_ref = users_ref.document(uuid)

        plates_ref = user_ref.collection('plates')

        plate_info = request.json.get('plate_info')

        plates_ref.document(plate_info['plate_num']).set(plate_info)

        return jsonify({"success": True, "plate added": plate_info}), 200
    except Exception as e:
        traceback.print_exc()
        return f"An Error Occured: {e}"

@app.route('/get-full-plate-history', methods=['GET'])
def read_plate_history():
    """
        read() : Fetches documents from Firestore collection as JSON
        query params: uuid
    """
    try:
        uuid = request.args.get('uuid')
        if uuid:
            user_ref = users_ref.document(uuid)
            plates_ref = user_ref.collection('plates')
            plate_history_snapshot = plates_ref.stream()

            plate_history = []
            for doc in plate_history_snapshot:
                data = doc.to_dict()
                plate_history.append(data)

            return jsonify(plate_history)
        else:
            return jsonify({'success': False, 'error': 'please include uuid in query params'}), 500
    except Exception as e:
        traceback.print_exc()
        return f"An Error Occured: {e}"
    
@app.route('/get-user-profile', methods=['GET'])
def read_user_info():
    """
        read() : Fetches documents from Firestore collection as JSON
        query params: uuid
    """
    try:
        uuid = request.args.get('uuid')
        if uuid:
            user_ref = users_ref.document(uuid)
            user = user_ref.get()
            return jsonify(user), 200
        else:
            return jsonify({'success': False, 'error': 'please include uuid in query params'}), 500
    except Exception as e:
        traceback.print_exc()
        return f"An Error Occured: {e}"
    
@app.route('/get-league-info', methods=['GET'])
def read_league_info():
    """
        read() : Fetches documents from Firestore collection as JSON
        query params: league_id
    """
    try:
        league_id = request.args.get('league_id')
        if league_id:
            leagues_doc = leagues_ref.get()
            league = leagues_doc.get(league_id)
            return jsonify(league), 200
        else:
            return jsonify({'success': False, 'error': 'please include uuid in query params'}), 500
    except Exception as e:
        traceback.print_exc()
        return f"An Error Occured: {e}"


'''
@app.route('/update', methods=['POST', 'PUT'])
def update():
    """
        update() : Update document in Firestore collection with request body
        Ensure you pass a custom ID as part of json body in post request
        e.g. json={'id': '1', 'title': 'Write a blog post today'}
    """
    try:
        id = request.json['id']
        todo_ref.document(id).update(request.json)
        return jsonify({"success": True}), 200
    except Exception as e:
        return f"An Error Occured: {e}"
    
@app.route('/delete', methods=['GET', 'DELETE'])
def delete():
    """
        delete() : Delete a document from Firestore collection
    """
    try:
        # Check for ID in URL query
        todo_id = request.args.get('id')
        todo_ref.document(todo_id).delete()
        return jsonify({"success": True}), 200
    except Exception as e:
        return f"An Error Occured: {e}"
'''

if __name__ == "__main__":
    app.run(debug=True, port=8080)