import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // We are in the browser and metamask is running.

  window.ethereum.request({ method: "eth_accounts" });
  web3 = new Web3(window.ethereum);
} else {
  // We are on the server *OR* the user is not running metamask
  const provider = new Web3.providers.WebsocketProvider(
    "wss://solemn-sleek-spring.matic.discover.quiknode.pro/1bcfe54a925848e8c7d9c23ac21c48bb5855c84e/"
  );
  web3 = new Web3(provider);
}

export default web3;
