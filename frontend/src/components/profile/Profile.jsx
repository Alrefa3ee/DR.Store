import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../services/config";
import { toast, ToastContainer } from "react-toastify";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBInput,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdb-react-ui-kit";
import { useState } from "react";

export default function Profile() {
  const [editState, setEditState] = useState(false);
  const [orders, setOrders] = useState([]); // [{}]
  const [products, setProducts] = useState([]); // [{}]
  const [user, setUser] = useState({
    full_name: "Abdullah Alrefaee",
    username: "alrefa3ee@gmail.com",
    phone_number: "+962799412757",
    email: "abd516693@gmail.com",
    address: "Bay Area, San Francisco, CA",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("isAuth") !== "true") {
      navigate("/login");
    }
  }, []);

  const handleEdit = () => {
    setEditState(!editState);
    console.log(editState);
    console.log(user);
    if (editState) {
      axiosInstance
        .put("/updateUserInfo/", user, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          console.log(res.data);
          toast.success("User Info Updated Successfully");
        })
        .catch((err) => {
          console.log(err);
          toast.error("Error Updating User Info");
          Navigate("/login");
        });


      console.log(user);
    }
  };

  const handelChange = (e) => {
    if (editState) {
      setUser({ ...user, [e.target.id]: e.target.value });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleEdit();
    }
  };


  function GetAllProducts() {
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
        navigate("/login");
        console.log(err);
      });


  }

  useEffect(() => {
    axiosInstance
      .get("/getUserInfo", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        // add all orders to orders state
        setOrders(res.data.user_orders);
        // add user info to user state
        setUser({
          ...user,
          full_name: res.data.full_name,
          username: res.data.username,
          phone_number: res.data.phone_number,
          email: res.data.email,
          address: res.data.address,
        });
        console.log(res.data.user_orders);
      })
      .catch((err) => {
        navigate("/login");
        console.log(err);
      });

  }, []);

  const getTotalPrice = (id ) => {
    const p = products.find((product) => product.id === id);
    return p.price;
  };

  useEffect(() => {
    GetAllProducts();
  }, [orders]);

  const handelDate = (date) => {
    const d = date.split("T")[0];
    return d;
  };

  function GetProductById(id, products) {
    const p = products.find((product) => product.id === id);
    try {
    return (
      <>
        <a
          className="mt-2 text-dark text-decoration-none"
          href={p.get_absolute_url}
        >
          {p.name} <i className="bx bxs-book-alt"></i>
        </a>{" "}
        <br />
      </>
    )
    }
    catch(err){
      return <></>
    }
  }

  const handelDeleteOrder = (id) => {
    return () => {
      axiosInstance
        .delete(`/DeleteOrder/${id}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          console.log(res.data);
          setOrders(orders.filter((order) => order.id !== id));
          toast.success("Order Deleted Successfully");
        })
        .catch((err) => {
          console.log(err);
          toast.error("Error Deleting Order");
          Navigate("/login");
        });
    };
  };

  return (
    <section style={{ backgroundColor: "#eee" }}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <MDBContainer className="py-5">
        <MDBRow>
          <MDBCol>
            <MDBBreadcrumb className="bg-light rounded-3 h3 p-3 mb-4">
              <MDBBreadcrumbItem active>User Profile</MDBBreadcrumbItem>
            </MDBBreadcrumb>
          </MDBCol>
        </MDBRow>

        <MDBRow>
          <MDBCol lg="4">
            <MDBCard className="mb-4">
              <MDBCardBody className="text-center">
                <MDBCardImage
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                  alt="avatar"
                  className="rounded-circle"
                  style={{ width: "150px" }}
                  fluid
                />

                <div className="d-flex justify-content-center mb-2 mt-5">

                  <MDBBtn
                    className={`btn btn-${editState ? "primary" : "danger"}`}
                    onClick={handleEdit}
                  >
                    {editState ? "Save" : "Edit informations"}
                  </MDBBtn>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol lg="8">
            <MDBCard className="mb-4">
              <MDBCardBody className="">
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Full Name</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBInput
                      onChange={handelChange}
                      className="text-muted"
                      label={user.full_name}
                      id="full_name"
                      type="text"
                      disabled={!editState}
                    />
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>username</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBInput
                      onChange={handelChange}
                      className="text-muted"
                      label={user.username}
                      id="username"
                      type="text"
                      disabled={!editState}
                    />
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Phone</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBInput
                      onKeyPress={(e) => handleKeyPress(e)}
                      onChange={handelChange}
                      className="text-muted"
                      label={user.phone_number}
                      id="phone_number"
                      type="text"
                      disabled={!editState}
                    />
                  </MDBCol>
                </MDBRow>
                <hr />

                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Email</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBInput
                      onChange={handelChange}
                      className="text-muted"
                      label={user.email}
                      id="email"
                      type="text"
                      disabled={!editState}
                    />
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Address</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBInput
                      onChange={handelChange}
                      className="text-muted"
                      label={user.address}
                      id="address"
                      type="text"
                      disabled={!editState}
                    />
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
        <MDBCol lg="12">
          <MDBCard className="mb-4 mb-md-0">
            <MDBCardBody className="d-flex justify-content-center">
              <MDBTable striped className="text-center">
                <MDBTableHead>
                  <tr>
                    <th scope="col">Order Id</th>
                    <th scope="col">Products</th>
                    <th scope="col">Total Price</th>
                    <th scope="col">Status</th>
                    <th scope="col">date ordered</th>
                    <th scope="col">Actions</th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody>
                  {orders.map((order, index) => {
                    return (
                      <tr key={index}>
                        <th scope="row">{order.id}</th>
                        <td>
                        {order.ordered_products.map((product, ind) => {
                            return (
                          
                              <>{GetProductById(product.product, products)}</>
                            
                            );
                          })}
                        </td>
                        <td>
                        {order.ordered_products.map((product, ind) => {
                            return (
                          
                              <>{getTotalPrice(product.product)} <br/> </>
                            
                            );
                          })}
                        </td>
                        <td>{order.status}</td>
                        <td>{handelDate(order.date_ordered)}</td>
                        <td>
                          <button
                            onClick={handelDeleteOrder(order.id)}
                            className="btn btn-danger"
                          >
                            <i className="bx bxs-trash"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </MDBTableBody>
              </MDBTable>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBContainer>
    </section>
  );
}
