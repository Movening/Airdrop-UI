import React, { Component } from 'react';

class Navbar extends Component {
    render() {
        return (
            <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-2 shadow">
                <a
                    className="navbar-brand col-sm-3 col-md-2 mr-0"
                    href="https://movening.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Movening Airdrop
                </a>
                <ul className="navbar-nav px-3">
                    <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                        <p id="account" className="mb-0 text-white">{ this.props.account }</p>
                    </li>
                </ul>
            </nav>
        );
    }
}

export default Navbar;