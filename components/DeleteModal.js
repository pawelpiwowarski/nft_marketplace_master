import React from "react";

import {Icon, Button, Dropdown, Modal, Image, Header, } from "semantic-ui-react";
import { delete_account } from "../utils/account/deleteaccount";

const delete_query = async (address)=> {
    await delete_account(address)
}
const Delete_modal = (props)=> {
    const [open, setOpen] = React.useState(false)

return( <Modal

    onOpen={() => setOpen(true)}
   open={open}
    trigger = {      <Button content="Delete account" size="medium" negative ></Button>
}
>

<Modal.Description>

    <Header as="h1">Are you sure you want to delete this account? </Header>
    <h2>You are to delete only the information stored on our servers like username 
        email and profile picture. Every information that is stored on the blockchain is 
        however irreversible. 
        
    </h2>
    <div>
    <Button size="massive"content="No"  onClick = {()=> {
            setOpen(false)
    }} positive></Button>
    <Button size="massive" content="Yes" negative onClick = {()=> {
            delete_query(props.address)
            setOpen(false)
    }}></Button>

</div>
</Modal.Description>
</Modal>)
}

export default Delete_modal