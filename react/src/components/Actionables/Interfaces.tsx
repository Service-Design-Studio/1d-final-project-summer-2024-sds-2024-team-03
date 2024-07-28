import dayjs, { Dayjs } from "dayjs";

//Actionables.tsx
export interface ActionablesPageProps {
  setFromDate: React.Dispatch<React.SetStateAction<Dayjs>>;
  fromDate: Dayjs;
  setToDate: React.Dispatch<React.SetStateAction<Dayjs>>;
  toDate: Dayjs;
  selectedProduct: string[];
  setSelectedProduct: React.Dispatch<React.SetStateAction<string[]>>;
  selectedSource: string[];
  setSelectedSource: React.Dispatch<React.SetStateAction<string[]>>;
}

//TodoList.tsx, DATA
export interface Actionable {
  id: number;
  action: string;
  status: string;
  subproduct: string;
  actionable_category: string;
  feedback_category: string;
  feedback_json: string;
  created_at: string;
  updated_at: string;
  url: string;
}
// TodoList.tsx
export interface TodoListProps {
  data: Actionable[];
  setRefresh: React.Dispatch<React.SetStateAction<number>>;
}
export interface ActionableWithRefresh {
  actionable: Actionable;
  setRefresh: React.Dispatch<React.SetStateAction<number>>;
}
