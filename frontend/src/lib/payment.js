import { axiosInstance } from "./axios.js";

  export const checkout = {
    handlePayment: async (bookID, sellingPrice, username, email, phone, onSuccess) => {
      try {
        const loadRazorpay = () => {
          return new Promise((resolve) => {
            if (window.Razorpay) {
              resolve(window.Razorpay);
            } else {
              const script = document.createElement("script");
              script.src = "https://checkout.razorpay.com/v1/checkout.js";
              script.onload = () => resolve(window.Razorpay);
              script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
              document.body.appendChild(script);
            }
          });
        };

        const Razorpay = await loadRazorpay();
        if (!Razorpay) {
          throw new Error("Failed to load Razorpay SDK");
        }

        console.log("creating order");
        const { data } = await axiosInstance.post(`/payment/order`, {
          amount: sellingPrice,
        });
        console.log("order created: ", data);

        const options = {
          // key: import.meta.env.RAZORPAY_KEY_ID,
          key: "rzp_test_iBxQQF9d1tG1ek",
          amount: data.amount,
          currency: data.currency,
          name: "Books",
          description: `Payment for Book ID: ${bookID}`,
          order_id: data.id,
          handler: async (response) => {
            try {
              console.log("payment verify called");
              const verify = await axiosInstance.post(`/payment/verify`, response);
              console.log(verify.data);
              console.log("Verification API response:", verify.data);
              if (verify.data.success) {
                console.log("payment verify success");
                try {
                  await onSuccess();
                } catch (error) {
                  console.error("Error in onSuccess():", error);
                }
              }
            } catch (error) {
              alert("Payment verification failed!");
            }
          },
          prefill: {
            name: username,
            email: email,
            contact: phone,
          },
          theme: { color: "#3399cc" },
        };

        const paymentObject = new Razorpay(options);
        paymentObject.open();
      } catch (error) {
        console.error("Payment Error:", error);
      }
    },
  };
