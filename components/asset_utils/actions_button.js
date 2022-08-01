import React from "react"; 
import { Button, Header, Image, Modal, Input, Message} from 'semantic-ui-react'
import instance from "../../etherum_side/instance_of_the_contract";
import instance_of_marketplace from "../../etherum_side/instance_of_the_marketplace";
import { utils } from "ethers";

const Actions = (json)=> {


  const delist = async()=> {
    try {
      startloading(true)
      await instance_of_marketplace.methods.delist_asset(json.index,  await instance._address).send({from: json.account})
      setmessage("Your NFT has been sucessfully delisted!" )

      startloading(false)

    }
    catch(e) {
      startloading(false)
      setmessage("")
      setError(e.message)
    }
  }
  const is_file_a_video = () => {

    
    if (json.props.mimetype == 'video/mp4')
    {
       return <div> <video width="400px" height="400px" loop  autoPlay="autoplay"  muted src={`data:${json.props.mimetype};base64,${json.props.buffer}`} ></video> <br></br> </div>
    }
   return <Image size='medium' src={`data:${json.props.mimetype};base64,${json.props.buffer}`} /> 
}

const [action, actions_list_scroll] = React.useState(false)
const [open, setOpen] = React.useState(false)
const [address, setAddress] = React.useState("")
const [error, setError] = React.useState("")
const [loading, startloading] = React.useState(false)
const [message_content, setmessage] = React.useState('')
    return (
        <div>
        <br></br>
       

        <Modal onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}trigger = { <Button  size='huge' color='teal' content="Actions" ></Button>}>
        <Modal.Header centered >Select an action</Modal.Header>
      <Modal.Content image>
        {is_file_a_video()}
        <Modal.Description>
         <Button 
         disabled = {json.asset_listed } 
         onClick={()=> {
           setError("")
           actions_list_scroll(true)}} size="massive" color="teal" content="Transfer" positive></Button>
         <Button 
         disabled = {!json.asset_listed } 
         size="massive" color="teal" content="Delist" negative
         onClick={ ()=> {delist()} }
         ></Button>
         { action && <div> <br></br>
          <Header size="huge"> Paste the address of the reciver: </Header>
          <Input onChange={event => setAddress(event.target.value)} size="big" color='teal' />

          <Message  size="medium"  color="teal">
        After this action this NFT will be transfered to the inputted address.
        <br></br> Double check it!

          </Message>
         
 
        

          
          </div>
          
         
       }
        {
           error &&  <Message color="red" size="medium">   {error}  </Message>
         }
        {message_content && <Message size="huge" positive > {message_content}</Message>}

        </Modal.Description>

       
      </Modal.Content>
    
      <Modal.Actions>
        <Button loading = {loading} color='black' onClick={() => setOpen(false)}>
          Close 
        </Button>
        { action && 
        <Button
        loading = {loading}
          content="Yep, send it off!"
          labelPosition='right'
          icon='checkmark'
          onClick={async () => {
            try {
            if (!utils.isAddress(address)) {
    

              throw new Error('Invalid Address!')
              
            }
            startloading(true)
            console.log(json.account)
            console.log(address)
            console.log(json.index)
            await instance.methods.safeTransferFrom(json.account,address,json.index,1, []).send({from: json.account, gas: '200000'})
            setmessage("Your NFT has been sucessfully transfered! ")
            startloading(false)
            setError("")
            }
            catch(e) {
              startloading(false)
              setError(e.message)
              setmessage("")

            }
            }}
          positive
        />
}

      </Modal.Actions>
      </Modal>
</div>

    )
}

module.exports = Actions