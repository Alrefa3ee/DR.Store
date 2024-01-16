import { useEffect, useState } from "react";
import axios from "axios";
import style from "./SignUp.module.css";
import bg from "../../assets/images/bg.png";
import logo from "../../assets/images/logo-sm.svg";
import { Link, Navigate } from "react-router-dom";
const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    address: "",
    phone: "",
    birthDate: "",
  });

  useEffect(() => {
    if (sessionStorage.getItem("isAuth") === "true") {
      Navigate("/");
    }
  }, []);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/auth/users/",
        formData
      );

      Navigate("/login");
    } catch (error) {}
  };

  return (
    <>
      <div className={` ${style.bg} `} style={{ background: `url(${bg}) ` }}>
        <div className={`container ${style.cont} `}>
          <ul
            className="nav nav-pills nav-justified bg-transparentmb-3"
            id="ex1"
            role="tablist"
          >
            <li className="nav-item bg-transparent" role="presentation">
              <a className="nav-link bg-transparent ">
                <img src={logo} alt="" />
              </a>
            </li>
          </ul>
          <div className="bg-light  border border-danger rounded rounded-3 tab-content p-5">
            <div
              className="tab-pane fade show active"
              id="pills-login"
              role="tabpanel"
              aria-labelledby="tab-login"
            >
              <form>
                <div className="form-outline mb-4">
                  <input
                    id="fullName"
                    className="form-control"
                    type={"fullName"}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                  <label className="form-label" htmlFor="fullName">
                    Full Name
                  </label>
                </div>

                <div className="form-outline mb-4">
                  <input
                    id="username"
                    type={"username"}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="form-control"
                  />
                  <label className="form-label" htmlFor="username">
                    Username
                  </label>
                </div>
                <div className="form-outline mb-4">
                  <input
                    id="email"
                    type={"email"}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="form-control"
                  />
                  <label className="form-label" htmlFor="email">
                    Email
                  </label>
                </div>

                <div className="form-outline mb-4">
                  <input
                    id="password"
                    className="form-control"
                    type={"password"}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                </div>

                <div className="form-outline mb-4">
                  <input
                    id="phone"
                    className="form-control"
                    type={"phone"}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                  <label className="form-label" htmlFor="password">
                    phone
                  </label>
                </div>
                <div className="form-outline mb-4">
                  <input
                    id="address"
                    className="form-control"
                    type={"address"}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                  <label className="form-label" htmlFor="address">
                    address
                  </label>
                </div>
                <div className="form-outline mb-4">
                  <input
                    id="password"
                    className="form-control"
                    type={"birthDate"}
                    onChange={(e) =>
                      setFormData({ ...formData, birthDate: e.target.value })
                    }
                  />
                  <label className="form-label" htmlFor="birthDate">
                    Birth Date
                  </label>
                </div>

                <div className="row mb-4">
                  <div className="col-md-6 d-flex justify-content-center">
                    <div className="form-check mb-3 mb-md-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="loginCheck"
                        checked
                      />
                      <label
                        className="form-check-label text-dark text-decoration-none"
                        htmlFor="loginCheck"
                      >
                        Remember me{" "}
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  onClick={onSubmit}
                  className="btn btn-danger btn-block mb-4"
                >
                  Sign Up
                </button>

                <div className="text-center">
                  <p>
                    Have account?{" "}
                    <Link className="text-decoration-none" to={"/login"}>
                      Login
                    </Link>
                  </p>
                </div>
              </form>
            </div>
            <div
              className="tab-pane fade"
              id="pills-register"
              role="tabpanel"
              aria-labelledby="tab-register"
            ></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
