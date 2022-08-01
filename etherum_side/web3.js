import Web3 from "web3";
 
let web3;
 
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined" ) {
  // We are in the browser and metamask is running.
  
  window.ethereum.request({ method: "eth_accounts" });
  web3 = new Web3(window.ethereum);

  
  

} 

else {
  // We are on the server *OR* the user is not running metamask
  const provider = new Web3.providers.WebsocketProvider(
    "wss://black-bold-water.matic-testnet.discover.quiknode.pro/64ec46db114c87d96ef15bca97f4cd673fc74efd/"
  );
  web3 = new Web3(provider);
}
 
export default web3;