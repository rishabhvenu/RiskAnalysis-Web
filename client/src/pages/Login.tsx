import React from "react";
import "./../../stylesheets/Register.scss";
import axios from "axios";
import { NavigateFunction, useNavigate } from "react-router";
import Connection from "../utils/Connection";

interface LoginProps {
  useNavigate: NavigateFunction;
}

class LoginPage extends React.Component<LoginProps> {
  login = "";

  constructor(props: LoginProps) {
    super(props);
  }

  private shake() {
    const invalid: HTMLElement = document.querySelector(
      ".invalid"
    ) as HTMLElement;
    const form = document.querySelector(".registration-form");
    form?.classList.add("shake");
    invalid.style.marginTop = "0";

    form?.addEventListener("animationend", () => {
      form?.classList.remove("shake");
      invalid.style.marginTop = "-85px";
    });
  }

  private setInvalidText(text: string) {
    const invalidText: HTMLElement = document.querySelector(
      ".invalid p"
    ) as HTMLElement;

    invalidText.innerText = text;
  }
  private fieldTextChange(
    field: string,
    callback: Function,
    icon: string,
    next_field?: string
  ) {
    const changeEvents = ["change", "keyup", "paste"];
    const fieldElement: HTMLInputElement = document.querySelector(
      `.${field}`
    ) as HTMLInputElement;
    changeEvents.forEach((event) => {
      fieldElement?.addEventListener(event, () => {
        const iconElement = document.querySelector(`.${icon}`);

        if (fieldElement.value) {
          iconElement?.classList.add("next");
        } else {
          iconElement?.classList.remove("next");
        }
      });
    });

    const next_button: HTMLElement = document.querySelector(
      ".next-button." + field
    ) as HTMLElement;

    next_button?.addEventListener("mouseover", () => {
      next_button.style.cursor = "pointer";
    });

    next_button?.addEventListener("click", async () => {
      if (await callback(fieldElement.value)) {
        const fieldSection = document.querySelector(`.${field}-section`);
        fieldSection?.classList.add("fold-up");

        if (next_field) {
          const nextFieldSection = document.querySelector(
            `.${next_field}-section`
          );
          nextFieldSection?.classList.remove("folded");
        }
      }
    });
  }

  async componentDidMount() {
    if (await Connection.isLoggedIn()) {
      this.props.useNavigate("/home");
      return;
    }
    this.fieldTextChange(
      "login",
      async (value: string) => {
        const code = (
          await axios.get(
            `${import.meta.env.VITE_BASE_URL}/login/username_or_email?login=${value}`
          )
        ).data.code;

        if (code === 1) {
          this.shake();
          this.setInvalidText("Username/Email Doesnt Exist");
          return false;
        }

        this.login = value;
        return true;
      },
      "icon-user",
      "password"
    );
    this.fieldTextChange(
      "password",
      async (value: string) => {
        const code = (
          await axios.post(
            `${import.meta.env.VITE_BASE_URL}/login`,
            {
              login: this.login,
              password: value,
            },
            {
              withCredentials: true,
            }
          )
        ).data.code;

        if (code == 1) {
          this.shake();
          this.setInvalidText("Incorrect Password");
          return false;
        }

        this.props.useNavigate("/home");
        this.props.useNavigate(0);
        return true;
      },
      "icon-lock"
    );
  }

  render() {
    return (
      <>
        <div className="registration-form">
          <header>
            <h1>Log In</h1>
            <p>Fill in information</p>
          </header>
          <form>
            <div className="input-section login-section">
              <input
                className="login"
                type="text"
                placeholder="ENTER YOUR E-MAIL OR USER"
                autoComplete="off"
              />
              <div className="animated-button">
                <span className="icon-user">
                  <i className="fa fa-user"></i>
                </span>
                <span className="next-button login">
                  <i className="fa fa-arrow-up"></i>
                </span>
              </div>
            </div>
            <div className="input-section password-section folded">
              <input
                className="password"
                type="password"
                placeholder="ENTER YOUR PASSWORD HERE"
              />
              <div className="animated-button">
                <span className="icon-lock">
                  <i className="fa fa-lock"></i>
                </span>
                <span className="next-button password">
                  <i className="fa fa-arrow-up"></i>
                </span>
              </div>
            </div>
            <div className="invalid">
              <p></p>
            </div>
          </form>
        </div>
      </>
    );
  }
}

const Login = () => {
  return <LoginPage useNavigate={useNavigate()} />;
};

export default Login;
