const routes = require('next-routes-extended')



module.exports = routes()     
.add('/asset/:instance_address/:index_of_the_nft', '/asset')
.add('/mint_nft', '/mint_nft')
.add('/profile/:address', '/profile')

