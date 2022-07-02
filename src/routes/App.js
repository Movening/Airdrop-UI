import React, { Component } from 'react';
import Navbar from '../components/Navbar';
import Main from '../components/Main';
import Web3 from 'web3';
import AirdropContract from '../abis/AirdropContract';

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
    if(networkId === 56) {
      // Asignar contracto
      const airdropContract = new web3.eth.Contract(AirdropContract.abi, AirdropContract.address)
      this.setState({ airdropContract })
      
      const tokenAddress = await airdropContract.methods.token().call()
      this.setState({ tokenAddress })
      
      let actualTime = Date.now() / 1000 | 0

      let pendingBalance = await airdropContract.methods.pendingBalanceByAddress(this.state.account).call()
      pendingBalance = web3.utils.fromWei(pendingBalance.toString(), 'ether')
      this.setState({ pendingBalance })

      // Revisa si está dentro de la whitelist y recoge tiempo en el que se va a poder hacer claim.
      let whitelist = await airdropContract.methods.whitelistByAddress(this.state.account).call()
      let cooldownTime = await airdropContract.methods.claimReadyByAddress(this.state.account).call()
      if(Number(cooldownTime) <= actualTime && whitelist === true && pendingBalance > 0) {
        this.setState({ claimNotAvailable: false })
      }

      this.setState({ loading: false })
    } else {
      window.alert('Network error, change to Binance Smart Chain and reload the page.');
    }
  }

  claimTokens = () => {
    this.setState({ loading: true });

    this.state.airdropContract.methods.claimTokens().send({ from: this.state.account })
    .on('confirmation', () => {
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
      claimNotAvailable: true,
      pendingBalance: 0,
      loading: true
    }
  }

  render() {
    let content;
    if(this.state.loading) {
      content = <p id="loader" className="text-center mt-5">Loading...</p>
    } else {
      content = <Main 
        tokenAddress={ this.state.tokenAddress }
        claimTokens={ this.claimTokens }
        claimNotAvailable={ this.state.claimNotAvailable }
        pendingBalance={ this.state.pendingBalance }
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
