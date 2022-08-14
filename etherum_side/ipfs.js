

import { create } from 'ipfs-http-client'

const projectId = process.env.NEXT_PUBLIC_projectId
const projectSecret = process.env.NEXT_PUBLIC_projectSecret
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