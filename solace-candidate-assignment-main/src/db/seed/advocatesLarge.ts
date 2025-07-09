const specialties = [
  "Bipolar",
  "LGBTQ",
  "Medication/Prescribing",
  "Suicide History/Attempts",
  "General Mental Health (anxiety, depression, stress, grief, life transitions)",
  "Men's issues",
  "Relationship Issues (family, friends, couple, etc)",
  "Trauma & PTSD",
  "Personality disorders",
  "Personal growth",
  "Substance use/abuse",
  "Pediatrics",
  "Women's issues (post-partum, infertility, family planning)",
  "Chronic pain",
  "Weight loss & nutrition",
  "Eating disorders",
  "Diabetic Diet and nutrition",
  "Coaching (leadership, career, academic and wellness)",
  "Life coaching",
  "Obsessive-compulsive disorders",
  "Neuropsychological evaluations & testing (ADHD testing)",
  "Attention and Hyperactivity (ADHD)",
  "Sleep issues",
  "Schizophrenia and psychotic disorders",
  "Learning disorders",
  "Domestic abuse",
];

const firstNames = [
  "John", "Jane", "Michael", "Emily", "David", "Sarah", "Chris", "Jessica", "Daniel", "Laura",
  "James", "Amanda", "Joshua", "Megan", "Robert", "Ashley", "William", "Jennifer", "Richard", "Elizabeth",
  "Joseph", "Linda", "Thomas", "Barbara", "Christopher", "Susan", "Charles", "Karen", "Matthew", "Nancy",
  "Anthony", "Lisa", "Mark", "Betty", "Donald", "Helen", "Steven", "Sandra", "Paul", "Donna",
  "Andrew", "Carol", "Kenneth", "Ruth", "Peter", "Sharon", "Kevin", "Michelle", "Brian", "Laura",
  "George", "Sarah", "Timothy", "Kimberly", "Ronald", "Deborah", "Jason", "Dorothy", "Edward", "Lisa",
  "Jeffrey", "Nancy", "Ryan", "Karen", "Jacob", "Betty", "Gary", "Helen", "Nicholas", "Sandra",
  "Eric", "Donna", "Jonathan", "Carol", "Stephen", "Ruth", "Larry", "Sharon", "Justin", "Michelle",
  "Scott", "Laura", "Brandon", "Sarah", "Benjamin", "Kimberly", "Samuel", "Deborah", "Frank", "Dorothy",
  "Noah", "Emma", "Liam", "Olivia", "Mason", "Ava", "Lucas", "Isabella", "Oliver", "Sophia",
  "Ethan", "Charlotte", "Alexander", "Mia", "Henry", "Amelia", "Jacob", "Harper", "Sebastian", "Evelyn"
];

const lastNames = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
  "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
  "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
  "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
  "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts",
  "Gomez", "Phillips", "Evans", "Turner", "Diaz", "Parker", "Cruz", "Edwards", "Collins", "Reyes",
  "Stewart", "Morris", "Morales", "Murphy", "Cook", "Rogers", "Gutierrez", "Ortiz", "Morgan", "Cooper",
  "Peterson", "Bailey", "Reed", "Kelly", "Howard", "Ramos", "Kim", "Cox", "Ward", "Richardson",
  "Watson", "Brooks", "Chavez", "Wood", "James", "Bennett", "Gray", "Mendoza", "Ruiz", "Hughes",
  "Price", "Alvarez", "Castillo", "Sanders", "Patel", "Myers", "Long", "Ross", "Foster", "Jimenez"
];

const cities = [
  "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego",
  "Dallas", "San Jose", "Austin", "Jacksonville", "Fort Worth", "Columbus", "San Francisco", "Charlotte",
  "Indianapolis", "Seattle", "Denver", "Washington", "Boston", "El Paso", "Detroit", "Nashville",
  "Portland", "Memphis", "Oklahoma City", "Las Vegas", "Louisville", "Baltimore", "Milwaukee", "Albuquerque",
  "Tucson", "Fresno", "Sacramento", "Long Beach", "Kansas City", "Mesa", "Virginia Beach", "Atlanta",
  "Colorado Springs", "Omaha", "Raleigh", "Miami", "Oakland", "Minneapolis", "Tulsa", "Cleveland",
  "Wichita", "New Orleans", "Tampa", "Honolulu", "Aurora", "Anaheim", "Santa Ana", "St. Louis",
  "Riverside", "Corpus Christi", "Lexington", "Pittsburgh", "Anchorage", "Stockton", "Cincinnati", "St. Paul",
  "Toledo", "Greensboro", "Newark", "Plano", "Henderson", "Lincoln", "Buffalo", "Jersey City",
  "Chula Vista", "Fort Wayne", "Orlando", "St. Petersburg", "Chandler", "Laredo", "Norfolk", "Durham",
  "Madison", "Lubbock", "Irvine", "Winston-Salem", "Glendale", "Garland", "Hialeah", "Reno",
  "Chesapeake", "Gilbert", "Baton Rouge", "Irving", "Scottsdale", "North Las Vegas", "Fremont", "Boise"
];

const degrees = ["MD", "PhD", "MSW", "LCSW", "LMFT", "LPC", "PsyD", "DNP", "MA", "MS"];

const randomSpecialty = () => {
  const random1 = Math.floor(Math.random() * specialties.length);
  const numSpecialties = Math.floor(Math.random() * 4) + 1; // 1-4 specialties
  const selectedSpecialties: string[] = [];
  
  for (let i = 0; i < numSpecialties; i++) {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * specialties.length);
    } while (selectedSpecialties.includes(specialties[randomIndex]));
    selectedSpecialties.push(specialties[randomIndex]);
  }
  
  return selectedSpecialties;
};

const generateRandomPhoneNumber = () => {
  // Generate a 10-digit phone number
  const areaCode = Math.floor(Math.random() * 900) + 100; // 100-999
  const exchange = Math.floor(Math.random() * 900) + 100; // 100-999
  const number = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
  return parseInt(`${areaCode}${exchange}${number}`);
};

const generateRandomAdvocate = () => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const city = cities[Math.floor(Math.random() * cities.length)];
  const degree = degrees[Math.floor(Math.random() * degrees.length)];
  const advocateSpecialties = randomSpecialty();
  const yearsOfExperience = Math.floor(Math.random() * 20) + 1; // 1-20 years
  const phoneNumber = generateRandomPhoneNumber();

  return {
    firstName,
    lastName,
    city,
    degree,
    specialties: advocateSpecialties,
    yearsOfExperience,
    phoneNumber,
  };
};

// Generate 1000 advocates
const advocateDataLarge = Array.from({ length: 1000 }, () => generateRandomAdvocate());

export { advocateDataLarge as advocateData}; 