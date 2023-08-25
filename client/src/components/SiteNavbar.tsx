import axios from "axios";
import React from "react";
import { Container, Dropdown, Nav, Navbar } from "react-bootstrap";
import { NavigateFunction, useNavigate } from "react-router-dom";
import Connection from "../utils/Connection";

interface SiteNavbarProps {
  useNavigate: NavigateFunction;
}

class SiteNavbarComponent extends React.Component<
  SiteNavbarProps,
  { username: string | null }
> {
  constructor(props: SiteNavbarProps) {
    super(props);
    this.state = {
      username: null,
    };
  }

  async componentDidMount() {
    this.setState({
      username: await Connection.isLoggedIn(),
    });
  }

  async logout() {
    await axios.delete(`${import.meta.env.VITE_BASE_URL}/logout`, {
      withCredentials: true,
    });

    this.setState({ username: null });
    this.forceUpdate();
    this.props.useNavigate("/login");
  }

  render() {
    return (
      <Navbar expand="lg" className="navbar-dark bg-dark">
        <Container className="justify-content-center">
          <Navbar.Brand id="navbarBrand">Stock Risk Analysis</Navbar.Brand>
        </Container>
        <Nav className="me-auto">
          {!this.state.username && (
            <>
              <Nav.Link href="/login">Login</Nav.Link>
              <Nav.Link href="/register">Register</Nav.Link>
            </>
          )}

          {this.state.username && (
            <Dropdown>
              <Dropdown.Toggle variant="dark">
                {this.state.username}
              </Dropdown.Toggle>
              <Dropdown.Menu variant="dark" align="end">
                <Dropdown.Item onClick={async () => await this.logout()}>
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </Nav>
      </Navbar>
    );
  }
}

const SiteNavbar = () => {
  return <SiteNavbarComponent useNavigate={useNavigate()} />;
};

export default SiteNavbar;
