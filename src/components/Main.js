import React, { Component } from 'react';

class Main extends Component {
    render() {
        return(
            <div id="content" className="mt-3">
                <table className="table table-borderless text-muted text-center">
                    <thead>
                        <tr>
                            <th scope="col">Emyem Wallet Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{/*{window.web3.utils.fromWei(this.props.tokenV1Balance, 'Ether')}*/}0 Emyem</td>
                        </tr>
                    </tbody>
                </table>

                <div className="card mb-4" >
                    <div className="card-body">
                        <form className="mb-3" onSubmit={(event) => {
                            event.preventDefault();
                            let amount;
                            amount = this.input.value.toString();
                            amount = window.web3.utils.toWei(amount, 'Ether');
                            this.props.swapVersions(amount);
                        }}>
                            <div>
                                <label className="float-left"><b>Buy MYM with BNB</b></label>
                            </div>
                            <div className="input-group mb-4">
                                <input
                                type="text"
                                ref={(input) => { this.input = input }}
                                className="form-control form-control-lg"
                                placeholder="0"
                                required />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        MYM
                                    </div>
                                </div>
                            </div>
                            <button disabled={ this.props.swapAvailable } type="submit" className="btn btn-primary btn-block btn-lg">BUY</button>
                        </form>

                        <button 
                        disabled={ this.props.claimAvailable }
                        type="submit" 
                        className="btn btn-outline-primary btn-block"
                        onClick={(event) => {
                            event.preventDefault();
                            this.props.releaseTokens();
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