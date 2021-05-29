import { HttpClient } from "@angular/common/http";
import { IFundingRate } from "../models/funding-rate";
import { Exchange } from "./base-exchange";
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from "rxjs";

export class XBinance extends Exchange{

  constructor(
    httpClient: HttpClient,
    apiKey?: string,
    apiSecret?: string
  ){
    super(httpClient, apiKey, apiSecret);
    this._name = "Binance";
    this._baseUrl = "https://www.binance.com/fapi/v1/";
  }
  
  getFuningRate(): Promise<IFundingRate[]> {
    return this._http.get<IBinanceFundingRate[]>(this._baseUrl+"premiumIndex")
    .pipe(
      map(data => {
        const result:IFundingRate[] = [];
        if(data){
          for(let i=0; i<data.length; i++) {
            const rate = data[i].lastFundingRate;
            result.push({
              symbol: Exchange.processSymbol(data[i].symbol),
              rate: rate,
              nextFundingTime: data[i].nextFundingTime,
              time: data[i].time,
            });
          }
        }
        return result;
      }),
      catchError(err => of([]))
    ).toPromise();
  }

  getFuningRateCoin(): Promise<IFundingRate[]> {
    return this._http.get<IBinanceFundingRate[]>("https://www.binance.com/dapi/v1/premiumIndex")
    .pipe(
      map(data => {
        const result:IFundingRate[] = [];
        if(data){
          for(let i=0; i<data.length; i++) {
            const rate = data[i].lastFundingRate;
            result.push({
              symbol: Exchange.processSymbol(data[i].symbol),
              rate: rate,
              nextFundingTime: data[i].nextFundingTime,
              time: data[i].time,
            });
          }
        }
        return result;
      }),
      catchError(err => of([]))
    ).toPromise();
  }
}

interface IBinanceFundingRate{
  symbol: string;
  markPrice: number;
  indexPrice: number;
  lastFundingRate: number;
  nextFundingTime: Date;
  interestRate: number;
  time: Date;
}