import { CSSProperties } from "react";

export interface Params {
  locales?: string;
  wholenumber?: string;
  justification?: string;
  currencyIndicator?: string;
  percentage?: boolean;
  precision?: number;
  commafy?: boolean;
  currency?: string;
  cssClass?: Array<string>;
  shortFormat?: boolean;
  shortFormatMinValue?: number;
  shortFormatPrecision?: number;
  title?: boolean;
}

interface NumericLabelProps {
  params: Params;
  children: number;
}

interface Options {
  maximumFractionDigits?: number;
  minimumFractionDigits: number;
}

const NumericLabel = (props: NumericLabelProps) => {
  const nFormatter = (num: number, minValue: number) => {
    if (!num || !+num || typeof +num !== "number") {
      return {
        number: num,
      };
    }

    num = +num;

    minValue = minValue || 0;
    const si = [
      { value: 1e18, symbol: "E" },
      { value: 1e15, symbol: "P" },
      { value: 1e12, symbol: "T" },
      { value: 1e9, symbol: "B" },
      { value: 1e6, symbol: "M" },
      { value: 1e3, symbol: "k" },
    ];

    if (typeof num === "number" && num >= minValue) {
      for (let i = 0; i < si.length; i++) {
        if (num >= si[i].value) {
          return {
            number: num / si[i].value,
            letter: si[i].symbol,
          };
        }
      }
    }
    return {
      number: num,
    };
  };

  let option: Options = {
    minimumFractionDigits: 0,
  };

  let locales;
  let number;
  let mystyle: CSSProperties;

  let css = "";

  if (props.params) {
    locales = props.params.locales;
    if (props.params.wholenumber == "floor") {
      number = Math.floor(props.children);
    } else if (props.params.wholenumber == "ceil") {
      number = Math.ceil(props.children);
    } else {
      number = +props.children;
    }

    let styles = "right" as "right" | "left" | "center";

    if (props.params.justification == "L") {
      styles = "left";
    } else if (props.params.justification == "C") {
      styles = "center";
    } else {
      styles = "right";
    }

    mystyle = {
      textAlign: styles,
    };

    let currencyIndicator;

    if (props.params.currencyIndicator) {
      currencyIndicator = props.params.currencyIndicator;
    } else {
      currencyIndicator = "USD";
    }

    if (props.params.percentage) {
      option = Object.assign(option, {
        style: "percent",
        maximumFractionDigits: props.params.precision || 2,
        minimumFractionDigits: props.params.precision || 0,
        useGrouping: props.params.commafy,
      });
    } else if (props.params.currency) {
      option = Object.assign(option, {
        style: "currency",
        currency: currencyIndicator,
        maximumFractionDigits: props.params.precision || 2,
        minimumFractionDigits: props.params.precision || 0,
        useGrouping: props.params.commafy,
      });
    } else {
      option = Object.assign(option, {
        style: "decimal",
        useGrouping: props.params.commafy,
      });

      if (props.params.precision) {
        option.maximumFractionDigits = props.params.precision;
        option.minimumFractionDigits = props.params.precision || 0;
      }
    }
    if (props.params.cssClass) {
      props.params.cssClass.map((clas) => {
        css += clas + " ";
      });
    }
  } else {
    number = +props.children;
    locales = "en-US";
    mystyle = {
      textAlign: "left",
    };
  }

  let shortenNumber = number;
  let numberLetter = "";

  if (props.params && props.params.shortFormat) {
    const sn = nFormatter(number, props.params.shortFormatMinValue || 0);
    shortenNumber = sn.number;
    numberLetter = sn.letter || "";

    if (
      props.params.shortFormatMinValue &&
      +number >= props.params.shortFormatMinValue
    ) {
      option.maximumFractionDigits =
        props.params.shortFormatPrecision || props.params.precision || 0;
    }
  }

  option.minimumFractionDigits =
    option.maximumFractionDigits === undefined
      ? ~~option.minimumFractionDigits
      : Math.min(
          ~~option.minimumFractionDigits,
          ~~option.maximumFractionDigits
        );

  let theFormattedNumber: string | number = shortenNumber;

  if (typeof shortenNumber === "number") {
    theFormattedNumber = Intl.NumberFormat(locales, option).format(
      +shortenNumber
    );
  }

  if (numberLetter) {
    if (props.params && props.params.percentage) {
      if (typeof theFormattedNumber === "string") {
        theFormattedNumber = theFormattedNumber.replace(
          "%",
          numberLetter + "%"
        );
      }
    } else {
      theFormattedNumber += numberLetter;
    }
  }

  let title: string | boolean = false;
  if (props.params && props.params.title) {
    props.params.title === true
      ? (title = number.toString())
      : (title = props.params.title);
  }

  if (
    mystyle.textAlign &&
    (mystyle.textAlign == "right" || mystyle.textAlign == "center")
  ) {
    if (title) {
      return (
        <div className={css} style={mystyle} title={title}>
          {theFormattedNumber}
        </div>
      );
    } else {
      return (
        <div className={css} style={mystyle}>
          {theFormattedNumber}
        </div>
      );
    }
  } else {
    if (title) {
      return (
        <span className={css} style={mystyle} title={title}>
          {theFormattedNumber}
        </span>
      );
    } else {
      return (
        <span className={css} style={mystyle}>
          {theFormattedNumber}
        </span>
      );
    }
  }
};

export default NumericLabel;
