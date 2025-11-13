export interface Question {
  id: string;
  category: "Fitness" | "Nutrition" | "Lifestyle" | "Health";
  question: string;
  options?: string[];
  type?: "radio" | "checkbox" | "input";
  allowSelectAll?: boolean;
  placeholder?: string;
  hasOtherOption?: boolean;
}
