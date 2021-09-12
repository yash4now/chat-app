const users = [];

 const addUser = ({id, name, room}) => {

     name = name.trim().toLowerCase();
     room = room.trim().toLowerCase();

     const existingUser = users.find((user) => user.room === room && user.name === name)
     if(existingUser) {
         return{error: 'Username is taken'}
     }
     const user = {id, name, room};
     users.push(user);
     return{user}
    }
 const removeUser = (id) => {
    const  index = users.findIndex((user) => user.id === id);
 }
 const getUser = (id) => users.find((user) => user.id ===id);
 const getUserInRoom = (room) => users.filter((user) => user.room === room);
 module.exports = {addUser, removeUser, getUser, getUserInRoom};







// var express = require('express');
// var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// module.exports = router;
