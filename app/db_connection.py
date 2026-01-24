from pymongo import MongoClient

# Establish connection to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['test']
users_collection = db['user']

# Signup function to store user details
def signup_user(username, password, child_name, parent_name, age, email):
    user = {
        'username': username,
        'password': password,
        'child_name': child_name,
        'parent_name': parent_name,
        'age': age,
        'email': email
    }
    if users_collection.find_one({'username': username}):
        return 'Username already exists!'
    users_collection.insert_one(user)
    return 'User registered successfully!'

# Login function to verify user details
def login_user(username, password):
    user = users_collection.find_one({'username': username, 'password': password})
    if user:
        return 'Login successful!'
    else:
        return 'Invalid username or password!'

if __name__ == '__main__':
    # Example usage
    print(signup_user('testuser', 'password123', 'Aishu', 'Kumar', 10, 'aishu@example.com'))
    print(login_user('testuser', 'password123'))
