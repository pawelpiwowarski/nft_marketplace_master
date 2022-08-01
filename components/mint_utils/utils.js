import { Message } from "semantic-ui-react"
import React from 'react';
import ipfs from "../../etherum_side/ipfs";



export function User_cant_mint_info(props) {


if (!props.user_cannot_mint)
{
return (
        <Message size="huge" color="teal"> In order to mint an artwork, your address will need to become authenicated.
        <br></br>
        In order to do so, you need to authenticate your address in the account settings tab in the right side menu.    </Message>

)
}
return null
}


export const resize_image = (file)=> {

        return new Promise((resolve, reject) => {
        
        console.log(file)

        const MAX_WIDTH = 640;
        const MAX_HEIGHT = 360;
        const MIME_TYPE = file.type
        const QUALITY = 0.7;
        const blobURL = URL.createObjectURL(file);
        const img = new Image();
        img.src = blobURL;
        img.onerror = function () {
                URL.revokeObjectURL(this.src);
                // Handle the failure properly
                reject("Cannot load image");

              };

        img.onload = function async () {
              
                URL.revokeObjectURL(this.src);
                const [newWidth, newHeight] = calculateSize(img, MAX_WIDTH, MAX_HEIGHT);
                const canvas = document.createElement("canvas");
                canvas.width = newWidth;
                canvas.height = newHeight;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, newWidth, newHeight);
                canvas.toBlob(
                  (blob) => {
         
                        resolve(blob)
                  },
                  MIME_TYPE,
                  QUALITY
                );
        
              };




              function calculateSize(img, maxWidth, maxHeight) {
                let width = img.width;
                let height = img.height;
              
                // calculate the width and height, constraining the proportions
                if (width > height) {
                  if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                  }
                } else {
                  if (height > maxHeight) {
                    width = Math.round((width * maxHeight) / height);
                    height = maxHeight;
                  }
                }
                return [width, height];
              }
     
        });
        }


export const upload_image_to_ipfs = (blob)=> {
        return new Promise((resolve, reject) => {
        const reader = new FileReader()
       

        if (blob.size > 5242880) {
                reject("File is too large")
        }
        reader.readAsArrayBuffer(blob)
        reader.onloadend = async ()=> {
                
                let {cid} = await ipfs.add(reader.result) // Display as a buffer

                const img_source = "https://ipfs.io/ipfs/" + cid

                resolve(img_source)

                
        }

        reader.onerror = ()=> {
                reject('An Error has occured')
        }
}       )}