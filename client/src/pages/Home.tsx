import "bootstrap/dist/css/bootstrap.min.css";
import SearchBar from "../components/SearchBar";
import React from "react";
import Connection from "../utils/Connection";
import { NavigateFunction, useNavigate } from "react-router-dom";

export interface HomeProps {
  useNavigate: NavigateFunction;
}

class HomePage extends React.Component<HomeProps> {
  constructor(props: HomeProps) {
    super(props);
  }

  async componentDidMount() {
    if (!(await Connection.isLoggedIn())) {
      this.props.useNavigate("/login");
    }
  }
  render() {
    return <SearchBar />;
  }
}

const Home = () => {
  return <HomePage useNavigate={useNavigate()} />;
};

export default Home;
