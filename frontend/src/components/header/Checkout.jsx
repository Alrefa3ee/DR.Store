import axiosInstance from "../../services/config";
import { toast } from "react-toastify";
export default function checkout() {
  const cart = JSON.parse(localStorage.getItem("shopping-cart")); // cart is an array of objects [{id: 1, quantity: 2}, {id: 2, quantity: 1}]

  console.log("________________________________\n\n\n");

  console.log("\n\n\n________________________________");

  const user = sessionStorage.getItem("username");
  if (cart.length === 0) {
    return toast.error("Cart is empty", {
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

  const token = sessionStorage.getItem("token");
  const id = sessionStorage.getItem("_id");
  if (!token || !id) {
    return toast.error("Login first", {
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

  const data = {
    ordered_products: cart.map((item) => ({
      product: item.id, // Ensure item.id is the actual product ID (a plain value)
      quantity: item.quantity,
    })),
    user: id,
  };

  axiosInstance
    .post("order/", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      console.log(res.data);
      localStorage.setItem("shopping-cart", JSON.stringify([]));
      toast.success(`we will contact with you ${user}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return res.data;
    })
    .catch((err) => {
      toast.error("Something went wrong", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return err;
    });

  return data;
}
