import React from "react";
import { Box, Stack } from "@chakra-ui/react";
import Card from "./Card";
import axios from "axios";
const Home = () => {
  const checkoutHandler = async (amount) => {
    const {
      data: { key },
    } = await axios.get(
      "https://5683-2405-201-301a-e803-718b-2695-847c-2967.ngrok-free.app/api/getkey"
    );
    const {
      data: { order },
    } = await axios.post(
      "https://5683-2405-201-301a-e803-718b-2695-847c-2967.ngrok-free.app/api/checkout",
      { amount }
    );
    const options = {
      key: key, // Enter the Key ID generated from the Dashboard
      amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: "Atharv Agarwal",
      description: "Test Transaction",
      image: "https://avatars.githubusercontent.com/u/89630019?v=4",
      order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      prefill: {
        name: "Gaurav Kumar",
        email: "gaurav.kumar@example.com",
        contact: "9000090000",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
      handler: function (response) {
        console.log(response.razorpay_payment_id);
        if (response.razorpay_payment_id) {
          window.location.href = `/paymentSuccess?reference=${response.razorpay_payment_id}`;
        } else {
          alert("payment is not successful");
        }

        // You can redirect to a success page or perform other actions here
        // Example: window.location.href = '/success-page';
      },
    };
    var rzp1 = new window.Razorpay(options);
    rzp1.open();
  };
  return (
    <Box>
      <Stack direction={["column", "row"]}>
        <Card
          amount={5000}
          img={
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQKtq_SXWnk2DWWYXAPygIvQuS-frwKaknc3d2RHb1umEa3fJF&s"
          }
          checkoutHandler={checkoutHandler}
        ></Card>
        <Card
          amount={2000}
          img={
            "https://idestiny.in/wp-content/uploads/2022/09/iPhone_14_Pro_Deep_Purple_PDP_Image_Position-1a_Avail__en-IN.jpg"
          }
          checkoutHandler={checkoutHandler}
        ></Card>
      </Stack>
    </Box>
  );
};

export default Home;