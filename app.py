from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, send_file
import pandas as pd
import requests
import os
import time
import csv
from datetime import datetime, timezone

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'

# ==== CONFIGURATION ====
UPLOAD_FOLDER = 'uploads'
RESPONSE_LOG = 'vapi_responses.csv'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

VAPI_API_KEY = ""
VAPI_AGENT_ID = ""
TWILIO_PHONE_NUMBER = ""
TWILIO_SID = ""
TWILIO_AUTH_TOKEN = ""
WEBHOOK_URL = ""

HEADERS = {
    "Authorization": f"Bearer {VAPI_API_KEY}",
    "Content-Type": "application/json"
}

def initiate_call(name, phone):
    payload = {
        "customer": {
            "number": f"+{phone}",
            "name": name
        },
        "phoneNumber": {
            "twilioPhoneNumber": TWILIO_PHONE_NUMBER,
            "twilioAccountSid": TWILIO_SID,
            "twilioAuthToken": TWILIO_AUTH_TOKEN
        },
        "assistantId": VAPI_AGENT_ID,
        "webhookUrl": WEBHOOK_URL,
        "metadata": {
            "clientName": name
        }
    }

    try:
        response = requests.post("https://api.vapi.ai/call/phone", headers=HEADERS, json=payload)
        if response.status_code == 200:
            return f"✅ Call initiated: {name} ({phone})"
        else:
            return f"❌ Failed: {name} ({phone}) - {response.text}"
    except Exception as e:
        return f"⚠️ Error: {name} ({phone}) - {str(e)}"

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        uploaded_file = request.files.get('file')
        if not uploaded_file or uploaded_file.filename == '':
            flash("Please upload a valid Excel file (.xlsx)")
            return redirect(request.url)

        file_path = os.path.join(UPLOAD_FOLDER, uploaded_file.filename)
        uploaded_file.save(file_path)

        try:
            df = pd.read_excel(file_path)
        except Exception:
            flash("❌ Unable to read Excel file. Please check the format.")
            return redirect(request.url)

        if 'Name' not in df.columns or 'Phone' not in df.columns:
            flash("❌ Excel must contain 'Name' and 'Phone' columns.")
            return redirect(request.url)

        call_logs = []
        for _, row in df.iterrows():
            name = str(row["Name"]).strip()
            phone = str(row["Phone"]).strip()

            if not phone or len(phone) < 10:
                call_logs.append(f"⚠️ Skipping invalid number: {name} - {phone}")
                continue

            status = initiate_call(name, phone)
            call_logs.append(status)
            time.sleep(1)

        return render_template("result.html", logs=call_logs)

    return render_template("index.html")

@app.route('/vapi-response', methods=['POST'])
def vapi_response():
    data = request.json

    timestamp = datetime.now(timezone.utc).isoformat()
    call_id = data.get("callId", "")
    phone_number = data.get("phoneNumber", "")
    status = data.get("status", "")
    transcript = data.get("transcript", "")
    agent_response = data.get("agentResponse", "")
    client_response = data.get("clientResponse", "")

    row = [timestamp, call_id, phone_number, status, agent_response, client_response, transcript]
    file_exists = os.path.isfile(RESPONSE_LOG)

    with open(RESPONSE_LOG, mode='a', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        if not file_exists:
            writer.writerow(["Timestamp", "Call ID", "Phone", "Status", "Agent Response", "Client Response", "Transcript"])
        writer.writerow(row)

    return jsonify({"status": "logged"}), 200

@app.route('/view-responses')
def view_responses():
    if not os.path.exists(RESPONSE_LOG):
        return "<h3>No responses received yet.</h3>"

    with open(RESPONSE_LOG, newline='', encoding='utf-8') as f:
        reader = csv.reader(f)
        data = list(reader)

    return render_template("responses.html", headers=data[0], rows=data[1:])

@app.route('/download-responses')
def download_responses():
    if os.path.exists(RESPONSE_LOG):
        return send_file(RESPONSE_LOG, as_attachment=True)
    return "No response file found.", 404

# Add this to your app.py if not already present
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Make sure static files are served correctly
from flask import send_from_directory

@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)

if __name__ == '__main__':
    app.run(debug=True)
