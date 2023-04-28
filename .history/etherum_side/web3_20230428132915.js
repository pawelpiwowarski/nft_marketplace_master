import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // We are in the browser and metamask is running.

  window.ethereum.request({ method: "eth_accounts" });
  web3 = new Web3(window.ethereum);
} else {
  // We are on the server *OR* the user is not running metamask
  const provider = new Web3.providers.WebsocketProvider(
    "wss://polygon-mainnet.g.alchemy.com/v2/KLbfkqsd1Rh4Gm8yBeFAs-qVAmhgTWfa/"
  );
  web3 = new Web3(provider);
}

export default web3;
