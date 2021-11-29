import * as IPFS from 'ipfs-core'
import * as path from 'path'
import fs from 'fs-extra'

const ipfs = await IPFS.create();

  


const __dirname = path.resolve();
const description = "test"
const name = "1"
const nft_metadata_path = path.resolve(__dirname, 'nft_metadata_test');
const img_path = path.resolve(__dirname, 'images', "1.jpeg")

const file = fs.readFileSync(img_path)
console.log(file)
const { cid } = await ipfs.add({path: "testfile", content: file})

console.log(cid)

const img_source = "https://gateway.ipfs.io/ipfs/" + cid


console.log(img_source)


const nft_metadata_object = {

    "description": description,
    "name": name,
    "image": img_source

}

fs.outputJSONSync(
    path.resolve(nft_metadata_path, name + '.json'),
    nft_metadata_object
  );


// QmXXY5ZxbtuYj6DnfApLiGstzPN7fvSyigrRee3hDWPCaf