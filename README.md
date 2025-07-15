# VAPI Call Manager 📞

**VAPI Call Manager** is a web application built with **Flask** (Python) and a modern frontend (Next.js + Tailwind CSS) for managing and initiating voice calls using contact lists uploaded in Excel format.

![VAPI Call Manager Screenshot](./path/to/your/screenshot.png)

---

## ✨ Features

✅ Upload Excel files (.xlsx or .xls) with contact lists  
✅ Drag & Drop or file selection UI  
✅ File validation: requires columns **Name** and **Phone**  
✅ Displays file requirements and sample format  
✅ Clean, modern UI styled with Tailwind CSS  
✅ Built using:
- **Flask** (Python backend)
- **Jinja2** templates
- **Next.js** frontend components
- **Tailwind CSS** for styling

---

## 📝 File Requirements

- Excel format: `.xlsx` or `.xls`
- Must contain columns:
  - `Name`
  - `Phone`
- Phone numbers should include country code (without `+`)
- Maximum file size: **16MB**

---

## 💻 How to Run Locally

1. **Clone the repo**

    ```bash
    git clone https://github.com/yourusername/vapi-call-manager.git
    cd vapi-call-manager
    ```

2. **Create virtual environment**

    ```bash
    python -m venv venv
    ```

3. **Activate virtual environment**

    - Windows:

      ```bash
      .\venv\Scripts\activate
      ```

    - macOS / Linux:

      ```bash
      source venv/bin/activate
      ```

4. **Install dependencies**

    ```bash
    pip install -r requirements.txt
    ```

5. **Run Flask app**

    ```bash
    python app.py
    ```

6. Visit:

    ```
    http://127.0.0.1:5000
    ```

---

## 📂 Project Structure

├── app.py
├── templates/
│ ├── base.html
│ └── index.html
├── uploads/
├── public/
├── styles/
├── components/
├── app/
├── venv/
└── README.md


![Screenshot](./screenshots/vapi-call-manager.png)
