import { Question } from "../types";

export const QUESTIONS: Question[] = [
  // FITNESS GOAL
  {
    id: "fitness_goal",
    question: "What is your main goal?",
    type: "single",
    options: ["Lose Weight", "Get Healthier", "Gain Muscle"],
  },

  {
    id: "body_type",
    question: "How would you describe your body type?",
    type: "single",
    options: ["Slim", "Mid-sized", "Overweight"],
  },

  {
    id: "dream_body",
    question: "What is your dream body?",
    type: "single",
    options: ["Slim", "Toned", "Fit", "Muscular"],
  },

  {
    id: "sports_experience",
    question: "Describe your experience with fitness (Gym/Sports).",
    type: "single",
    options: ["None", "Beginner", "Intermediate", "Advanced", "Athlete"],
  },

  {
    id: "best_condition",
    question: "When were you in your best physical condition?",
    type: "single",
    options: [
      "Currently",
      "1–2 years ago",
      "3–5 years ago",
      "More than 5 years ago",
      "Not sure",
    ],
  },

  {
    id: "workout_frequency",
    question: "How frequently do you or can you work out?",
    type: "single",
    options: ["Never", "1–2 days/week", "3–4 days/week", "5+ days/week"],
  },

  // CUISINES — MULTIPLE + OTHER
  {
    id: "popular_cuisines",
    question: "What type of cuisine do you prefer?",
    type: "checkbox",
    allowSelectAll: true,
    options: ["Italian", "Chinese", "Indian", "Mexican", "Other"],
    otherOption: {
      enabled: true,
      label: "Other",
      placeholder: "Enter your cuisine preference",
    },
  },

  // NUTRITION HABITS
  {
    id: "nutrition_habits",
    question: "Describe your nutrition habits.",
    type: "single",
    options: ["Healthy", "Unhealthy", "Mixed"],
  },

  {
    id: "cooking_time",
    question: "How much time do you spend cooking daily?",
    type: "single",
    options: ["<15 min", "15–30 min", "30–60 min", "More than 1 hour"],
  },

  {
    id: "diet_preference",
    question: "What type of diet do you prefer?",
    type: "single",
    options: ["Not Specific", "Vegetarian", "Vegan", "Non-Veg", "Keto"],
  },

  // LIFESTYLE
  {
    id: "daily_routine",
    question: "What is your daily routine?",
    type: "single",
    options: [
      "Mostly Sitting",
      "Moderately Active",
      "On Feet Often",
      "Highly Active",
    ],
  },

  {
    id: "energy_level",
    question: "Describe your energy level during the day.",
    type: "single",
    options: ["Low", "Moderate", "High", "Varies Throughout the Day"],
  },

  {
    id: "water_intake",
    question: "How much water do you drink daily?",
    type: "single",
    options: ["<1L", "1–2L", "2–3L", "3L+", "I don’t track"],
  },

  // BAD HABITS — MULTIPLE + OTHER
  {
    id: "bad_habits",
    question: "Do you have any of these bad habits?",
    type: "checkbox",
    options: [
      "Eat Late",
      "Can’t Quit Sugar",
      "Eat Processed Food",
      "Too Much Soda",
      "Eat Too Much Salt",
      "None of These",
      "Other",
    ],
    otherOption: {
      enabled: true,
      label: "Other",
      placeholder: "Describe the habit",
    },
  },

  // INPUT QUESTIONS
  {
    id: "height",
    question: "What is your height?",
    type: "input",
    placeholder: "Enter your height in centimeters (e.g., 175)",
  },

  {
    id: "weight",
    question: "What is your weight?",
    type: "input",
    placeholder: "Enter your weight in kilograms (e.g., 70)",
  },

  {
    id: "target_weight",
    question: "What is your target weight?",
    type: "single",
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
    question: "How old are you?",
    type: "single",
    options: ["<18", "18–25", "26–35", "36–45", "46+"],
  },
];
