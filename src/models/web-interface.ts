export interface IAPIParam {
  query: string;
  offset: number;
  limit: number;
  rating: string;
  language: string;
}
export interface ISkeletonLoader {
  'background-color'?: string;
  height?: string;
  'border-radius'?: string;
  width?: string;
  margin?: string;
  'margin-top'?: string;
  'margin-bottom'?: string;
  'margin-left'?: string;
  'margin-right'?: string;
}

export interface IGifDB {
  rowID: number;
  id: string;
  title?: string;
  viewUrl?: string;
  viewThumbnail?: string; 
  searchTags?: string[];
  username?: string,
  slug?: string
  download?: number;
  savedate?: string;
}

export interface ICloseImageDialog {
  isSave?: boolean;
}