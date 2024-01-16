import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
// import axiosInstance from "../../services/config";
import bg from "../../assets/images/bg.png";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import CategoryIcon from "@mui/icons-material/Category";
import Tooltip from "@mui/material/Tooltip";
import axiosInstance from "../../services/config";
import Typography from "@mui/material/Typography";
import "./Products.css";
import Grid from "@mui/material/Grid";
import { ToastContainer, toast } from "react-toastify";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loadstate, setLoadstate] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [categorys, setCategorys] = useState([]);
  const Navigate = useNavigate();


  useEffect(() => {
        
    if (sessionStorage.getItem("isAuth") !== "true") {
      Navigate("/login");
    }
    if(categorys.length === 0){
      
      axiosInstance.get("/categorys",{ headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },}).then((res) => {
        setCategorys(res.data);
      })
      }
  }, []);
  useEffect(() => {

    axiosInstance
      .get(`/products?page=${page}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log("\n\n\n\n", res.data);
        setTimeout(() => {
          if(products.length === 0){
            setProducts(res.data.results);
          }
          else{
            setProducts([...products, ...res.data.results]);
          }
        }, 1000);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          sessionStorage.setItem("isAuth", "false");
          Navigate("/login");
        }
        else if(err.response.status === 404 && products.next == null){
          setLoadstate(false);
          toast.info("this is all products avaliable", {
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
      });
  }, [page]);

  const handelSearch = () => {
    console.log(search);
    if (search) {
     
    
    axiosInstance
      .post(`search/?q=${search}`, {
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
      });
    }
    else{
      toast.error("Please Enter Product Name", {
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

  const handelImageSrc = (src) => src.replace("/media/", "").replace("%3A", ":");

  return (
    <>        <ToastContainer
    position="top-right"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="colored"
  />
      <div style={{ background: `url(${bg})` }} className={`product_section`}>


        <div className={`titlePro`}>
          <h1>Products</h1>
        </div>
        <div className="search">
          <div className="main-search-input fl-wrap">
            <div className="main-search-input-item">
              <input
                type="text"
                name="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
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
              <ul className="dropdown-menu">{
                categorys.map((category) => (
                  <li key={category.id}>
                    <button
                    onClick={() => {
                      axiosInstance.post(`search/?q=${category.name}`, {
                        headers: {
                          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                        },
                      })
                      .then((res) => {
                        setProducts(res.data);
                        console.log(res.data);
                      })
                    }}
                      
                      className="dropdown-item"
                    >
                      {category.name}
                    </button>
                  </li>
                ))

                  }{
                  <button
                    onClick={() => {
                      axiosInstance
                        .get(`/products?page=${page}`, {
                          headers: {
                            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                          },
                        })
                        .then((res) => {
                          console.log("\n\n\n\n", res.data);
                          setTimeout(() => {
                            setProducts(res.data.results);
                          }, 1000);
                        })
                        .catch((err) => {
                          if (err.response.status === 401) {
                            sessionStorage.setItem("isAuth", "false");
                            Navigate("/login");
                          }
                        });
                    }}
                    className="dropdown-item"
                  >
                    All
                  </button>

               

              }</ul>
            </button>
            <button
              onClick={handelSearch}
              className="main-search-button2  main-search-button"
            >
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
                      <Link
                        to={`/products${product.category.get_absolute_url}${product.name}`}
                      >
                        <img
                          src={handelImageSrc(product.get_image)}
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
                        <CategoryIcon />
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
                          to={`/products${product.category.get_absolute_url}${product.name}`}
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


          {loadstate && (

          <div className="col-12 mt-5 ">
            <div className="d-flex justify-content-center">
              <button
                onClick={() => {
                  setPage(page + 1);
                }}
                className="btn btn-dark"
              >
                Load More
              </button>
            </div>

            </div>
         )}
        </div> 
      </div>
    </>
  );
}
