/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('posts').del()
  await knex('posts').insert([
    {user_id: 1, title: 'Best Place to Visit', 
    content: 'The best place to visit on a cold summer night is a beautiful place I like to call Slice of Pie. The Slice of Pie will provide you with such a unique experience that you will not understand the best of the best. This is the reason why I would recommend this to anyone in the world.'
    },
    {user_id: 2, title: 'Worst Place to Visit', 
    content: 'Iowa'
    },
    {user_id: 2, title: 'Best Place to Eat', 
    content: 'Chilis'
    }
  ]);
};
