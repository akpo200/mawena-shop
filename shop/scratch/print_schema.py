import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), '../mawena.db')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Get all tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()

for table in tables:
    table_name = table[0]
    print(f"\nSchema for table {table_name}:")
    cursor.execute(f"PRAGMA table_info({table_name});")
    columns = cursor.fetchall()
    for col in columns:
        print(f"  Column: {col[1]} ({col[2]})")

conn.close()
