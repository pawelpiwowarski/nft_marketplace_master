
import {Icon, Button, Dropdown, Modal, Image, } from "semantic-ui-react";
import React from "react"; 
import { utils } from "ethers";
import confidential from  '../utils/credentials'
import instance_of_profile_authenictaion from '../etherum_side/instance_of_the_profile'
import profile_url from '../utils/fetch'
const Modal_Profile = (props)=> {

    const [loading_flag, set_loading_flag] = React.useState(false)
    const [backend_name, setbackendname] = React.useState('')
    const [img_url, setUrl] = React.useState('')
    const [open, setOpen] = React.useState(false)
    const [username, set_username] = React.useState('')
    const [email, set_email] = React.useState('')
    const fileInputRef = React.createRef();
    const image_submission = async(e) => {
  
 
        if (e.target.files[0]) {
        setbackendname(e.target.files[0].name)
      
        const data = new FormData()
        data.append('profile', e.target.files[0])
        
        const res = await fetch( profile_url + 'temp_uploads?address='+ props.address + '&name=' + e.target.files[0].name, {method: 'POST', body: data, headers: {'Authorization': 'Basic '+btoa(confidential)}})
        const res_to_json = await res.json()
      
        const src = "data:image/png;base64," + res_to_json.body
      
        setUrl(src)
        }
      }  
      const verification = async(address)=> {

        try {
        set_loading_flag(true)
        await instance_of_profile_authenictaion.methods.submit().send({from: address, value: 10000000000000000})
        set_loading_flag(false)
        }
        catch {
          set_loading_flag(false)
        }
    }
    
    const final_submission = async()=> {
        if (!backend_name && !props.local_json.url) {
          throw new Error('Please provide a profile picture')
        }
      
        else {
        
          const truth_val = Boolean( !backend_name && props.local_json.url)
          if (truth_val) {
            const backend_name_2 = 
            setbackendname(backend_name_2)
            console.log(backend_name)
          }
          const obj ={ 
            username: username || props.local_json.username,
            email: email || props.local_json.email
          }
          
        await fetch( profile_url + 'upload_complete?address=' + utils.getAddress(props.address) + '&name=' + backend_name + '&val=' + truth_val, {method: 'POST', body:JSON.stringify(obj) ,headers: {'Content-Type': 'application/json', 'Authorization': 'Basic '+btoa(confidential)}})
        }
      
        setOpen(false)
        set_username('')
        set_email('')
      }



return (

    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Dropdown.Item icon='setting'> <Icon name="setting"></Icon>Account settings </Dropdown.Item>}
    >
     
      <Modal.Header> <Icon color='teal' size='big' name="user"></Icon>{props.auth ? 'Update email, username and a profile picture': 'Authentication is required'} </Modal.Header>
      <Modal.Content image>
    
      <Image  label={username || props.local_json.username|| 'Username'}size='medium' centered src={  img_url || profile_url + props.local_json.url} wrapped/>

      <Modal.Description>
      
          {!props.auth &&
          <h3> In order to create a profile you have to pay a small one time operational cost to the marketplace - 0.001 ETH. Authenticated user have access to receiving emails on buys, messaging service and profile picture.</h3>
}
          <h2> Address: {props.address}</h2>
          { props.auth &&
          <h2>Email: <input placeholder={  props.local_json.email ||'Email'} onChange={event => set_email(event.target.value)}/> </h2>}{
            props.auth &&
          <h2>Username: <input  placeholder={props.local_json.username  || 'Username'} onChange={event => set_username(event.target.value)}/> </h2> 
}{props.auth &&
          <Button
                    disabled={!props.auth}
                    color="teal"
                    content='Upload profile picture'
                  size = 'big'
                  type='button'
                  icon="file"
                  onClick={() => fileInputRef.current.click()}
                  loading={loading_flag}
   

                />}<input
                ref={fileInputRef}
                type="file"
                hidden
                onChange={image_submission}
                name='profile'
              />
      </Modal.Description>
      </Modal.Content>


   
      <Modal.Actions>
        <Button  loading={loading_flag} color='black' onClick={() => {setOpen(false) 
          set_username('') 
          set_email('')
        setUrl('')}
          }>
          Nope, let me think
        </Button>
        <Button 
        color="blue"
        onClick={() => verification(props.address)}
        disabled = {props.auth}
        positive = {props.auth}
        loading ={loading_flag}
        > {props.auth ? 'You are an authenicated user! ': 'Authentication required - 0.001 ETH'} 
    
         </Button>
         { props.auth &&
        <Button
        disabled = {!props.auth}
        color="teal"
          content="Yep, Submit the data"
          labelPosition='right'
          icon='checkmark'
          onClick={final_submission}
     
        />
         }
      </Modal.Actions>
    </Modal>
)

}

export default Modal_Profile