import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  // NavLink,
  // UncontrolledDropdown,
  // DropdownToggle,
  // DropdownMenu,
  // DropdownItem,
} from 'reactstrap';
import { withRouter } from 'react-router-dom';

import { logout } from '../utils/auth';

class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }
  render() {
    return (
      <div>
        <Navbar color="dark" dark expand="md">
          <NavbarBrand href="/">reactstrap</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              {this.props.isLoggedIn ? (
                <NavItem>
                  <button
                    onClick={() => {
                      logout();
                      this.props.history.push('/');
                    }}
                    className="btn btn-outline-success my-2 my-sm-0"
                    type="submit"
                  >
                    Logout
                  </button>
                </NavItem>
              ) : (
                <NavItem>
                  <button
                    onClick={() => {
                      this.props.history.push('/Login');
                    }}
                    className="btn btn-outline-success my-2 my-sm-0"
                    type="submit"
                  >
                    Login
                  </button>
                </NavItem>
              )}
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

export default withRouter(NavBar);
