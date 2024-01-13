import { useEffect, useState } from "react";
import style from "./product.module.css";
import bg from "../../assets/images/bg.png";
import { useShoppingCart } from "../../context/cart/CartContext";
import axiosInstance from "../../services/config";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";
function Product() {
  const [rating, setRating] = useState(0);

  const [productData, setProductData] = useState([]);
  const { category, product } = useParams();
  const { increaseCartQuantity } = useShoppingCart();

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

  useEffect(() => {
    if (rating !== 0 && rating !== null) {
      console.log(rating);
    }
    
  }, [rating]);

  return (
    <>
      {" "}
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
          <h4 className="d-flex flex-column justify-content-center">
            <button onClick={addToCart} className="btn btn-danger ">
              Add To Cart {productData.price} $
            </button>
            <Box className="mt-5 h3"
              sx={{
                '& > legend': { mt: 2 },
              }}>
            
            <Rating
              name="simple-controlled"
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
            />
            </Box>
          </h4>

        </div>
      </div>
    </>
  );
}

export default Product;
