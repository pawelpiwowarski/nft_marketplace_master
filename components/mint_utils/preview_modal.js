import React  from "react";

import {Icon, Button, Dropdown, Modal, Image, Header, Message, Card, CardContent, } from "semantic-ui-react";


export const Preview_modal = (props)=>  {

const [open, setOpen] = React.useState(false)

console.log(props.image)


    return (

        <div>
        <br></br>
       

        <Modal onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open} trigger = { <Button  type="button" size='huge' color='teal' content="Preview" ></Button>}>
        <Modal.Header>Preview of your NFT</Modal.Header>
<Modal.Content>
<div id="modal"> 
<Card   
        style = {{width: "50%", height: "500px",overflowWrap: "break-word"}}
        image = {props.image}  

        header={props.name}
        description = {props.description} 
        extra = { 
            <div id="extra">
            
            <a  href={`/profile/${props.owner}`}>
            <h4 > {"Address of the owner: " + props.owner.toLowerCase()} </h4>
            </a> 
            <a  href={`/space/${props.creator}`}>
            
            <h4>{"Address of the creator: " + props.creator.toLowerCase()} </h4>
            </a>
            </div>
        }
        />
</div>
</Modal.Content>
      <Modal.Actions>
        
        <Button  color = "teal" onClick={()=> {
             setOpen(false)
        }}> Close </Button>


      </Modal.Actions>
      </Modal>
</div>

    )

} 