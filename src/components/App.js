import React, { Component } from 'react';
import './App.css';
import Navbar from './Navbar';
import Main from './Main';
import Web3 from 'web3';
import PresaleContract from '../abis/PresaleContract';

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } else if(window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('No ethereum browser is installed. Try it installing MetaMask.');
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
	
    // Cargar cuenta
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    // Recoger contrato
    const networkId = await web3.eth.net.getId();
    if(networkId === 97) {//TODO: cambiar a 56
      // Asignar contracto
      const presaleContract = new web3.eth.Contract(PresaleContract.abi, PresaleContract.address)
      this.setState({ presaleContract })
      
      const tokenAddress = await presaleContract.methods.token().call()
      this.setState({ tokenAddress })
      
      let presaleEnding = await presaleContract.methods.ending().call()
      let actualTime = Date.now() / 1000 | 0

      // Revisa si está dentro de la whitelist.
      let whitelist = await presaleContract.methods.whitelist(this.state.account).call()
      if(whitelist === true && presaleEnding.toNumber() >= actualTime) {
        this.setState({ buyAvailable: false })
      }

      // Recoge tiempo en el que se va a poder hacer claim.
      let cooldownTime = await presaleContract.methods.claimReady(this.state.account).call()
      if(cooldownTime.toNumber() <= actualTime && whitelist === true && presaleEnding.toNumber() != 0 && presaleEnding.toNumber() <= actualTime) {
        this.setState({ claimAvailable: false })
      }

      this.setState({ loading: false })
    } else {
      window.alert('Network error, change to Binance Smart Chain and reload the page.');
    }
  }

  buyTokens = (bnbAmount) => {
    this.setState({ loading: true });

    this.state.presaleContract.methods.invest().send({ value: bnbAmount, from: this.state.account })
    .on('confirmation', (confirmationNumber) => {
      this.setState({ loading: false });
      window.location.reload();
    });
  }

  claimTokens = () => {
    this.setState({ loading: true });

    this.state.presaleContract.methods.claimTokens().send({ from: this.state.account })
    .on('confirmation', (confirmationNumber) => {
      this.setState({ loading: false });
      window.location.reload();
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      account: '',
      presaleContract: {},
      tokenAddress: {},
      buyAvailable: true,
      claimAvailable: true,
      loading: true
    }
  }

  render() {
    let content;
    if(this.state.loading) {
      content = <p id="loader" className="text-center">Loading...</p>
    } else {
      content = <Main 
        tokenAddress={ this.state.tokenAddress }
        buyTokens={ this.buyTokens }
        claimTokens={ this.claimTokens }
        buyAvailable={ this.state.buyAvailable }
        claimAvailable={ this.state.claimAvailable }
      />
    }

    return (
      <div>
        <Navbar account={ this.state.account } />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
