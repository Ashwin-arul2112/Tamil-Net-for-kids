from flask import Flask, jsonify, render_template, request, session
from base64 import b64decode
from io import BytesIO
from PIL import Image
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
from pymongo import MongoClient
import random
import inference
import bcrypt
import webbrowser

app = Flask(__name__)
app.secret_key = 'supersecretkey123'  # Needed for session management

# === Neural Net Setup ===
class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()
        self.conv1 = nn.Conv2d(1, 16, 3, padding=1)
        self.bn1 = nn.BatchNorm2d(16)
        self.conv2 = nn.Conv2d(16, 16, 3, padding=1)
        self.bn2 = nn.BatchNorm2d(16)
        self.pool1 = nn.MaxPool2d(2, 2)
        self.conv3 = nn.Conv2d(16, 32, 3, padding=1)
        self.bn3 = nn.BatchNorm2d(32)
        self.conv4 = nn.Conv2d(32, 32, 3, padding=1)
        self.bn4 = nn.BatchNorm2d(32)
        self.conv5 = nn.Conv2d(32, 64, 3, padding=1)
        self.bn5 = nn.BatchNorm2d(64)
        self.conv6 = nn.Conv2d(64, 64, 3, padding=1)
        self.bn6 = nn.BatchNorm2d(64)
        self.fc1 = nn.Linear(64 * 8 * 8, 1024)
        self.bn7 = nn.BatchNorm1d(1024)
        self.fc2 = nn.Linear(1024, 512)
        self.bn8 = nn.BatchNorm1d(512)
        self.fc3 = nn.Linear(512, 156)

    def forward(self, x):
        x = F.relu(self.bn1(self.conv1(x)))
        x = self.pool1(F.relu(self.bn2(self.conv2(x))))
        x = F.relu(self.bn3(self.conv3(x)))
        x = self.pool1(F.relu(self.bn4(self.conv4(x))))
        x = F.relu(self.bn5(self.conv5(x)))
        x = self.pool1(F.relu(self.bn6(self.conv6(x))))
        x = x.view(-1, 64 * 8 * 8)
        x = F.relu(self.bn7(self.fc1(x)))
        x = F.relu(self.bn8(self.fc2(x)))
        x = F.softmax(self.fc3(x), dim=1)
        return x

net = Net()
net.load_state_dict(torch.load("tamil_net.pt", map_location=torch.device('cpu')))
net.eval()

# === MongoDB Setup ===
client = MongoClient('mongodb://localhost:27017/')
db = client['test']
users_collection = db['user']

# Tamil Characters List
classes = ['அ', 'ஆ', 'இ', 'ஈ', 'உ', 'ஊ', 'எ', 'ஏ', 'ஐ', 'ஒ', 'ஓ', 'ஔ', 'க', 'ங', 'ச', 'ஞ', 'ட', 'ண', 'த', 'ந', 'ப', 'ம', 'ய', 'ர', 'ல', 'வ', 'ழ', 'ள', 'ற', 'ன', 
           'க்', 'ங்', 'ச்', 'ஞ்', 'ட்', 'ண்', 'த்', 'ந்', 'ப்', 'ம்', 'ய்', 'ர்', 'ல்', 'வ்', 'ழ்', 'ள்', 'ற்', 'ன்', 
           'ஃ', 'கி', 'ஙி', 'சி', 'ஞி', 'டி', 'ணி', 'தி', 'நி', 'பி', 'மி', 'யி', 'ரி', 'லி', 'வி', 'ழி', 'ளி', 'றி', 'னி', 
           'ஸி', 'ஷி', 'ஜி', 'ஹி', 'க்ஷி', 'கீ', 'ஙீ', 'சீ', 'ஞீ', 'டீ', 'ணீ', 'தீ', 'நீ', 'பீ', 'மீ', 'யீ', 'ரீ', 'லீ', 'வீ', 
           'ழீ', 'ளீ', 'றீ', 'னீ', 'ஸீ', 'ஷீ', 'ஜீ', 'ஹீ', 'ஏ', 'ஐ', 'க்ஷ', 'கு', 'ஙு', 'சு', 'ஞு', 'டு', 'ணு', 'து', 'நு', 'பு', 'மு', 'யு', 
           'ரு', 'லு', 'வு', 'ழு', 'ளு', 'று', 'னு', 'கூ', 'ஸ்ரீ', 'ஸு', 'ஷு', 'ஜு', 'ஹு', 'க்ஷு', 'ஸூ', 'ஷூ', 'ஜூ', 'ஹூ', 'க்ஷூ']

# === Routes ===
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if users_collection.find_one({"username": data['username']}):
        return jsonify({"success": False, "message": "Username already exists!"})

    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())

    users_collection.insert_one({
        "username": data['username'],
        "password": hashed_password,
        "childname": data['childname'],
        "parentname": data['parentname'],
        "age": data['age'],
        "email": data['email']
    })

    return jsonify({"success": True, "message": "Signup successful!"})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = users_collection.find_one({"username": data['username']})
    if user and bcrypt.checkpw(data['password'].encode('utf-8'), user['password']):
        session['parentname'] = user['parentname']  # Store parent in session
        return jsonify({"success": True})
    return jsonify({"success": False, "message": "Invalid username or password!"})

@app.route('/parent-dashboard-data')
def parent_dashboard_data():
    parentname = session.get('parentname')
    if not parentname:
        return jsonify({"success": False, "message": "Not logged in"}), 403

    children = list(users_collection.find(
        {"parentname": parentname}, {"_id": 0, "childname": 1, "age": 1, "username": 1}
    ))
    return jsonify({"success": True, "children": children})

@app.route('/')
def index():
    return render_template('Login.html')

@app.route('/main')
def index1():
    return render_template('main.html')

@app.route('/tamil-numbers')
def index2():
    return render_template('tn/Tamilnum.html')

@app.route('/Practice')
def index3():
    return render_template('tn/Practice.html')

@app.route('/Word')
def index4():
    return render_template('tn/word.html')

@app.route('/Parent')
def index5():
    return render_template('tn/parent.html')

@app.route('/predict', methods=['GET', 'POST'])
def predict():
    string_data = request.get_data().decode('utf-8')
    prediction = inference.get_prediction(string_data, net)
    return prediction

@app.route('/suggest', methods=['GET', 'POST'])
def suggest():
    suggestion = random.choice(classes)
    return suggestion

# === Start App ===
if __name__ == "__main__":
    webbrowser.open("http://127.0.0.1:5000")
    app.run()
