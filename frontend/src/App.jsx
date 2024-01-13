import { useState, useEffect } from "react";
import Home from "./components/home/Home";
import {
  BrowserRouter as Router,
  Routes,
  Route,

} from "react-router-dom";
import Header from "./components/header/Header";
import NotFound from "./components/notFound/NotFound";
import MainFooter from "./components/footer/MainFooter";
import Product from "./components/product/Product";
import Products from "./components/products/Products";
import ShopMethod from "./components/footer/ShopMethod";
import Register from "./components/signup/SignUp";
import Login from "./components/login/Login";
import Logout from "./components/Logout";
import { useNavigate } from "react-router-dom";
import Profile from "./components/profile/Profile";
import ShoppingCartProvider  from "./context/cart/CartContext";
import ProductRecommendation from "./components/productRecommendation/ProductRecommendation";
function StaticSection(porps) {
  const navigate = useNavigate();
  const [isLoding, setIsLoding] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem("isAuth") === "true") {
        setIsLoding(false);
      
    }
    else {
      setIsLoding(false);
      navigate("/login");
    }
  }

  , []);

  return (
    <>
      {isLoding ? <div className="container"><h1>Loading...</h1></div> :  
      <>
      <Header />
      {porps.element}
      <MainFooter />
      </>
      }
    </>
  ) 
}


function App() {


  return (
    <Router>
        <ShoppingCartProvider>

            <Routes>

            <Route path="/" element={
                <>
                    <Header />
                    <Home />
                    <ShopMethod />
                    <MainFooter />

                </>
                } />
            <Route path="/products" element={
                <>
                    <StaticSection element={<><Products /><ShopMethod/></>} />
                </>
            }  />
            <Route path="/products/:category/:product" element={
                <>
                    <Header />
                    <Product />
                    <MainFooter />
                </>
            } />
         
            <Route path="/profile" element={<StaticSection element={<Profile />}/>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/ProductRecommendation" element={<ProductRecommendation />} /> */}
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
        </ShoppingCartProvider>

    </Router>
  );
}

export default App;
