const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const app = express();
const port = 3000;

const clientId = "P9MRFMIQRENCHNTZOY7DBFMC648F5B3O";
const clientSecret = "sv59gqr43y680e62mdeuudr4sub74qn5";
let storedOtp = null;
let orderId = null;
let phoneNumber = null;

app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/send-otp", async (req, res) => {
  phoneNumber = req.body.phoneNumber;
  try {
    const response = await axios.post(
      "https://auth.otpless.app/auth/otp/v1/send",
      {
        phoneNumber,
        otpLength: 6,
        channel: "SMS",
        expiry: 60,
      },
      {
        headers: {
          clientId: clientId,
          clientSecret: clientSecret,
          "Content-Type": "application/json",
        },
      }
    );
    orderId = response.data.orderId; // Store orderId for verification
    storedOtp = response.data.otp; // Store OTP temporarily
    res.json({ success: true });
  } catch (error) {
    console.error(
      "Error sending OTP:",
      error.response ? error.response.data : error.message
    );
    res.status(error.response ? error.response.status : 500).json({
      success: false,
      message: error.response ? error.response.data.message : error.message,
    });
  }
});

app.post("/verify-otp", async (req, res) => {
  const { otp } = req.body;
  try {
    const response = await axios.post(
      "https://auth.otpless.app/auth/otp/v1/verify",
      {
        orderId: orderId,
        otp: otp,
        phoneNumber: phoneNumber, // Include phone number
      },
      {
        headers: {
          clientId: clientId,
          clientSecret: clientSecret,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.isOTPVerified) {
      storedOtp = null; // Clear OTP after successful verification
      orderId = null; // Clear orderId after successful verification
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false, message: response.data.reason });
    }
  } catch (error) {
    console.error(
      "Error verifying OTP:",
      error.response ? error.response.data : error.message
    );
    res.status(error.response ? error.response.status : 500).json({
      success: false,
      message: error.response ? error.response.data.message : error.message,
    });
  }
});

app.post("/resend-otp", async (req, res) => {
  try {
    const response = await axios.post(
      "https://auth.otpless.app/auth/otp/v1/resend",
      {
        orderId: orderId,
        channel: "SMS",
        phoneNumber: phoneNumber, // Include phone number
      },
      {
        headers: {
          clientId: clientId,
          clientSecret: clientSecret,
          "Content-Type": "application/json",
        },
      }
    );
    storedOtp = response.data.otp; // Update OTP
    res.json({ success: true });
  } catch (error) {
    console.error(
      "Error resending OTP:",
      error.response ? error.response.data : error.message
    );
    res.status(error.response ? error.response.status : 500).json({
      success: false,
      message: error.response ? error.response.data.message : error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
