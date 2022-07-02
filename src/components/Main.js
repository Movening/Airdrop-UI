import React, { Component } from 'react';

class Main extends Component {
    render() {
        return(
            <div id="content" className="mt-4">
                <table className="table table-borderless text-muted text-center mb-4">
                    <thead>
                        <tr>
                            <th className="pb-0" scope="col">Token Contract</th>
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
                        <div className="text-center mb-4">
                            <label><b>Pending Balance</b></label>
                            <br/>
                            <label>{ this.props.pendingBalance } MOVIs</label>
                        </div>

                        <button 
                            disabled={ this.props.claimNotAvailable }
                            type="submit" 
                            className="btn btn-outline-primary btn-block"
                            onClick={(event) => {
                                event.preventDefault();
                                this.props.claimTokens();
                        }}>
                            CLAIM MOVI
                        </button>
                    </div>
                </div>
            </div>    
        );
    }
}

export default Main;