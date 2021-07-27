import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Tasks extends BaseSchema {
  protected tableName = 'tasks';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary().notNullable().unique();
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE');
      table.enum('status', ['todo', 'doing', 'done']).notNullable();
      table.string('note').notNullable();
      table.timestamp('created_at', { useTz: true });
      table.timestamp('updated_at', { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
