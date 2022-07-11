// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract GigTransaction is Ownable{
     //must be able to receive eth.
     // freelancer must be able to accept the order of the client
     // must transfer all the received ethers to the freelancer or owner once approved by client;
     address public client;
     uint256 public contractbalance;
     uint256 public  orderID;
     uint public startTime; // to specify the timeinterval to complete the work
     uint public stakeAmount = 0.1 ether;
     
     struct order{
        address client;
        uint submissionTime;
        uint256 salary;
     }
     mapping(uint256 => order)public getOrder;

    //events
    event request(address sender,uint submissionTime,uint256 salary);
    event approvework(uint256 orderId);
    event accepted(uint256 orderId);
    event rejected(uint256 orderId);
    event clientdeposited(address client,uint256 salary, uint submissionTime);
    event workComplete(uint256 orderId);
    event startWork(uint submissionTime);
    
    //owner of the contract is the freelancer

     // function to make a order by client
     function makeRequest(uint _submissionTime,uint256 _salary)public {
        getOrder[orderID] = order(msg.sender, _submissionTime ,_salary);
        orderID++;
        emit request(msg.sender,_submissionTime,_salary);      
     }

     // function to delete a order
     function deleteOrder(uint orderId)public{
      delete getOrder[orderId];
     }

     // function to accept the request by client
     function acceptRequest(uint256 _orderId)public onlyOwner payable{
         require(msg.value == stakeAmount,"please send the correct stake amount");
         (bool sent,) = address(this).call{value:msg.value}("");
         require(sent,"transaction in accept payment function failed");
         emit accepted(_orderId);
     }

     //function to reject the request by client
     function rejectRequest(uint256 _orderId) public onlyOwner {
      emit rejected(_orderId);
     }

     // client will send ether once his order is accepted
     function sendPaymenttosmartcontract(uint256 orderId)public payable{
         require(getOrder[orderId].client==msg.sender,"you are not the client of this order");
         require(getOrder[orderId].salary == msg.value,"please send the correct amount");
         (bool sent,) = address(this).call{value:msg.value}("");
         require(sent,"transaction in accept payment function failed"); 
         emit clientdeposited(msg.sender,msg.value,getOrder[orderID].submissionTime); 
         startTime = block.timestamp;
         emit startWork(startTime);      
     }

     // smart contract terminates in 2 case
     // 1. if the work is completed.
     // 2. if the work is not completed within given time.

     // a function which a freelancer can call after completing work
     function workCompleted(uint256 orderId)public{
      emit workComplete(orderId); // once you receive this event stop the timer.
      emit approvework(orderId);// client should approve his work
     }

     // a function where a client can accept work of the freelancer
     function acceptthework(uint orderId)public {
      require(msg.sender == getOrder[orderId].client,"you are not the client");
      sendToFreelancer(true);
     }
     
     // a function where a client can reject the work 
     function rejectthework(uint orderId)public{
       require(msg.sender == getOrder[orderId].client,"you are not the client");
       sendToFreelancer(false);
     } 

     // function  where client can get his amount + penalty back if freelancer fails to complete the work
     function claimPenalty(uint orderId)public{
      require(getOrder[orderId].client == msg.sender,"you are not the client to receive penalty");
       (bool sent,) = msg.sender.call{value:address(this).balance}("");
       require(sent,"transaction failed");
       deleteOrder(orderId);
     }


     // function to transfer freelancer the money
     function sendToFreelancer(bool _workcompleted)public payable{
        require(owner()!= address(0),"owner doenot exists");
        require(_workcompleted,"work is not yet completed");
         contractbalance = address(this).balance;
         (bool sent,) = payable(owner()).call{value:contractbalance}(" ");
         require(sent,"transaction failed");
     }



     receive()external payable{} // receive ether when msg.data is empty
     fallback()external payable{} // receive ether when msg.data is not empty

}