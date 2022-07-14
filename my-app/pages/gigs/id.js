import {useState,useRef,useEffect} from "react";
import {Contract} from "ethers";
import { getProviderOrSigner } from "../../utilities";
import {CONTRACT_ADDRESS,CONTRACT_ABI} from "../../constants";
import Web3Modal from "web3modal";
import styles from "../../styles/Gig.module.css";


export default function Gig(){
   // must render two types of frontend one for user and other for freelancer
   const [owner,setowner] =useState("");
   const [client,setClient] =useState("");
   const web3Ref = useRef();

useEffect(()=>{
    web3Ref.current = new Web3Modal({
        network:"mumbai",
        providerOptions:{},
        disableInjectedProvider:false
   });
   const provider  = await getProviderOrSigner(false,web3Ref);
   const contract = new Contract(
    CONTRACT_ADDRESS,
    CONTRACT_ABI,
    provider
   );
   contract.on("request",()=>{

   });
   
   setUserandClient();

   },[]);


   async function setUserandClient(){
    const signer  = await getProviderOrSigner(true,web3Ref);
    const user = await signer.getAddress();
    setClient(user);

    const contract  = new Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
    );

    const Owner = await contract.owner();
    setowner(Owner);
   }



function renderOwner(){
    return(
        <h1>hello I am owner</h1>
    )
}




function renderClient(){

    return(
        <>
         <div className={styles.selectService}>
           <button className="p-2 m-5 rounded bg-red-200">provide an order</button> 
           <button className="p-2 m-5 rounded bg-red-200">chat with freelancer</button> 
         </div>
         <div className={styles.historySection}>
                       
         </div>
         </>
    )
}

  
  

 function renderBody(){      
    if(client==owner) return renderOwner()
    else return renderClient()
   }



    return(
        <>
         {renderBody()}
        </>
    )
}