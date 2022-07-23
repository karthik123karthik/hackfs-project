// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

//contract address : 0x7b0F6fdC394A620D3095e69cC1f727A4660A4Ba3

import "@openzeppelin/contracts/access/Ownable.sol";

contract GigTransaction is Ownable{
     //must be able to receive eth.
     // freelancer must be able to accept the order of the client
     // must transfer all the received ethers to the freelancer or owner once approved by client
     uint256 public contractbalance;
     uint256 public  orderID;
     uint public startTime; // to specify the timeinterval to complete the work
     uint public stakeAmount = 0.001 ether;
     address private verifier;     
     struct order{
        address client;
        uint submissionTime; // in days
        uint256 salary;
     }
     mapping(uint256 => order)public getOrder;

    //events
    event request(address sender,uint submissionTime,uint256 salary,uint orderId);
    event approvework(uint256 orderId);
    event accepted(uint256 orderId);
    event rejected(uint256 orderId);
    event clientdeposited(address client,uint256 salary, uint submissionTime);
    event startWork(uint submissionTime);
    event  workNotCompleted(uint orderId);
    event  amountReceived(uint orderId);
    
    //owner of the contract is the freelancer
    constructor(address _verifier)payable{
        verifier = _verifier;
    }

     // function to make a order by client
     function makeRequest(uint _submissionTime,uint256 _salary)public {
        getOrder[orderID] = order(msg.sender, _submissionTime ,_salary);
        orderID++;
        emit request(msg.sender,_submissionTime,_salary,orderID-1);      
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

     //function to get the smart contract balance
     function giveBalanceOfEth()public view returns(uint){
         return address(this).balance;
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
         emit clientdeposited(msg.sender,msg.value,getOrder[orderId].submissionTime); 
         startTime = block.timestamp;
         emit startWork(startTime);      
     }

     // smart contract terminates in 2 case
     // 1. if the work is completed.
     // 2. if the work is not completed within given time.

     // a function which a freelancer can call after completing work
     function workCompleted(uint256 orderId)public{
        emit approvework(orderId);// client should approve his work
     }

    
     
     // a function where a client can reject the work 
     function rejectthework(uint orderId)public{
       require(msg.sender == getOrder[orderId].client,"you are not the client");
       emit workNotCompleted(orderId);
     } 

     //modifier for only verifier
    modifier onlyverifier(){
         require(msg.sender==verifier,"you are not the verifier");
         _;
    }

     // function  where client can get his amount + penalty back if freelancer fails to complete the work
     function claimPenalty(uint orderId)public onlyverifier{
        uint time = getOrder[orderId].submissionTime * 1 days;
        require(block.timestamp >= startTime + time,"please wait till submission time finishes");
       (bool sent,) = payable(getOrder[orderId].client).call{value:(getOrder[orderId].salary+stakeAmount)}("");
       require(sent,"transaction failed");
       deleteOrder(orderId);
     }


     // function to transfer freelancer the money
     function sendToFreelancer(uint orderId)public payable{
        require(getOrder[orderId].client==msg.sender,"you are not the client of this order");
        require(owner()!= address(0),"owner doenot exists");
         contractbalance = getOrder[orderId].salary+stakeAmount;
         (bool sent,) = payable(owner()).call{value:contractbalance}(" ");
         require(sent,"transaction failed");
         emit amountReceived(orderId);
     }



     receive()external payable{} // receive ether when msg.data is empty
     fallback()external payable{} // receive ether when msg.data is not empty

}