import { useEffect, useState } from "react";
import style from "./product.module.css";
import bg from "../../assets/images/bg.png";
import { useShoppingCart } from "../../context/cart/CartContext";
import axiosInstance from "../../services/config";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";
function Product() {
  const [productData, setProductData] = useState([]);
  const { category, product } = useParams();
  const {increaseCartQuantity,} = useShoppingCart();

  useEffect(() => {
    axiosInstance
      .get(`/products/${category}/${product}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setProductData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function addToCart() {
    increaseCartQuantity(productData.id);
    toast.success("Item Added to Cart", {
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
      <div className={style.productContainer}>

        <div className={style.title}>

          <div
            className={`titlePro ${style.Pro}`}
            style={{ background: `url(${bg})` }}
          >
            <h1>Product</h1>
          </div>
        </div>
        <div className={`container ${style.image_container}`}>
          <img src={productData.get_image} className={style.image} alt="" />
        </div>
        <div className={`container ${style.productDetails}`}>
          <h2>{productData.name}</h2>
          <h3>{productData.description}</h3>
          <h4>
            <button onClick={addToCart} className="btn btn-danger ">
              Add To Cart {productData.price} $
            </button>

          </h4>
        </div>
      </div>

    </>
  );
}

export default Product;
