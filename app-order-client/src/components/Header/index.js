import React from 'react';
import '../../global.scss'
import {
  Container,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from 'reactstrap';
import {FaAngleDown} from "react-icons/fa";

export default class Header extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {

      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (

      <Container className='p-0'>
        <Navbar  light expand="md" className="lato-bold p-0">
          <NavbarBrand href="/"><img src="/assets/images/logo.png" alt="salom"/></NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="/" className="aboutUs">Biz haqimizda</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/">Xizmatlar</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/">Portfolio</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/">Mijozlar</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/">Jamoa</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/">Kontakt</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/dashboard">Admin</NavLink>
              </NavItem>

              <UncontrolledDropdown>
                <DropdownToggle caret className="dropdownMain">
                  Uzbek <FaAngleDown/>
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>Uzbek</DropdownItem>
                  <DropdownItem>Russian</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Navbar>
      </Container>
    );
  }
}
