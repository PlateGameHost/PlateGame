import firebase_admin
from flask import Flask, jsonify, request
from flask_cors import CORS
from firebase_admin import firestore, credentials, initialize_app
from datetime import datetime, timezone
import os

app = Flask(__name__)

default_app = initialize_app()
db = firestore.client()

prod_ref = db.collection('prod')
users_ref = prod_ref.document('users')
leagues_ref = prod_ref.document('leagues')

@app.route('/', methods=['GET'])
def read_health():
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
        return jsonify({"success": True}), 200
    except Exception as e:
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
            'plates': [],
        }
        users_ref.document(uuid).set(user_obj)
        return jsonify({"success": True}), 200
    except Exception as e:
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

        plate_info = request.json.get('plate_info')

        user_ref.update({
        'plates': firestore.ArrayUnion(plate_info)
        })

        return jsonify({"success": True, "plate added": plate_info}), 200
    except Exception as e:
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
            plate_history = users_ref.collection(uuid).get('plates')
            return jsonify(plate_history), 200
        else:
            return jsonify({'success': False, 'error': 'please include uuid in query params'}), 500
    except Exception as e:
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