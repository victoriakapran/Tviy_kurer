// Дані для калькулятора доставки (масиви/об'єкти без API та без серверу)

const DELIVERY_DATA = {
  currency: "грн",

  // Базова вартість: завжди додається (формує "мінімальну" ціну доставки)
  basePrice: 60.00,

  // 12 популярних міст України + коефіцієнти (множники)
  cities: [
    { id: "kyiv", name: "Київ", coeff: 1.00 },
    { id: "lviv", name: "Львів", coeff: 1.08 },
    { id: "odesa", name: "Одеса", coeff: 1.10 },
    { id: "kharkiv", name: "Харків", coeff: 1.07 },
    { id: "dnipro", name: "Дніпро", coeff: 1.06 },
    { id: "zaporizhzhia", name: "Запоріжжя", coeff: 1.05 },
    { id: "vinnytsia", name: "Вінниця", coeff: 1.04 },
    { id: "poltava", name: "Полтава", coeff: 1.03 },
    { id: "chernihiv", name: "Чернігів", coeff: 1.02 },
    { id: "cherkasy", name: "Черкаси", coeff: 1.03 },
    { id: "ivano-frankivsk", name: "Івано-Франківськ", coeff: 1.09 },
    { id: "mykolaiv", name: "Миколаїв", coeff: 1.08 }
  ],

  // Типи доставки + множники
  deliveryTypes: [
    { id: "standard", name: "Стандарт", coeff: 1.00 },
    { id: "express", name: "Експрес", coeff: 1.35 },
    { id: "courier", name: "Кур’єр до дверей", coeff: 1.25 },
    { id: "locker", name: "Поштомат / відділення", coeff: 0.95 }
  ],

  // Вагові категорії (цена за вагу) — без введення кг вручну
  // Формула: basePrice + (weightPrice) * cityCoeff, потім множник типу доставки та опції (%)
  weightTiers: [
    { id: "to5", label: "До 5 кг", weightPrice: 55.00 },
    { id: "5to10", label: "Від 5 до 10 кг", weightPrice: 85.00 },
    { id: "10to30", label: "Від 10 до 30 кг", weightPrice: 140.00 },
    { id: "over30", label: "Від 30 кг", weightPrice: 220.00 }
  ],

  // Додаткові опції (відсоток до вартості)
  options: {
    fragile: { label: "Крихке", percent: 5 },
    cod: { label: "Післяплата", percent: 2 },
    insurance: { label: "Страховка", percent: 10 }
  }
};
