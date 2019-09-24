import React from 'react'

import Card from "reactstrap/es/Card";
import Col from "reactstrap/es/Col";
import Row from "reactstrap/es/Row";
import CardText from "reactstrap/es/CardText";
import CardBody from "reactstrap/es/CardBody";
import Container from "reactstrap/es/Container";




class Carusel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      touchstartX: null,
      touchstartY: 0,
      touchendX: 0,
      touchendY: 0,
      mouseCliced: false,
      circleId1: 1,
      circleId: 1
    }
  }

  componentDidMount() {
    const Cards = (e) => {
      window.addEventListener('DOMContentLoaded', () => {
        setTimeout(init, 1)
      }, true);

      function init(e) {
        if (document.querySelector(".boxs")) {
          let cards = document.querySelector(".boxs");
          cards.addEventListener('click', clicked, false);

          document.querySelectorAll(".boxs .box")[1].click();
        }
      }

      function clicked(e) {
        let card = e.target;
        if (card.getAttribute("data-card")) {
          rearrange(card.getAttribute("data-card"));
        }
      }

      function rearrange(card) {
        let cards = document.querySelectorAll(".boxs .box");
        for (let n = 0; n < cards.length; n++) {
          cards[n].classList.remove("card--left");
          cards[n].classList.remove("card--center");
          cards[n].classList.remove("card--right");
        }
        cards[card].classList.add("card--center");
        if (card == 0) {
          cards[2].classList.add("card--left");
          cards[1].classList.add("card--right");
        }
        if (card == 1) {
          cards[0].classList.add("card--left");
          cards[2].classList.add("card--right");
        }
        if (card == 2) {
          cards[1].classList.add("card--left");
          cards[0].classList.add("card--right");
        }
      }

      return {
        init
      }
    };
    Cards();
setInterval(this.setLeft,9000,true)
  }

  getTouches = (event) => {
    return event.touches ||             // browser API
      event.originalEvent.touches; // jQuery
  };
  handleTouchStart = (event) => {

    const firstTouch = this.getTouches(event)[0];
    this.state.touchstartX = firstTouch.clientX;
    this.state.touchstartY = firstTouch.clientY;
    this.setState(this.state)

  };
  handleTouchMove = (event) => {
    if (!this.state.touchstartX || !this.state.touchstartY) {
      return;
    }

    let xUp = event.touches[0].clientX;
    let yUp = event.touches[0].clientY;
    this.state.touchendX = xUp;
    this.state.touchendY = yUp;
    this.setState(this.state);
    let xDiff = this.state.touchstartX - xUp;
    let yDiff = this.state.touchstartY - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
      if (xDiff > 0) {
        /* left swipe */
        let card = document.getElementsByClassName("card--right");
        this.state.circleId++;
        if (this.state.circleId == 3) this.state.circleId = 0
        if (card[0].id) {
          this.rearrange(card[0].id)
        }
      } else {
        /* right swipe */

        let card = document.getElementsByClassName("card--left");
        this.state.circleId--;
        if (this.state.circleId == -1) this.state.circleId = 2


        if (card[0].id) {
          this.rearrange(card[0].id)
        }
      }
    } else {
      if (yDiff > 0) {
        /* up swipe */
      } else {
        /* down swipe */
      }

    }
    /* reset values */
    this.state.touchstartX = null;
    this.state.touchstartY = null;
    this.setState(this.state)
  };
  clicked = (e) => {
    let card = e.target;
    if (card.getAttribute("data-card")) {
      this.rearrange(card.getAttribute("data-card"));
    }

  };
  rearrange = (card) => {
    let cards = document.querySelectorAll(".boxs .box");
    this.state.circleId1=card;
    this.setState(this.state)
    for (let n = 0; n < cards.length; n++) {
      cards[n].classList.remove("card--left");
      cards[n].classList.remove("card--center");
      cards[n].classList.remove("card--right");
    }
    cards[card].classList.add("card--center");
    if (card == 0) {
      cards[2].classList.add("card--left");
      cards[1].classList.add("card--right");
    }
    if (card == 1) {
      cards[0].classList.add("card--left");
      cards[2].classList.add("card--right");
    }
    if (card == 2) {
      cards[1].classList.add("card--left");
      cards[0].classList.add("card--right");
    }
  };
  setLeft = () => {
    let card = document.getElementsByClassName("card--left");
    this.state.circleId--;
    if (this.state.circleId == -1) this.state.circleId = 2


    if (card[0].id) {
      this.rearrange(card[0].id)
    }
    this.setState(this.state)
  };
  setRight = () => {
    let card = document.getElementsByClassName("card--right");
    this.state.circleId++;
    if (this.state.circleId == 3) this.state.circleId = 0
    if (card[0].id) {
      this.rearrange(card[0].id)
    }
    this.setState(this.state)
  };
  mouseCordinate = (event) => {

    this.state.touchstartX = event.clientX
    this.state.touchstartY = event.clientY
    this.state.mouseCliced = true;
    this.setState(this.state)
  }
  mouseCordinateBlur = (event) => {
    if (this.state.mouseCliced) {

      if (event.clientX > this.state.touchstartX) {
        let card = document.getElementsByClassName("card--left");
        this.state.circleId--;
        if (this.state.circleId == -1) this.state.circleId = 2
        if (card[0].id) {
          this.rearrange(card[0].id)
        }

      }
      if (event.clientX < this.state.touchstartX) {
        let card = document.getElementsByClassName("card--right");
        this.state.circleId++;
        if (this.state.circleId == 3) this.state.circleId = 0

        if (card[0].id) {
          this.rearrange(card[0].id)
        }
      }
      this.state.touchstartX = event.clientX
      this.state.touchstartY = event.clientY
      this.state.mouseCliced = false;
      this.setState(this.state)
    }
  };
  mouseMoveCordinate = (event) => {
    if (this.state.mouseCliced) {

      if (event.clientX > this.state.touchstartX) {
        let card = document.getElementsByClassName("card--left");
        this.state.circleId--;
        if (this.state.circleId == -1) this.state.circleId = 2
        if (card[0].id) {
          this.rearrange(card[0].id)
        }

      }
      if (event.clientX < this.state.touchstartX) {
        let card = document.getElementsByClassName("card--right");
        this.state.circleId++;
        if (this.state.circleId == 3) this.state.circleId = 0

        if (card[0].id) {
          this.rearrange(card[0].id)
        }
      }

      this.state.mouseCliced = false;
    }
    this.setState(this.state)
  };
  circleAction = (event) => {
    let id = event.target.id
    this.state.circleId1=id;
    this.setState(this.state)
    if (id != this.state.circleId) {
      if (id == 2 && this.state.circleId == 0) {

        this.setLeft()
        this.setLeft()

      }
      if (id == 0 && this.state.circleId == 2) {

        this.setLeft()
        this.setLeft()

      } else {

        if (id > this.state.circleId && id < 3) {

          this.setRight()

        } else this.setLeft()

      }
    }


  }

  render() {
    // const {commentList} = this.props
    console.log(this.state.circleId1  )
    return (<div className='CaruselContainer'>


        <div className="boxs" unselectable='on'>


          <div className="box card--left fill-white1" data-card="0" id="0" unselectable='on'
               onTouchStart={this.handleTouchStart} onTouchMove={this.handleTouchMove}
            // onClick={this.mouseCordinate}
               onMouseMove={this.mouseMoveCordinate} onBlur={this.mouseCordinateBlur}
               onMouseDown={this.mouseCordinate}>
            <img src="/assets/images/headerimg.png" alt="" />


          </div>
          <div className="box card--center fill-white2" data-card="1" id="1" unselectable='on'
               onTouchStart={this.handleTouchStart}
               onTouchMove={this.handleTouchMove}
            // onClick={this.mouseCordinate}
               onMouseDown={this.mouseCordinate} onMouseMove={this.mouseMoveCordinate}
               onBlur={this.mouseCordinateBlur}>
            <img src="/assets/images/headerimg.png"    alt=""/>

          </div>
          <div className="box card--right fill-white3" data-card="2" id="2" unselectable='on'
               onTouchStart={this.handleTouchStart}
               onTouchMove={this.handleTouchMove}
            // onClick={this.mouseCordinate}
               onMouseDown={this.mouseCordinate}
               onMouseMove={this.mouseMoveCordinate} onBlur={this.mouseCordinateBlur}>
            <img src="/assets/images/headerimg.png"   alt="" />


          </div>


        </div>

        <div className="homeCircles" id="0" style={this.state.circleId1 == 0 ? {opacity: "1",marginTop:"-318px"} : {marginTop:"-318px"}}
             onClick={this.circleAction}></div>
        <div className="homeCircles" id="1" style={this.state.circleId1 == 1 ? {opacity: "1",marginTop:"-303px"} : {marginTop:"-303px"}}
             onClick={this.circleAction}></div>
        <div className="homeCircles" id="2" style={this.state.circleId1 == 2 ? {opacity: "1",marginTop:"-288px"} : {marginTop:"-288px"}}
             onClick={this.circleAction}></div>



      </div>
    )
  }
}

export default Carusel;
