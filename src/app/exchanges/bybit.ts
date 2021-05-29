import { HttpClient } from "@angular/common/http";
import { IFundingRate } from "../models/funding-rate";
import { Exchange } from "./base-exchange";
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from "rxjs";

export class XBybit extends Exchange{

  constructor(
    httpClient: HttpClient,
    apiKey?: string,
    apiSecret?: string
  ){
    super(httpClient, apiKey, apiSecret);
    this._name = "Bybit";
    this._baseUrl = "https://api.bybit.com/v2/";
  }
  
  getFuningRate(): Promise<IFundingRate[]> {
    return  this._http.get<IBybitTickersResponse>(this._baseUrl+"public/tickers")
    .pipe(
      map(resp => {
        const result:IFundingRate[] = [];
        if(resp.ret_msg=="OK" && resp.result && resp.result.length>0){
          const data = resp.result;
          for(let i=0; i<data.length; i++) {
            const rate = data[i].funding_rate;
            if(data[i].symbol.endsWith('USDT')){
              result.push({
                symbol: Exchange.processSymbol(data[i].symbol),
                rate: rate,
              });
            }
          }
        }
        return result;
      }),
      catchError(err => of([]))
    ).toPromise();
  }

  getFuningRateCoin(): Promise<IFundingRate[]> {
    return  this._http.get<IBybitTickersResponse>(this._baseUrl+"public/tickers")
    .pipe(
      map(resp => {
        const result:IFundingRate[] = [];
        if(resp.ret_msg=="OK" && resp.result && resp.result.length>0){
          const data = resp.result;
          for(let i=0; i<data.length; i++) {
            const rate = data[i].funding_rate;
            if(data[i].symbol.endsWith('USD')){
              result.push({
                symbol: Exchange.processSymbol(data[i].symbol),
                rate: rate,
              });
            }
          }
        }
        return result;
      }),
      catchError(err => of([]))
    ).toPromise();
  }
}

interface IBybitTicker{
  symbol: string;
  funding_rate: number;
}

interface IBybitTickersResponse{
    "ret_code": number; //0,
    "ret_msg": string;//"OK",
    "ext_code": string;//"",
    "ext_info": string;//"",
    "result": IBybitTicker[];
    //"time_now": "1618923851.542795"
}