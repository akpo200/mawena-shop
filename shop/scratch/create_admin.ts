import { getPayloadClient } from '../lib/payload'

async function run() {
  console.log('Initializing Payload client...')
  const payload = await getPayloadClient()
  
  console.log('Creating admin user...')
  const user = await payload.create({
    collection: 'users',
    data: {
      name: 'Admin Mawena',
      email: 'admin@mawena.com',
      password: 'password123',
      role: 'admin',
    }
  })
  console.log('Admin user created successfully!')
  console.log('Email: admin@mawena.com')
  console.log('Password: password123')
  process.exit(0)
}

run().catch(err => {
  console.error('Failed to create admin user:', err)
  process.exit(1)
})
