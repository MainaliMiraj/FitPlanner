import type { Question } from "../types";

export const QUESTIONS: Question[] = [
  // 🏋️ FITNESS
  {
    id: "fitness_goal",
    category: "Fitness",
    question: "What is your main goal?",
    options: ["Lose Weight", "Get Healthier", "Gain Muscle"],
  },
  {
    id: "body_type",
    category: "Fitness",
    question: "How would you describe your body type?",
    options: ["Slim", "Mid-sized", "Overweight"],
  },
  {
    id: "dream_body",
    category: "Fitness",
    question: "What is your dream body?",
    options: ["Slim", "Toned", "Curvy"],
  },
  {
    id: "target_zones",
    category: "Fitness",
    question: "What are your target zones?",
    type: "checkbox",
    options: [
      "Belly",
      "Butt",
      "Chest",
      "Legs",
      "Arms",
      "Back",
      "Shoulders",
      "Full Body",
    ],
  },
  {
    id: "sports_experience",
    category: "Fitness",
    question: "Describe your experience with sports.",
    options: ["None", "Beginner", "Intermediate", "Advanced", "Athlete"],
  },
  {
    id: "best_condition",
    category: "Fitness",
    question: "When were you in your best physical condition?",
    options: [
      "Currently",
      "1–2 years ago",
      "3–5 years ago",
      "More than 5 years ago",
      "Never sure",
    ],
  },
  {
    id: "workout_frequency",
    category: "Fitness",
    question: "How frequently do you work out?",
    options: ["Never", "1–2 days/week", "3–4 days/week", "5+ days/week"],
  },

  // 🍎 NUTRITION
  {
    id: "nutrition_habits",
    category: "Nutrition",
    question: "Describe your nutrition habits.",
    options: ["Healthy", "Unhealthy", "Mixed"],
  },
  {
    id: "cooking_time",
    category: "Nutrition",
    question: "How much time do you spend cooking daily?",
    options: ["<15 min", "15–30 min", "30–60 min", "More than 1 hour"],
  },
  {
    id: "include_veggies",
    category: "Nutrition",
    question: "Mark the veggies you want to include.",
    type: "checkbox",
    options: [
      "Broccoli",
      "Spinach",
      "Carrots",
      "Tomatoes",
      "Bell Peppers",
      "Cucumber",
      "Cauliflower",
      "Mushrooms",
      "Other",
    ],
  },
  {
    id: "include_products",
    category: "Nutrition",
    question: "Select other products you want to include.",
    type: "checkbox",
    allowSelectAll: true,
    options: [
      "Chicken",
      "Fish",
      "Eggs",
      "Milk",
      "Rice",
      "Oats",
      "Beans",
      "Nuts",
      "Fruits",
    ],
  },
  {
    id: "diet_preference",
    category: "Nutrition",
    question: "What type of diet do you prefer?",
    options: [
      "Not Specific",
      "Vegetarian",
      "Vegan",
      "Non-Veg",
      "Keto",
      "Pescatarian",
      "No Sugar",
      "Paleo",
      "Halal",
      "Kosher",
    ],
  },

  // 🌅 LIFESTYLE
  {
    id: "daily_routine",
    category: "Lifestyle",
    question: "What is your daily routine?",
    options: [
      "Mostly Sitting",
      "Moderately Active",
      "On Feet Often",
      "Highly Active",
    ],
  },
  {
    id: "energy_level",
    category: "Lifestyle",
    question: "Describe your energy level during the day.",
    options: ["Low", "Moderate", "High", "Varies Throughout the Day"],
  },
  {
    id: "water_intake",
    category: "Lifestyle",
    question: "How much water do you drink daily?",
    options: ["<1L", "1–2L", "2–3L", "3L+", "I don’t track"],
  },
  {
    id: "bad_habits",
    category: "Lifestyle",
    question: "Do you have any of these bad habits?",
    type: "checkbox",
    options: [
      "Eat Late",
      "Can’t Quit Sugar",
      "Eat Processed Food",
      "Too Much Soda",
      "Eat Too Much Salt",
      "None of These",
    ],
  },
  {
    id: "life_event",
    category: "Lifestyle",
    question: "Do you have any important life event coming soon?",
    options: ["Wedding", "Vacation", "Sports Event", "Photoshoot", "None"],
  },

  // ❤️ HEALTH
  {
  id: "height",
  question: "What is your height?",
  type: "input",
  category: "Health",
  placeholder: "Enter your height in centimeters (e.g., 175)"
},
{
  id: "weight",
  question: "What is your weight?",
  type: "input",
  category: "Health",
  placeholder: "Enter your weight in kilograms (e.g., 70)"
},

  {
    id: "target_weight",
    category: "Health",
    question: "What is your target weight?",
    options: [
      "Lose 5 kg",
      "Lose 10 kg",
      "Maintain",
      "Gain 5 kg",
      "Gain 10 kg+",
    ],
  },
  {
    id: "age",
    category: "Health",
    question: "How old are you?",
    options: ["<18", "18–25", "26–35", "36–45", "46+"],
  },
];
