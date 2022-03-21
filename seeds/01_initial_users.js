/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {username: 'joshyposhy', passwordHash: 'hashSlingingSlasher', first_name: 'Joshlyn', last_name: 'Jamerson' },
    {username: 'james', passwordHash: 'hashSlingingSlasher1', first_name: 'James', last_name: 'Kelley' }
  ]);
};
