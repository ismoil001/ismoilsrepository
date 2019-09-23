import React from 'react';
import '../../global.scss'
import {Link, animateScroll as scroll} from "react-scroll";
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
                <Link spy={true} smooth={true} duration={1000} activeClass="active" activeClassName="selected" to="bizhaqimizda">
                  <NavLink>Biz haqimizda</NavLink>
                </Link>
              </NavItem>
              <NavItem>
                <Link spy={true} smooth={true} duration={1500} activeClass="active" activeClassName="selected" to="xizmatlar">
                  <NavLink>Xizmatlar</NavLink>
                </Link>
              </NavItem>
              <NavItem>
                <Link spy={true} smooth={true} duration={1800} activeClass="active" activeClassName="selected" to="portfolio">
                  <NavLink>Portfolio</NavLink>
                </Link>
              </NavItem>
              <NavItem>
                <Link spy={true} smooth={true} duration={2000} activeClass="active" activeClassName="selected" to="mijozlar">
                  <NavLink>Mijozlar</NavLink>
                </Link>
              </NavItem>
              <NavItem>
                <Link spy={true} smooth={true} duration={1000} activeClass="active" activeClassName="selected" to="jamoa">
                  <NavLink>Jamoa</NavLink>
                </Link>
              </NavItem>
              <NavItem>
                <Link spy={true} smooth={true} duration={2000} activeClass="active" activeClassName="selected" to="kontakt">
                  <NavLink>Kontakt</NavLink>
                </Link>
              </NavItem>
              <NavItem>
                <NavLink href="/login">Kirish</NavLink>
              </NavItem>

              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret className="language">
                  Uzbek
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5 5L9 1" stroke="grey" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>

                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem>
                    RU
                  </DropdownItem>
                  <DropdownItem>
                    EN
                  </DropdownItem>
                  <DropdownItem />
                  <DropdownItem>
                    UZ
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Navbar>
      </Container>
    );
  }
}
