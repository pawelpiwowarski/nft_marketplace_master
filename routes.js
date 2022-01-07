const routes = require('next-routes-extended')



module.exports = routes()     
.add('/asset/:instance_address/:index_of_the_nft', '/asset/0x3F3638012cd5b807a2aeDA39E7cdA7571507DA56/[index]')
.add('/mint_nft', '/mint_nft')
.add('/profile/:address', '/profile/[index]')
