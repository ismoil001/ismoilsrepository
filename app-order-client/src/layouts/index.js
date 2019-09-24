import {Col, Container, Nav, NavItem, NavLink, Row} from "reactstrap";
import React from "react";

function BasicLayout(props) {
  if(props.location.pathname==="/home" || props.location.pathname==="/login")
  {
    return props.children
  }else{
    return (
      <Container fluid={1} className='dashboardSection'>
        <Row className='row1'>
          <Col xl={2} className='p-0 bg-white border-right border-bottom'>
            <div className="dashboadBrand py-2 p-0 text-center">
              <img src="/assets/images/logo.png" alt=""/>
            </div>
          </Col>
          <Col xl={10} className='p-0 bg-white border-bottom'>
            <div className="d-flex mainSearch py-3 px-4">
              <input type="text" className="border search" placeholder="Search..."/>
              <div className="input-group-append">
                <button className="input-group-text srch_btn position-relative"/>
              </div>
            </div>
          </Col>
        </Row>
        <Row className='row2'>
          <Col xl={2} className='menuLists p-0 border-right border-bottom'>
            <Nav vertical className='nav'>
              <NavItem className='navItem'>
                <NavLink href="/dashboard" className='navLink'>Order</NavLink>
              </NavItem>
              <NavItem className='navItem'>
                <NavLink href="/payment" className='navLink'>Payment</NavLink>
              </NavItem>
              <NavItem className='navItem'>
                <NavLink href="/aksverka" className='navLink'>Aksverka</NavLink>
              </NavItem>
            </Nav>
          </Col>
          <Col xl={10} className='mainContent border-bottom'>
            {props.children}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default BasicLayout;
