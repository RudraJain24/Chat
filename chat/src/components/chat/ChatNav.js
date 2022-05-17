import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import logo from "../../assets/logo.png"

const ChatNav = (props) => {

  return <>

    <Navbar className="nav-background" expand="lg">
      <Container fluid>
        <Navbar.Brand href="#" style={{ display: "contents" }}>
          <img
            src={logo}
            className="d-inline-block align-top"
            alt="10outof10"
            style={{ width: "8rem" }}
          />Hi, {props.user.name}</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll" className="justify-content-end">
          <Nav navbarScroll>
            <Nav.Link className="navMenu" onClick={props.userSignOut} >Sign Out</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  </>

}

export default ChatNav;