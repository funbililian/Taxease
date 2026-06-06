let payments = JSON.parse(localStorage.getItem("payments")) || [];

/* -----------------------------
   ADD PAYMENT (simulate or from backend)
------------------------------*/
function addPayment(reference, amount, status) {
  const payment = {
    reference,
    amount,
    status, // "success" or "failed"
    date: new Date().toLocaleString()
  };

  payments.push(payment);
  localStorage.setItem("payments", JSON.stringify(payments));

  renderPayments();
}

/* -----------------------------
   RENDER TABLE
------------------------------*/
function renderPayments(filter = "all") {
  const table = document.getElementById("historyTable");
  table.innerHTML = "";

  let filtered = payments;

  if (filter !== "all") {
    filtered = payments.filter(p => p.status === filter);
  }

  filtered.forEach(p => {
    const row = `
      <tr>
        <td>${p.reference}</td>
        <td>₦${p.amount}</td>
        <td class="${p.status === "success" ? "status-success" : "status-failed"}">
          ${p.status}
        </td>
        <td>${p.date}</td>
      </tr>
    `;

    table.innerHTML += row;
  });
}

/* -----------------------------
   FILTER BUTTONS
------------------------------*/
function filterPayments(type) {
  renderPayments(type);
}

/* -----------------------------
   SIMULATION (for testing only)
   You can REMOVE this later
------------------------------*/
addPayment("NTC-123456", 5000, "success");
addPayment("NTC-789012", 5000, "failed");
addPayment("NTC-555888", 5000, "success");

/* INITIAL LOAD */
renderPayments();