import {useState} from "react";
import {useSigner,useContract,useContractEvent} from "wagmi";
import {CONTRACT_ADDRESS,CONTRACT_ABI} from "../constants";
import { utils } from "ethers";



export function Freelancer(){
   const [availableOrders,setAvailableOrders] = useState([{ client_address :"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
   completiondays : "2",salary_offered :"10 ",order_id:"-1"}]);
   const [acceptedOrders,setAcceptedOrders] = useState([]);
   const {data:signer}= useSigner();
   const contract = useContract({
      addressOrName: CONTRACT_ADDRESS,
      contractInterface: CONTRACT_ABI,
     signerOrProvider:signer
   });

 useContractEvent({
   addressOrName: CONTRACT_ADDRESS,
   contractInterface: CONTRACT_ABI,
   eventName: 'request',
   listener: (event) => { 
      setAvailableOrders((prev)=>{
         return [
         {
            client_address : event[0].toString(),
            completiondays : event[1].toString(),
            salary_offered : event[2].toString(),
            order_id : event[3].toString()
         }
      ,...prev]
      })
   }
 });


 function acceptOrder(idx){
      setAcceptedOrders((prev) => {
         return [
            {...availableOrders[idx]},
            ...prev
         ]
      });
      setAvailableOrders((prev) => {
        return  prev.filter((_,index)=> index!=idx)
      });

   document.getElementsByClassName("availableorders")[0].classList.add("hidden");
   document.getElementsByClassName("acceptedorders")[0].classList.remove("hidden");
 }

 useContractEvent({
   addressOrName:CONTRACT_ADDRESS,
   contractInterface:CONTRACT_ABI,
   eventName:"startWork",
   listener : (event) => {
      document.getElementsByClassName("completedTheOrderbutton")[0].classList.remove("hidden");
   }
});

useContractEvent({
   addressOrName:CONTRACT_ADDRESS,
   contractInterface:CONTRACT_ABI,
   eventName:"workNotCompleted",
   listener : (event) => {
      document.getElementsByClassName("waitingForClientReply")[0].classList.add("hidden");
      document.getElementsByClassName("rejectionPage")[0].classList.remove("hidden");
   }
});

 // function to stalk the amount

 async function stakeAmount(orderid){
   let amountToBeStaked = utils.parseEther("0.001");
   const tx = await  contract.acceptRequest(orderid,{
      value:amountToBeStaked
  });
   await tx.wait();
   document.getElementsByClassName("acceptTheOrderbutton")[0].classList.add("hidden");
 }

 async function askForApproval(orderid){
     const tx = await  contract.workCompleted(orderid);
     await tx.wait();
     document.getElementsByClassName("waitingForClientReply")[0].classList.remove("hidden");
     document.getElementsByClassName("acceptedorders")[0].classList.add("hidden");
 }
 



   return (
      <div> 
         <div className="rejectionPage flex h-[100vh] hidden flex-col justify-center items-center">
            <h1>client rejected your work contact us if you want any help contact us</h1>
         </div> 

         <div className="waitingForClientReply hidden flex h-[100vh] flex-col justify-center items-center">
                 <h1>waiting for client response</h1>     
         </div>
    
        <div className="availableorders h-[100vh] flex flex-col items-center">
           { availableOrders.map((order,idx)=>{
            return(
               <div key={idx} className=" m-3 flex flex-col bg-gray-100 justify-center p-3 items-center w-[70%] align-center">
               <strong>lable Id - [ {order.order_id} ]</strong>
               <label className="font-bold">client_address:</label> 
              <h2>{order.client_address}</h2>
              <label className="font-bold">submissionTime:</label> 
              <h2>{order.completiondays} days</h2>
              <label className="font-bold">salary_offered:</label> 
              <h2>{order.salary_offered} ether</h2>
              <div className="buttons w-[100%] flex flex-row justify-around">
              <button className="accept rounded bg-green-200 p-3 font-bold " onClick={()=>acceptOrder(idx)}>accept</button>
              <button className="reject rounded bg-red-200  p-3 font-bold ">reject</button>
             </div>
              </div>
           )
            })
         }
        </div>
        <div className="acceptedorders hidden  h-[100vh] available-orders  flex flex-col items-center">
           { acceptedOrders.map((order,idx)=>{
            return(
               <div key={idx} className=" m-3 flex flex-col bg-gray-100 justify-center p-3 items-center w-[70%] align-center">
               <label className="font-bold">client_address:</label> 
              <h2>{order.client_address}</h2>
              <label className="font-bold">submissionTime:</label> 
              <h2>{order.completiondays} days</h2>
              <label className="font-bold">salary_offered:</label> 
              <h2>{order.salary_offered} ether</h2>
              <div className="flex flex-row justify-start items-start w-[100%] m-3">
               <button className="acceptTheOrderbutton rounded bg-green-200 p-3" onClick={()=> stakeAmount(order.order_id)}>acceptOrder</button>
               <button className="completedTheOrderbutton hidden rounded bg-green-200 p-3" onClick={()=>askForApproval(order.order_id)} >completed</button>
               </div>
              </div>
           )
            })            
         }
        </div>     
    </div>
   )
}