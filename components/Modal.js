
import {Icon, Button, Dropdown, Modal, Image, Header, Message, } from "semantic-ui-react";
import React, { useEffect } from "react"; 
import profile_url from '../utils/fetch'
import { patch } from "../utils/patch_queries"
import {post_avatar} from '../utils/avatar/postavatar'
import { is_avatar_set } from "../utils/avatar/is_avatar_set";
import Delete_modal from "./DeleteModal";
import { create_user, does_user_exists } from "../utils/autheniticate";
import fetch_profile_details from '../utils/fetch_profile'
import { set_tokens } from "../utils/autheniticate";
import instance from "../etherum_side/instance_of_the_contract";
import Web3 from "web3";
const Modal_Profile = (props)=> {

    const [loading_flag, set_loading_flag] = React.useState(false)
    const [current_buffer, setcurrentbuffer] = React.useState('')
    const [img_url, setUrl] = React.useState('https://www.samenfiks.nl/wp-content/uploads/2020/02/no-profile-picture.jpg')
    const [open, setOpen] = React.useState(false)
    const [username, set_username] = React.useState('')
    const [email, set_email] = React.useState('')
    const [is_picutre_set, set_is_avatar_set] = React.useState(false)
    const [local_json, set_local_json] = React.useState('')
    const [error,setError] = React.useState('')
    const [positve, setPositive] =React.useState('')


    useEffect(async ()=> {
      set_local_json(await fetch_profile_details(props.address.toLowerCase()))
      set_is_avatar_set(await is_avatar_set(props.address.toLowerCase()))
    }, [])
    useEffect(()=>{
      set_is_avatar_set(false)


  
    }, [img_url])
    

   
    const fileInputRef = React.createRef();





    const image_submission = async(e) => {
  
  
        if (e.target.files[0]) {

          const files = e.target.files[0]
          const reader = new FileReader();
          reader.readAsDataURL(files)
          reader.onloadend = ()=> {
       
            setUrl(reader.result)
  
          }
       setcurrentbuffer(e.target.files[0])


      
        

 
      
      
        }
      }  
   
    const verification = async(account)=> {

      set_loading_flag(true)
      try {
      await instance.methods.approve_user_to_mint().send({
        from: account,
        gas: '4000000',
        value: Web3.utils.toWei('10', 'ether')
      })

      setPositive('Congratulations you are now an authenticated user! ')
      set_loading_flag(false)


    }

    catch(e) {
      setError(e.message)
      set_loading_flag(false)

    }


    }
    
    const final_submission = async()=> {
      setError('')
      const obj ={ 
        name: username || local_json.name,
        email: email || local_json.email
      }

      if (!obj.name || !obj.email) {
        return setError('Please provide a name and an email! ')
      }
      
      if (!(await does_user_exists(props.address))) {
       const response = await create_user(props.address, username, email)
      
       if (response.error) {
        set_loading_flag(false)
        return setError(response.error)
      }

      setPositive(response.success)


       await set_tokens(props.address)
      } 
      
       
        
        set_loading_flag(true)
        if (username || email) {
          try {
          const response = await patch(props.address, obj)
          if (response.error) {
            set_loading_flag(false)
            return setError(response.error)
          }
          }
          catch(e){
            set_loading_flag(false)
            return setError(e.message)
          }
        }

        

         
        if (current_buffer) {

  
          
    let data = new FormData()
    data.append('avatar', current_buffer)
    const response = await post_avatar(data)
    if (response.error) {
      set_loading_flag(false)
      return setError(response.error)
    }
    setPositive(response)

        }
   
  
        set_username(username)
        set_email(email)
        set_loading_flag(false)
      }



return (

    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Dropdown.Item> <Icon name="setting"></Icon>Account settings </Dropdown.Item>}
    >
     
      <Modal.Header> <Icon color='teal' size='big' name="user"></Icon>{props.auth ? 'Update email, username and a profile picture': 'Authentication is required'} </Modal.Header>
      <Modal.Content image>
    
      <Image  label={username || local_json.name}size='medium'
       centered src={   is_picutre_set ?   profile_url + `users/${props.address.toLowerCase()}/avatar`: img_url} wrapped/>

      <Modal.Description>
      
          {!props.auth &&
          <Header as='h3'>  In order mint on the marketplace you have to pay a small one time operational cost to the marketplace - 10 MATIC. Authenticated user have access to creating their own profiles on the marketplace setting up a username and a profile picture.</Header>

}
          <h2> Your Address: {props.address}</h2>
          { props.auth &&
          <h2>Email: <input placeholder={  local_json.email ||'Email'} onChange={event => set_email(event.target.value)}/> </h2>}{
            props.auth &&
          <h2>Username: <input  placeholder={local_json.name  || 'Username'} onChange={event => set_username(event.target.value)}/> </h2> 
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
       {props.auth && <Delete_modal address={props.address}></Delete_modal>}
       {error && <Message style={{"font-size": '20px'}} content={error} negative></Message>}
        {positve&& <Message style={{"font-size": '20px'}} content={positve} positive></Message>} 
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
        > {props.auth ? 'You are an authenicated user! ': 'Authentication required - 10 MATIC'} 
    
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