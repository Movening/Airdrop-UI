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
      const presaleContract = new web3.eth.Contract(PresaleContract.abi, PresaleContract.address);
      this.setState({ presaleContract });
      
      const owner = await presaleContract.methods.owner().call()
      console.log(owner)

      this.setState({ loading: false });
    } else {
      window.alert('Network error, change to Binance Smart Chain and reload the page.');
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      account: '',
      presaleContract: {},
      loading: true
    }
  }

  render() {
    let content;
    if(this.state.loading) {
      content = <p id="loader" className="text-center">Loading...</p>
    } else {
      content = <Main 
        // TODO:
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
