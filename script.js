document.getElementById("send-otp").addEventListener("click", async () => {
  const phoneNumber = document.getElementById("phone-number").value;
  if (!phoneNumber) {
    document.getElementById("message").innerText =
      "Please enter a phone number";
    return;
  }
  try {
    const response = await fetch("/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phoneNumber }),
    });
    const result = await response.json();
    if (result.success) {
      document.getElementById("otp-group").style.display = "block";
      document.getElementById("send-otp").style.display = "none";
      document.getElementById("verify-otp").style.display = "block";
      document.getElementById("resend-otp").style.display = "block";
      document.getElementById("message").innerText = "";
    } else {
      document.getElementById("message").innerText = result.message;
    }
  } catch (error) {
    document.getElementById("message").innerText = error.message;
  }
});

document.getElementById("verify-otp").addEventListener("click", async () => {
  const otp = document.getElementById("otp").value;
  if (!otp) {
    document.getElementById("message").innerText = "Please enter the OTP";
    return;
  }
  try {
    const response = await fetch("/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ otp }),
    });
    const result = await response.json();
    if (result.success) {
      localStorage.setItem("user", JSON.stringify(result.user));
      window.location.href = "user-info.html"; // Redirect to the next page
    } else {
      document.getElementById("message").innerText = result.message;
    }
  } catch (error) {
    document.getElementById("message").innerText = error.message;
  }
});

document.getElementById("resend-otp").addEventListener("click", async () => {
  try {
    const response = await fetch("/resend-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    if (result.success) {
      document.getElementById("message").innerText = "OTP resent successfully";
    } else {
      document.getElementById("message").innerText = result.message;
    }
  } catch (error) {
    document.getElementById("message").innerText = error.message;
  }
});
