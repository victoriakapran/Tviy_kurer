(function () {
  "use strict";

  function toMoney(value) {
    const num = Number(value);
    if (Number.isNaN(num)) return "0.00";
    return num.toFixed(2);
  }

  function getEl(id) {
    return document.getElementById(id);
  }

  function createOption(value, text) {
    const opt = document.createElement("option");
    opt.value = value;
    opt.textContent = text;
    return opt;
  }

  function safeText(text) {
    return String(text || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function renderBreakRow(label, value, currency) {
    const row = document.createElement("div");
    row.className = "break-row";
    row.innerHTML = "<span>" + safeText(label) + "</span><strong>" + safeText(value) + " " + safeText(currency) + "</strong>";
    return row;
  }

  function renderBreakRowPlain(label, value) {
    const row = document.createElement("div");
    row.className = "break-row";
    row.innerHTML = "<span>" + safeText(label) + "</span><strong>" + safeText(value) + "</strong>";
    return row;
  }

  function initCalculator(prefill) {
    const form = getEl("deliveryForm");
    if (!form) return;

    const citySelect = getEl("citySelect");
    const deliveryType = getEl("deliveryType");
    const weightTier = getEl("weightTier");

    const optFragile = getEl("optFragile");
    const optCod = getEl("optCod");
    const optInsurance = getEl("optInsurance");

    const resultBlock = getEl("resultBlock");
    const resultValue = getEl("resultValue");
    const breakdown = getEl("breakdown");

    // Populate cities
    citySelect.innerHTML = "";
    DELIVERY_DATA.cities.forEach(function (c) {
      citySelect.appendChild(createOption(c.id, c.name));
    });

    // Populate delivery types
    deliveryType.innerHTML = "";
    DELIVERY_DATA.deliveryTypes.forEach(function (t) {
      deliveryType.appendChild(createOption(t.id, t.name));
    });

    // Populate weight tiers
    weightTier.innerHTML = "";
    DELIVERY_DATA.weightTiers.forEach(function (w) {
      weightTier.appendChild(createOption(w.id, w.label));
    });

    // Apply prefill if exists
    if (prefill && prefill.city) citySelect.value = prefill.city;
    if (prefill && prefill.type) deliveryType.value = prefill.type;
    if (prefill && prefill.weight) weightTier.value = prefill.weight;

    function calc() {
      const city = DELIVERY_DATA.cities.find(function (c) { return c.id === citySelect.value; });
      const type = DELIVERY_DATA.deliveryTypes.find(function (t) { return t.id === deliveryType.value; });
      const weight = DELIVERY_DATA.weightTiers.find(function (w) { return w.id === weightTier.value; });

      if (!city || !type || !weight) return null;

      const base = Number(DELIVERY_DATA.basePrice);
      const weightPrice = Number(weight.weightPrice);

      // Base + weight component * city coeff
      const cityPart = weightPrice * Number(city.coeff);
      const beforeType = base + cityPart;

      // Type multiplier
      const afterType = beforeType * Number(type.coeff);

      // Options percent add-ons (sum percent)
      let percent = 0;
      if (optFragile && optFragile.checked) percent += Number(DELIVERY_DATA.options.fragile.percent);
      if (optCod && optCod.checked) percent += Number(DELIVERY_DATA.options.cod.percent);
      if (optInsurance && optInsurance.checked) percent += Number(DELIVERY_DATA.options.insurance.percent);

      const afterOptions = afterType * (1 + percent / 100);

      return {
        city: city,
        type: type,
        weight: weight,
        base: base,
        weightPrice: weightPrice,
        cityCoeff: Number(city.coeff),
        cityPart: cityPart,
        beforeType: beforeType,
        typeCoeff: Number(type.coeff),
        afterType: afterType,
        optionsPercent: percent,
        total: afterOptions
      };
    }

    function show(result) {
      if (!result) return;

      resultBlock.classList.remove("hidden");
      resultValue.textContent = toMoney(result.total) + " " + DELIVERY_DATA.currency;

      // Breakdown
      breakdown.innerHTML = "";
      breakdown.appendChild(renderBreakRow("Базова вартість", toMoney(result.base), DELIVERY_DATA.currency));
      breakdown.appendChild(renderBreakRow("Ціна за вагу (" + result.weight.label + ")", toMoney(result.weightPrice), DELIVERY_DATA.currency));
      breakdown.appendChild(renderBreakRowPlain("Коефіцієнт міста (" + result.city.name + ")", "× " + toMoney(result.cityCoeff)));
      breakdown.appendChild(renderBreakRow("Компонента міста (вага × коеф.)", toMoney(result.cityPart), DELIVERY_DATA.currency));
      breakdown.appendChild(renderBreakRow("Проміжна сума (база + компонента)", toMoney(result.beforeType), DELIVERY_DATA.currency));
      breakdown.appendChild(renderBreakRowPlain("Коефіцієнт типу доставки (" + result.type.name + ")", "× " + toMoney(result.typeCoeff)));
      breakdown.appendChild(renderBreakRow("Після типу доставки", toMoney(result.afterType), DELIVERY_DATA.currency));

      if (result.optionsPercent > 0) {
        breakdown.appendChild(renderBreakRowPlain("Додаткові опції", "+" + toMoney(result.optionsPercent) + "%"));
      } else {
        breakdown.appendChild(renderBreakRowPlain("Додаткові опції", "не обрано"));
      }

      breakdown.appendChild(renderBreakRow("Підсумок", toMoney(result.total), DELIVERY_DATA.currency));
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const r = calc();
      show(r);
    });

    // Optional: recalc on change (без кнопки), але результат показуємо тільки після натискання.
    // Це зменшує ризик "миготіння" та лишає логіку простою.
  }

  function readPrefillFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const city = params.get("city");
    const type = params.get("type");
    const weight = params.get("weight");
    if (!city && !type && !weight) return null;
    return { city: city, type: type, weight: weight };
  }

  document.addEventListener("DOMContentLoaded", function () {
    initCalculator(readPrefillFromQuery());
  });
})();
