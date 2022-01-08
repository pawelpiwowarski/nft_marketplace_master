const routes = require('next-routes-extended')



module.exports = routes()     
.add('/asset/:instance_address/:index_of_the_nft', '/asset/0x1DEDa0e734465B737e2999532dc424ee39721DB5/[index]')
.add('/mint_nft', '/mint_nft')
.add('/profile/:address', '/profile/[index]')
