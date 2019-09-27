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
  DropdownItem, Col
} from 'reactstrap';
import {FaAngleDown} from "react-icons/fa";
import {Link} from "react-scroll/modules";

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

      <Container>
        <Navbar  light expand="md" className="lato-bold " >
          <NavbarBrand href="/"><img src="/assets/images/logo.png" alt="salom"/></NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <Link  spy={true} smooth={true} duration={1500}  to="bizhaqimizda">
                  <NavLink href="/" className="aboutUs">
                  Biz haqimizda
                  <div></div>
                  </NavLink>
                </Link>
              </NavItem>
              <NavItem>
                <Link  spy={true} smooth={true} duration={1500}  to="xizmatlar">
                <NavLink href="/">Xizmatlar
                  <div></div></NavLink>
                </Link>
              </NavItem>
              <NavItem>
                <Link  spy={true} smooth={true} duration={1500}  to="portfolio">
                <NavLink href="/">Portfolio
                  <div></div></NavLink>
                </Link>
              </NavItem>
              <NavItem>
                <Link  spy={true} smooth={true} duration={1500}  to="mijozlar">
                <NavLink href="/">Mijozlar <div></div></NavLink>
                </Link>
              </NavItem>
              <NavItem>
                <Link  spy={true} smooth={true} duration={1500}  to="jamoa">
                <NavLink href="/">Jamoa <div></div></NavLink>
                </Link>
              </NavItem>
              <NavItem>
                <Link  spy={true} smooth={true} duration={1500}  to="kontakt">
                <NavLink href="/">Kontakt <div></div></NavLink>
                </Link>
              </NavItem>
              <NavItem>
                <NavLink href="/dashboard">Admin <div></div></NavLink>
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
