function calculate() {
  var bill = document.getElementById("bill").value;
  if (bill==="" || isNaN(bill) || bill <= 0) {
    alert("Please put in number for bill");
  }
  var guests = document.getElementById("guests").value;
  if (guests === "" || isNaN(guests) || guests <= 0) {
    alert("Please put in number of guests");
  }
  var percent = document.getElementById("percent").value/100;
  if (percent === "" || isNaN(percent) || percent <= 0) {
    alert("Please put in percent you would like to tip");
  }
  else {
  let tip = bill*percent;
  document.getElementById("printTip").innerHTML = "$" + tip.toFixed(2);
  
  let tipPerGuest = tip/guests;
  document.getElementById("printPerPerson").innerHTML = "$" + tipPerGuest.toFixed(2);
   let totalBill = parseFloat(bill) + parseFloat(tip);
    document.getElementById("total").innerHTML = "$" + totalBill.toFixed(2);
  }
}