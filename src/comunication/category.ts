export interface CategoryResponse {
  id: number;
  name: string;
  date: string;
  owner: number;
}

export interface CategoryRequest {
  name: string;
  owner?: number;
  date?: string;
}
