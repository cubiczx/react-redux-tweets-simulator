import React from "react";
import { Container, Navbar, Button } from "react-bootstrap";
import LogoRedux from "../assets/png/redux.png";
import { useDispatch } from "react-redux";
import { setTweetModalToggle } from "../actions/modalsActions";

export default function Menu() {
  // Dispatch para abrir el modal de nuevo tweet
  const dispatch = useDispatch();

  const handleOpenTweetModal = (state: boolean) => {
    dispatch(setTweetModalToggle(state));
  };

  return (
    <>
      <Navbar className="modern-navbar" expand="lg" variant="dark">
        <Container className="justify-content-center">
          <Navbar.Brand href="#home">
            <img
              src={LogoRedux}
              width={40}
              height={40}
              className="navbar-logo"
              alt="Redux Tweets Simulator"
            />
            Redux Tweets
          </Navbar.Brand>
        </Container>
      </Navbar>
      
      <Button 
        className="btn-floating-new-tweet" 
        onClick={() => handleOpenTweetModal(true)}
        title="Nuevo Tweet"
      >
        ✨
      </Button>
    </>
  );
}
