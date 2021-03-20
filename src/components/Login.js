import React, { useState, useRef } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import AuthService from "../services/auth.service";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const Login = (props) => {
  const form = useRef();
  const checkBtn = useRef();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const onChangeUsername = (e) => {
    const username = e.target.value;
    setUsername(username);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const handleLogin = (e) => {debugger;
    e.preventDefault();

    setMessage("");
    setLoading(true);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      AuthService.login(username, password).then(
        () => {
          props.history.push("/profile");
          window.location.reload();
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setLoading(false);
          setMessage(resMessage);
        }
      );
    } else {
      setLoading(false);
    }
  };

  return (
      <div className="container-fluid min-100 d-flex flex-column justify-content-center">
        <div className="row flex-grow-1">
          <div className="col fondoAzul headtop"/>
        </div>
        <div className="row flex-grow-1 align-self-center w-50">
          <div className="card border-0">
            <img src="assets/img/logo.svg" className="card-img-top" alt="Logo"/>
              <div className="card-body">
                <h5 className="card-title"/>
                <p className="card-tex text-center">
                  <Form className="text-center" onSubmit={handleLogin} ref={form}>
                    <div className="input-group mb-3 border-radius-25">
                      <span className="input-group-text text-light fondoceleste" id="basic-addon1">
                        <i className="far fa-user fa-2x"/>
                      </span>
                      <Input type="text" className="form-control text-light fondoceleste" placeholder="Usuario"
                             aria-label="Usuario" aria-describedby="basic-addon1"
                             name="username"
                             value={username}
                             onChange={onChangeUsername}
                             validations={[required]}

                      />
                    </div>
                    <div className="input-group mb-3 border-radius-25">
                      <span className="input-group-text text-light fondoceleste" id="basic-addon1">
                        <i className="fas fa-unlock-alt fa-2x"/>
                      </span>
                      <Input  className="form-control text-light fondoceleste" placeholder="Password"
                             aria-label="Password" aria-describedby="basic-addon1"
                             type="password"
                             name="password"
                             value={password}
                             onChange={onChangePassword}
                             validations={[required]}

                      />
                    </div>
                     <div className="form-group">
                      <button className="btn text-light fondoAzul btn-lg" disabled={loading}>
                        {loading && (
                            <span className="spinner-border spinner-border-sm"></span>
                        )}
                        <span>Entrar</span>
                      </button>
                    </div>
                    {message && (
                        <div className="form-group">
                          <div className="alert alert-danger" role="alert">
                            {message}
                          </div>
                        </div>
                    )}
                    <CheckButton style={{ display: "none" }} ref={checkBtn} />
                  </Form>
                </p>
              </div>
          </div>
        </div>
        <div className="row flex-grow-1">
          <div className="col fondoAzul"/>
        </div>
      </div>
  );
};

export default Login;
