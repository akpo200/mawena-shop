import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), '../mawena.db')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Get users
print("\nUsers found in 'users':")
try:
    cursor.execute("SELECT id, email, role, name FROM users;")
    users = cursor.fetchall()
    for user in users:
        print(f"ID: {user[0]}, Email: {user[1]}, Role: {user[2]}, Name: {user[3]}")
except Exception as e:
    print(f"Error reading users: {e}")

# Check products count
try:
    cursor.execute("SELECT COUNT(*) FROM products;")
    print(f"Products count: {cursor.fetchone()[0]}")
except Exception as e:
    print(f"Error counting products: {e}")

# Check categories count
try:
    cursor.execute("SELECT COUNT(*) FROM categories;")
    print(f"Categories count: {cursor.fetchone()[0]}")
except Exception as e:
    print(f"Error counting categories: {e}")

conn.close()
