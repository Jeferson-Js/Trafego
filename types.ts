
export interface FormState {
  niche: string;
  price: string;
  goal: string;
}

export interface PlanSection {
  title: string;
  content: string;
}

export interface GeneratedPlan {
  text: string;
  images: string[];
}
