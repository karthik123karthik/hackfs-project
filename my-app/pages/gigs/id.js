import {useState,useEffect} from "react";
import {CONTRACT_ADDRESS,CONTRACT_ABI} from "../../constants";
import {useContract,useSigner} from "wagmi";
import {Freelancer} from "../../components/freelancer";
import {Client} from "../../components/client";


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