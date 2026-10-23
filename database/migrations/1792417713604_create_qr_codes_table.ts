import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'qr_codes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      // Ce qui est interressant, c'est que j'ai eu une erreur lors du 'node ace migration:run' car j'avais mis 'table.increments('user_id'). Or il faut mettre 'table.integer('user_id')' car sinon la table dit qu'elle a plusieurs primary key. Et c'est logique car la table users a déjà un primary key qui est 'id'.
      table
        .integer('user_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      // Facultatif : le validateur accepte null (champ laissé vide dans le formulaire).
      table.string('title', 100).nullable()
      table.string('type').notNullable()
      table.text('content').notNullable()
      table.string('foreground_color', 7).notNullable().defaultTo('#000000')
      table.string('background_color', 7).notNullable().defaultTo('#ffffff')
      table.integer('size').notNullable().defaultTo(300)
      table.string('error_correction', 1).notNullable().defaultTo('M')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
