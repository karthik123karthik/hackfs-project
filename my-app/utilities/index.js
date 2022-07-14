import {providers} from "ethers";

export async function  getProviderOrSigner(needSigner,web3Ref){
    try{
    const provider = await web3Ref.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    const {chainId} = await web3Provider.getNetwork();
    if(chainId!==80001){
      window.alert("please change the network to mumbai testnet");
      return;
    }
     if(needSigner){
      return web3Provider.getSigner();
     }
     return web3Provider;
    }
    catch(error){
      console.log(error);
    }
  }