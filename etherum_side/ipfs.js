

import { create } from 'ipfs-http-client'

const projectId = '23MkCtQ2o9pLUtumSuF8BdKo0xl'
const projectSecret = '2e376fe5faf4fc81baad3d7650b92adc'
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')

const ipfs = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: auth
    }
  })

  export default ipfs