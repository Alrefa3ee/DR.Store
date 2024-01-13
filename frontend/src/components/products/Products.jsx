import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
// import axiosInstance from "../../services/config";
import bg from "../../assets/images/bg.png";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import CategoryIcon from "@mui/icons-material/Category";
import Tooltip from "@mui/material/Tooltip";
import axiosInstance from "../../services/config";
import "./Products.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const Navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("isAuth") !== "true") {
      Navigate("/login");
    }
    axiosInstance
      .get("/products", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setProducts(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
        sessionStorage.setItem("isAuth", "false");
        Navigate("/login");
      });
  }, []);

  function handelSearch(e) {
    const search = e.target.value;
  }

  return (
    <>
      <div style={{ background: `url(${bg})` }} className={`product_section`}>
        <div className={`titlePro`}>
          <h1>Products</h1>
        </div>
        <div className="search">
          <div className="main-search-input fl-wrap">
            <div className="main-search-input-item">
              <input
                type="text"
                onChange={handelSearch}
                placeholder="Search Products..."
              />
            </div>

            <button className="dropdown  main-search-button1 main-search-button">
              <button
                className="btn  categoryBtn"
                type="button"
                data-bs-toggle="dropdown"
              >
                Category
              </button>
              <ul className="dropdown-menu">
                {
                 
                }

                
              </ul>
            </button>
            <button className="main-search-button2  main-search-button">
              Search <i style={{ transform: "" }} className="bx bx-search"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          {products.map((product) => (
            <div key={product.id} className="col-lg-4 col-md-6 col-sm-12">
              <div className="card">
                <div className="card-body">
                  <div className="card-img-actions">
                    <div
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      className="card-img img-fluid"
                    >
                      <Link to={`/products${product.get_absolute_url}`}>
                        <img
                          src={product.get_thumbnail}
                          className="card-img img-fluid"
                          width="96"
                          height="350"
                          alt=""
                        />
                      </Link>
                    </div>
                  </div>
                  <h5 className="card-title mt-3">
                    {product.name}{" "}
                    <Tooltip className="mb-1 " title={product.category.name}>
                      <IconButton>
                        <CategoryIcon  />
                      </IconButton>
                    </Tooltip>
                    
                  </h5>
                  <p className="card-text text-center">{product.description}</p>
                  <div className="card-footer">
                    <div className="row mt-2">
                      <div className="col">
                        <p className="btn btn-danger btn-block">
                          {product.price}$
                        </p>
                      </div>
                      <div className="col">
                        <Link
                          to={`/products${product.get_absolute_url}`}
                          className="btn btn-success btn-block"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
