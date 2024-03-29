import React from "react"
import '../global.scss'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {Link} from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Col,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle, Nav,
  Row,
  UncontrolledDropdown
} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import CountTo from 'react-count-to';
import {Map, Placemark, YMaps} from "react-yandex-maps";
import Slider from "react-slick";
import Header from "../components/Header/index";
import Carusel from "../components/Carusel";
import {FaAngleDown} from "react-icons/fa";
import {connect} from "dva";
import {FormattedMessage, formatMessage, setLocale, getLocale,} from 'umi-plugin-locale';

@connect(({app}) => ({app}))

class A extends React.Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false,
      windowHeight: undefined,
      windowWidth: undefined,
      scrolled: false,
      count: true,
    };
  }

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize)

  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  resize = () => {
    return window.innerWidth;
  }
  handleResize = () => this.setState({
    windowHeight: window.innerHeight,
    windowWidth: window.innerWidth
  });
  scrolled = () => {
    var testDiv = document.getElementById("fixedMenu");

    if (window.visualViewport.pageTop < testDiv.offsetTop + 50 && window.visualViewport.pageTop > testDiv.offsetTop - 500) {

      this.state.count = true;

      this.setState(this.state)
    }
    if (window.visualViewport.pageTop != 0) {
      this.state.scrolled = true;
      this.setState(this.state)
    } else {
      this.state.scrolled = false;
      this.setState(this.state)
    }
    console.log("state")
    console.log(this.state.count)
  }

  render() {
    const {app} = this.props;
    const {company, homeData} = app;

    let settings = {
      dots: true,
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: homeData ? homeData.masters.length >= 3 ? 3 : homeData.masters.length : 1,
      autoplay: true,
      speed: 500,
      autoplaySpeed: 5000,
      cssEase: "linear",
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
            slidesToScroll: homeData ? homeData.masters.length >= 2 ? 2 : homeData.masters.length : 1,
            infinite: true,
            dots: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            initialSlide: 1
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    };
    let portfolio = {
      dots: true,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      speed: 300,
      autoplaySpeed: 3000,
      cssEase: "linear"
    };
    const mapData = {
      center: [40.539137, 70.940434],
      zoom: 17,
    };
    const coordinates = [
      [40.539137, 70.940434]
    ];
    const slideUsers = [
      {
        img: "/assets/images/user1.png",
        name: <FormattedMessage id="section7_User_Name1"/>,
        profession: <FormattedMessage id="section7_User_Profession1"/>,
      },
      {
        img: "/assets/images/user2.png",
        name: <FormattedMessage id="section7_User_Name2"/>,
        profession: <FormattedMessage id="section7_User_Profession2"/>,
      },
      {
        img: "/assets/images/user3.png",
        name: <FormattedMessage id="section7_User_Name3"/>,
        profession: <FormattedMessage id="section7_User_Profession3"/>,
      },
      {
        img: "/assets/images/user3.png",
        name: <FormattedMessage id="section7_User_Name4"/>,
        profession: <FormattedMessage id="section7_User_Profession4"/>
      },
      {
        img: "/assets/images/user1.png",
        name: <FormattedMessage id="section7_User_Name5"/>,
        profession: <FormattedMessage id="section7_User_Profession5"/>,
      },
      {
        img: "/assets/images/user2.png",
        name: <FormattedMessage id="section7_User_Name6"/>,
        profession: <FormattedMessage id="section7_User_Profession6"/>
      },
    ]
    const ourService = [
      {
        img: "/assets/images/mahsulot.png",
        title: <FormattedMessage id='section3_Sub_Title1'/>
      },
      {
        img: "/assets/images/mahsulot2.png",
        title: <FormattedMessage id='section3_Sub_Title2'/>
      },
      {
        img: "/assets/images/mahsulot3.png",
        title: <FormattedMessage id='section3_Sub_Title3'/>
      },
      {
        img: "/assets/images/mahsulot4.png",
        title: <FormattedMessage id='section3_Sub_Title4'/>
      },
      {
        img: "/assets/images/mahsulot5.png",
        title: <FormattedMessage id='section3_Sub_Title5'/>
      },
      {
        img: "/assets/images/mahsulot6.png",
        title: <FormattedMessage id='section3_Sub_Title6'/>
      },
      {
        img: "/assets/images/mahsulot7.png",
        title: <FormattedMessage id='section3_Sub_Title7'/>
      },
      {
        img: "/assets/images/mahsulot8.png",
        title: <FormattedMessage id='section3_Sub_Title8'/>
      },
      {
        img: "/assets/images/mahsulot9.png",
        title: <FormattedMessage id='section3_Sub_Title9'/>
      },
      {
        img: "/assets/images/mahsulot10.png",
        title: <FormattedMessage id='section3_Sub_Title10'/>
      },
      {
        img: "/assets/images/mahsulot11.png",
        title: <FormattedMessage id='section3_Sub_Title11'/>
      },
      {
        img: "/assets/images/mahsulot12.png",
        title: <FormattedMessage id='section3_Sub_Title12'/>
      },
    ];

    const handleLang2 = (key) => {
      localStorage.setItem("dropdown", key)
      if (key === 1) {
        setLocale("en-US")
      } else {
        setLocale("en-RU")
      }
    }
    return (
      <div className="fullScreen">
        <div className="header" id='fixedMenu' onAnimationEnd={this.scrolled} onWheel={this.scrolled}
             onMouseMove={this.scrolled}
             onTouchStart={this.scrolled} onTouchMove={this.scrolled}>
          <div className="header position-relative">
            <Container fluid={1} className='pl-0'>
              <img src="/assets/images/headerborder.png" className='rec position-absolute' alt=""/>
              <div className={this.state.scrolled ? "headerback" : null} style={this.state.scrolled ? {
                background: "white",
                position: "fixed",
                zIndex: "999",
                width: "100%",
                padding: "0",
              } : null}><Header/></div>
              <Row className='p-0'>
                <Col xs={12} sm={12} md={12} lg={7} xl={7} className='p-md-0 p-lg-0 p-xl-0'
                     style={this.state.scrolled ? {marginTop: "102px"} : null}>
                  <div className="d-flex justify-content-center justify-content-lg-end justify-content-xl-end">
                    <div className="contents">
                      <p className="order lato-light mb-0">
                        <FormattedMessage id='header_text'/>
                        <p className="lato-bold mb-0"><b><FormattedMessage id="header_text_bold"/></b></p>
                      </p>
                      <a href={"http://t.me/EuroPrintTestPdpBot"}> <Button color="danger" className="order-button">
                        <span className='lato-regular'><FormattedMessage id="header_btn"/></span>
                        <span className="ml-2"><img src="/assets/images/arrow-right.png" alt="#"/></span>
                      </Button>
                      </a>
                      <Row className='contact ml-0 mr-0'>
                        <Col xs={5} sm={4} md={3} lg={4} xl={3} className='p-0'>
                          <span><img src="/assets/images/phone.png" className='mr-n3'
                                     style={{transform: "translate(10px,0px)"}} alt=""/></span>
                          <span
                            className="phone-code  lato-regular">({company && company.phoneNumber1.substring(0, 6)})</span>
                          <p className="pnone-number text-xl-right lato-black mt-n1 mb-0">
                            {company && company.phoneNumber1.substring(6).substring(0, 3) + "-" + company.phoneNumber1.substring(6).substring(3, 5) + "-" + company.phoneNumber1.substring(6).substring(5)}</p>
                        </Col>
                        <Col xs={5} sm={4} md={3} lg={4} xl={3} className='ml-xl-3 p-0'>
                          <span>
                            <img src="/assets/images/phone.png" className='mr-n3'
                                 style={{transform: "translate(10px,0px)"}} alt=""/></span>
                          <span
                            className="phone-code lato-regular">({company && company.phoneNumber2.substring(0, 6)})</span>
                          <p className="pnone-number text-xl-right lato-black mt-n1 mb-0">
                            {company && company.phoneNumber2.substring(6).substring(0, 3) + "-" + company.phoneNumber2.substring(6).substring(3, 5) + "-" + company.phoneNumber2.substring(6).substring(5)}</p>
                        </Col>
                      </Row>
                    </div>

                  </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={5} xl={5} className='p-0'
                     style={this.state.scrolled ? {marginTop: "102px"} : null}>
                  <Carusel/>
                </Col>
              </Row>
            </Container>
          </div>

          <section className="section-one" id="bizhaqimizda">
            <Container fluid={1}>
              <Row>
                <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                  <Row>
                    <Col xs={12} sm={12} md={9} lg={9} xl={9} className='ml-auto'>
                      <p className="tipography lato-bold mb-xl-0">
                        <FormattedMessage id='section1_Title'/>
                      </p>
                      <p className="tipography-text lato-regular mb-0">
                        <FormattedMessage id='section1_Text'/>
                      </p>
                      <p className="tipography-text mt-md-4 mt-lg-n1 mt-xl-0 lato-regular">
                        <FormattedMessage id='section1_Sub_Title'/>
                      </p>

                      <div className="mt-3 ">
                        <span><img className="path" src="/assets/images/orengepart.png" alt=""/></span>
                        <span className="ml-3 lato-bold tipography-text">
                        <FormattedMessage id='section1_Sub_Text1'/>
                      </span>
                      </div>
                      <div>
                        <span><img className="path" src="/assets/images/orengepart.png" alt=""/></span>
                        <span className="ml-3 lato-bold tipography-text">
                        <FormattedMessage id='section1_Sub_Text2'/>
                      </span>
                      </div>
                      <div>
                        <span><img className="path" src="/assets/images/orengepart.png" alt=""/></span>
                        <span className="ml-3 lato-bold tipography-text">
                        <FormattedMessage id='section1_Sub_Text3'/>
                      </span>
                      </div>
                      <div>
                        <span><img className="path" src="/assets/images/orengepart.png" alt=""/></span>
                        <span className="ml-3 lato-bold tipography-text">
                        <FormattedMessage id='section1_Sub_Text4'/>
                      </span>
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} className='p-0 pt-5 pt-md-0 pt-lg-0 pt-xl-0'>
                  <div className="d-flex align-items-end flex-column">
                    <img className="section1img1" src="/assets/images/Group 33.png" alt=""/>
                  </div>
                </Col>
              </Row>
            </Container>
          </section>

          <section className="section-two">
            <Container>
              <p className="text-center text-white we-text lato-bold">
                <FormattedMessage id='section2_Main_Title'/>
              </p>
              <Row className="card-row">
                <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                  <Card className='sectionInfoCard'>
                    <div className="timer_Main d-flex align-items-center flex-column">
                      <CardImg className='timer' src="/assets/images/timer.png" alt=""/>
                    </div>
                    <p className="efficiency lato-bold">
                      <FormattedMessage id='section2_Sub_Title1'/>
                    </p>
                    <p className="efficiency2 lato-regular">
                      <FormattedMessage id='section2_Text1'/>
                    </p>
                  </Card>
                </Col>
                <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                  <Card className='sectionInfoCard'>
                    <div className="timer_Main d-flex align-items-center flex-column">
                      <CardImg className='timer' src="/assets/images/Group 28.png" alt=""/>
                    </div>
                    <p className="efficiency lato-bold">
                      <FormattedMessage id='section2_Sub_Title2'/>
                    </p>
                    <p className="efficiency2 lato-regular">
                      <FormattedMessage id='section2_Text2'/>
                    </p>
                  </Card>
                </Col>
                <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                  <Card className='sectionInfoCard'>
                    <div className="timer_Main d-flex align-items-center flex-column">
                      <CardImg className='timer' src="/assets/images/Group 29.png" alt=""/>
                    </div>
                    <p className="efficiency lato-bold">
                      <FormattedMessage id='section2_Sub_Title3'/>
                    </p>
                    <p className="efficiency2 lato-regular">
                      <FormattedMessage id='section2_Text3'/>
                    </p>
                  </Card>
                </Col>
              </Row>
              <Row className="card-row2">
                <Col xs={12} sm={12} md={4} lg={4} xl={4} className="offset-md-2 offset-lg-2 offset-xl-2">
                  <Card className='sectionInfoCard'>
                    <div className="timer_Main d-flex align-items-center flex-column">
                      <CardImg className='timer' src="/assets/images/Group 30.png" alt=""/>
                    </div>
                    <p className="efficiency lato-bold">
                      <FormattedMessage id='section2_Sub_Title4'/>
                    </p>
                    <p className="efficiency2 lato-regular">
                      <FormattedMessage id='section2_Text4'/>
                    </p>
                  </Card>
                </Col>
                <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                  <Card className='sectionInfoCard'>
                    <div className="timer_Main d-flex align-items-center flex-column">
                      <CardImg className='timer' src="/assets/images/Group 31.png" alt=""/>
                    </div>
                    <CardTitle className='mb-0'>
                      <p className="efficiency lato-bold">
                        <FormattedMessage id='section2_Sub_Title5'/>
                      </p>
                    </CardTitle>
                    <CardText>
                      <p className="efficiency2 lato-regular">
                        <FormattedMessage id='section2_Text5'/>
                      </p>
                    </CardText>
                  </Card>
                </Col>
              </Row>
            </Container>
          </section>

          <section className="section3 position-relative" id="xizmatlar">
            <div className="position-absolute bg-color-1">
              <img src="/assets/images/bg-img-2.png" alt=""/>
            </div>
            <p className="text-center service lato-bold">
              <FormattedMessage id='section3_Title'/>
            </p>
            <Container className="mahsulotlar">
              <Row className='position-relative pb-5 mb-5'>
                <div className="bg-color-2 position-absolute"><img src="/assets/images/bg-color-3.png" alt=""/></div>
                {ourService.map(service =>
                  <Col xs={12} sm={6} md={3} lg={3} xl={3} className=' mt-4'>
                    <Card className="card-style">
                      <img src={service.img} alt="" className="img-fluid"/>
                      <div className='cart-hover text-center'>
                        <ul className='list-unstyled mb-0'>
                          <li className=''>
                            <p className='text-white text-center lato-bold'>{service.title}</p>
                          </li>
                          <li className=''>
                            <a target="_blank" href="https://t.me/EuroPrintTestPdpBot"> <Button
                              className='text-white lato-regular card-btn'>
                              <FormattedMessage id='section3_Btn'/>
                            </Button>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </Card>
                  </Col>
                )}
              </Row>
            </Container>
          </section>

          <section className='section4' id='portfolio'>
            <Container fluid={1}>
              <Row className='p-0 section4_row'>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} className='p-md-0 p-lg-0 p-xl-0'>
                  <div className='portfolio_Card'>
                    <p className='portfolio_Title lato-bold'>
                      <FormattedMessage id="section4_Title"/>
                    </p>
                    <p className='portfolio_Text lato-regular'>
                      <FormattedMessage id="section4_Text"/>
                    </p>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} className='p-0 shape_Carousel1'>
                  {/*<div className='shape_Carousel1'/>*/}
                  <div className="shape_Carousel2"/>
                  <Slider {...portfolio}>
                    {homeData && homeData.portfolios.map(item =>
                      <div className="">{console.log(item)}
                        <img className='portfolio_Img' src={"/api/file/get/" + item.attachment.id} alt=""/>
                      </div>
                    )}
                  </Slider>
                </Col>
              </Row>
            </Container>
          </section>

          <section className="section5">
            <p className="lato-bold text-center we-price">
              <FormattedMessage id="section5_Title"/>
            </p>
            <div className="bg-image" id="section5">
              <Container className="section5Container pt-md-5 pt-lg-5 pt-xl-5 pb-md-5 pb-lg-5 pb-xl-5">
                <Row className='mr-0'>
                  <div className="bg-img"/>
                  <Col xs={12} sm={12} md={12} lg={12} xl={12} className='counters'>
                    <Row>
                      <Col xs={12} sm={4} md={4} lg={4} xl={4} id="count" className="text-center pl-0">

                        {this.state.count ?
                          <CountTo className="lato-bold text-center number d-inline-block" to={company.countCustomer}
                                   speed={3000}/> :
                          <CountTo className="lato-bold text-center number d-inline-block" to={0} speed={1000}/>}
                        <span className="lato-bold number">+</span>
                        <div className="d-flex justify-content-center">
                          <div className="">
                            <p className="lato-regular text-center number-com">
                              <FormattedMessage id='section5_Text1'/>
                            </p>
                          </div>
                        </div>
                      </Col>

                      <Col xs={12} sm={4} md={4} lg={4} xl={4} className="text-center">
                        {this.state.count ?
                          <CountTo className="lato-bold text-center number" to={company.orderCount} speed={3000}/> :
                          <CountTo className="lato-bold text-center number d-inline-block" to={0} speed={1000}/>}
                        <span className="lato-bold number">+</span>
                        <div className="d-flex justify-content-center">
                          <div className="">
                            <p className="lato-regular mb-0 number-com">
                              <FormattedMessage id='section5_Text2'/>
                            </p>
                          </div>
                        </div>
                      </Col>
                      <Col xs={12} sm={4} md={4} lg={4} xl={4} className="text-center">
                        {this.state.count ?
                          <CountTo className="lato-bold text-center number" to={company.masterCount} speed={3000}/> :
                          <CountTo className="lato-bold text-center number d-inline-block" to={0} speed={1000}/>}
                        <span className="lato-bold number">+</span>
                        <div className="d-flex justify-content-center">
                          <div className="">
                            <p className="lato-regular text-center number-com">
                              <FormattedMessage id='section5_Text3'/>
                            </p>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Container>
            </div>
          </section>

          <section className="section6" id="mijozlar">
            <Container fluid={true} className='position-relative mt-lg-4'>
              <div className="bg-1 position-absolute"></div>
              <div className="bg-2 position-absolute"></div>
              <p className='section6Title text-center mb-4 pt-lg-4 lato-bold mb-3'>
                <FormattedMessage id="section6_Title"/>
              </p>
              <div className="tech-slideshow">
                <div className="mover-1">
                  <div className="carusel  position-relative d-flex img-fluid">
                    <div className="d-block">
                      <div className="our-product py-2 px-1 ml-0">
                        <img src="/assets/images/deya.png" className='img-fluid' alt="d"/>
                      </div>
                      <div className="our-product p-2 ml-0">
                        <img src="/assets/images/nmedov.png" className='img-fluid' alt="d"/>
                      </div>
                    </div>
                    <div className="d-block">
                      <div className="our-product-2 ">
                        <img src="/assets/images/indorama.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                      <div className="our-product-2 ">
                        <img src="/assets/images/euromed.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                      <div className="our-product-2 ">
                        <img src="/assets/images/andelai.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                    </div>
                    <div className="d-block">
                      <div className="our-product p-2">
                        <img src="/assets/images/panda.png" className='img-fluid' alt="d"/>
                      </div>
                      <div className="our-product p-2">
                        <img src="/assets/images/asmald.png" className='img-fluid' alt="d"/>
                      </div>
                    </div>
                    <div className="d-block">
                      <div className="our-product-2 ">
                        <img src="/assets/images/filtruz.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                      <div className="our-product-2 ">
                        <img src="/assets/images/krember.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                      <div className="our-product-2 ">
                        <img src="/assets/images/pokiza.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                    </div>
                    <div className="d-block">
                      <div className="our-product p-2">
                        <img src="/assets/images/meva.png" className='img-fluid' alt="d"/>
                      </div>
                      <div className="our-product p-2">
                        <img src="/assets/images/bliss.png" className='img-fluid' alt="d"/>
                      </div>
                    </div>
                    <div className="d-block">
                      <div className="our-product-2 ">
                        <img src="/assets/images/nmedov.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                      <div className="our-product-2 ">
                        <img src="/assets/images/sfad.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                      <div className="our-product-2 ">
                        <img src="/assets/images/umr.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                    </div>
                    <div className="d-block">
                      <div className="our-product p-2">
                        <img src="/assets/images/nur.png" className='img-fluid' alt="d"/>
                      </div>
                      <div className="our-product px-1">
                        <img src="/assets/images/zebuz.png" className='img-fluid' alt="d"/>
                      </div>
                    </div>
                    <div className="d-block">
                      <div className="our-product-2 ">
                        <img src="/assets/images/umr.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                      <div className="our-product-2 ">
                        <img src="/assets/images/meva.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                      <div className="our-product-2 ">
                        <img src="/assets/images/deya.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                    </div>
                    <div className="d-block">
                      <div className="our-product p-2">
                        <img src="/assets/images/andelai.png" className='img-fluid' alt="d"/>
                      </div>
                      <div className="our-product p-2">
                        <img src="/assets/images/pokiza.png" className='img-fluid' alt="d"/>
                      </div>
                    </div>
                    <div className="d-block">
                      <div className="our-product-2  ">
                        <img src="/assets/images/asmald.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                      <div className="our-product-2 ">
                        <img src="/assets/images/euromed.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                      <div className="our-product-2 ">
                        <img src="/assets/images/umr.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                    </div>
                    <div className="d-block">
                      <div className="our-product p-2">
                        <img src="/assets/images/sfad.png" className='img-fluid' alt="d"/>
                      </div>
                      <div className="our-product p-2">
                        <img src="/assets/images/filtruz.png" className='img-fluid' alt="d"/>
                      </div>
                    </div>
                    <div className="d-block">
                      <div className="our-product-2 ">
                        <img src="/assets/images/deya.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                      <div className="our-product-2 ">
                        <img src="/assets/images/krember.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                      <div className="our-product-2 ">
                        <img src="/assets/images/nmedov.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                    </div>
                    <div className="d-block">
                      <div className="our-product p-2">
                        <img src="/assets/images/bliss.png" className='img-fluid' alt="d"/>
                      </div>
                      <div className="our-product p-2">
                        <img src="/assets/images/panda.png" className='img-fluid' alt="d"/>
                      </div>
                    </div>
                    <div className="d-block">
                      <div className="our-product-2 ">
                        <img src="/assets/images/nmedov.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                      <div className="our-product-2 ">
                        <img src="/assets/images/sfad.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                      <div className="our-product-2 ">
                        <img src="/assets/images/umr.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                    </div>
                    <div className="d-block">
                      <div className="our-product p-2">
                        <img src="/assets/images/asmald.png" className='img-fluid' alt="d"/>
                      </div>
                      <div className="our-product p-2">
                        <img src="/assets/images/meva.png" className='img-fluid' alt="d"/>
                      </div>
                    </div>
                    <div className="d-block">
                      <div className="our-product-2 ">
                        <img src="/assets/images/umr.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                      <div className="our-product-2 ">
                        <img src="/assets/images/meva.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                      <div className="our-product-2 ">
                        <img src="/assets/images/deya.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                    </div>
                    <div className="d-block">
                      <div className="our-product py-2 px-1">
                        <img src="/assets/images/deya.png" className='img-fluid' alt="d"/>
                      </div>
                      <div className="our-product p-2">
                        <img src="/assets/images/nmedov.png" className='img-fluid' alt="d"/>
                      </div>
                    </div>
                    <div className="d-block">
                      <div className="our-product-2 ">
                        <img src="/assets/images/indorama.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                      <div className="our-product-2 ">
                        <img src="/assets/images/euromed.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                      <div className="our-product-2 ">
                        <img src="/assets/images/andelai.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                    </div>
                    <div className="d-block">
                      <div className="our-product p-2">
                        <img src="/assets/images/panda.png" className='img-fluid' alt="d"/>
                      </div>
                      <div className="our-product p-2">
                        <img src="/assets/images/asmald.png" className='img-fluid' alt="d"/>
                      </div>
                    </div>
                    <div className="d-block">
                      <div className="our-product-2 ">
                        <img src="/assets/images/filtruz.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                      <div className="our-product-2 ">
                        <img src="/assets/images/krember.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                      <div className="our-product-2 ">
                        <img src="/assets/images/pokiza.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                    </div>
                    <div className="d-block">
                      <div className="our-product p-2">
                        <img src="/assets/images/meva.png" className='img-fluid' alt="d"/>
                      </div>
                      <div className="our-product p-2">
                        <img src="/assets/images/bliss.png" className='img-fluid' alt="d"/>
                      </div>
                    </div>
                    <div className="d-block">
                      <div className="our-product-2 ">
                        <img src="/assets/images/nmedov.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                      <div className="our-product-2 ">
                        <img src="/assets/images/sfad.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                      <div className="our-product-2 ">
                        <img src="/assets/images/umr.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                    </div>
                    <div className="d-block">
                      <div className="our-product p-2">
                        <img src="/assets/images/nur.png" className='img-fluid' alt="d"/>
                      </div>
                      <div className="our-product px-1">
                        <img src="/assets/images/zebuz.png" className='img-fluid' alt="d"/>
                      </div>
                    </div>
                    <div className="d-block">
                      <div className="our-product-2 ">
                        <img src="/assets/images/umr.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                      <div className="our-product-2 ">
                        <img src="/assets/images/meva.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                      <div className="our-product-2 ">
                        <img src="/assets/images/deya.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                    </div>
                    <div className="d-block">
                      <div className="our-product p-2">
                        <img src="/assets/images/andelai.png" className='img-fluid' alt="d"/>
                      </div>
                      <div className="our-product p-2">
                        <img src="/assets/images/pokiza.png" className='img-fluid' alt="d"/>
                      </div>
                    </div>
                    <div className="d-block">
                      <div className="our-product-2  ">
                        <img src="/assets/images/asmald.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                      <div className="our-product-2 ">
                        <img src="/assets/images/euromed.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                      <div className="our-product-2 ">
                        <img src="/assets/images/umr.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                    </div>
                    <div className="d-block">
                      <div className="our-product p-2">
                        <img src="/assets/images/sfad.png" className='img-fluid' alt="d"/>
                      </div>
                      <div className="our-product p-2">
                        <img src="/assets/images/filtruz.png" className='img-fluid' alt="d"/>
                      </div>
                    </div>
                    <div className="d-block">
                      <div className="our-product-2 ">
                        <img src="/assets/images/deya.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                      <div className="our-product-2 ">
                        <img src="/assets/images/krember.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                      <div className="our-product-2 ">
                        <img src="/assets/images/nmedov.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                    </div>
                    <div className="d-block">
                      <div className="our-product p-2">
                        <img src="/assets/images/bliss.png" className='img-fluid' alt="d"/>
                      </div>
                      <div className="our-product p-2">
                        <img src="/assets/images/panda.png" className='img-fluid' alt="d"/>
                      </div>
                    </div>
                    <div className="d-block">
                      <div className="our-product-2 ">
                        <img src="/assets/images/nmedov.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                      <div className="our-product-2 ">
                        <img src="/assets/images/sfad.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                      <div className="our-product-2 ">
                        <img src="/assets/images/umr.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                    </div>
                    <div className="d-block">
                      <div className="our-product p-2">
                        <img src="/assets/images/asmald.png" className='img-fluid' alt="d"/>
                      </div>
                      <div className="our-product p-2">
                        <img src="/assets/images/meva.png" className='img-fluid' alt="d"/>
                      </div>
                    </div>
                    <div className="d-block">
                      <div className="our-product-2 ">
                        <img src="/assets/images/deya.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                      <div className="our-product-2 ">
                        <img src="/assets/images/krember.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                      <div className="our-product-2 ">
                        <img src="/assets/images/nmedov.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                    </div>
                    <div className="d-block">
                      <div className="our-product py-2 px-1 ">
                        <img src="/assets/images/deya.png" className='img-fluid' alt="d"/>
                      </div>
                      <div className="our-product p-2 ">
                        <img src="/assets/images/nmedov.png" className='img-fluid' alt="d"/>
                      </div>
                    </div>
                    <div className="d-block">
                      <div className="our-product-2 ">
                        <img src="/assets/images/indorama.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                      <div className="our-product-2 ">
                        <img src="/assets/images/euromed.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                      <div className="our-product-2 ">
                        <img src="/assets/images/andelai.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                    </div>
                    <div className="d-block">
                      <div className="our-product p-2">
                        <img src="/assets/images/panda.png" className='img-fluid' alt="d"/>
                      </div>
                      <div className="our-product p-2">
                        <img src="/assets/images/asmald.png" className='img-fluid' alt="d"/>
                      </div>
                    </div>
                    <div className="d-block">
                      <div className="our-product-2 ">
                        <img src="/assets/images/filtruz.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                      <div className="our-product-2 ">
                        <img src="/assets/images/krember.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                      <div className="our-product-2 ">
                        <img src="/assets/images/pokiza.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                    </div>
                    <div className="d-block">
                      <div className="our-product p-2">
                        <img src="/assets/images/meva.png" className='img-fluid' alt="d"/>
                      </div>
                      <div className="our-product p-2">
                        <img src="/assets/images/bliss.png" className='img-fluid' alt="d"/>
                      </div>
                    </div>
                    <div className="d-block">
                      <div className="our-product-2 ">
                        <img src="/assets/images/nmedov.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                      <div className="our-product-2 ">
                        <img src="/assets/images/sfad.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                      <div className="our-product-2 ">
                        <img src="/assets/images/umr.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                    </div>
                    <div className="d-block">
                      <div className="our-product p-2">
                        <img src="/assets/images/nur.png" className='img-fluid' alt="d"/>
                      </div>
                      <div className="our-product px-1">
                        <img src="/assets/images/zebuz.png" className='img-fluid' alt="d"/>
                      </div>
                    </div>
                    <div className="d-block">
                      <div className="our-product-2 ">
                        <img src="/assets/images/umr.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                      <div className="our-product-2 ">
                        <img src="/assets/images/meva.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                      <div className="our-product-2 ">
                        <img src="/assets/images/deya.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                    </div>
                    <div className="d-block">
                      <div className="our-product p-2">
                        <img src="/assets/images/andelai.png" className='img-fluid' alt="d"/>
                      </div>
                      <div className="our-product p-2">
                        <img src="/assets/images/pokiza.png" className='img-fluid' alt="d"/>
                      </div>
                    </div>
                    <div className="d-block">
                      <div className="our-product-2  ">
                        <img src="/assets/images/asmald.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                      <div className="our-product-2 ">
                        <img src="/assets/images/euromed.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                      <div className="our-product-2 ">
                        <img src="/assets/images/umr.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                    </div>
                    <div className="d-block">
                      <div className="our-product p-2">
                        <img src="/assets/images/sfad.png" className='img-fluid' alt="d"/>
                      </div>
                      <div className="our-product p-2">
                        <img src="/assets/images/filtruz.png" className='img-fluid' alt="d"/>
                      </div>
                    </div>
                    <div className="d-block">
                      <div className="our-product-2 ">
                        <img src="/assets/images/deya.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                      <div className="our-product-2 ">
                        <img src="/assets/images/krember.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                      <div className="our-product-2 ">
                        <img src="/assets/images/nmedov.png" className='img-fluid mb-1' alt="d"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </section>

          <section className="section7 position-relative" id='jamoa'>
            <img src="/assets/images/Rectangle6.png" className='rec6 img-fluid position-absolute' alt=""/>
            <Container className='team_Carousel position-relative'>
              <div className="bg-1 position-absolute"></div>
              <div className="bg-2 position-absolute"></div>
              <p className='team_Title'>
                <FormattedMessage id='section7_Title'/>
              </p>
              <Slider {...settings}>
                {homeData && homeData.masters.map(item =>
                  <div className=''>
                    <Card className='team_Card'>
                      <p className="d-flex align-items-center flex-column">
                        <p className='d-flex justify-content-center align-items-center img_Round'>
                          <CardImg className='user_Img' src={"/api/file/get/" + item.attachment.id} alt=""/>
                        </p>
                      </p>
                      <CardBody>
                        <CardTitle className='user_Name'>{item.fullName}</CardTitle>
                        <p className="d-flex align-items-center flex-column">
                          <CardText className='user_Profession'>{item.description}</CardText>
                        </p>
                      </CardBody>
                    </Card>
                  </div>
                )}
              </Slider>
            </Container>
          </section>

          <section className='section8'>
            <Container fluid={1} className="p-0">
              <img className="rectangle" src="/assets/images/Rectangle 6.7.png" alt=""/>
              <YMaps>
                <Map defaultState={mapData} className='mapYandex'>
                  {coordinates.map(coordinate => <Placemark geometry={coordinate}/>)}
                </Map>
              </YMaps>
            </Container>
          </section>

          <footer className="footer" id="kontakt">
            <Container>
              <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Row className='footerLinks'>
                    <Col xs={12} sm={6} md={6} lg={2} xl={2} className="mt-2">
                      <p className="lato-bold company">
                        <FormattedMessage id="section8_Title1"/>
                      </p>
                      <Link className="lato-light link-menu" spy={true} smooth={true} duration={1500}
                            activeClass="active"
                            activeClassName="selected" to="bizhaqimizda"><p className="mt-4">
                        <a><FormattedMessage id="section8_Title1_Link1"/></a></p>
                      </Link>
                      <Link className="lato-light link-menu" spy={true} smooth={true} duration={1300}
                            activeClass="active"
                            activeClassName="selected" to="xizmatlar"><p className="mt-3">
                        <a><FormattedMessage id="section8_Title1_Link2"/></a></p>
                      </Link>
                      <Link className="lato-light link-menu" spy={true} smooth={true} duration={1200}
                            activeClass="active"
                            activeClassName="selected" to="portfolio"><p className="mt-3">
                        <a><FormattedMessage id="section8_Title1_Link3"/></a>
                      </p></Link>
                      <Link className="lato-light link-menu" spy={true} smooth={true} duration={1000}
                            activeClass="active"
                            activeClassName="selected" to="mijozlar"><p className="mt-3">
                        <a><FormattedMessage id="section8_Title1_Link4"/></a></p>
                      </Link>
                      <Link className="lato-light link-menu" spy={true} smooth={true} duration={700}
                            activeClass="active"
                            activeClassName="selected" to="jamoa"><p className="mt-3">
                        <a><FormattedMessage id="section8_Title1_Link5"/></a></p></Link>
                    </Col>
                    <Col xs={12} sm={6} md={6} lg={2} xl={2} className="mt-2">
                      <p className="lato-bold company">
                        <FormattedMessage id="section8_Title2"/>
                      </p>

                      <p className="mt-4 link-menu">
                        <a className="lato-light" href="#">
                          <FormattedMessage id="section8_Title2_Link1"/>
                        </a>
                      </p>
                      <p className="link-menu">
                        <a className="lato-light" href="#">
                          <FormattedMessage id="section8_Title2_Link2"/>
                        </a>
                      </p>
                      <p className="link-menu">
                        <a className="lato-light" href="#">
                          <FormattedMessage id="section8_Title2_Link3"/>
                        </a>
                      </p>
                      <p className="link-menu">
                        <a className="lato-light" href="#">
                          <FormattedMessage id="section8_Title2_Link4"/>
                        </a>
                      </p>
                      <p className="link-menu">
                        <a className="lato-light" href="#">
                          <FormattedMessage id="section8_Title2_Link5"/>
                        </a>
                      </p>
                      <p className="link-menu">
                        <a className="lato-light" href="#">
                          <FormattedMessage id="section8_Title2_Link6"/>
                        </a>
                      </p>
                      <p className="link-menu">
                        <a className="lato-light" href="#">
                          <FormattedMessage id="section8_Title2_Link7"/>
                        </a>
                      </p>
                      <p className="link-menu">
                        <a className="lato-light" href="#">
                          <FormattedMessage id="section8_Title2_Link8"/>
                        </a>
                      </p>
                    </Col>
                    <Col xs={12} sm={6} md={6} lg={2} xl={2} className="mt-2">
                      <p className="lato-bold company">
                        <FormattedMessage id="section8_Title3"/>
                      </p>
                      <p className="mt-4 link-menu">
                        <a className="lato-light" href="#">
                          <FormattedMessage id="section8_Title3_Link1"/>
                        </a>
                      </p>
                      <p className="link-menu">
                        <a className="lato-light" href="#">
                          <FormattedMessage id="section8_Title3_Link2"/>
                        </a>
                      </p>
                      <p className="link-menu">
                        <a className="lato-light" href="#">
                          <FormattedMessage id="section8_Title3_Link3"/>
                        </a>
                      </p>
                      <p className="link-menu">
                        <a className="lato-light" href="#">
                          <FormattedMessage id="section8_Title3_Link4"/>
                        </a>
                      </p>
                      <p className="link-menu">
                        <a className="lato-light" href="#">
                          <FormattedMessage id="section8_Title3_Link5"/>
                        </a>
                      </p>
                    </Col>
                    <Col xs={12} sm={6} md={6} lg={6} xl={6} className="mt-2">
                      <div className="d-flex offset-lg-8 offset-xl-8">
                        <div className="">
                          <p className="lato-bold aloqa">
                            <FormattedMessage id="section8_Title4"/>
                          </p>

                          <div>
                            <p className="phone-num mt-4">
                              <img className="phone-img" src="/assets/images/phone.png" alt=""/>
                              <span
                                className="phone-code lato-regular">({company && company.phoneNumber1.substring(0, 6)})</span>
                            </p>
                            <p
                              className="phone-number lato-black mb-0">{company && company.phoneNumber1.substring(6)}</p>
                          </div>

                          <div>
                            <p className="phone-num mt-3">
                              <span
                                className="phone-code lato-regular">({company && company.phoneNumber2.substring(0, 6)})</span>
                            </p>
                            <p
                              className="phone-number lato-black mb-0">{company && company.phoneNumber2.substring(6)}</p>

                          </div>

                          <div>
                            <p className="phone-num mt-3">
                              <span
                                className="phone-code lato-regular">({company && company.phoneNumber3.substring(0, 6)})</span>
                            </p>
                            <p
                              className="phone-number lato-black mb-0">{company && company.phoneNumber3.substring(6)}</p>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row className="mt-md-5 mr-1">
                <Col xs={12} sm={12} lg={12} md={12} xl={12}>
                  <Row>
                    <Col xs={12} sm={12} md={8} lg={10} xl={10} className='row1'>
                      <Row>
                        <Col xs={4} sm={3} md={3} lg={2} xl={2} className='dropdownMenu'>
                          <UncontrolledDropdown>
                            <DropdownToggle caret className="dropdownMain">
                              {localStorage.getItem("dropdown") == 1 ? "Узбек" : "Русский"}<FaAngleDown/>
                            </DropdownToggle>
                            <DropdownMenu right>
                              <DropdownItem onClick={() => handleLang2(1)} key={1}>
                                <FormattedMessage id='language_item1'/>
                              </DropdownItem>
                              <DropdownItem onClick={() => handleLang2(2)} key={2}>
                                <FormattedMessage id='language_item2'/>
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </Col>
                        <Col xs={8} sm={9} md={9} lg={10} xl={10}>
                          <div className="telegram d-inline-block">
                            <a href={company.telegram}><img className="text-center"
                                                            src="/assets/images/002-telegram.png" alt=""/></a>
                          </div>
                          <div className="telegram ml-md-3 ml-1 d-inline-block">
                            <a href={company.instagram} href={company.instagram}><img
                              src="/assets/images/003-instagram.png" alt=""/></a>
                          </div>
                          <div className="telegram ml-md-3 ml-1 d-inline-block">
                            <a href={company.facebook}><img src="/assets/images/001-facebook-logo.png" alt=""/></a>
                          </div>
                          <div className="telegram ml-md-3 ml-1 d-inline-block">
                            <a href={company.youtube}> <img src="/assets/images/004-youtube.png" alt=""/></a>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                    <Col xs={12} sm={12} md={4} lg={2} xl={2} className=''>
                      <Row className='row2'>
                        <Col xs={1} sm={1} md={1} lg={1} xl={1} className='p-0'>
                          <img className="phone-img1" src="/assets/images/map-pin.png" alt=""/>
                        </Col>
                        <Col xs={11} sm={11} md={11} lg={11} xl={11} className='p-0'>
                          <p className='addres mb-0'>140100</p>
                          <p className="lato-regular addres">
                            {getLocale() === "en-US" ? company.address : company.addressRu}
                          </p>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className=" mt-3 p-1">
                <p className="lato-regular link-pdp">
                  <a className="text-white" href="https://pdp.uz">
                    <FormattedMessage id='footer_linkText_Info'/>
                  </a>
                </p>
              </Row>
            </Container>
          </footer>
        </div>
      </div>
    );
  }
}

export default A;
