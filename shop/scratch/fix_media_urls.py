import sqlite3

db = sqlite3.connect('mawena.db')
cur = db.cursor()

# Mettre à jour les URLs dans la table media
cur.execute("UPDATE media SET url = REPLACE(url, '/api/media/file/', '/media/')")
print(f'Media URLs updated: {cur.rowcount} rows')

# Vérifier
cur.execute('SELECT id, filename, url FROM media LIMIT 5')
print('Sample media:')
for row in cur.fetchall():
    print(f'  ID={row[0]}, file={row[1]}, url={row[2]}')

db.commit()
db.close()
print('Done!')
