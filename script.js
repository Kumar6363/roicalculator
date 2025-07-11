function fmt(num) {
  return 'RM ' + num.toLocaleString('en-MY', { minimumFractionDigits: 2 });
}

function calcROI() {
  const price = parseFloat(document.getElementById('price').value) || 0;
  const rent = parseFloat(document.getElementById('rent').value) || 0;
  const exp = parseFloat(document.getElementById('expenses').value) || 0;
  const cash = parseFloat(document.getElementById('cash').value);
  const rate = parseFloat(document.getElementById('rate').value) / 100 / 12;
  const years = parseInt(document.getElementById('years').value);
  const months = years * 12;

  const warn = document.getElementById('warnMsg');
  const res = document.getElementById('result');

  if (!cash || cash <= 0) {
    warn.style.display = 'block';
    res.style.display = 'none';
    return;
  } else {
    warn.style.display = 'none';
  }

  const annualRent = rent * 12;
  const annualExp = exp * 12;

  // Calculate loan repayment
  const loanAmount = price * 0.9;
  const monthlyLoan = loanAmount * rate * Math.pow(1 + rate, months) / (Math.pow(1 + rate, months) - 1);
  const annualLoan = monthlyLoan * 12;

  // Net annual income INCLUDING loan repayments
  const netIncome = annualRent - annualExp - annualLoan;

  const roiPct = (netIncome / cash) * 100;

  // Display
  document.getElementById('annualRent').textContent = fmt(annualRent);
  document.getElementById('annualExp').textContent = fmt(annualExp);
  document.getElementById('netIncome').textContent = fmt(netIncome);
  document.getElementById('roi').textContent = roiPct.toFixed(2) + '%';
  document.getElementById('monthlyLoan').textContent = fmt(monthlyLoan);

  res.style.display = 'block';
}
