import sqlite3
import pg8000
import os

sqlite_db_path = os.path.join(os.path.dirname(__file__), '../mawena.db')

# Connect to SQLite
sqlite_conn = sqlite3.connect(sqlite_db_path)
sqlite_cursor = sqlite_conn.cursor()

# Connect to PostgreSQL Neon
postgres_conn = pg8000.connect(
    user="neondb_owner",
    password="npg_VrsIR1Zd4wTy",
    host="ep-bitter-bonus-apxa5j46.c-7.us-east-1.aws.neon.tech",
    database="neondb",
    ssl_context=True
)
postgres_cursor = postgres_conn.cursor()

def migrate_table(table_name, columns):
    print(f"\nMigrating table {table_name}...")
    
    # Get SQLite rows
    col_str = ", ".join([f'"{c}"' for c in columns])
    sqlite_cursor.execute(f"SELECT {col_str} FROM {table_name};")
    rows = sqlite_cursor.fetchall()
    
    if not rows:
        print(f"No rows found in {table_name} SQLite.")
        return
        
    print(f"Found {len(rows)} rows to migrate.")
    
    # Delete existing rows in Postgres to avoid duplicates
    try:
        postgres_cursor.execute(f"DELETE FROM {table_name};")
    except Exception as e:
        print(f"Could not clean table {table_name} (might not be created yet or constraint issue): {e}")
        # rollback to clear transaction error state
        postgres_conn.rollback()
        # reopen new transaction block
        postgres_cursor.execute("BEGIN;")
        return
    
    # Insert rows into Postgres
    placeholders = ", ".join(["%s"] * len(columns))
    insert_query = f"INSERT INTO {table_name} ({col_str}) VALUES ({placeholders});"
    
    success_count = 0
    for row in rows:
        try:
            # PostgreSQL driver expects list or tuple of values
            postgres_cursor.execute(insert_query, list(row))
            success_count += 1
        except Exception as e:
            print(f"Error inserting row in {table_name}: {e}")
            
    postgres_conn.commit()
    print(f"Successfully migrated {success_count}/{len(rows)} rows to {table_name}.")

try:
    # Migrate tables in the correct order to respect foreign key constraints
    
    # 1. users
    migrate_table("users", [
        "id", "name", "role", "email", "salt", "hash", 
        "login_attempts", "lock_until", "created_at", "updated_at"
    ])
    
    # 2. media
    migrate_table("media", [
        "id", "alt", "url", "thumbnail_u_r_l", "filename", "mime_type", "filesize", 
        "width", "height", "focal_x", "focal_y", 
        "sizes_thumbnail_url", "sizes_thumbnail_width", "sizes_thumbnail_height", "sizes_thumbnail_mime_type", "sizes_thumbnail_filesize", "sizes_thumbnail_filename",
        "sizes_card_url", "sizes_card_width", "sizes_card_height", "sizes_card_mime_type", "sizes_card_filesize", "sizes_card_filename",
        "sizes_fullscreen_url", "sizes_fullscreen_width", "sizes_fullscreen_height", "sizes_fullscreen_mime_type", "sizes_fullscreen_filesize", "sizes_fullscreen_filename",
        "created_at", "updated_at"
    ])
    
    # 3. categories
    migrate_table("categories", [
        "id", "name", "slug", "gender", "parent_id", "image_id", "description", 
        "order", "created_at", "updated_at"
    ])
    
    # 4. products
    migrate_table("products", [
        "id", "name", "slug", "price", "compare_at_price", "category_id", "description", 
        "short_description", "has_variants", "in_stock", "featured", "seo_meta_title", 
        "seo_meta_description", "is_customizable", "weight", "created_at", "updated_at"
    ])
    
    # 5. products_images
    migrate_table("products_images", ["id", "_order", "_parent_id", "image_id", "alt"])
    
    # 6. products_variants
    migrate_table("products_variants", ["_order", "_parent_id", "id", "label", "available"])
    
    # 7. settings
    migrate_table("settings", [
        "id", "wave_payment_link", "whatsapp_number", "delivery_instructions", 
        "created_at", "updated_at"
    ])
    
    # 8. settings_shipping_rules
    migrate_table("settings_shipping_rules", [
        "_order", "_parent_id", "id", "country_code", "city", 
        "min_weight", "max_weight", "cost"
    ])
    
    print("\nData migration finished successfully!")
    
except Exception as e:
    print(f"\nMigration failed with error: {e}")
    postgres_conn.rollback()

finally:
    sqlite_conn.close()
    postgres_conn.close()
