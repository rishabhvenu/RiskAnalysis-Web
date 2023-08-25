import React from "react";
import { Card, Col, Container, Form, Row } from "react-bootstrap";
import { NavigateFunction, useNavigate } from "react-router-dom";
import "./../../stylesheets/SearchBar.scss";

interface SearchBarProps {
  navigate: NavigateFunction;
}

class SearchBarComponent extends React.Component<
  SearchBarProps,
  { input: string }
> {
  constructor(props: SearchBarProps) {
    super(props);

    this.state = {
      input: "",
    };

    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    const form = document.getElementById("searchForm");
    const searchBar = document.getElementById("searchBar");

    form?.addEventListener("submit", (event) => {
      event.preventDefault();
    });

    searchBar?.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        this.fetchData();
      }
    });
  }

  setInput(input: string) {
    this.setState({ input: input });
  }

  fetchData() {
    this.props.navigate(`/stock?ticker=${this.state.input}`);
  }

  render() {
    return (
      <Container>
        <Row className="justify-content-center">
          <Col xs="12" md="10" lg="8">
            <Form id="searchForm" className="card card-sm">
              <Card.Body className="row no-gutters align-items-center">
                <Col xs="auto">
                  <i className="fas fa-search h4 text-body"></i>
                </Col>
                <Col>
                  <Form.Control
                    size="lg"
                    type="search"
                    id="searchBar"
                    onChange={(e) => this.setInput(e.target.value)}
                    placeholder='Search the symbol of your stock, etc "TSLA"'
                  />
                </Col>
              </Card.Body>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

function SearchBar() {
  const navigate = useNavigate();
  return <SearchBarComponent navigate={navigate} />;
}

export default SearchBar;
