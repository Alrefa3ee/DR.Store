import { Link } from "react-router-dom"
import logo from "../../assets/images/logo-sm.svg"
export default function Footer() {
  return (
    <footer className="bg-light">
      <div className="footer-area footer-padding">
        <div className="container">
          <div className="row d-flex justify-content-between">
            <div className="col-xl-3 col-lg-3 col-md-5 col-sm-6">
              <div className="single-footer-caption mb-50">
                <div className="single-footer-caption mb-30">
                  <div className="footer-logo">
                    <a href="index.html">
                      <img id="img" src={logo} alt="" />
                    </a>
                  </div>
                  <div className="footer-tittle">
                    <div className="footer-pera">
                      <p>
                        Asorem ipsum adipolor sdit amet, consectetur adipisicing
                        elitcf sed do eiusmod tem.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-2 col-lg-3 col-md-3 col-sm-5">
              <div className="single-footer-caption mb-50">
                <div className="footer-tittle">
                  <h4>Quick Links</h4>
                  <ul>
                    <li>
                      <a href="#">About</a>
                    </li>
                    <li>
                      <a href="#"> Offers &amp; Discounts</a>
                    </li>
                    <li>
                      <a href="#"> Get Coupon</a>
                    </li>
                    <li>
                      <a href="#"> Contact Us</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-4 col-sm-7">
              <div className="single-footer-caption mb-50">
                <div className="footer-tittle">
                  <h4>New Products</h4>
                  <ul>
                    <li>
                      <a href="#">Woman Cloth</a>
                    </li>
                    <li>
                      <a href="#">Fashion Accessories</a>
                    </li>
                    <li>
                      <a href="#"> Man Accessories</a>
                    </li>
                    <li>
                      <a href="#"> Rubber made Toys</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-5 col-sm-7">
              <div className="single-footer-caption mb-50">
                <div className="footer-tittle">
                  <h4>Support</h4>
                  <ul>
                    <li>
                      <a href="#">Frequently Asked Questions</a>
                    </li>
                    <li>
                      <a href="#">Terms &amp; Conditions</a>
                    </li>
                    <li>
                      <a href="#">Privacy Policy</a>
                    </li>
                    <li>
                      <a href="#">Report a Payment Issue</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="row align-items-center">
            <div className="col-xl-7 col-lg-8 col-md-7">
              <div className="footer-copy-right">
                <p>
                  Copyright © 2024 All rights reserved | This Site is made with{" "}
                  <i className="bx bx-heart" aria-hidden="true"></i> by{" "}
                  <a href="https://alrefa3ee.studio">Alrefa3ee</a>
                </p>
              </div>
            </div>
            <div className="col-xl-5 col-lg-4 col-md-5">
              <div className="footer-copy-right f-right">
                <div className="footer-social">
                  <a href="#">
                    <i className="bx bxl-twitter"></i>
                  </a>
                  <a href="#">
                    <i className="bx bxl-facebook"></i>
                  </a>
                  <a href="#">
                    <i className="bx bxl-behance"></i>
                  </a>
                  <a href="#">
                    <i className="bx bx-globe"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
