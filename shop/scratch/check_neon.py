import pg8000
import os

conn_string = "postgresql://neondb_owner:npg_VrsIR1Zd4wTy@ep-bitter-bonus-apxa5j46.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require"

try:
    # Connect to PostgreSQL Neon
    print("Connecting to Neon PostgreSQL...")
    # Parse the connection string
    # postgresql://user:password@host/dbname
    conn = pg8000.connect(
        user="neondb_owner",
        password="npg_VrsIR1Zd4wTy",
        host="ep-bitter-bonus-apxa5j46.c-7.us-east-1.aws.neon.tech",
        database="neondb",
        ssl_context=True
    )
    cursor = conn.cursor()
    
    # Query to list tables
    print("Querying tables in Neon...")
    cursor.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public';
    """)
    tables = cursor.fetchall()
    print(f"Tables found ({len(tables)}):")
    for table in tables:
        print(f"  - {table[0]}")
        
    conn.close()
except Exception as e:
    print(f"Error: {e}")
