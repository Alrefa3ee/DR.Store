import React ,{useState,useEffect} from 'react'
import axiosInstance from "../../services/config";
import style from "./ProductRecommendation.module.css";
import { useNavigate } from "react-router-dom";
export default function ProductRecommendation() {
    const [products, setProducts] = useState([]);
    const [loadstate, setLoadstate] = useState(null);
    const [search, setSearch] = useState("");

    const Navigate = useNavigate();

    useEffect(() => {
        setLoadstate(false);
        axiosInstance
          .get(`product/recommend/`, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            console.log("\n\n\n\n", res.data , "\n\n\n\n");
            
            setTimeout(() => {
              setProducts(res.data.recommendations);
              setLoadstate(true);
            }, 1000);

          })
          .catch((err) => {
            if (err.response.status === 401) {
              sessionStorage.setItem("isAuth", "false");
              Navigate("/login");
            }
          });
      }, []);



      const FormatImageUrl = (url) => {
        console.log(url);
        let newUrl = url.replace("/media/","");
        newUrl = newUrl.replace("%3A",":");
        return newUrl;
      }
  return (
    <>
    {loadstate === false ? (
        <div className="container">
          <h1>Loading...</h1>
        </div>
      ) : (
        <></>
      )
      }


    <div className="container t">
      <h2 className='text-center pt-3 pb-3 mt-5 mb-5'>
        <span className="text-danger text-center">Recommended</span> Products

      </h2>
    <div className="row">

    {products.map((product, index) => {
        return (
          <div
            key={index}
            className="col-xl-4 col-lg-4 col-md-6 col-sm-6 bg-light p-3"
          >
            <div className="single-new-pro mb-30 text-center bg-light p-2">
              <a
                href={`/products${product.category.get_absolute_url}${product.name}/`}
                className={`bg-light`}
              >
                <img
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  className={`bg-light w-75 h-75 ${style.imgev}`}
                  src={FormatImageUrl(product.get_image)}
                  alt=""
                />
              </a>
              <div className="product-caption">
                <h3 className=' text-center'>
                  <a
                  className='text-decoration-none link-dark fw-60 fs-5 w-50 text-center'
                    href={`/products${product.category.get_absolute_url}${product.name}/`}
                  >
                    {product.name}
                  </a>
                </h3>
                <span>{product.price}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
    </div>
    </>
  )
}
