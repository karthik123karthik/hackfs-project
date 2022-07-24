import {useState,useEffect} from "react";
import {CONTRACT_ADDRESS,CONTRACT_ABI} from "../../constants";
import {useContract,useSigner} from "wagmi";
import {Freelancer} from "../../components/freelancer";
import {Client} from "../../components/client";
import {Verifier} from "../../components/Verifier";


export default function Gig(){
   const [owner,setOwner] =useState(null);
   const [client,setClient] =useState(null);
   const {data:signer} = useSigner();
   const contract = useContract({
      addressOrName: CONTRACT_ADDRESS,
      contractInterface: CONTRACT_ABI,
      signerOrProvider:signer
    });  

   useEffect(()=>{
      const run = async ()=>{
         const Owner = await contract.owner();
         setOwner(Owner.toString());
         const client = await signer.getAddress();
         setClient(client.toString());
      }
      run().catch(console.error);       
   },[contract]);

   function renderBody(){
      if(client == "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"){
         return <Verifier/>
      }
      if(owner == client){
         return <Freelancer/>;
      }
      else{
         return <Client/>
      }
   }
   
   
    return(
        <>
        {owner && client && renderBody()}
        </>
    )
}