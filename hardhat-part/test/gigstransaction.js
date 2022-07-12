const {expect, assert} = require("chai");
const {ethers} = require("hardhat");
const {BigNumber} = require("ethers");

describe("gigTransaction contract",function (){
  let contractInstance;
    beforeEach(async()=>{
      const [owner,add1,add2] = await ethers.getSigners();
      const factory = await ethers.getContractFactory("GigTransaction");
      contractInstance = await factory.deploy(add2.address,{value : ethers.utils.parseEther("0.01")});
       await contractInstance.deployed();
    });
  it("must allow send amount  to freelncer after completing the work ",async ()=>{
     const tx =  await contractInstance.sendToFreelancer(true);
     await tx.wait();
     expect(await contractInstance.giveBalanceOfEth()).to.equal(BigNumber.from(0));
  });

  it("testing acceptrequest function",async()=>{
    const [owner,addr1] = await ethers.getSigners();
    const tx1 = await contractInstance.acceptRequest(0,{value:ethers.utils.parseEther("0.1")});
    await tx1.wait();   
    expect(await contractInstance.giveBalanceOfEth()).to.equal(ethers.utils.parseEther("0.11"));
    await expect(contractInstance.connect(addr1).acceptRequest(0,{value:ethers.utils.parseEther("0.1")})).to.be.revertedWith("Ownable: caller is not the owner");
  });

  describe("sendPaymentToSmartContract function",function(){
     it("allows only client to call this function",async()=>{
         await expect(contractInstance.sendPaymenttosmartcontract(0)).to.be.revertedWith("you are not the client of this order");
     });

     it("should revert if the sent amount is wrong",async()=>{
      const [owner,addr1] = await ethers.getSigners();
      const tx1 = await contractInstance.connect(addr1).makeRequest(BigNumber.from(3),BigNumber.from(2));
      await tx1.wait();
       await expect(contractInstance.connect(addr1).sendPaymenttosmartcontract(0,{value:ethers.utils.parseEther("1")})).to.be.revertedWith("please send the correct amount");
     });

     it("should transfer amount from client to contract",async()=>{
      const [owner,addr1] = await ethers.getSigners();
      const tx =  await contractInstance.sendToFreelancer(true);
      await tx.wait();
      const tx1 = await contractInstance.connect(addr1).makeRequest(3,2);
      await tx1.wait();
      const order = await contractInstance.getOrder(0);
      const tx2 = await contractInstance.connect(addr1).sendPaymenttosmartcontract(0,{value:order.salary.toString()});
      await tx2.wait();
      expect(await contractInstance.giveBalanceOfEth()).to.equal("2");
     });      
  });

  
  describe("claim penalty function",function(){
    
    it("should allow only verifier to call it",async()=>{
       const [owner,addr1,addr2] = await ethers.getSigners();   
       await expect(contractInstance.connect(addr1).claimPenalty(0)).to.be.revertedWith('you are not the verifier');      
     });

     it("should send amount to client",async()=>{
      const [owner,addr1,addr2] = await ethers.getSigners();  
       const tx1 = await contractInstance.connect(addr1).makeRequest(3,2);
      await tx1.wait(); 
      const tx = await contractInstance.connect(addr2).claimPenalty(0);
      await tx.wait(); 
     });     it("should verify submission time",async()=>{
      const [owner,addr1,addr2] = await ethers.getSigners();  
       const tx1 = await contractInstance.connect(addr1).makeRequest(4,2);
      await tx1.wait(); 
       expect(await contractInstance.connect(addr2).claimPenalty(0)).to.be.revertedWith("please wait till submission time finishes");
     });
  });


})