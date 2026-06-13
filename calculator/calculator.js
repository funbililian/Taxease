// ===================================
// ELEMENTS
// ===================================

const profileType = document.getElementById("profileType");
const businessSection = document.getElementById("businessSection");
const batchPayrollBtn = document.getElementById("batchPayrollBtn");
const calculateBtn = document.getElementById("calculateBtn");

let pieChart;
let barChart;

// ===================================
// PROFILE SWITCHING
// ===================================

function toggleProfileSections() {
  businessSection.style.display =
    profileType.value === "Business Owner" ? "block" : "none";
}

toggleProfileSections();
profileType.addEventListener("change", toggleProfileSections);

// ===================================
// NAVIGATION
// ===================================

batchPayrollBtn?.addEventListener("click", () => {
  window.location.href = "../payroll/index.html";
});

// ===================================
// HELPERS
// ===================================

function naira(value) {
  return "₦" + Number(value || 0).toLocaleString();
}

function getInput(id) {
  return Number(document.getElementById(id)?.value || 0);
}

// ===================================
// TAX CALCULATION (FRONTEND ONLY)
// ===================================

function calculateTax() {
  const grossMonthlyIncome = getInput("grossMonthlyIncome");
  const annualRent = getInput("annualRent");

  const nhfMonthly = getInput("nhf");
  const nhisMonthly = getInput("nhis");
  const lifeInsuranceMonthly = getInput("lifeInsurance");
  const mortgageInterestMonthly = getInput("mortgageInterest");

  if (!grossMonthlyIncome) {
    alert("Gross monthly income is required");
    return;
  }

  // =========================
  // SIMPLE TAX MODEL (LOCAL LOGIC)
  // =========================

  const annualIncome = grossMonthlyIncome * 12;

  const pension = annualIncome * 0.08; // 8%
  const nhf = nhfMonthly * 12;
  const nhis = nhisMonthly * 12;
  const lifeInsurance = lifeInsuranceMonthly * 12;
  const mortgageInterest = mortgageInterestMonthly * 12;

  const rentRelief = annualRent * 0.2; // simple assumption

  const deductions =
    pension + nhf + nhis + lifeInsurance + mortgageInterest + rentRelief;

  const taxableIncome = Math.max(0, annualIncome - deductions);

  const paye = taxableIncome * 0.1; // simple flat model (replace with real tax bands if needed)

  const netIncome = annualIncome - paye - deductions;

  const result = {
    annualIncome,
    annualPAYE: paye,
    annualPension: pension,
    annualRentRelief: rentRelief,
    annualNHF: nhf,
    annualNHIS: nhis,
    annualLifeInsurance: lifeInsurance,
    annualMortgageInterest: mortgageInterest,
    annualNet: netIncome
  };

  renderResults(result);
}

// ===================================
// EVENT LISTENER
// ===================================

calculateBtn?.addEventListener("click", calculateTax);

// ===================================
// RENDER RESULTS
// ===================================

function renderResults(result) {
  const {
    annualIncome,
    annualPAYE,
    annualPension,
    annualRentRelief,
    annualNHF,
    annualNHIS,
    annualLifeInsurance,
    annualMortgageInterest,
    annualNet
  } = result;

  const annualDeductions =
    annualPension +
    annualNHF +
    annualNHIS +
    annualLifeInsurance +
    annualMortgageInterest +
    annualRentRelief;

  // MONTHLY
  document.getElementById("grossMonthlyIncome").textContent = naira(
    annualIncome / 12
  );

  document.getElementById("monthlyPension").textContent = naira(
    annualPension / 12
  );

  document.getElementById("monthlyRentRelief").textContent = naira(
    annualRentRelief / 12
  );

  document.getElementById("monthlyPAYE").textContent = naira(
    annualPAYE / 12
  );

  document.getElementById("monthlyNet").textContent = naira(
    annualNet / 12
  );

  // ANNUAL
  document.getElementById("annualGross").textContent = naira(annualIncome);
  document.getElementById("annualPension").textContent = naira(annualPension);
  document.getElementById("annualRentRelief").textContent = naira(annualRentRelief);
  document.getElementById("annualPAYE").textContent = naira(annualPAYE);
  document.getElementById("annualNet").textContent = naira(annualNet);

  // BREAKDOWN
  document.getElementById("grossBreakdown").textContent = naira(annualIncome);
  document.getElementById("pensionBreakdown").textContent = naira(annualPension);
  document.getElementById("nhfBreakdown").textContent = naira(annualNHF);
  document.getElementById("rentReliefBreakdown").textContent = naira(annualRentRelief);
  document.getElementById("taxBreakdown").textContent = naira(annualPAYE);
  document.getElementById("netBreakdown").textContent = naira(annualNet);

  updateCharts({
    annualIncome,
    annualPAYE,
    annualPension,
    annualRentRelief,
    annualDeductions,
    annualNet
  });

  // SAVE LOCALLY ONLY
  localStorage.setItem(
    "taxeaseUser",
    JSON.stringify({
      profileType: profileType.value,
      annualIncome,
      annualPAYE,
      annualNet
    })
  );
}

// ===================================
// CHARTS
// ===================================

function updateCharts(data) {
  if (pieChart) pieChart.destroy();
  if (barChart) barChart.destroy();

  pieChart = new Chart(document.getElementById("taxPieChart"), {
    type: "pie",
    data: {
      labels: ["PAYE", "Pension", "Rent Relief", "Net Income"],
      datasets: [
        {
          data: [
            data.annualPAYE,
            data.annualPension,
            data.annualRentRelief,
            data.annualNet
          ]
        }
      ]
    }
  });

  barChart = new Chart(document.getElementById("incomeBarChart"), {
    type: "bar",
    data: {
      labels: ["Income", "Rent Relief", "PAYE", "Deductions", "Net"],
      datasets: [
        {
          label: "Annual Amount (₦)",
          data: [
            data.annualIncome,
            data.annualRentRelief,
            data.annualPAYE,
            data.annualDeductions,
            data.annualNet
          ]
        }
      ]
    }
  });
}
