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

        const { data } = await axiosInstance.post(`/payment/order`, {
          amount: sellingPrice,
        });

        const options = {
          key: import.meta.env.RAZORPAY_KEY_ID,
          amount: data.amount,
          currency: data.currency,
          name: "Books",
          description: `Payment for Book ID: ${bookID}`,
          order_id: data.id,
          handler: async (response) => {
            try {
              console.log("payment verify called");
              const verify = await axios.post(`/payment/verify`, response);
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
