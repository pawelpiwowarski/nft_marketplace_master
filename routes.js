const routes = require('next-routes-extended')



module.exports = routes()     
.add('/asset/:instance_address/:index_of_the_nft', '/asset/0x8c97E997bC995De9010D90fCd69C9f2b529A4227/[index]')
.add('/mint_nft', '/mint_nft')
.add('/profile/:address', '/profile/[index]')
