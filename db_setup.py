import mysql.connector

db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'moffat_lodge'
}

conn = mysql.connector.connect(**db_config)
cursor = conn.cursor()

# 📌 Create Contact Us Messages Table
cursor.execute("""
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

# 📌 Create Reservations Table (for Lookup)
cursor.execute("""
CREATE TABLE IF NOT EXISTS reservations (
    reservation_id VARCHAR(50) PRIMARY KEY,
    full_name VARCHAR(100),
    email VARCHAR(100),
    check_in DATE,
    check_out DATE,
    room_type VARCHAR(50),
    guests INT
)
""")

conn.commit()
conn.close()

print("✅ Database setup complete!")
