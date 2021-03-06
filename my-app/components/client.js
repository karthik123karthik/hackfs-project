import {useContractEvent,useSigner,useContract} from "wagmi";
import {useState} from "react"
import { CONTRACT_ADDRESS,CONTRACT_ABI } from "../constants"
import {BigNumber, utils } from "ethers";

export function Client(){
    const [orderid,setOrderid] = useState(null);
    const {data:signer} = useSigner();
    const [value,setValue] = useState("0");
    const contract =    useContract({
        addressOrName:CONTRACT_ADDRESS,
        contractInterface:CONTRACT_ABI,
        signerOrProvider:signer
    });

    useContractEvent({
        addressOrName:CONTRACT_ADDRESS,
        contractInterface:CONTRACT_ABI,
        eventName:"accepted",
        listener : (event) => {
            document.getElementsByClassName("makeRequestPage")[0].classList.add("hidden");
            document.getElementsByClassName("sendToSmartContractPage")[0].classList.remove("hidden");
        }
    });

    useContractEvent({
        addressOrName:CONTRACT_ADDRESS,
        contractInterface:CONTRACT_ABI,
        eventName:"request",
        listener : (event) => {
            document.getElementsByClassName("makeRequestPage")[0].classList.add("hidden");
            document.getElementsByClassName("waitingForCompletion")[0].classList.remove("hidden");
            setOrderid(event[0]);
        }
    });




    useContractEvent({
        addressOrName:CONTRACT_ADDRESS,
        contractInterface:CONTRACT_ABI,
        eventName:"accepted",
        listener : (event) => {
            document.getElementsByClassName("waitingForCompletion")[0].classList.add("hidden");
            document.getElementsByClassName("sendToSmartContractPage")[0].classList.remove("hidden");
            setOrderid(event[0]);
        }
    });


    useContractEvent({
        addressOrName:CONTRACT_ADDRESS,
        contractInterface:CONTRACT_ABI,
        eventName:"clientdeposited",
        listener : (event) => {
                document.getElementsByClassName("sendToSmartContractPage")[0].classList.add("hidden");
                document.getElementsByClassName("waitingForCompletion")[0].classList.remove("hidden");
            
        }
    });

    useContractEvent({
        addressOrName:CONTRACT_ADDRESS,
        contractInterface:CONTRACT_ABI,
        eventName:"approvework",
        listener : (event) => {
                document.getElementsByClassName("waitingForCompletion")[0].classList.add("hidden");            
                document.getElementsByClassName("acceptTheWorkPage")[0].classList.remove("hidden");            
        }
    });



    async function sendAmount(orderid){
         const tx = await contract.sendToFreelancer(orderid);
         await tx.wait();
        document.getElementsByClassName("successPage")[0].classList.remove("hidden")
        document.getElementsByClassName("acceptTheWorkPage")[0].classList.add("hidden");
    }
// <iframe className="h-[90%] w-[100%]" src="https://code.hyperdapp.dev/flow/QmUPuXEbCE67bJdbeUUaDBNuei8U4VgK7tK6UrFjvprCHj"></iframe>



    async function workNotCompleted(orderid){
         const tx = await contract.rejectthework(orderid);
         await tx.wait();
    }

    function handleChange(e){
        setValue(e.target.value);
    }

    async function sendPaymentToSmartContract(){
       const tx = await contract.sendPaymenttosmartcontract(BigNumber.from(orderid),{value:utils.parseEther(value)});
       await tx.wait();
    }
    
    
    return (
        
        <div className="bg-slate-900">
               <h2 className="contact text-center  border p-3 text-xl bg-gray-100 w-[80vw] bg-amber-300 mb-2 mx-auto">If You Have Any Problem Contact us at Address:0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266</h2>
               <div className="makeRequestPage hidden h-[100vh] w-[80vw] mx-auto">
                  <iframe className="h-[100%] w-[100%]" src="https://code.hyperdapp.dev/flow/QmSkiyqY4BMAdoJ5V6EMB3YCEREdhL21iU9whCgv5rGHzJ"></iframe>
               </div>
               <div className="sendToSmartContractPage  h-[100vh] w-[80vw] mx-auto">
                   <p className="text  p-3 text-center text-xl bg-green-100">your order is accepted by  the freelancer please send the amount to smartcontract to allow freelancer to work.</p>
                   <iframe className="h-[90%] w-[100%]" src="https://code.hyperdapp.dev/flow/QmUPuXEbCE67bJdbeUUaDBNuei8U4VgK7tK6UrFjvprCHj"></iframe>    
                </div>
               <div className=" waitingForCompletion hidden bg-gray-100 text-2xl mx-auto  flex flex-col h-[100vh] w-[80%] justify-center border items-center">
                    <img src="/Loading.svg" className=" p-3 mb-5"></img>
                    <p>waiting for the  response from  the freelancer</p>
               </div>               
               <div className=" acceptTheWorkPage bg-gray-200 hidden mx-auto text-2xl flex flex-col h-[100vh] w-[80%] justify-center border items-center">
                   <p>freelancer told that he have completed the work and asking for his salary</p>
                   <div className="flex w-[100%]items-center text-xl p-3 m-6 justify-between border w-[70%] bg-blue-50 ">
                        <button className="rounded bg-green-200 text-black p-3 m-2 hover:bg-green-100" onClick={()=> sendAmount(orderid)}>sendAmount</button>
                        <button className="rounded bg-red-200 text-black p-2 hover:bg-red-100" onClick={()=> workNotCompleted(orderid)}>workNotCompleted</button>
                   </div>
              </div>
              <div className="successPage bg-gray-100 hidden  text-2xl w-[80%] mx-auto h-[100vh] flex flex-col justify-center items-center">
                         <img src="/success.svg" className=" w-[300px] mb-6"></img>
                         <h2>Thank You for using dLance and your order is completed</h2>
              </div>
        </div>

    )
}