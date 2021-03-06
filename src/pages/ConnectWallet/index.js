import React, {useEffect} from "react";
import "styles/connect-wallet.css";
import 'font-awesome/css/font-awesome.min.css';
import {useWeb3React, Web3ReactProvider} from "@web3-react/core";
import {injectedConnector} from "../../components/Header";
import {Web3Provider} from "@ethersproject/providers";
import { firestore, auth } from '../../firebase';
import {useHistory} from "react-router-dom";


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
  const history = useHistory();


  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user == null) {
        history.push("/signin");
      }
    });
  }, [])

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <main className="main">
        <div className="container">
          <div className="row">
            <div className="col-md-8 connect-wallet-pg">
              <a href="/">
                <i className="fa fa-arrow-left"></i>
                <span className="ml-3"><b>Go Back</b></span>
              </a>
              <div className="mt-3">
                <h1>Connect to your wallet</h1>
              </div>
              <div className="mt-1">
                Connect with one of available wallet providers <br/> or create a new wallet.
              </div>
              <div className="mt-5">
                <div className="row">
                  <div className="col-5 ">
                    <div className="btn-connect-wallet">
                      <div onClick={connectWallet} style={{ cursor: "pointer" }}>
                        <img src="/assets/img/metamask.svg" style={{ width: 30 }} />
                        <h3 className="mt-1">Metamask</h3>
                        <span>One of the most secure<br/> wallets with great flexibility.</span>
                      </div>
                      <br/>
                      <span>If you do not have a MetaMask Wallet, sign up here <a href="https://metamask.io" target="_blank">https://metamask.io</a></span>
                    </div>
                  </div>
                  <div className="col-5">
                    <div className="btn-connect-wallet">
                      <div>
                        <img src="/assets/img/rainbow.png" style={{ width: 30 }} />
                        <img src="/assets/img/trust.png" className="ml-2" style={{ width: 30 }} />
                        <img src="/assets/img/argent.png" className="ml-2" style={{ width: 30 }} />
                        <h3 className="mt-1">WalletConnection</h3>
                        <span>Connect with Rainbow, Trust,<br/>Argent and more.</span><br/>
                      </div>
                      <br/>
                      <span>If you do not have a WalletConnect account, sign up here <a href="https://walletconnect.org" target="_blank">https://walletconnect.org</a></span>
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  We do not own your private keys and cannot access your<br/>
                  funds without your confirmation.
                </div>
              </div>
            </div>
            <div className="col-md-4 connect-wallet-video-pg">
              <iframe className="connect-wallet-video"
                      src="https://www.youtube.com/embed/d8IBpfs9bf4">
              </iframe>
            </div>
          </div>
        </div>
      </main>
    </Web3ReactProvider>

  );
}

export default ConnectWallet;