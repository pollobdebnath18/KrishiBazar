const productTranslations: Record<string, string> = {
  mango: "আম",
  tomato: "টমেটো",
  potato: "আলু",
  rice: "চাল",
  onion: "পেঁয়াজ",
  garlic: "রসুন",
  ginger: "আদা",
  turmeric: "হলুদ",
  chili: "মরিচ",
  "green chili": "কাঁচা মরিচ",
  "dry chili": "শুকনা মরিচ",
  coriander: "ধনেপাতা",
  cucumber: "শসা",
  carrot: "গাজর",
  cauliflower: "ফুলকপি",
  cabbage: "বাঁধাকপি",
  eggplant: "বেগুন",
  brinjal: "বেগুন",
  spinach: "পালং শাক",
  pumpkin: "কুমড়া",
  okra: "ঢেঁড়স",
  radish: "মুলা",
  "bitter gourd": "করলা",
  "ridge gourd": "ঝিঙে",
  "sweet potato": "মিষ্টি আলু",
  broccoli: "ব্রকোলি",
  capsicum: "ক্যাপসিকাম",
  mushroom: "মাশরুম",
  banana: "কলা",
  apple: "আপেল",
  orange: "কমলা",
  lemon: "লেবু",
  papaya: "পেঁপে",
  watermelon: "তরমুজ",
  "sweet pumpkin": "মিষ্টি কুমড়া",
  jackfruit: "কাঁঠাল",
  pineapple: "আনারস",
  guava: "পেয়ারা",
  litchi: "লিচু",
  grape: "আঙ্গুর",
  strawberry: "স্ট্রবেরি",
  pomegranate: "ডালিম",
  coconut: "নারিকেল",
  date: "খেজুর",
  fish: "মাছ",
  "hilsha fish": "ইলিশ মাছ",
  "rohu fish": "রুই মাছ",
  "tilapia fish": "তেলাপিয়া মাছ",
  shrimp: "চিংড়ি",
  crab: "কাঁকড়া",
  chicken: "মুরগি",
  duck: "হাঁস",
  egg: "ডিম",
  beef: "গরুর মাংস",
  mutton: "খাসির মাংস",
  milk: "দুধ",
  curd: "দই",
  "ghee": "ঘি",
  butter: "মাখন",
  cheese: "পনির",
  lentil: "ডাল",
  dal: "ডাল",
  wheat: "গম",
  corn: "ভুট্টা",
  maize: "ভুট্টা",
  flour: "আটা",
  "rice flour": "চালের গুঁড়া",
  sugar: "চিনি",
  salt: "লবণ",
  oil: "তেল",
  "mustard oil": "সরিষার তেল",
  mustard: "সরিষা",
  sesame: "তিল",
  peanut: "চিনাবাদাম",
  cashew: "কাজুবাদাম",
  almond: "বাদাম",
  raisin: "কিশমিশ",
  cardamom: "এলাচ",
  cinnamon: "দারুচিনি",
  clove: "লবঙ্গ",
  "black pepper": "গোলমরিচ",
  pepper: "গোলমরিচ",
  cumin: "জিরা",
  "mustard seed": "সরিষার বীজ",
  honey: "মধু",
  tea: "চা",
  coffee: "কফি",
  betel: "পান",
  "green coconut": "ডাব",
  "tamarind": "তেঁতুল",
};

const categoryTranslations: Record<string, string> = {
  vegetables: "সবজি",
  fruits: "ফল",
  fish: "মাছ",
  meat: "মাংস",
  poultry: "হাঁস-মুরগি",
  dairy: "দুগ্ধজাত",
  grains: "শস্য",
  cereals: "শস্য",
  spices: "মসলা",
  legumes: "ডাল",
  drinks: "পানীয়",
  snacks: "খাবার",
  "dry food": "শুকনো খাবার",
};

const locationTranslations: Record<string, string> = {
  sylhet: "সিলেট",
  dhaka: "ঢাকা",
  rajshahi: "রাজশাহী",
  khulna: "খুলনা",
  chattogram: "চট্টগ্রাম",
  chittagong: "চট্টগ্রাম",
  barisal: "বরিশাল",
  rangpur: "রংপুর",
  mymensingh: "ময়মনসিংহ",
  comilla: "কুমিল্লা",
  jessore: "যশোর",
  bogra: "বগুড়া",
  dinajpur: "দিনাজপুর",
  feni: "ফেনী",
  noakhali: "নোয়াখালী",
  tangail: "টাঙ্গাইল",
  gazipur: "গাজীপুর",
  narayanganj: "নারায়ণগঞ্জ",
  savar: "সাভার",
  "natore": "নাটোর",
};

const descriptionTranslations: Record<string, string> = {
  "fresh local tomato": "তাজা স্থানীয় টমেটো",
  "fresh local mango": "তাজা স্থানীয় আম",
  "fresh vegetables": "তাজা সবজি",
  "fresh fruits": "তাজা ফল",
  "organic vegetables": "জৈব সবজি",
  "fresh fish": "তাজা মাছ",
};

function lookup(map: Record<string, string>, value: string): string {
  if (!value) return value;
  return map[value.trim().toLowerCase()] ?? value;
}

export function translateProductTitle(value: string): string {
  return lookup(productTranslations, value);
}

export function translateCategory(value: string): string {
  return lookup(categoryTranslations, value);
}

export function translateLocation(value: string): string {
  return lookup(locationTranslations, value);
}

export function translateDescription(value: string | null): string | null {
  if (!value) return value;
  return lookup(descriptionTranslations, value);
}