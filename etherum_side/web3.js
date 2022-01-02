import Web3 from "web3";
 
let web3;
 
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined" ) {
  // We are in the browser and metamask is running.
  if (window.ethereum.chainId == "0x4")
  {
  window.ethereum.request({ method: "eth_accounts" });
  web3 = new Web3(window.ethereum);

  
  }
  else {

    const provider = new Web3.providers.WebsocketProvider(
      "wss://rinkeby.infura.io/ws/v3/6d6b6d3a7c164567a05a88d04c2a3c92"
    );
    web3 = new Web3(provider);
  }
} 

else {
  // We are on the server *OR* the user is not running metamask
  const provider = new Web3.providers.WebsocketProvider(
    "wss://rinkeby.infura.io/ws/v3/6d6b6d3a7c164567a05a88d04c2a3c92"
  );
  web3 = new Web3(provider);
}
 
export default web3;