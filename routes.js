const routes = require('next-routes-extended')



module.exports = routes()     
.add('/asset/:instance_address/:index_of_the_nft', '/asset/0x7BA4821C6951BD6A75290974bF8Fc9eCADf95478/[index]')
.add('/mint_nft', '/mint_nft')
.add('/profile/:address', '/profile/[index]')
