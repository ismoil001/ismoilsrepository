import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, Col, Container, Nav, NavItem, NavLink, Row, Table} from "reactstrap";
import {FaEdit, FaRegEdit, FaTrashAlt} from "react-icons/fa";

class Index extends Component {
  render() {

        const admin= [
          {
            col1: 'Date',
            col2: 'Product',
            col3: 'Company',
            col4: 'User',
            col5: 'Count',
            col6: 'Price',
            col7: 'Sum',
            col8: 'Qoldiq',
            col9: 'Payment',
            col10: 'Operation',
          },
        ]
        const adminData= [
          {
            id: 1,
            date: "1asssssssasd",
            product: "2asssssss",
            company: "3dddddddddddddd",
            user: "4dsasdasda",
            count: "5asdasdasd",
            price: "6asdasd",
            sum: "7asdasdasd",
            qoldiq: "8asdasdasd",
            payment: "9asdasdasdasd",
            operation: "",
          },
        ]
    return (
      <div>
        <Col xl={10} className='mainContent border-bottom'>
          <Row>
            <Col xl={12}>
              <div className="d-flex justify-content-center">
                <p style={{fontSize: "35px"}}>Admin page</p>
              </div>
            </Col>
          </Row>
          <div className="d-flex justify-content-center">
            <Row className=''>
              <Col xl={12}>
                <Button className='tableBtn'>Add order</Button>
                <Table className='tables'>
                  <thead>
                  {admin.map((i, index) => {
                    return (
                      <tr className='tableRowMain'>
                        <th>
                          {i.col1}
                        </th>
                        <th>
                          {i.col2}
                        </th>
                        <th>
                          {i.col3}
                        </th>
                        <th>
                          {i.col4}
                        </th>
                        <th>
                          {i.col5}
                        </th>
                        <th>
                          {i.col6}
                        </th>
                        <th>
                          {i.col7}
                        </th>
                        <th>
                          {i.col8}
                        </th>
                        <th>
                          {i.col9}
                        </th>
                        <th>
                          {i.col10}
                        </th>
                      </tr>
                    )
                  })}
                  </thead>
                  <tbody>
                  {adminData.map((i, index) => {
                    return (
                      <tr key={i.key} className='tableHover'>
                        <td>
                          {i.date}
                        </td>
                        <td>
                          {i.product}
                        </td>
                        <td>
                          {i.company}
                        </td>
                        <td>
                          {i.user}
                        </td>
                        <td>
                          {i.count}
                        </td>
                        <td>
                          {i.price}
                        </td>
                        <td>
                          {i.sum}
                        </td>
                        <td>
                          {i.qoldiq}
                        </td>
                        <td>
                          {i.payment}
                        </td>
                        <td>
                          <div className="d-flex justify-content-center mainRound align-items-center">
                            <a href="">
                              <div className="round">
                                <span className='icons'><FaEdit/></span>
                              </div>
                            </a>
                            <a href="">
                              <div className="round">
                                <span className='icons'><FaTrashAlt/></span>
                              </div>
                            </a>
                            <a href="">
                              <div className="round">
                                <span className='icons'><FaRegEdit/></span>
                              </div>
                            </a>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </div>
        </Col>

      </div>
    );
  }
}

Index.propTypes = {};

export default Index;
