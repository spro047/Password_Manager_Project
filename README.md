# Password Manager (Flask + Python)

A lightweight, local-only demo password manager featuring a Python Flask backend and a simple HTML/JS frontend.

## Description

This project is a rudimentary password management system designed to demonstrate how to securely store and retrieve account credentials locally. It utilizes the `cryptography.fernet` module to apply symmetric encryption (AES + HMAC) to the passwords before saving them into a simple JSON database (`passwords.json`). 

The application offers an intuitive web interface to:
- Generate strong, randomized passwords of customizable length.
- Add new accounts with their respective usernames and passwords.
- View stored passwords (decrypts them for viewing purposes).
- Delete existing entries from the vault.

*Note: This is an educational project and is not intended for deployment to the public internet. It lacks authentication and intentionally decrypts passwords in bulk on the `/view` route for demonstration purposes.*

## Quickstart / How to Run

1. **Create & activate a virtual environment**
   - **Windows (PowerShell)**
     ```powershell
     python -m venv .venv
     .venv\Scripts\Activate.ps1
     ```
   - **macOS / Linux**
     ```bash
     python3 -m venv .venv
     source .venv/bin/activate
     ```

2. **Install dependencies**
   Ensure you have `Flask` and `cryptography` installed via `requirements.txt`:
   ```bash
   python -m pip install --upgrade pip
   pip install -r requirements.txt
   ```

3. **Run the application**
   ```bash
   python app.py
   ```

4. **Access the Web Interface**
   Open your browser and navigate to:
   ```
   http://127.0.0.1:5000
   ```
   *(If port 5000 is busy, modify the `app.run` port parameter at the bottom of `app.py`)*

## Project Structure

- `app.py`: The core Flask routing logic and encryption handling.
- `key.key`: Automatically generated symmetric encryption key (keep this secret!).
- `passwords.json`: Local storage file for encrypted account credentials.
- `requirements.txt`: Python package dependencies.
- `templates/` & `static/`: Frontend HTML, CSS, and JavaScript.

## Challenges Faced

During the creation of this Password Manager, several interesting challenges were encountered:

1. **Symmetric Encryption Implementation**: Figuring out how to securely encrypt and decrypt strings in Python was accomplished using the `cryptography.fernet` library. A key challenge was ensuring that the dynamically generated `key.key` was loaded consistently across application restarts so previously encrypted passwords wouldn't be permanently locked.
2. **File-based Data Storage**: Creating a functional database without utilizing a heavy external database (like PostgreSQL or MySQL). A lightweight dictionary-based JSON architecture (`passwords.json`) was implemented, bringing challenges in file read/write synchronization and ensuring data appending didn't overwrite earlier entries.
3. **Frontend-Backend Integration**: Building asynchronous interaction between the simple HTML/JS frontend and the Flask backend using `fetch` API requests to seamlessly add and delete passwords without fully reloading the web page.
4. **Strong Password Generation**: Writing an algorithm on the server side (`/generate`) to randomly construct passwords using uppercase, lowercase, numbers, and special characters, while maintaining user control over the desired length (handling constraints like min length of 8 and max of 64).
