const routes = require('next-routes-extended')



module.exports = routes()     
.add('/asset/:instance_address/:index_of_the_nft', '/asset/0x6F3943f1bc5A973eF69526e004C0c836759CeBF1/[index]')
.add('/mint_nft', '/mint_nft')
.add('/profile/:address', '/profile/[index]')
