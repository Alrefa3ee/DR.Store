import { Link, useLocation } from "react-router-dom";
import style from "./Home.module.css";
import LatestProductSection from "./LatestProductSection";
import { useEffect, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  if (sessionStorage.getItem("isAuth") === "true") {
    console.log("welcome");
    toast.success(`Welcome ${sessionStorage.getItem("username")}`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  } else {
    toast.warning(`Welcome Guest Login To Show Products`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  }

  return (
    <>
      <div className={style.hero}>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <div className={style.hero_content}>
          <h2>
            Ecommerce Website for Seamless <br /> Online Shopping
          </h2>
          <p>
            Built with Django and React, this dynamic ecommerce platform
            provides a smooth and engaging user experience.
          </p>
          <Link to="/products" className={style.hero_btn}>
            Shop Now
          </Link>
        </div>
      </div>
      <div className="big bg-light">
        <div
          style={{
            textAlign: "center",
            padding: "20px 0 0 0",
            margin: "0 20px",
          }}
          className={` section-seconde`}
        >
          <h2 className="">Latest Products</h2>
          <LatestProductSection />
        </div>
      </div>
    </>
  );
}
