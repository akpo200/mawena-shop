import sqlite3
import os
import datetime
import json

db_path = os.path.join(os.path.dirname(__file__), '../mawena.db')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("Cleaning existing database records (products, categories, media)...")
cursor.execute("DELETE FROM products_images;")
cursor.execute("DELETE FROM products_variants;")
cursor.execute("DELETE FROM products;")
cursor.execute("DELETE FROM categories;")
cursor.execute("DELETE FROM media;")
conn.commit()

# Clean ISO 8601 UTC timestamp format for JavaScript Date parser
now = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z")

# 1. Insert Media
media_files = [
    ("B1.jpeg", "Photo Bonnet tricoté noir"),
    ("B2.jpeg", "Photo Bonnet tressé caramel"),
    ("B12.jpeg", "Photo Bracelet en perles multicolores"),
    ("3.jpeg", "Photo Bague en résine dorée"),
    ("BOUCLE RAFIA.jpeg", "Photo Boucles d'oreilles raphia"),
    ("2.jpeg", "Photo Tote bag Mawena naturel"),
    ("WhatsApp Image 2026-03-19 at 09.19.04.jpeg", "Photo Tote bag imprimé wax"),
    ("MONTRES.jpeg", "Photo Montre homme bronze"),
    ("B3.jpeg", "Photo Scrunchie soie"),
    ("B4.jpeg", "Photo Haut batik femme"),
    ("B5.jpeg", "Photo Short batik coloré"),
    ("B8.jpeg", "Photo Bracelet cuivre artisanal"),
]

media_ids = {}
for idx, (filename, alt) in enumerate(media_files, 1):
    url = f"/api/media/file/{filename}"
    cursor.execute("""
        INSERT INTO media (id, alt, url, filename, mime_type, created_at, updated_at)
        VALUES (?, ?, ?, ?, 'image/jpeg', ?, ?);
    """, (idx, alt, url, filename, now, now))
    media_ids[filename] = idx

print(f"Inserted {len(media_files)} media files.")

# 2. Insert Categories
categories = [
    (1, "Bonnets", "bonnets", "femme", 0),
    (2, "Bijoux", "bijoux", "femme", 0),
    (3, "Tote Bags", "tote-bags", "unisexe", 0),
    (4, "Montres", "montres", "homme", 0),
    (5, "Vêtements Batik", "vetements-batik", "femme", 0),
    (6, "Univers Enfant", "enfant", "enfant", 0),
]

for cat in categories:
    cursor.execute("""
        INSERT INTO categories (id, name, slug, gender, "order", created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?);
    """, (cat[0], cat[1], cat[2], cat[3], cat[4], now, now))

print(f"Inserted {len(categories)} categories.")

# Helper to generate Lexical richText JSON
def make_lexical_json(text):
    return json.dumps({
        "root": {
            "type": "root",
            "children": [
                {
                    "type": "paragraph",
                    "children": [
                        {
                            "type": "text",
                            "text": text,
                            "version": 1
                        }
                    ],
                    "direction": "ltr",
                    "format": "",
                    "indent": 0,
                    "version": 1
                }
            ],
            "direction": "ltr",
            "format": "",
            "indent": 0,
            "version": 1
        }
    })

# 3. Insert Products
products = [
    # Bonnets
    (1, "Bonnet tricoté noir", "bonnet-tric-noir", 3500, 1, "Bonnet artisanal élégant", "Bonnet tricoté de manière artisanale en laine douce.", 1, 1, 0, "B1.jpeg"),
    (2, "Bonnet tressé caramel", "bonnet-tress-caramel", 3500, 1, "Bonnet tricoté à la main", "Bonnet avec motif tressé de couleur caramel chaud.", 1, 1, 0, "B2.jpeg"),
    (9, "Scrunchie soie", "scrunchie-soie", 2000, 1, "Élastique cheveux en soie", "Scrunchie en soie pour protéger vos cheveux avec élégance.", 1, 1, 0, "B3.jpeg"),
    
    # Bijoux
    (3, "Bracelet en perles", "bracelet-perles", 4500, 2, "Bijou artisanal africain", "Bracelet fait main avec perles traditionnelles colorées.", 1, 1, 1, "B12.jpeg"),
    (4, "Bague en résine dorée", "bague-resine", 3000, 2, "Bague artisanale unique", "Bague élégante en résine avec inclusions dorées.", 1, 1, 0, "3.jpeg"),
    (5, "Boucles d'oreilles raphia", "boucles-raphia", 4000, 2, "Boucles en fibres naturelles", "Boucles d'oreilles en raphia naturel tressé à la main.", 1, 1, 1, "BOUCLE RAFIA.jpeg"),
    (12, "Bracelet cuivre artisanal", "bracelet-cuivre", 5500, 2, "Bracelet en cuivre travaillé", "Bracelet torsadé en cuivre pur martelé artisanalement.", 1, 1, 0, "B8.jpeg"),
    
    # Tote Bags
    (6, "Tote bag Mawena naturel", "tote-bag-naturel", 6000, 3, "Sac en coton unisexe", "Sac cabas en toile de coton écru naturel très robuste.", 1, 1, 1, "2.jpeg"),
    (7, "Tote bag imprimé wax", "tote-bag-wax", 6000, 3, "Sac avec motif wax africain", "Tote bag doublé en tissu wax aux couleurs solaires.", 1, 1, 0, "WhatsApp Image 2026-03-19 at 09.19.04.jpeg"),
    
    # Montres
    (8, "Montre homme bronze", "montre-homme-bronze", 18000, 4, "Montre au cadran bronze doré", "Montre élégante pour homme avec bracelet en cuir et cadran bronze.", 1, 1, 0, "MONTRES.jpeg"),
    
    # Batik
    (10, "Haut batik femme", "haut-batik", 12000, 5, "Haut en tissu batik fait main", "Haut léger d'été teint selon la technique artisanale du batik.", 0, 1, 0, "B4.jpeg"),
    (11, "Short batik coloré", "short-batik", 10000, 5, "Short en batik africain", "Short confortable aux teintes colorées réalisées à la main.", 0, 1, 0, "B5.jpeg"),
]

for p in products:
    # insert product with lexical json description
    lexical_desc = make_lexical_json(p[6])
    cursor.execute("""
        INSERT INTO products (id, name, slug, price, category_id, short_description, description, in_stock, featured, is_customizable, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, (p[0], p[1], p[2], p[3], p[4], p[5], lexical_desc, p[7], p[8], p[9], now, now))
    
    # insert products_images mapping
    image_filename = p[10]
    media_id = media_ids[image_filename]
    cursor.execute("""
        INSERT INTO products_images (id, _order, _parent_id, image_id, alt)
        VALUES (?, 1, ?, ?, ?);
    """, (f"img-{p[0]}", p[0], media_id, p[5]))
    
    # insert standard variants
    cursor.execute("""
        INSERT INTO products_variants (_order, _parent_id, id, label, available)
        VALUES (1, ?, ?, 'Taille Unique', 1);
    """, (p[0], f"var-{p[0]}"))

conn.commit()
conn.close()
print("Database seeding completed successfully with clean ISO dates!")
