import { CategoryResponse } from './category'

export interface ExpenseResponse {
  id: number;
  value: number;
  dates: string[];
  lastDate: string;
  categories: CategoryResponse[];
}