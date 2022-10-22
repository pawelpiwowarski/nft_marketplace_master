const outsiders = ["0xA8787f506FcE6B4a7F3DF268cd5B7C700A1D7335"];

import web3 from "../../etherum_side/web3";
const get_outside_collection = async () => {
  outsiders.forEach(async (address) => {
    const response = await web3.eth.call({ to: address, data: "0x4f6ccce7" });

    const response_json = await response.json();

    console.log(response_json);
  });

  return <div className="container"></div>;
};

export default get_outside_collection;
