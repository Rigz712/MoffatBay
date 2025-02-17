from flask import Flask, request, redirect, render_template
import mysql.connector

app = Flask(__name__)

# ✅ MySQL Database Connection
db = mysql.connector.connect(
    host="localhost",
    user="root",  # Change if you use a different MySQL user
    password="",  # Add your MySQL password if required
    database="moffat_lodge"
)

@app.route('/')
def home():
    return "Flask is running!"  # ✅ Debug: Check if Flask is running

# ✅ Contact Form Route
@app.route('/submit_contact', methods=['POST'])
def submit_contact():
    try:
        name = request.form.get('name')
        email = request.form.get('email')
        message = request.form.get('message')

        if not name or not email or not message:
            return "Missing data", 400  # 🚨 Error handling for missing fields

        cursor = db.cursor()
        sql = "INSERT INTO contact_us (name, email, message) VALUES (%s, %s, %s)"
        values = (name, email, message)
        cursor.execute(sql, values)
        db.commit()
        cursor.close()

        print("✅ Data inserted successfully!")  # ✅ Debugging

        return redirect('/thank_you.html')  # ✅ Redirect to thank-you page

    except Exception as e:
        print("❌ Error:", str(e))  # ✅ Debugging
        return "Database error", 500

# ✅ Thank You Page Route (Create `thank_you.html` if needed)
@app.route('/thank_you.html')
def thank_you():
    return "<h1>Thank you! Your message has been received.</h1>"

if __name__ == '__main__':
    app.run(debug=True)
