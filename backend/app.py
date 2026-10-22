import firebase_admin
from flask import Flask, jsonify, request
from flask_cors import CORS
from firebase_admin import firestore, credentials, initialize_app
import os

cred = credentials.Certificate("./plate-game-f1495-firebase-adminsdk-fbsvc-f51c0269e4.json")

app = Flask(__name__)

# Initialize Firestore DB
cred = credentials.Certificate('key.json')

default_app = initialize_app(cred)
db = firestore.client()

users_ref = db.collection('prod', 'users')
leagues_ref = db.collection('prod', 'leagues')


@app.route('/add-user', methods=['POST'])
def create():
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

@app.route('/plate-found', methods=['POST'])
def create():
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

@app.route('/get-plates', methods=['GET'])
def read():
    """
        read() : Fetches documents from Firestore collection as JSON
        todo : Return document that matches query ID
        all_todos : Return all documents
    """
    try:
        # Check if ID was passed to URL query
        todo_id = request.args.get('id')    
        if todo_id:
            todo = todo_ref.document(todo_id).get()
            return jsonify(todo.to_dict()), 200
        else:
            all_todos = [doc.to_dict() for doc in todo_ref.stream()]
            return jsonify(all_todos), 200
    except Exception as e:
        return f"An Error Occured: {e}"
    
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

port = int(os.environ.get('PORT', 8080))
if __name__ == '__main__':
    app.run(threaded=True, host='0.0.0.0', port=port)