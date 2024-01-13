import style from "./login.module.css";
import bg from "../../assets/images/bg.png";
import logo from "../../assets/images/logo-sm.svg";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { ToastContainer, toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [error, setError] = useState(null);
  const Navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("isAuth") === "true") {
      Navigate("/");
    }
  }, []);

  const onSubmit = async (values) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/token/",
        values
      );

      if (response.status === 200) {
        sessionStorage.setItem("isAuth", true);
        sessionStorage.setItem("token", response.data.access);
        sessionStorage.setItem("_token", response.data.refresh);
        sessionStorage.setItem("username", formik.values.username);
        sessionStorage.setItem("_id", jwtDecode(response.data.access).user_id);

        Navigate("/");
      } else {
        setError("error in login");
        toast.error(" Login Failed", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    } catch (error) {
      toast.error(" Login Failed", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit,
  });

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
              <form onSubmit={formik.handleSubmit}>
                <div className="form-outline mb-4">
                  <input
                    id="username"
                    type={"username"}
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    className="form-control"
                  />
                  <label className="form-label" htmlFor="username">
                    Username
                  </label>
                </div>

                <div className="form-outline mb-4">
                  <input
                    id="password"
                    className="form-control"
                    type={"password"}
                    autoComplete="off"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                  />
                  <label className="form-label" htmlFor="password">
                    Password
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

                  <div className="col-md-6 d-flex justify-content-center">
                    <a className=" text-dark" href="#!">
                      Forgot password?
                    </a>
                  </div>
                </div>

                <button type="submit" className="btn btn-danger btn-block mb-4">
                  Sign in
                </button>

                <div className="text-center">
                  <p>
                    Not a member?{" "}
                    <Link className="text-decoration-none" to={"/register"}>
                      Register
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
}
