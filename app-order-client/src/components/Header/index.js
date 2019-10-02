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

      <Container className='p-0'>
        <Navbar  light expand="md" className="lato-regular">
          <NavbarBrand href="/"><img src="/assets/images/logo.png" alt="logo"/></NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <Link onClick={this.toggle}  spy={true} smooth={true} duration={1500}  to="bizhaqimizda">
                  <NavLink href="/" className="aboutUs">
                    <FormattedMessage id="header_link1"/>
                  </NavLink>
                </Link>
              </NavItem>
              <NavItem>
                <Link onClick={this.toggle}  spy={true} smooth={true} duration={1500}  to="xizmatlar">
                <NavLink href="/">
                  <FormattedMessage id="header_link2"/>
                  </NavLink>
                </Link>
              </NavItem>
              <NavItem>
                <Link onClick={this.toggle}  spy={true} smooth={true} duration={1500}  to="portfolio">
                <NavLink href="/">
                  <FormattedMessage id="header_link3"/>
                </NavLink>
                </Link>
              </NavItem>
              <NavItem>
                <Link onClick={this.toggle}  spy={true} smooth={true} duration={1500}  to="mijozlar">
                <NavLink href="/">
                  <FormattedMessage id="header_link4"/>
                </NavLink>
                </Link>
              </NavItem>
              <NavItem>
                <Link onClick={this.toggle} spy={true} smooth={true} duration={1500}  to="jamoa">
                <NavLink href="/">
                  <FormattedMessage id="header_link5"/>
                </NavLink>
                </Link>
              </NavItem>
              <NavItem>
                <Link onClick={this.toggle} spy={true} smooth={true} duration={1500}  to="kontakt">
                <NavLink href="/">
                  <FormattedMessage id="header_link6"/>
                </NavLink>
                </Link>
              </NavItem>
              {/*<NavItem>*/}
              {/*  <NavLink href="/dashboard">*/}
              {/*    <FormattedMessage id="header_link7"/>*/}
              {/*  </NavLink>*/}
              {/*</NavItem>*/}

              <UncontrolledDropdown>
                <DropdownToggle caret className="dropdownMain">
                  Uzbek <FaAngleDown className='faAngel'/>
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem onClick={()=>handleLang(1)} key={1}>
                    <FormattedMessage id='header_item1'/>
                  </DropdownItem>
                  <DropdownItem onClick={()=>handleLang(2)} key={2}>
                    <FormattedMessage id='header_item2'/>
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
