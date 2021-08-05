import React from "react";
import "styles/connect-wallet.css";
import 'font-awesome/css/font-awesome.min.css';
import {useWeb3React, Web3ReactProvider} from "@web3-react/core";
import {injectedConnector} from "../../components/Header";
import {Web3Provider} from "@ethersproject/providers";

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

function ConnectWallet() {
  const { activate, account } = useWeb3React();
  const connectWallet = async () => {
    await activate(injectedConnector);
  };

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <main className="main">
        <div className="wallet-bg">
          <img src="/assets/img/home/bg.gif" />
        </div>
        <div className="container">
          <div className="row">
            <div className="offset-2 col-8" style={{ marginTop: 180 }}>
              <a href="/">
                <i className="fa fa-arrow-left"></i>
                <span className="ml-3"><b>Go Back</b></span>
              </a>
              <div className="mt-3">
                <h1>Connect to your wallet</h1>
              </div>
              <div className="mt-1">
                Connect with one of available wallet providers <br/> or create a new wallet. <a href="#"> <b>What is a wallet?</b></a>
              </div>
              <div className="mt-5">
                <div className="row">
                  <div className="col-5 ">
                    <a onClick={connectWallet} className="btn-connect-wallet">
                      <img src="/assets/img/metamask.svg" style={{ width: 30 }} />
                      <h3 className="mt-1">Metamask</h3>
                      <span>One of the most secure<br/> wallets with great flexibility</span>
                    </a>
                  </div>
                  <div className="col-5">
                    <a href="#" className="btn-connect-wallet">
                      <img src="/assets/img/rainbow.png" style={{ width: 30 }} />
                      <img src="/assets/img/trust.png" className="ml-2" style={{ width: 30 }} />
                      <img src="/assets/img/argent.png" className="ml-2" style={{ width: 30 }} />
                      <h3 className="mt-1">WalletConnection</h3>
                      <span>Connect with Rainbow, Trust,<br/>Argent and more</span>
                    </a>
                  </div>
                </div>
                <div className="mt-5">
                  We do not own your private keys and cannot access your<br/>
                  funds without your confirmation.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Web3ReactProvider>

  );
}

export default ConnectWallet;