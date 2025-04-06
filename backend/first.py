from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, firestore, storage
import uuid
import base64
from werkzeug.utils import secure_filename
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

cred = credentials.Certificate('/Users/rijulpoudel/Desktop/hack-ku-2025/backend/service_account_file.json')
firebase_admin.initialize_app(cred, {
    'storageBucket': 'skrrv-94cf5.firebasestorage.com'  # ✅ CORRECT!
})

db = firestore.client()
bucket = storage.bucket()

@app.route('/store', methods=['POST'])
def store_item():
    data = request.get_json()
    name = data.get('name')
    location = data.get('location')
    photo_url = data.get('imageUrl')

    if not name or not location:
        return jsonify({'error': 'Missing fields'}), 400

    doc_ref = db.collection('item').document(name)
    doc = doc_ref.get()

    if doc.exists:
        item = doc.to_dict()
        locations = item.get('locations', [])
        if location not in locations:
            locations.append(location)
        doc_ref.update({
            'locations': locations,
            'photo': photo_url or item.get('photo')
        })
        return jsonify({'message': f"Updated {name}", 'photo': photo_url})
    else:
        doc_ref.set({
            'name': name,
            'locations': [location],
            'photo': photo_url
        })
        return jsonify({'message': f"Stored {name}", 'photo': photo_url})

@app.route('/retrieve', methods=['GET'])
def retrieve_item():
    name = request.args.get('name')
    doc = db.collection('item').document(name).get()
    if doc.exists:
        return jsonify(doc.to_dict())
    else:
        return jsonify({'error': 'Item not found'}), 404

@app.route('/upload-image', methods=['POST'])
def upload_image():
    try:
        image = request.files['image']
        if not image:
            return jsonify({'error': 'No image file provided'}), 400

        filename = secure_filename(image.filename)
        blob = bucket.blob(f'images/{uuid.uuid4().hex}_{filename}')
        blob.upload_from_file(image, content_type='image/jpeg')
        blob.make_public()

        return jsonify({'imageUrl': blob.public_url})
    
    except Exception as e:
        print(f"Upload failed: {e}")
        return jsonify({'error': 'Upload failed', 'details': str(e)}), 500

@app.route('/all-items', methods=['GET'])
def all_items():
    docs = db.collection('item').stream()
    results = []
    for doc in docs:
        item = doc.to_dict()
        results.append({
            'name': item.get('name'),
            'locations': item.get('locations', []),
            'photo': item.get('photo', None)
        })
    return jsonify(results)

@app.route('/delete-item', methods=['DELETE'])
def delete_item():
    name = request.args.get('name')
    if not name:
        return jsonify({'error': 'Name required'}), 400

    doc_ref = db.collection('item').document(name)
    doc = doc_ref.get()
    if doc.exists:
        doc_ref.delete()
        return jsonify({'message': f"{name} deleted"})
    else:
        return jsonify({'error': f"{name} not found"}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5050, debug=True)
