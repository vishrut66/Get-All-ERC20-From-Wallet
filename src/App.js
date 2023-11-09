import './App.css';
import { useState } from "react";
import { ethers } from "ethers";
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils"


function App() {


  const [address, setAddress] = useState();
  const [network, setNetwork] = useState();
  const [chainId, setChainId] = useState();
  const [walletConnected, setWalletConnected] = useState(false);

  const [msg, setMsg] = useState();

  const [APIConnected, setAPIConnected] = useState(false);
  const [ERC20s, setERC20s] = useState();


  const connectButton = async () => {
    const { ethereum } = window;

    if (ethereum.isMetaMask) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);


      const { name, chainId } = await provider.getNetwork();

      setNetwork(name);
      setChainId(chainId);
      setAddress(accounts[0]);

      setWalletConnected(true);


    } else {
      setMsg("Install MetaMask");
    }
  };

  window.ethereum.on('accountsChanged', function () {
    connectButton();
  })

  window.ethereum.on('networkChanged', function () {
    connectButton();
  })

  // make sure it only runs/called once 
  const start = async () => {
    await Moralis.start({
      apiKey: process.env.REACT_APP_MY_API_KEY,
      // ...and any other configuration
    });
  }

  // get by using moralis
  const getERC20 = async () => {

    if (APIConnected === false) {
      start();
      setAPIConnected(true);
    }

    let chain;

    if (chainId === 1) {
      chain = EvmChain.ETHEREUM;
    } else if (chainId === 137) {
      chain = EvmChain.POLYGON;
    } else if (chainId === 56) {
      chain = EvmChain.BSC;
    } else if (chainId === 80001) {
      chain = EvmChain.MUMBAI
    } else if (chainId === 42161) {
      chain = EvmChain.ARBITRUM;
    } else if (chainId === 250) {
      chain = EvmChain.FANTOM;
    } else if (chainId === 43114) {
      chain = EvmChain.AVALANCHE;
    }

    const response = await Moralis.EvmApi.token.getWalletTokenBalances({ address, chain });

    const ERC20s = response.toJSON();

    // it is temporary remove it in production mode
    if (ERC20s === undefined || ERC20s.length === 0) {
      alert("you don't have ERC20 token");
    }

    setERC20s(ERC20s);
  }



  return (
    <div className="App">

      <h2>I know UI if not so good but it'work! (update comes soon!!)</h2>

      <h3> Created by Vishrut </h3>
      <h1>Connect MetaMask</h1>
      <button onClick={connectButton}>Connect Wallet</button>
      <br />
      <br />
      <p>Public Key: {address}</p>
      <p>Network: {network}</p>
      <p>Chain ID : {chainId}</p>
      {msg && <p>{msg}</p>}

      <br />
      <br />

      <h1>get balance</h1>
      <button disabled={!walletConnected} onClick={getERC20}>get balance</button>

      <h1>ERC20 in your Wallet</h1>
      <table>
        <thead>
          <tr >
            <th scope="col">Symbol</th>
            <th scope="col">Amount</th>
            <th scope="col">token address</th>
            <th scope="col">Name</th>
          </tr>
        </thead>

        <tbody>
          {

            ERC20s?.map((token, inx) => {
              const dec = token.decimals;
              const amount = (token.balance / 10 ** dec).toFixed(2);

              return (
                <>
                  <tr key={inx + 1}>
                    <td name="symbol" >{token.symbol}</td>
                    <td name="Amount" >{amount}</td>
                    <td name="Amount" >{token.token_address}</td>
                    <td name="token">{token.name}</td>
                  </tr>
                  <br />
                </>
              )
            })
          }

        </tbody>
      </table>
      <br />
      <br />

    </div>
  );
}

export default App;
