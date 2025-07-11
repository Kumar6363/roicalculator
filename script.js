// ----------  fee helpers ----------
function spaLegal(price){
  /* crude tier: 0–500k = 1%, next 500k = 0.8%, >1M =0.5%  */
  let fee=0;
  const tiers=[[500000,0.01],[500000,0.008],[Infinity,0.005]];
  let remaining=price;
  for(const [cap,rate] of tiers){
    const slice=Math.min(remaining,cap);
    fee+=slice*rate;
    remaining-=slice;
    if(!remaining) break;
  }
  return fee;
}
function loanLegal(loan){ return loan*0.012; }          // ~1.2 %
function motDuty(price,waived){ return waived?0:price*0.01; } // 1 % if not 1st Home

// ----------  main calc ----------
document.getElementById("btnCalc").addEventListener("click",()=>{
  const price=+document.getElementById("price").value;
  const rate=+document.getElementById("rate").value/100/12; // monthly rate
  const years=+document.getElementById("years").value;
  const firstHome=document.getElementById("firstHome").checked;
  const includeLegal=document.getElementById("fullLoan").checked;

  if(!price||!rate||!years){alert("Please fill all values");return;}

  // preliminary legal fees (based on house price for SPA & MOT, later on loan for loanLegal)
  const spa=spaLegal(price);
  const mot=motDuty(price,firstHome);
  let provisionalLoan=price;
  if(includeLegal) provisionalLoan+=spa+mot; // add upfront fees into loan

  const loanLegalFee=loanLegal(provisionalLoan);
  if(includeLegal) provisionalLoan+=loanLegalFee; // full‑loan means add this too

  // final monthly repayment
  const n=years*12;
  const monthly = (provisionalLoan*rate)/(1-Math.pow(1+rate,-n));

  // total cash needed if NOT full‑loan
  const totalCash = includeLegal ? 0 : (spa+mot+loanLegalFee);

  // ----------  output ----------
  const fmt=v=>`RM ${v.toLocaleString('en-MY',{minimumFractionDigits:2})}`;
  document.getElementById("loanAmt").textContent     = fmt(provisionalLoan);
  document.getElementById("monthly").textContent     = fmt(monthly);
  document.getElementById("spaFee").textContent      = fmt(spa);
  document.getElementById("motFee").textContent      = fmt(mot);
  document.getElementById("loanFee").textContent     = fmt(loanLegalFee);
  document.getElementById("totalCash").textContent   = includeLegal ? "– Full Loan –" : fmt(totalCash);

  document.getElementById("result").hidden=false;
});
