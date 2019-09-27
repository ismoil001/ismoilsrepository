import React from "react"
import '../global.scss'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {Link, animateScroll as scroll} from "react-scroll";
import {
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  CardImg,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  CardBody, CardTitle, CardText, UncontrolledDropdown, Nav
} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import CountTo from 'react-count-to';
import {YMaps, Map, Placemark} from "react-yandex-maps";
import Slider from "react-slick";
import Header from "../components/Header/index";
import Carusel from "../components/Carusel";
import {FaAngleDown} from "react-icons/fa";

export default class A extends React.Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false,
      windowHeight: undefined,
      windowWidth: undefined,
      scrolled: false,
      count: false,
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
  // scrolled=()=>{
  //   var testDiv = document.getElementById("section5");
  //
  //   if ( window.visualViewport.pageTop < testDiv.offsetTop+50 && window.visualViewport.pageTop >  testDiv.offsetTop-500) {
  //
  //     this.state.count=true;
  //
  //     this.setState(this.state)
  //   }
  //   if(window.visualViewport.pageTop!=0){
  //     this.state.scrolled=true;
  //     this.setState(this.state)
  //   }
  //   else{
  //     this.state.scrolled=false;
  //     this.setState(this.state)
  //   }
  //   console.log("state")
  //   console.log(  this.state.count)
  // }

  render() {
    let settings = {
      dots: true,
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 3,
      autoplay: true,
      speed: 500,
      autoplaySpeed: 5000,
      cssEase: "linear",
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
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
      speed: 500,
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
        name: "Brandon Richards",
        profession: "Fotograf, Bosh dizayner",
      },
      {
        img: "/assets/images/user2.png",
        name: "Beth Mckinney",
        profession: "Mizlar bilan ishlash bo’lim boshlig’i",
      },
      {
        img: "/assets/images/user3.png",
        name: "Dianne Fisher",
        profession: "Mizlar bilan ishlash meneger",
      },
      {
        img: "/assets/images/user3.png",
        name: "Dianne Fisher",
        profession: "Mizlar bilan ishlash meneger",
      },
      {
        img: "/assets/images/user1.png",
        name: "Brandon Richards",
        profession: "Fotograf, Bosh dizayner",
      },
      {
        img: "/assets/images/user2.png",
        name: "Beth Mckinney",
        profession: "Mizlar bilan ishlash bo’lim boshlig’i",
      },
    ]
    const ourService = [
      {
        img: "/assets/images/mahsulot.png",
        title: "Gofra karobka"
      },
      {
        img: "/assets/images/mahsulot2.png",
        title: "Etiketka"
      },
      {
        img: "/assets/images/mahsulot3.png",
        title: "Flaer"
      },
      {
        img: "/assets/images/mahsulot4.png",
        title: "Bloknot"
      },
      {
        img: "/assets/images/mahsulot5.png",
        title: "Listovka"
      },
      {
        img: "/assets/images/mahsulot6.png",
        title: "Buklet"
      },
      {
        img: "/assets/images/mahsulot7.png",
        title: "Kalendar"
      },
      {
        img: "/assets/images/mahsulot8.png",
        title: "Katalog"
      },
      {
        img: "/assets/images/mahsulot9.png",
        title: "Visitka"
      },
      {
        img: "/assets/images/mahsulot10.png",
        title: "Jurnal"
      },
      {
        img: "/assets/images/mahsulot11.png",
        title: "Qog'oz stakan"
      },
      {
        img: "/assets/images/mahsulot12.png",
        title: "Kraft qog'oz paketlar"
      },
    ];

    return (
      <div className="fullScreen">
        <div className="header" onWheel={this.scrolled} onMouseMove={this.scrolled}
             onTouchStart={this.scrolled} onTouchMove={this.scrolled}>
          <div className="header position-relative">
            <Container fluid={1}>
              <img src="/assets/images/headerborder.png" className='rec position-absolute' alt=""/>
              <div className={this.state.scrolled ? "headerback" : null} style={this.state.scrolled ? {
                background: "white",
                position: "fixed",
                zIndex: "999",
                marginLeft: "-1.1%",
                width: "100%",
              } : null}><Header/></div>
              <Row className='p-0'>
                <Col xs={12} sm={12} md={12} lg={7} xl={7} className='p-md-0 p-lg-0 p-xl-0'
                     style={this.state.scrolled ? {marginTop: "102px"} : null}>
                  <div className="d-flex justify-content-center justify-content-lg-end justify-content-xl-end">
                    <div className="contents">
                      <p className="order lato-regular mb-0">
                        Nega mijozlar bizni tanlashadi?
                        So‘ngi texnologiyalar sifati,
                        <span className="lato-black"> hoziroq buyurtma bering!</span>
                      </p>
                      <Button color="danger" className="order-button">
                        <span> Buyurtma berish</span>
                        <span className="ml-3"><img src="/assets/images/arrow-right.png" alt="#"/></span>
                      </Button>
                      <Row className='contact ml-0 mr-0'>
                        <Col xs={5} sm={4} md={3} lg={4} xl={3} className='p-0'>
                          <span><img src="/assets/images/phone.png" alt=""/></span>
                          <span className="phone-code  lato-regular ml-2">(+99894)</span>
                          <p className="pnone-number lato-black">360-77-00</p>
                        </Col>
                        <Col xs={5} sm={4} md={3} lg={4} xl={3} className='p-0'>
                          <span><img src="/assets/images/phone.png" alt=""/></span>
                          <span className="phone-code lato-regular ml-2">(+99894)</span>
                          <p className="pnone-number lato-black">204-11-00</p>
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
                      <p className="tipography lato-black">«EUROPRINT»
                        tipografiyasi haqida</p>
                      <p className="tipography-text lato-regular">"EUROPRINT" o'zbek bosmaxonasi - bu sizning
                        biznesingizga
                        yuqori darajadagi professional yondashuv. Axir, sizning kompaniyangizning imidji
                        bunga bog'liq.
                        Biz, o'zbek matbaa ijodiy uyi, Sizga eng yuqori darajadagi bosma dizayn va ishlab chiqarishni
                        rivojlantirish bo'yicha xizmatlarni ko'rsatishga tayyormiz. Bizning ishimizda sifat,
                        samaradorlik va
                        mijozning
                        vazifalariga individual yondoshishni muvaffaqiyatli birlashtiramiz.
                      </p>
                      <span className="tipography-text pt-4 lato-regular"> "EUROPRINT" bosmaxonasi:</span>

                      <div className="mt-3 ">
                        <span><img className="path" src="/assets/images/orengepart.png" alt=""/></span>
                        <span className="ml-3 lato-bold tipography-text">Katta tajriba</span>
                      </div>
                      <div>
                        <span><img className="path" src="/assets/images/orengepart.png" alt=""/></span>
                        <span className="ml-3 lato-bold tipography-text">Eng yangi uskunalar</span>
                      </div>
                      <div>
                        <span><img className="path" src="/assets/images/orengepart.png" alt=""/></span>
                        <span className="ml-3 lato-bold tipography-text">Keng doiradagi xizmatlar</span>
                      </div>
                      <div>
                        <span><img className="path" src="/assets/images/orengepart.png" alt=""/></span>
                        <span className="ml-3 lato-bold tipography-text">Buyurtmaning eng tezkor bajarilishi</span>
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} className='p-0 pt-5 pt-md-0 pt-lg-0 pt-xl-0'>
                  <div className="d-flex align-items-end flex-column">
                    <img className="section1img1" src="/assets/images/Subtract.png" alt=""/>
                  </div>
                  <img className="section1img2 position-absolute" src="/assets/images/section1.png" alt=""/>
                </Col>
              </Row>
            </Container>
          </section>

          <section className="section-two">
            <Container>
              <p className="text-center text-white we-text lato-bold">Nima uchun biz ?</p>
              <Row className="card-row">
                <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                  <Card className='sectionInfoCard'>
                    <div className="timer_Main d-flex align-items-center flex-column">
                      <CardImg className='timer' src="/assets/images/timer.png" alt=""/>
                    </div>
                    <p className="efficiency lato-bold">Samaradorlik</p>
                    <p className="efficiency2 lato-regular">Har qanday murakkablikdagi buyurtmalarni
                      tezkor hisoblash. Ofset usulida ishlash
                      24 soat davom etadi.</p>
                  </Card>
                </Col>
                <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                  <Card className='sectionInfoCard'>
                    <div className="timer_Main d-flex align-items-center flex-column">
                      <CardImg className='timer' src="/assets/images/Group 28.png" alt=""/>
                    </div>
                    <p className="efficiency lato-bold">100% sifat</p>
                    <p className="efficiency2 lato-regular">Eng yangi uskunalar, sifatli materiallar,
                      professional xodimlar.</p>
                  </Card>
                </Col>
                <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                  <Card className='sectionInfoCard'>
                    <div className="timer_Main d-flex align-items-center flex-column">
                      <CardImg className='timer' src="/assets/images/Group 29.png" alt=""/>
                    </div>
                    <p className="efficiency lato-bold">Qulay narx</p>
                    <p className="efficiency2 lato-regular">Xarajatlarni minimallashtirish bizga
                      bozor narxidan past narxlarda
                      raqobatdosh ustunlikni beradi.</p>
                  </Card>
                </Col>
              </Row>
              <Row className="card-row2">
                <Col xs={12} sm={12} md={4} lg={4} xl={4} className="offset-md-2 offset-lg-2 offset-xl-2">
                  <Card className='sectionInfoCard'>
                    <div className="timer_Main d-flex align-items-center flex-column">
                      <CardImg className='timer' src="/assets/images/Group 30.png" alt=""/>
                    </div>
                    <p className="efficiency lato-bold">Zamonaviy uskunalar</p>
                    <p className="efficiency2 lato-regular">Bizning bosmaxona zamonaviy poligrafiya uskunalari bilan
                      jihozlangan ishlab chiqarish ustaxonasiga asoslanadi.</p>
                  </Card>
                </Col>
                <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                  <Card className='sectionInfoCard'>
                    <div className="timer_Main d-flex align-items-center flex-column">
                      <CardImg className='timer' src="/assets/images/Group 31.png" alt=""/>
                    </div>
                    <CardTitle className='mb-0'>
                      <p className="efficiency lato-bold">Dizayn ofisi va dizayn studiasi</p>
                    </CardTitle>
                    <CardText>
                      <p className="efficiency2 lato-regular">Ular bizga g'oyalar bosqichida buyurtma
                        olishga va har qanday g'oyani birinchi darajali tayyor mahsulotga tarjima qilishga imkon
                        beradi.</p>
                    </CardText>
                  </Card>
                </Col>
              </Row>
            </Container>
          </section>

          <section className="section3" id="xizmatlar">
            <p className="text-center service lato-bold">Bizning xizmatlar</p>
            <Container className="mahsulotlar">
              <Row className='position-relative pb-5 mb-5'>
                <div className="bg-color-2 position-absolute"><img src="/assets/images/bg-color-3.png" alt=""/></div>
                {ourService.map(service=>
                  <Col xs={12} sm={6} md={3} lg={3} xl={3} className=' mt-4'>
                    <Card className="card-style">
                      <img src={service.img} alt="" className="img-fluid"/>
                      <div className='cart-hover text-center'>
                        <p className='text-white text-center lato-bold'>{service.title}</p>
                        <Button className='text-white lato-regular card-btn'>Buyurtma berish</Button>
                      </div>
                    </Card>
                  </Col>
                )}
              </Row>
            </Container>
          </section>

          <section className='section4' id='portfolio'>
            <Container fluid={1}>
              <Row className='p-0'>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} className='p-md-0 p-lg-0 p-xl-0'>
                  <div className='portfolio_Card'>
                    <p className='portfolio_Title lato-bold'>Portfolio</p>
                    <p className='portfolio_Text lato-regular'>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Dolor viverra quisque orci cursus curabitur auctor ut sit.
                      Purus proin eget enim arcu aliquam. Dictumst aliquet
                      aliquam pretium facilisis sed at cras varius. Erat vivamus
                      mi sociis pharetra faucibus nisl enim.
                    </p>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} className='p-0 shape_Carousel1'>
                  {/*<div className='shape_Carousel1'/>*/}
                  <div className="shape_Carousel2"/>
                  <Slider {...portfolio}>
                    <div className="">
                      <img className='portfolio_Img img-fluid' src="/assets/images/portfolio.png" alt=""/>
                    </div>
                    <div className="">
                      <img className='portfolio_Img img-fluid' src="/assets/images/portfolio2.png" alt=""/>
                    </div>
                  </Slider>
                </Col>
              </Row>
            </Container>
          </section>

          <section className="section5">
            <p className="lato-bold text-center we-price">Bizning yutuqlarimiz</p>
            <div className="bgBox"/>
            <div className="bg-image" id="section5">
              <Container className="section5Container pt-md-5 pt-lg-5 pt-xl-5 pb-md-5 pb-lg-5 pb-xl-5">
                <Row>
                  <div className="bg-img"/>
                  <Col xs={12} sm={12} md={12} lg={12} xl={12} className='counters'>
                    <Row>
                      <Col xs={12} sm={4} md={4} lg={4} xl={4} id="count" className="text-center">

                        {this.state.count ?
                          <CountTo className="lato-bold text-center number d-inline-block" to={628} speed={3000}/> :
                          <CountTo className="lato-bold text-center number d-inline-block" to={0} speed={1000}/>}
                        <span className="lato-bold number">+</span>
                        <p className="lato-regular text-center number-com">Bizning mijozlarimiz <br/>
                          soni</p>
                      </Col>

                      <Col xs={12} sm={4} md={4} lg={4} xl={4} className="text-center">
                        {this.state.count ? <CountTo className="lato-bold text-center number" to={1500} speed={3000}/> :
                          <CountTo className="lato-bold text-center number d-inline-block" to={0} speed={1000}/>}
                        <span className="lato-bold number">+</span>
                        <p className="lato-regular  number-com">Bajarilgan buyurtmalar <br/>
                          soni</p>
                      </Col>
                      <Col xs={12} sm={4} md={4} lg={4} xl={4} className="text-center">
                        {this.state.count ? <CountTo className="lato-bold text-center number" to={254} speed={3000}/> :
                          <CountTo className="lato-bold text-center number d-inline-block" to={0} speed={1000}/>}
                        <span className="lato-bold number">+</span>
                        <p className="lato-regular text-center number-com">Bizning <br/>
                          mutaxasislarimiz</p>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Container>
            </div>
          </section>

          <section className="section6 pt-lg-5" id="mijozlar">
            <Container fluid={true} className='position-relative mt-lg-4'>
              <div className="bg-1 position-absolute"></div>
              <div className="bg-2 position-absolute"></div>
              <h1 className='text-center mb-4 pt-lg-4 lato-bold mb-3'>Bizning mijozlar</h1>
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
                      <div className="our-product-2 " >
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


          <section className="section7 position-relative">
            <img src="/assets/images/Rectangle6.png" className='rec6 img-fluid position-absolute' alt=""/>
            <Container className='team_Carousel '>
              <p className='team_Title'>Bizning jamoa</p>
              <Slider {...settings}>
                {slideUsers.map(users=>
                  <div className=''>
                    <Card className='team_Card'>
                      <p className="d-flex align-items-center flex-column">
                        <p className='d-flex justify-content-center align-items-center img_Round'>
                          <CardImg className='user_Img' src={users.img} alt=""/>
                        </p>
                      </p>
                      <CardBody>
                        <CardTitle className='user_Name'>{users.name}</CardTitle>
                        <p className="d-flex align-items-center flex-column">
                          <CardText className='user_Profession'>{users.profession}</CardText>
                        </p>
                      </CardBody>
                    </Card>
                  </div>
                )}
              </Slider>
            </Container>
          </section>

          <section className='section8'>
            <Container fluid={1} className="mt-5 p-0">
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
                      <p className="lato-bold company">Kompaniya</p>
                      <Link className="lato-light link-menu" spy={true} smooth={true} duration={1500} activeClass="active"
                            activeClassName="selected" to="bizhaqimizda"><p className="mt-3"><a> Biz haqimizda</a></p>
                      </Link>
                      <Link className="lato-light link-menu" spy={true} smooth={true} duration={1300} activeClass="active"
                            activeClassName="selected" to="xizmatlar"><p className="mt-3"><a> Bizning xizmatlar</a></p>
                      </Link>
                      <Link className="lato-light link-menu" spy={true} smooth={true} duration={1200} activeClass="active"
                            activeClassName="selected" to="portfolio"><p className="mt-3"><a> Portfolio</a></p></Link>
                      <Link className="lato-light link-menu" spy={true} smooth={true} duration={1000} activeClass="active"
                            activeClassName="selected" to="mijozlar"><p className="mt-3"><a> Bizning Mijozlar</a></p>
                      </Link>
                      <Link className="lato-light link-menu" spy={true} smooth={true} duration={700} activeClass="active"
                            activeClassName="selected" to="jamoa"><p className="mt-3"><a> Bizning Jamoa</a></p></Link>
                    </Col>
                    <Col xs={12} sm={6} md={6} lg={2} xl={2} className="mt-2">
                      <p className="lato-bold company">Xizmatlar</p>
                      <p className="mt-3 link-menu"><a className="lato-light" href="#">Ipakli bosma</a></p>
                      <p className="link-menu"><a className="lato-light" href="#">Ofset bosma</a></p>
                      <p className="link-menu"><a className="lato-light" href="#">Kesish</a></p>
                      <p className="link-menu"><a className="lato-light" href="#">Ultra-binafsha rang</a></p>
                      <p className="link-menu"><a className="lato-light" href="#">Bo'rttirish</a></p>
                      <p className="link-menu"><a className="lato-light" href="#">Laminatsiya</a></p>
                      <p className="link-menu"><a className="lato-light" href="#">Qog'oz lashirovka</a></p>
                      <p className="link-menu"><a className="lato-light" href="#">O'yib olish</a></p>
                    </Col>
                    <Col xs={12} sm={6} md={6} lg={2} xl={2} className="mt-2">
                      <p className="lato-bold company">Xizmatlar</p>
                      <p className="mt-3 link-menu"><a className="lato-light" href="#">Rahbariyat</a></p>
                      <p className="link-menu"><a className="lato-light" href="#">Tarix</a></p>
                      <p className="link-menu"><a className="lato-light" href="#">Yangiliklar</a></p>
                      <p className="link-menu"><a className="lato-light" href="#">Maketlar uchun talab</a></p>
                      <p className="link-menu"><a className="lato-light" href="#">Aloqa</a></p>
                    </Col>
                    <Col xs={12} sm={6} md={6} lg={6} xl={6} className="mt-2">
                      <div className="d-flex justify-content-lg-end justify-content-xl-end mr-lg-5 mr-xl-5">
                        <div className="">
                          <p className="lato-bold aloqa">Aloqa</p>

                          <div>
                            <p className="phone-num" style={{marginTop: "20px"}}>
                              <img className="phone-img" src="/assets/images/phone.png" alt=""/>
                              <span className="phone-code lato-regular">(+99891)</span>
                            </p>
                            <p className="phone-number lato-black mb-0">204-11-00</p>
                          </div>

                          <div>
                            <p className="phone-num mt-3">
                              <span className="phone-code lato-regular">(+99891)</span>
                            </p>
                            <p className="phone-number lato-black mb-0">360-77-00</p>

                          </div>

                          <div>
                            <p className="phone-num mt-3">
                              <span className="phone-code lato-regular">(+99873)</span>
                            </p>
                            <p className="phone-number lato-black mb-0">543-55-55</p>
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
                              Uzbek <FaAngleDown/>
                            </DropdownToggle>
                            <DropdownMenu>
                              <DropdownItem>Uzbek</DropdownItem>
                              <DropdownItem>Russian</DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </Col>
                        <Col xs={8} sm={9} md={9} lg={10} xl={10}>
                          <div className="telegram d-inline-block">
                            <a href=""><img className="text-center" src="/assets/images/002-telegram.png" alt=""/></a>
                          </div>
                          <div className="telegram ml-md-3 ml-1 d-inline-block">
                            <a href=""><img src="/assets/images/003-instagram.png" alt=""/></a>
                          </div>
                          <div className="telegram ml-md-3 ml-1 d-inline-block">
                            <a href=""><img src="/assets/images/001-facebook-logo.png" alt=""/></a>
                          </div>
                          <div className="telegram ml-md-3 ml-1 d-inline-block">
                            <a href=""> <img src="/assets/images/004-youtube.png" alt=""/></a>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                    <Col xs={12} sm={12} md={4} lg={2} xl={2} className=''>
                      <Row className='row2'>
                        <Col xs={1} sm={1} md={1} lg={1} xl={1} className='p-0'>
                          <img className="phone-img" src="/assets/images/map-pin.png" alt=""/>
                        </Col>
                        <Col xs={11} sm={11} md={11} lg={11} xl={11} className='p-0'>
                          <p className='addres mb-0'>140100</p>
                          <p className="lato-regular addres"> O'zbekiston R, Farg'ona viloyati, Qo'qon sh. Usta bozor k,
                            1B uy.</p>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className=" mt-3 p-1">
                <p className="lato-regular link-pdp">
                  <a className="text-white" href="https://pdp.uz">© 2005 - 2019 europrint.uz tipografiyasi | Personal
                    Development Process</a></p>
              </Row>
            </Container>
          </footer>
        </div>
      </div>
    );
  }
}
