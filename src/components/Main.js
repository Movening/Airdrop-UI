import React, { Component } from 'react';

class Main extends Component {
    render() {
        return(
            <div id="content" className="mt-3">
                <table className="table table-borderless text-muted text-center">
                    <thead>
                        <tr>
                            <th scope="col">Token Contract</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{ this.props.tokenAddress }</td>
                        </tr>
                    </tbody>
                </table>

                <div className="card mb-4" >
                    <div className="card-body">
                        <form className="mb-3" onSubmit={(event) => {
                            event.preventDefault();
                            let bnbAmount;
                            bnbAmount = this.input.value.toString();
                            bnbAmount = window.web3.utils.toWei(bnbAmount, 'Ether');
                            this.props.buyTokens(bnbAmount);
                        }}>
                            <div>
                                <label className="float-left"><b>Buy MYM with BNB</b></label>
                            </div>
                            <div className="input-group mb-1">
                                <input
                                type="text"
                                ref={(input) => { this.input = input }}
                                className="form-control form-control-lg"
                                placeholder="0"
                                required />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        BNB
                                    </div>
                                </div>
                            </div>
                            <p className="mt-0 mb-3 text-center">Min. 0.10 BNB / Max. 10 BNB</p>
                            <button disabled={ this.props.buyAvailable } type="submit" className="btn btn-primary btn-block btn-lg">BUY</button>
                        </form>

                        <button 
                        disabled={ this.props.claimAvailable }
                        type="submit" 
                        className="btn btn-outline-primary btn-block"
                        onClick={(event) => {
                            event.preventDefault();
                            this.props.claimTokens();
                        }}>
                            CLAIM MYM
                        </button>
                    </div>
                </div>
            </div>    
        );
    }
}

export default Main;