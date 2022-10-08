export interface ISite {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  url: string;
  selector?: string;
  actions: Record<string, string>;
  results: string[];
  readonly published: boolean;
}
