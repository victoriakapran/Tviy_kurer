(function () {
  "use strict";

  function el(id){ return document.getElementById(id); }

  function row(label, value){
    const d = document.createElement("div");
    d.className = "break-row";
    d.innerHTML = "<span>" + label + "</span><strong>" + value + "</strong>";
    return d;
  }

  document.addEventListener("DOMContentLoaded", function () {
    const citiesTable = el("citiesTable");
    const typesTable = el("typesTable");

    if (citiesTable) {
      citiesTable.innerHTML = "";
      DELIVERY_DATA.cities.forEach(function (c) {
        citiesTable.appendChild(row(c.name, "× " + Number(c.coeff).toFixed(2)));
      });
    }

    if (typesTable) {
      typesTable.innerHTML = "";
      DELIVERY_DATA.deliveryTypes.forEach(function (t) {
        typesTable.appendChild(row(t.name, "× " + Number(t.coeff).toFixed(2)));
      });
    }
  });
})();