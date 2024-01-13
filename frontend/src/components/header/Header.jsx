import { NavLink } from "react-router-dom";
import {toast , ToastContainer} from "react-toastify";
import { Link } from "react-router-dom";
import "./Header.css";
import logo from "../../assets/images/logo-sm.svg";
import { useShoppingCart } from "../../context/cart/CartContext";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdb-react-ui-kit";
import { useState, useEffect } from "react";
import checkout from "./Checkout";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../services/config";
import Badge from "@mui/material/Badge";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
export default function Header() {
  const [productsDetails, setProductsDetails] = useState([]);
  const location = useLocation();
  const [isAuth, setIsAuth] = useState(false);
  const Navigate = useNavigate();
  const [show, setShow] = useState(false);
  const {
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
    isOpen,
    openCart,
    closeCart,
    cartQuantity,
    cartItems,
  } = useShoppingCart();



  useEffect(() => {
    if(localStorage.getItem("shopping-cart")===JSON.stringify([])){
      setProductsDetails([]);
    }
    console.log(location.pathname);
    if (
      sessionStorage.getItem("isAuth") !== "true" &&
      location.pathname !== "/"
    ) {
      Navigate("/login");
    } else {
      setIsAuth(true);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      const token = sessionStorage.getItem("token");
      setProductsDetails([]);
      cartItems.map((item) => {
        axiosInstance
          .get(`product/getById/${item.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            console.log("------------------", res.data);
            setProductsDetails((productsDetails) => [
              ...productsDetails,
              res.data,
            ]);
          })
          .catch((err) => {
            console.log(err);
            sessionStorage.setItem("isAuth","false");
            Navigate("/login");
          });
      });
      setShow(true);
    } else {
      setShow(false);
    }
  }, [isOpen]);


  function handelOrder(){
    setShow(false);
    
    const data = checkout();
    if(data.length===0){
      return toast.error("Cart is Empty", {
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
    else{
      toast.success("Order Placed", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true, 
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
    }
    console.log(data);
    setProductsDetails([]);
    setTimeout(() => {
    window.location.reload(false);
    } , 2000);


  }


  return (
    <>
      <nav
        style={{ position: "sticky", top: "0", zIndex: "1000" }}
        className="navbar navbar-expand-md bg-light py-3 nav_font"
        data-bs-theme="light"
      >
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to={"/"}>
            <span className="title">
              <span>
                <img className="d-inline-block align-top" src={logo} />
              </span>
            </span>
          </Link>
          <button
            data-bs-toggle="collapse"
            className="navbar-toggler"
            data-bs-target="#navcol-6"
          >
            <span className="visually-hidden">Toggle navigation</span>
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse flex-grow-0 order-md-first"
            id="navcol-6"
          >
            <ul className="navbar-nav nav_active me-auto">
              <li className="nav-item">
                <NavLink className="nav-link" to={"/"}>
                  HOME
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to={"/products"}>
                  Products
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to={"/about"}>
                  About
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to={"/contact"}>
                  Contact
                </NavLink>
              </li>
              <li className="d-sm nav-item">
                <Link
                  className={`nav-link`}
                  role="button"
                  to={isAuth ? "/logout" : "/login"}
                >
                  {isAuth ? "Logout" : "Login"}
                </Link>
              </li>
              <li className="nav-item d-sm">
                {isAuth && (
                  <Link className="nav-link" role="button" to={"/profile"}>
                    Profile <i className="bx bx-user"></i>
                  </Link>
                )}
              </li>
            </ul>
          </div>
          
            <button
              onClick={() => openCart()}
              className="btn btn-light me-2 d-fexed"
              role="button">

             <Badge color="primary" badgeContent={cartItems.length}>
                 <ShoppingCartOutlinedIcon />{" "}
             </Badge>

            </button>
          <div className="d-none d-md-block">

            {!isAuth && (
              <a className="btn btn-light me-2" role="button" href="#">
                SignUp
              </a>
            )}
            <Link
              className={`btn btn-${isAuth ? "danger" : "primary"}`}
              role="button"
              to={isAuth ? "/logout" : "/login"}
            >
              {isAuth ? "Logout" : "Login"}
            </Link>

            {isAuth && (
              <Link className="btn btn-dark ms-2" role="button" to={"/profile"}>
                Profile <i className="bx bx-user"></i>
              </Link>
            )}
          </div>
        </div>
        <Modal
          show={show}
          onHide={() => setShow(isOpen)}
          className=" modal-lg"
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header>
            <Modal.Title id="example-custom-modal-styling-title">
              Custom Modal Styling
            </Modal.Title>
          </Modal.Header>
          <Modal.Body
            style={{
              textAlign: "center",
            }}
          >
            <MDBTable striped className="text-center">
              <MDBTableHead>
                <tr>
                  <th scope="col">id</th>
                  <th scope="col">product</th>
                  <th scope="col">price</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Actions</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {productsDetails.map((item, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{item.name}</td>
                    <td>{item.price}</td>
                    <td>{getItemQuantity(item.id)}</td>
                    <td>
                      <button onClick={()=>increaseCartQuantity(item.id)} className="btn btn-success">
                      <i className='bx bx-plus' ></i>
                      </button>
                      <button onClick={()=>decreaseCartQuantity(item.id)} className="btn btn-warning ms-2 me-2">
                      <i className='bx bx-minus' ></i>
                      </button>
                      <button onClick={()=>removeFromCart(item.id)} className="btn btn-danger">
                        <i className="bx bxs-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </MDBTableBody>
            </MDBTable>
            <Button
              className="btn btn-danger pe-3 ps-3 text-end"
              onClick={() => closeCart()}
              type="button"
            >
              Close
            </Button>
            <Button
              className="btn  ms-4 "
              onClick={handelOrder}
              type="button"
            >
              Order

            </Button>

            
          </Modal.Body>
        </Modal>
      </nav>
    </>
  );
}
