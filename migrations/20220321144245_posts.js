/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("posts", (table) => {
        table.increments('id').primary();
        table.integer('user_id').references('id').inTable('users').notNullable().onDelete('cascade');
        table.string('title');
        table.text('content');
        table.timestamp("created_at", { useTz: true } ).defaultTo(knex.fn.now());;
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists("posts");
};
