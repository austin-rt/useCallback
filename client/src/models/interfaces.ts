export interface Author {
  name: string;
}

export interface Book {
  id: string;
  title: string;
  formats: {
    'image/jpeg': string;
  };
  authors: Author[];
  download_count: number;
}