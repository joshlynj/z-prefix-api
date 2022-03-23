const knex = require('./dbConnection');

function createUser(username, passwordHash, first_name, last_name){
    return knex('users').insert({username, passwordHash, first_name, last_name})
}

function getPasswordHash(username){
    return ( knex('users').where({username}).select('passwordHash')
    .then(data=>data[0].passwordHash)
    )}

function getIdForUser(username){
    return (knex('users').where({username}).select('id')
    .then(data=>data[0].id)
    )}

function getPostForUser(user_id){
        console.log('user_id', user_id)
        return (knex('posts').where({user_id}).select()
        // .then(data=>data[0].user_id)
        )}

        
module.exports = {
    createUser, getPasswordHash, getIdForUser, getPostForUser
}



    // function getPasswordHashForUser(username) {
    //     return knex("users")
    //       .where({ username })
    //       .select("passwordHash")
    //       .then((data) => data[0].passwordHash);
    //   }


      // getIdforUser: (param) =>{
    //     console.log(param);
    //     return knex.select(id).from('users').where({username: param})
        
    // }
    //function getIdForUser(username){
    //    return knex("id")
    //    .where({ username })
    //    .select()
    //}