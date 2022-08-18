import { Container, Icon} from 'semantic-ui-react'
import React from 'react';
import Header from './Header';
import instance from '../etherum_side/instance_of_the_contract';
const Layout = (props) => {

    return(

        <Container>

    
     <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css
        "/>
     
     <Header loading={props.loading} profile_details={props.profile_details} metamaskflag = {props.metamaskflag} address={props.account} auth={props.auth}/>
        {props.children}
       
  <div className="footer">


<ul>

 <a style={{color: 'black'}} href="mailto:support@plateau-nft.art"> <li><Icon name="mail"></Icon> Support </li></a>
 <a style={{color: 'black'}}target="_blank" href="https://twitter.com/ArtPlateau"> <li><Icon name="twitter"></Icon> Twitter</li></a>
 <a style={{color: 'black', hoover: {color: "blue"}}} target="_blank" href={`https://www.instagram.com/plateaunft`}><li><Icon name="instagram"></Icon>Instagram</li></a>  

 <a style={{color: 'black', hoover: {color: "violet"}}} target="_blank" href={`https://polygonscan.com/token/${instance._address}`}><li><Icon name="compass"></Icon>PolygonScan</li></a>  
 <a style={{color: 'black', hoover: {color: "blue"}}} target="_blank" href={`https://opensea.io/collection/plateau-nft-art`}><li><Icon name="ship"></Icon>OpenSea</li></a>  



</ul>

</div>
<div id="rights">
 <p>All right reserved Plateau-nft 2022 <Icon name="copyright outline icon"> </Icon></p>
</div>
        </Container>
    )
}

export default Layout;
