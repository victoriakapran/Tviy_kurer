const TK = {
  basePrice: 60.00,
  cities: [
    { name: "Київ", coef: 1.00 },
    { name: "Львів", coef: 1.08 },
    { name: "Одеса", coef: 1.10 },
    { name: "Харків", coef: 1.12 },
    { name: "Дніпро", coef: 1.07 },
    { name: "Запоріжжя", coef: 1.11 },
    { name: "Вінниця", coef: 1.05 },
    { name: "Полтава", coef: 1.06 },
    { name: "Чернігів", coef: 1.09 },
    { name: "Черкаси", coef: 1.04 },
    { name: "Івано-Франківськ", coef: 1.10 },
    { name: "Ужгород", coef: 1.13 }
  ],
  types: [
    { name: "Стандарт", coef: 1.00 },
    { name: "Експрес", coef: 1.35 },
    { name: "Кур'єр до дверей", coef: 1.25 },
    { name: "Поштомат / відділення", coef: 0.95 }
  ],
  options: {
    fragile: { label: "Крихке", coef: 1.05 },
    cod: { label: "Післяплата", coef: 1.02 },
    insurance: { label: "Страховка", coef: 1.10 }
  },
  weightTiers: [
    { max: 5, rate: 14.00, label: "до 5 кг" },
    { max: 10, rate: 12.00, label: "5–10 кг" },
    { max: 30, rate: 10.00, label: "10–30 кг" },
    { max: Infinity, rate: 8.00, label: "від 30 кг" }
  ]
};

function fmt2(n){ return Number(n).toFixed(2); }

function getTier(weight){
  for(const t of TK.weightTiers){
    if(weight <= t.max) return t;
  }
  return TK.weightTiers[TK.weightTiers.length - 1];
}

function initNavActive(){
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll('.nav a').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if(href === path) a.classList.add('active');
  });
}

function initCalculatorBlock(root){
  const citySel = root.querySelector('[data-city]');
  const typeSel = root.querySelector('[data-type]');
  const weightInp = root.querySelector('[data-weight]');
  const baseEl = root.querySelector('[data-base]');
  const resultEl = root.querySelector('[data-result]');
  const sumEl = root.querySelector('[data-sum]');
  const errEl = root.querySelector('[data-error]');
  const resetBtn = root.querySelector('[data-reset]');
  const form = root.querySelector('form');

  citySel.innerHTML = '<option value="">Оберіть місто</option>' + TK.cities.map(c =>
    `<option value="${c.coef}">${c.name} (коеф. ${fmt2(c.coef)})</option>`
  ).join('');
  typeSel.innerHTML = '<option value="">Оберіть тип</option>' + TK.types.map(t =>
    `<option value="${t.coef}">${t.name} (x${fmt2(t.coef)})</option>`
  ).join('');

  if(baseEl) baseEl.textContent = fmt2(TK.basePrice) + " грн";

  function showError(msg){
    if(!errEl) return;
    errEl.textContent = msg;
    errEl.classList.add('show');
  }
  function hideError(){
    if(!errEl) return;
    errEl.classList.remove('show');
  }

  function clear(){
    citySel.value = "";
    typeSel.value = "";
    weightInp.value = "";
    root.querySelectorAll('input[type="checkbox"][data-opt]').forEach(ch => ch.checked = false);
    resultEl.classList.remove('show');
    hideError();
  }
  if(resetBtn) resetBtn.addEventListener('click', clear);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    hideError();

    const cityCoef = Number(citySel.value);
    const typeCoef = Number(typeSel.value);
    const weight = Number(weightInp.value);

    if(!cityCoef || !typeCoef || !weight){
      showError("Заповніть усі поля для розрахунку.");
      return;
    }
    if(weight <= 0){
      showError("Вага має бути більшою за 0.");
      return;
    }

    const tier = getTier(weight);
    const basePart = TK.basePrice + tier.rate * weight;
    let price = basePart * cityCoef * typeCoef;

    let optMult = 1.0;
    root.querySelectorAll('input[type="checkbox"][data-opt]').forEach(ch => {
      if(ch.checked){
        const key = ch.getAttribute('data-opt');
        if(TK.options[key]) optMult *= TK.options[key].coef;
      }
    });
    price = price * optMult;

    sumEl.textContent = fmt2(price) + " грн";
    resultEl.classList.add('show');
  });
}

function initCitiesTable(){
  const tbody = document.querySelector('[data-cities-body]');
  if(!tbody) return;
  tbody.innerHTML = TK.cities.map(c => `
    <tr>
      <td>${c.name}</td>
      <td>${fmt2(c.coef)}</td>
      <td>(база + тариф×вага) × ${fmt2(c.coef)} × множник_типу × (1 + %)</td>
    </tr>
  `).join('');
  const baseEl = document.querySelector('[data-base-only]');
  if(baseEl) baseEl.textContent = fmt2(TK.basePrice) + " грн";
}

function initContactsForm(){
  const form = document.querySelector('[data-contact-form]');
  if(!form) return;
  const alertBox = document.querySelector('[data-contact-alert]');
  const clearBtn = document.querySelector('[data-contact-clear]');
  function esc(s){
    return String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
  }
  clearBtn.addEventListener('click', () => {
    form.reset();
    alertBox.classList.remove('show');
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const msg = form.querySelector('[name="message"]').value.trim();
    if(!name || !email || !msg){
      alert("Заповніть усі поля");
      return;
    }
    alertBox.innerHTML = "<b>Повідомлення сформовано (демонстрація):</b><br>" +
      "Ім'я: " + esc(name) + "<br>" +
      "Email: " + esc(email) + "<br>" +
      "Текст: " + esc(msg);
    alertBox.classList.add('show');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNavActive();
  document.querySelectorAll('[data-calculator]').forEach(initCalculatorBlock);
  initCitiesTable();
  initContactsForm();
});
