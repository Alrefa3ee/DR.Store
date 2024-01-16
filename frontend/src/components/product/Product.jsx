import { useEffect, useState } from "react";
import style from "./product.module.css";
import bg from "../../assets/images/bg.png";
import { useShoppingCart } from "../../context/cart/CartContext";
import axiosInstance from "../../services/config";
import Button from "react-bootstrap/Button";
import TextField from "@mui/material/TextField";
import Modal from "react-bootstrap/Modal";
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import * as React from "react";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { isString } from "formik";
function Product() {
  const [rating, setRating] = useState(2);
  const [imgSrc, setImgSrc] = useState("");
  const [description, setDescription] = useState("");
  const [productData, setProductData] = useState({});
  const { category, product } = useParams();
  const { increaseCartQuantity } = useShoppingCart();
  const [resentReviews, setResentReviews] = useState([]);
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    axiosInstance
      .get(`/products/${category}/${product}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setImgSrc(res.data.get_image);
        setProductData(res.data);
        console.log(productData);
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


  const handelRating = () => {
    axiosInstance.post(`product/${productData.id}/rating/`,{
      rating:rating,
      description:description
    }, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }).then((res) => {
      console.log(res.data);
      toast.success("Rating Added Successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }).catch((err) => {
      if(err.response.status === 500){

        toast.error("You already rated this product", {
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
   
  
  }

  useEffect(() => {
    axiosInstance.get(`product/${productData.id}/rating/`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }).then((res) => {
      console.log(res.data);
      setResentReviews(res.data);
    }).catch((err) => {
      console.log(err);
    });
  }, [productData.id]);

  function handelImageSrc(src) {
    return src.replace("/media/", "").replace("%3A", ":");
    
  }
  
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
      <div className={`mb-6 ${style.productContainer}`}>
        <div className={style.title}>
          <div
            className={`titlePro ${style.Pro}`}
            style={{ background: `url(${bg})` }}
          >
            <h1>Product</h1>
          </div>
        </div>
        <div className={`container mb-5 ${style.image_container}`}>
          <img src={handelImageSrc(imgSrc)} className={style.image} alt="" />
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
            <button onClick={handelRating} className="btn btn-dark ms-5 mb-1 h3" type="submit"><i className='bx bx-send' ></i></button>
              <br />

                  <TextField
                  id="outlined-multiline-flexible"
                  label="Multiline"
                  multiline
                  maxRows={4}
                  className="mt-2"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                  style={{width:"40%",height:"50%"}}

                  placeholder="Add your comment"
                />     
               </Box>
          </h4>




        </div>
      </div>
      <div className="container">
            <h2>Recent Reviwes </h2>
            <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            {
              resentReviews.map((review,index) => {
                return (
                  <Tab key={index} label={review.rating} value={`${index+1}`} />
                )
              })
            }
          </TabList>
        </Box>
        {
          resentReviews.map((review,index) => {
            return (
             
              <div key={index} >
               
              <TabPanel value={`${index+1}`}>{review.description} <br /><Rating name="read-only" value={review.rating} readOnly /></TabPanel>
              </div>
            )
          })
        }
      </TabContext>
    </Box>
          </div>
    </>
  );
}

export default Product;
