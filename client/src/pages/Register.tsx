import React from "react";
import "./../../stylesheets/Register.scss";
import axios from "axios";
import { NavigateFunction, useNavigate } from "react-router-dom";
import Connection from "../utils/Connection";

interface RegisterProps {
  useNavigate: NavigateFunction;
}

class RegisterPage extends React.Component<RegisterProps> {
  username = "";
  email = "";
  password = "";

  constructor(props: RegisterProps) {
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
      "email",
      async (value: string) => {
        const code = (
          await axios.get(`http://localhost:5050/register/email?email=${value}`)
        ).data.code;
        if (code == 0) {
          this.email = value;
        } else if (code === 1) {
          this.shake();
          this.setInvalidText("Invalid Email");
          return false;
        } else if (code == 2) {
          this.shake();
          this.setInvalidText("Email Already Registered");
          return false;
        }

        return true;
      },
      "icon-paper-plane",
      "username"
    );
    this.fieldTextChange(
      "username",
      async (value: string) => {
        const code = (
          await axios.get(
            `http://localhost:5050/register/username?username=${value}`
          )
        ).data.code;

        if (code == 0) {
          this.username = value;
        } else if (code == 1) {
          this.shake();
          this.setInvalidText("Username Taken");
          return false;
        }
        return true;
      },
      "icon-user",
      "password"
    );
    this.fieldTextChange(
      "password",
      async (value: string) => {
        const code = (
          await axios.get(
            `http://localhost:5050/register/password?password=${value}`
          )
        ).data.code;

        if (code == 0) {
          this.password = value;
        } else if (code == 1) {
          this.shake();
          this.setInvalidText("Weak Password");
          return false;
        }
        return true;
      },
      "icon-lock",
      "repeat-password"
    );
    this.fieldTextChange(
      "repeat-password",
      async (value: string) => {
        if (value !== this.password) {
          this.shake();
          this.setInvalidText("Passwords Don't Match");
          return false;
        }
        await axios.post("http://localhost:5050/register", {
          username: this.username,
          email: this.email,
          password: this.password,
        });

        this.props.useNavigate("/login");
        return true;
      },
      "icon-repeat-lock"
    );
  }

  render() {
    return (
      <>
        <div className="registration-form">
          <header>
            <h1>Sign Up</h1>
            <p>Fill in information</p>
          </header>
          <form>
            <div className="input-section email-section">
              <input
                className="email"
                type="email"
                placeholder="ENTER YOUR E-MAIL HERE"
                autoComplete="off"
              />
              <div className="animated-button">
                <span className="icon-paper-plane">
                  <i className="fa fa-envelope"></i>
                </span>
                <span className="next-button email">
                  <i className="fa fa-arrow-up"></i>
                </span>
              </div>
            </div>
            <div className="input-section username-section folded">
              <input
                className="username"
                type="text"
                placeholder="ENTER YOUR USERNAME HERE"
                autoComplete="off"
              />
              <div className="animated-button">
                <span className="icon-user">
                  <i className="fa fa-user"></i>
                </span>
                <span className="next-button username">
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
            <div className="input-section repeat-password-section folded">
              <input
                className="repeat-password"
                type="password"
                placeholder="REPEAT YOUR PASSWORD HERE"
              />
              <div className="animated-button">
                <span className="icon-repeat-lock">
                  <i className="fa fa-lock"></i>
                </span>
                <span className="next-button repeat-password">
                  <i className="fa fa-paper-plane"></i>
                </span>
              </div>
            </div>
            <div className="success">
              <p>ACCOUNT CREATED</p>
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

const Register = () => {
  return <RegisterPage useNavigate={useNavigate()} />;
};

export default Register;
