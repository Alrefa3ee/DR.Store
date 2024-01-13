import React from "react";
import style from "../latest/LatestProduct.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../../services/config";

export default function LatestProductSection() {
  const [latesetProducts, setLatesetProducts] = useState([]);
  const Navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/latest-products", {
        // headers: {
        //   Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        // },
      })
      .then((res) => {
        setLatesetProducts(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        Navigate("/login");
      });
  }, []);

  function timeSince(date) {
    const now = new Date().getTime();
    const data = new Date(date).getTime();
    const diff = now - data;
    const seconds = diff / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;

    if (hours < 24) {
      return Math.floor(hours) + " hours";
    } else if (hours > 24) {
      return Math.floor(hours / 24) + " days";
    }
  }

  return (
    <>
      <div className={`container bg-light ${style.cont}`}>
        <div className="row">
          {latesetProducts.map((product, index) => {
            return (
              <div
                key={index}
                className="col-xl-4 col-lg-4 col-md-6 col-sm-6 bg-light"
              >
                <div className="single-new-pro mb-30 text-center bg-light">
                  <Link
                    to={`/products${product.get_absolute_url}`}
                    className={`bg-light ${style.product_img}`}
                  >
                    <img
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      className={`bg-light`}
                      src={product.get_thumbnail}
                      alt="product"
                    />
                  </Link>

                  <div className={style.product_caption}>
                    <h3 className={style.product_caption_text}>
                      <Link
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                        className={style.link_product}
                        to={`/products${product.get_absolute_url}`}
                      >
                        {product.name}
                      </Link>
                    </h3>
                    <span>{product.price}</span>
                  </div>
                  <div className="card-footer">
                    <small className="text-body-secondary">
                      Adedd from {timeSince(product.date_added)}{" "}
                    </small>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
