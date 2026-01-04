# Password Manager (Flask + Python)

This is a local-only demo password manager with a Flask backend and a simple HTML/JS frontend.

## Quickstart

1. Create & activate a virtual environment
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

2. Install dependencies
   ```bash
   python -m pip install --upgrade pip
   pip install -r requirements.txt
   ```

3. Run the app
   ```bash
   python app.py
   ```

4. Open the browser at http://127.0.0.1:5000

## Notes
- Encryption uses `cryptography.Fernet` (AES + HMAC). The key is stored in `key.key`.
- For learning only, `/view` decrypts all entries to display in the UI.
- Do **not** deploy this as-is to the internet. In production, protect endpoints, require authentication, and avoid returning plaintext passwords.
