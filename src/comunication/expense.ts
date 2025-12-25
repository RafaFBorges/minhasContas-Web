import { CategoryResponse } from './category'

export interface ExpenseResponse {
  id: number;
  value: number;
  dates: string[];
  lastDate: string;
  categories: CategoryResponse[];
}

export interface ExpenseRequest {
  value?: number;
  date?: string;
  categoryIds?: number[];
}
