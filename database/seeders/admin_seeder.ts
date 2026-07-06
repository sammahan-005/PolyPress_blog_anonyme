import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import env from '#start/env'

export default class extends BaseSeeder {
  async run() {
    const email = env.get('ADMIN_EMAIL') || 'admin@polypress.com'
    const password = env.get('ADMIN_PASSWORD') || 'SuperSecureAdminPassword123!'

    await User.updateOrCreate(
      { email },
      {
        fullName: 'Administrateur PolyPress',
        password,
      }
    )
  }
}