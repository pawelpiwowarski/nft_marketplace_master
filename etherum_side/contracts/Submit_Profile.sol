// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract submit_profile {
    
    address payable admin;
    mapping(address => bool) public verification_map;
    
   
    constructor (){
        admin = payable(msg.sender);
    }
    function submit() external payable  {
        require(msg.value > 1000000000000000, 'You need to send more than 0.001 ETH to submit the profile');
        verification_map[msg.sender] = true;
    }


    function withdraw() public{
        require(msg.sender == admin, 'Only admin can withdraw the money');
        admin.transfer(address(this).balance);


    }
}