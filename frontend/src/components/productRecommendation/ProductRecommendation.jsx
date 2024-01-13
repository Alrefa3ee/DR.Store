import React ,{useState,useEffect} from 'react'
import axiosInstance from "../../services/config";
import { useNavigate } from "react-router-dom";
export default function ProductRecommendation() {
    const [products, setProducts] = useState([]);
    const [loadstate, setLoadstate] = useState(null);
    const [search, setSearch] = useState("");

    const Navigate = useNavigate();

    useEffect(() => {
        setLoadstate(false);
        axiosInstance
          .get(`product/recommendations/`, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            console.log("\n\n\n\n", res.data);
            setLoadstate(true);
            setTimeout(() => {

              if(products.length === 0){
                setProducts(res.data.results);
              }
              else{
                setProducts([...products, ...res.data.results]);

              }
            }, 1000);
            console.log(products);
          })
          .catch((err) => {
            if (err.response.status === 401) {
              sessionStorage.setItem("isAuth", "false");
              Navigate("/login");
            }
          });
      }, []);
  return (
    <>
    <div className="container">
    <div className="row">
    {products.map((product, index) => {
        return (
          <div
            key={index}
            className="col-xl-4 col-lg-4 col-md-6 col-sm-6 bg-light"
          >
            <div className="single-new-pro mb-30 text-center bg-light">
              <a
                href={`/products${product.category.get_absolute_url}${product.name}/`}
                className={`bg-light`}
              >
                <img
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  className={`bg-light`}
                  src={product.image}
                  alt=""
                />
              </a>
              <div className="product-caption">
                <h3>
                  <a
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
