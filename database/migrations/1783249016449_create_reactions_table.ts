import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'reactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('message_id').unsigned().references('id').inTable('messages').onDelete('CASCADE').notNullable()
      table.string('visitor_token', 255).notNullable()
      table.string('type', 20).notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.unique(['visitor_token', 'message_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}