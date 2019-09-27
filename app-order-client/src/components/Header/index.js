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
import { formatMessage, setLocale, getLocale, FormattedMessage } from 'umi-plugin-locale';
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

    const handleLang=(key)=>{
      if(key===1){
        setLocale("en-US")
      }else{
        setLocale("en-RU")
      }
    }
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
                <NavLink href="/login">Admin <div></div></NavLink>
              </NavItem>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret className="language">
                  Uzbek
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5 5L9 1" stroke="grey" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>

                </DropdownToggle>
                <DropdownMenu right >
                  <DropdownItem onClick={()=>handleLang(1)} key={1}>
                    RU
                  </DropdownItem>
                  <DropdownItem onClick={()=>handleLang(2)} key={2}>
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
