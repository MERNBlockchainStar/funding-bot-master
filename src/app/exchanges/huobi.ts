import { HttpClient, HttpHeaders } from "@angular/common/http";
import { IFundingRate } from "../models/funding-rate";
import { Exchange } from "./base-exchange";
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from "rxjs";

export class XHuobi extends Exchange{

  constructor(
    httpClient: HttpClient,
    apiKey?: string,
    apiSecret?: string
  ){
    super(httpClient, apiKey, apiSecret);
    this._name = "Huobi";
    this._baseUrl = "https://api.hbdm.com/linear-swap-api/v1/";
  }
  
  getFuningRate(): Promise<IFundingRate[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return  this._http.get<IBinanceFundingRateResponse>(this._baseUrl+"swap_batch_funding_rate", httpOptions)
    .pipe(
      map(response => {
        const result:IFundingRate[] = [];
        if(response && response.data){
          const data = response.data;
          for(let i=0; i<data.length; i++) {
            const rate = data[i].funding_rate;
            result.push({
              symbol: Exchange.processSymbol(`${data[i].symbol}${data[i].fee_asset}`),
              rate: rate,
              time: data[i].funding_time,
            });
          }
        }
        return result;
      }),
      catchError(err => of([])),
    ).toPromise();
  }

  getFuningRateCoin(): Promise<IFundingRate[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return  this._http.get<IBinanceFundingRateResponse>("https://api.hbdm.com/swap-api/v1/swap_batch_funding_rate", httpOptions)
    .pipe(
      map(response => {
        const result:IFundingRate[] = [];
        if(response && response.data){
          const data = response.data;
          for(let i=0; i<data.length; i++) {
            const rate = data[i].funding_rate;
            result.push({
              //symbol: `${data[i].symbol}${data[i].fee_asset}`,
              symbol: Exchange.processSymbol(`${data[i].contract_code}`),
              rate: rate,
              time: data[i].funding_time,
            });
          }
        }
        return result;
      }),
      catchError(err => of([])),
    ).toPromise();
  }
}

interface IBinanceFundingRate{
  estimated_rate: number;
  funding_rate: number;
  contract_code: string; //ETC-USDT,
  symbol: string; //ETC,
  fee_asset: string; //USDT,
  funding_time: Date;
  next_funding_time: Date;
}

interface IBinanceFundingRateResponse{
  data: IBinanceFundingRate[],
  status: string,
  ts: Date,
}