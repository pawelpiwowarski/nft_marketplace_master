import { Container } from 'semantic-ui-react'
import React from 'react';
import Header from './Header';
const Layout = (props) => {
    
    return(

        <Container>

    
     <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css
        "/>
     
     <Header metamaskflag = {props.metamaskflag} address={props.account}/>
        {props.children}
       
        </Container>
    )
}

export default Layout;
