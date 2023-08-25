import {
  NavigateFunction,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import NumericLabel, { Params } from "../utils/NumericLabel";
import React from "react";
import Connection from "../utils/Connection";

interface StockProps {
  queryParameters: URLSearchParams;
  useNavigate: NavigateFunction;
}

interface StockData {
  market_cap: number;
  beta: number;
  debt_to_equity_ratio: number;
  interest_coverage_ratio: number;
}

class StockPage extends React.Component<
  StockProps,
  { loading: boolean; data: StockData }
> {
  labelOptions: Params;
  ticker: string;

  constructor(props: StockProps) {
    super(props);

    this.state = {
      loading: true,
      data: {
        market_cap: 0,
        beta: 0,
        debt_to_equity_ratio: 0,
        interest_coverage_ratio: 0,
      },
    };

    this.labelOptions = {
      justification: "L",
      locales: "en-CA",
      percentage: false,
      wholenumber: "ceil",
      shortFormat: true,
      commafy: false,
      title: true,
    };

    this.ticker = this.props.queryParameters.get("ticker") as string;
  }

  async componentDidMount() {
    if (!(await Connection.isLoggedIn())) {
      this.props.useNavigate("/login");
      return;
    }
    fetch(`http://${window.location.hostname}:5100/stocks/${this.ticker}/`)
      .then((response) => response.json())
      .then((data) => this.setState({ data: data, loading: false }));
  }

  render() {
    return (
      <>
        {!this.state.loading && (
          <>
            <h4>
              Market Cap:{" "}
              <NumericLabel params={this.labelOptions}>
                {this.state.data.market_cap}
              </NumericLabel>
            </h4>
            <h4>Beta: {(this.state.data.beta * 1).toFixed(2)}</h4>
            <h4>
              Debt-to-Equity Ratio:{" "}
              {(this.state.data.debt_to_equity_ratio * 100).toFixed(1)}%
            </h4>
            <h4>
              Interest Coverage Ratio:{" "}
              {(this.state.data.interest_coverage_ratio * 1).toFixed(0)}x
            </h4>
          </>
        )}
        {this.state.loading && (
          <>
            <h1>Data Loading...</h1>
          </>
        )}
      </>
    );
  }
}

function Stock() {
  const [queryParameters] = useSearchParams();
  return (
    <StockPage queryParameters={queryParameters} useNavigate={useNavigate()} />
  );
}

export default Stock;
