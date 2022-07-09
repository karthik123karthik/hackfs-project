// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import "node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract GigTransaction{
     //must be able to receive eth.
     // freelancer must be able to accept the order of the client
     // must transfer all the received ethers to the freelancer or owner once approved by client;
     address public owner;
     address public client;
     uint256 public contractbalance;
     uint256 public  orderID;
     uint public stakeAmount = 0.1 ether;
     
     struct order{
        address client;
        uint submissionTime;
        uint256 salary;
     }
     mapping(uint256 => order)public getOrder;

    //events
    event request(address sender,uint submissionTime,uint256 salary);
    event accepted(uint256 orderId);
    event rejected(uint256 orderId);
    
    //owner of the contract is the freelancer
     constructor(address _owner){
        owner = _owner;
     }

     // function to make a order by client
     function makeRequest(uint _submissionTime,uint256 _salary)public {
        getOrder[orderID] = order(msg.sender, _submissionTime ,_salary);
        emit request(msg.sender,_submissionTime,_salary);      
     }

     // function to delete a order
     function deleteOrder(uint orderId)public{
      delete getOrder[orderId];
     }

     // function to accept the request by client
     function acceptRequest(uint256 _orderId) onlyOwner public payable{
         require(msg.value == stakeAmount,"please send the correct stake amount");
         (bool sent,) = address(this).call{value:msg.value}("");
         require(sent,"transaction in accept payment function failed");
         emit accepted(orderId);
     }

     //function to reject the request by client
     function rejectRequest(uint256 _orderId)onlyOwner public {
      emit rejected(orderId);
     }

     // client will send ether once his order is accepted
     function acceptPayment(uint256 orderID)public payable{
         require(getOrder[orderID].client==msg.sender,"you are not the client of this order");
         require(getOrder[orderID].salary == msg.value,"please send the correct amount");
         (bool sent,) = address(this).call{value:msg.value}("");
         require(sent,"transaction in accept payment function failed");
         
     }



     // function to transfer freelancer the money
     function sendToFreelancer(bool _workcompleted)public payable{
        require(owner!= address(0),"owner doenot exists");
        require(_workcompleted,"work is not yet completed");
         contractbalance = address(this).balance;
         (bool sent,) = payable(owner).call{value:contractbalance}(" ");
         require(sent,"transaction failed");
     }



     receive()external payable{} // receive ether when msg.data is empty
     fallback()external payable{} // receive ether when msg.data is not empty
}