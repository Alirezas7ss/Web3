import React, { useState, useEffect } from "react";
import NFTCollection from "../ABI/NFTCollection.json";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
const rinkeby = 'https://rpc.ankr.com/eth_rinkeby';
const addressCol = '0x369ea1705040e94FC3404181D8dd61593539b983'
const quantity = 1
export default function create() {
  const [address,setAddress] = useState()
  const [supply , setSupply] = useState()
  useEffect(() => {
    showSupply();
  }, []);

  async function connectWallet() {
    if(window.ethereum){
    try {
      const accounts = await window.ethereum.request({
           method:"eth_requestAccounts",});
      setAddress(accounts[0]);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const erc721 = ethers.Contract(addressCol , NFTCollection , provider)
    } catch (error) {
      console.log('Error connecting');
    }
  }else {
    alert('install metaMask')
  }
  }
  const disconnectWallet = () =>{
    setAddress(null);
  }
  async function mint() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const erc721 = new ethers.Contract(addressCol , NFTCollection , signer);
    const price = erc721.publicSalePrice()
    const addressS = signer.getAddress()
    const tx3 = await erc721.publicSaleMint( addressS , quantity , {value: price });
    await tx3.wait();
  }
  const showSupply = async() => {
    const provider = new ethers.providers.JsonRpcProvider(rinkeby);
    const erc721 = new ethers.Contract(addressCol, NFTCollection, provider);
    const Supply = await erc721.totalSupply() 
    setSupply(Supply)
  }
  
  
  
  return (
    <div className='h-screen w-full bg-primary'>
      <div className="flex flex-wrap justify-center items-center">
        {!address ? <button type="submit"  onClick={connectWallet}  className="text-white mt-10 text-lg bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:ring-green-200 dark:focus:ring-green-800 transition-all font-medium rounded-lg  px-5 py-2.5 text-center  mb-2">Connect</button>:
         <button type="submit" onClick={disconnectWallet}  className="text-white mt-10 text-lg bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg px-5 py-2.5 text-center  mb-2">Disconnect</button>
        }
      </div>
      {address && <p className='font-bold text-center  ' >{address}</p>}
      <div>
        <div className="h-52 w-52 border-red-400 border rounded-lg p-10 bg-slate-700 block ml-auto mr-auto">
          <p className='font-bold text-center  '>{`Total supply : ${supply}/10000`}</p>
          <button onClick={mint} type="submit"  className="text-white mt-5 block ml-auto mr-auto text-lg bg-gradient-to-br from-purple-600 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg  px-5 py-2.5 text-center mb-2">mint</button>
        </div>
      </div>
    </div>
  )
}
