import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    await User.updateOrCreate(
      { email: 'admin@polypress.com' },
      {
        fullName: 'Administrateur PolyPress',
        password: 'SuperSecureAdminPassword123!',
      }
    )
  }
}