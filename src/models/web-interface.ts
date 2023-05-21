export interface IAPIParam {
    query:      string; 
    offset:     number;
    limit:      number;
    rating:     string,
    language:   string;
}
export interface ISkeletonLoader {
    'background-color'?:    string
    height?:                string
    'border-radius'?:       string
    width?:                 string
    margin?:                string
  }