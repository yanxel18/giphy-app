import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAPIParam } from 'src/models/web-interface';
import { environment } from 'src/environments/environment.development';
import { Observable, map, retry, shareReplay } from 'rxjs';
import {
  IGiphyData,
  IGiphyPayload,
  TrendingWord,
} from 'src/models/giphy-interface';
import { DbService } from 'src/dbservice/db.service';
@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private http: HttpClient) {}
  /**
   *
   * @param searchParam passed parameter with
   * query = search term
   * offset = number of results to display
   * limit = count of results to display
   * rating = rate of GIFs
   * language = english
   * @returns
   */
  searchGif(searchParam: IAPIParam): Observable<IGiphyPayload> {
    return this.http.get<IGiphyPayload>(this.ApiSearchUrl(searchParam)).pipe(
      map((res) => { 
        return res;
      }),
      shareReplay(),
      retry(10)
    );
  }
  /**
   *
   * @param trendingParam passed parameter with
   * offset = number of results to display
   * limit = count of results to display
   * rating = rate of GIFs
   * language = english
   * @returns
   */
  trendingGif(trendingParam: Partial<IAPIParam>): Observable<IGiphyPayload> {
    return this.http
      .get<IGiphyPayload>(this.ApiTrendingUrl(trendingParam))
      .pipe(
        map((res) => {
          return res;
        }),
        shareReplay(),
        retry(10)
      );
  }
  /**
   *
   * @param gifNodeID
   * @returns
   */
  nodeGIF(gifNodeID: string): Observable<IGiphyData> {
    return this.http.get<IGiphyData>(this.ApiGIFNodeURL(gifNodeID)).pipe(
      map((res) => {
        return res;
      }),
      shareReplay(),
      retry(10)
    );
  }
  /**
   *
   * @returns
   */
  trendingWordsUrl(): Observable<string[]> {
    return this.http.get<TrendingWord>(this.ApiTrendingWordsUrl()).pipe(
      map((res) => {
        return res.data ?? [];
      }),
      shareReplay(),
      retry(10)
    );
  }
  /**
   *
   * @param urlParam received from searchGif method
   * @returns API Url string
   */
  protected ApiSearchUrl(urlParam: IAPIParam): string {
    const { query, offset, limit, rating, language } = urlParam;
    const API_URL: string = `${environment.API_ROOT_URL}${environment.API_SEARCH_URL}?api_key=${environment.API_KEY}&q=${query}&limit=${limit}&offset=${offset}&rating=${rating}&lang=${language}`;
    return API_URL;
  }
  /**
   *
   * @param urlParam received from trendingGif method
   * @returns API trending url string
   */
  protected ApiTrendingUrl(urlParam: Partial<IAPIParam>): string {
    const { offset, limit, rating, language } = urlParam;
    const API_TRENDING_URL: string = `${environment.API_ROOT_URL}${environment.API_TRENDING_URL}?api_key=${environment.API_KEY}&limit=${limit}&offset=${offset}&rating=${rating}&lang=${language}`;
    return API_TRENDING_URL;
  }
  /**
   *
   * @returns
   */
  protected ApiTrendingWordsUrl(): string {
    const API_TRENDING_URL: string = `${environment.API_ROOT_URL}${environment.API_TRENDING_WORDS_URL}?api_key=${environment.API_KEY}`;
    return API_TRENDING_URL;
  }

  protected ApiGIFNodeURL(gifNodeID: string): string {
    const API_GIF_NODE_URL: string = `${environment.API_ROOT_URL}${environment.API_GIF_NODE_URL}${gifNodeID}?api_key=${environment.API_KEY}`;
    return API_GIF_NODE_URL;
  }

  /**
   *
   * @param key variable to store in local storage
   * @param value value to store in local storage
   */
  tempStoreKey(key: string, value: string): void {
    localStorage.setItem(key, value);
  }
  /**
   *
   * @param key variable to retrieve from local storage
   * @returns value from local storage
   */
  tempGetKey(key: string): string | null {
    return localStorage.getItem(key);
  }


  downloadGIF(gifURL: string): Observable<any> {
    return this.http.get<any>(gifURL, {
      responseType: 'blob' as 'json',
      headers: { Accept: 'image/gif' },
    });
  }
}
