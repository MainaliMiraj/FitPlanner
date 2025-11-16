export type OtherOption = {
  enabled: boolean;
  label?: string;
  placeholder?: string;
  value?: string;
};

export type Question = {
  id: string;
  question: string;
  type: "single" | "checkbox" | "input";
  options?: string[];
  placeholder?: string;
  allowSelectAll?: boolean;
  otherOption?: OtherOption;
};
export interface OptionCardProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}
