// const bcrypt = require('bcrypt');

// bcrypt.genSalt(12, (error, salt)=>{
//     console.log(salt);
//     bcrypt.hash('123123', salt, (error, hash)=>{
//         if(error) return console.log(error);
//         console.log(hash);
//     })
// })

// bcrypt.compare('qweQWE123', '$2b$12$OHGjbFzCZnch/gMyEEzB8uxxtfpJ.Nb5KWMP3JnYlnGe4iAz1lwSy').then(res=>{
//     console.log(res);
// })

// const object = {
//     _id: '60b6157adecf0df78b6babeb',
//     userName: 'vuankhanh',
//     password: '$2b$12$.RyaWcfIiHDdfDQN7g/QzekpjcmS7.hZp8bW9bR69JWSPcINP/ldu',
//     name: 'Vũ An Khánh',
//     avatar: '',
//     permission: 1
// }

// delete object.password;
// console.log(object)