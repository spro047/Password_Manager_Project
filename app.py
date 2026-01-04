from flask import Flask, render_template, request, jsonify
import os, json, random, string
from cryptography.fernet import Fernet

app = Flask(__name__)

KEY_FILE = "key.key"
DATA_FILE = "passwords.json"

# Create or load encryption key
if not os.path.exists(KEY_FILE):
    with open(KEY_FILE, "wb") as f:
        f.write(Fernet.generate_key())
fernet = Fernet(open(KEY_FILE, "rb").read())

def load_passwords():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    return {}

def save_passwords(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=4)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/generate")
def generate_password():
    # /generate?length=16 (default 16)
    try:
        length = int(request.args.get("length", 16))
    except ValueError:
        length = 16
    length = max(8, min(64, length))
    chars = string.ascii_letters + string.digits + string.punctuation
    pwd = ''.join(random.choice(chars) for _ in range(length))
    return jsonify({"password": pwd})

@app.route("/add", methods=["POST"])
def add_password():
    data = request.json or {}
    account = (data.get("account") or "").strip()
    username = (data.get("username") or "").strip()
    password = data.get("password") or ""

    if not account or not username or not password:
        return jsonify({"error": "account, username, and password are required"}), 400

    enc_pwd = fernet.encrypt(password.encode()).decode()
    vault = load_passwords()
    vault[account] = {"username": username, "password": enc_pwd}
    save_passwords(vault)
    return jsonify({"message": "Saved"}), 201

@app.route("/view")
def view_passwords():
    # WARNING: Decrypting in bulk for demo purposes only.
    vault = load_passwords()
    items = []
    for account, details in vault.items():
        try:
            dec_pwd = fernet.decrypt(details["password"].encode()).decode()
        except Exception:
            dec_pwd = "[decryption error]"
        items.append({"account": account, "username": details["username"], "password": dec_pwd})
    return jsonify(items)

@app.route("/delete/<account>", methods=["DELETE"])
def delete_password(account):
    vault = load_passwords()
    if account in vault:
        del vault[account]
        save_passwords(vault)
        return jsonify({"message": f"Deleted {account}"}), 200
    return jsonify({"error": "Account not found"}), 404

if __name__ == "__main__":
    # Change port=5001 if 5000 is busy
    app.run(debug=True)
