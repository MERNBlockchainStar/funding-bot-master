import { HttpClient, HttpHeaders } from "@angular/common/http";
import { IFundingRate } from "../models/funding-rate";
import { Exchange } from "./base-exchange";
import { catchError, map } from 'rxjs/operators';
import { of } from "rxjs";

export class XBitfinex extends Exchange{
  protected _passPhase: string;
  constructor(
    httpClient: HttpClient,
    apiKey?: string,
    apiSecret?: string,
    passPhase?: string
  ){
    super(httpClient, apiKey, apiSecret);
    this._passPhase = passPhase;
    this._name = "Bitfinex";
    this._baseUrl = "https://api-pub.bitfinex.com/v2/";
  }
  
  getFuningRate(): Promise<IFundingRate[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return  this._http.get<IBitfinexFundingRate[]>(this._baseUrl+'status/deriv?keys=ALL', httpOptions)
    .pipe(
      map(data => {
        const result:IFundingRate[] = [];
        if(data){
          for(let i=0; i<data.length; i++) {
            const _symbol_arr = data[i][0].split(":");
            const base = this.filterSymbol(_symbol_arr[0]);
            const quote = this.filterSymbol(_symbol_arr[1]);
            const rate = data[i][12];
            if(base!==false && quote!==false && quote=='USDT'){
              result.push({
                symbol: Exchange.processSymbol(`${base}${quote}`),
                rate: rate,
                time: data[i][1],
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
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return  this._http.get<IBitfinexFundingRate[]>(this._baseUrl+'status/deriv?keys=ALL', httpOptions)
    .pipe(
      map(data => {
        const result:IFundingRate[] = [];
        if(data){
          for(let i=0; i<data.length; i++) {
            const _symbol_arr = data[i][0].split(":");
            const base = this.filterSymbol(_symbol_arr[0]);
            const quote = this.filterSymbol(_symbol_arr[1]);
            const rate = data[i][12];
            if(base!==false && quote!==false && quote=='BTC'){
              result.push({
                symbol: Exchange.processSymbol(`${base}${quote}`),
                rate: rate,
                time: data[i][1],
              });
            }
          }
        }
        return result;
      }),
      catchError(err => of([]))
    ).toPromise();
  }

  filterSymbol(symbol:string){
    symbol = symbol.replace(/^t/i, '');
    if(symbol.startsWith('TEST')){
      return false;
    }
    return symbol.replace(/F0$/i, '')
                 .replace(/^UST$/gi, 'USDT')
                 .replace(/^IOT$/gi, 'IOTA')
                 .replace(/^AMP$/gi, 'AMPL');

  }
}

type IBitfinexFundingRate = [
  string,       // 01   KEY,
  Date,         // 02   MTS,
  any,          //      PLACEHOLDER, 
  number,       //  4   DERIV_PRICE,
  number,       //  5   SPOT_PRICE,
  any,          //      PLACEHOLDER,
  number,       //  7   INSURANCE_FUND_BALANCE,
  any,          //      PLACEHOLDER,
  Date,         //  9   NEXT_FUNDING_EVT_TIMESTAMP_MS,
  number,       // 10   NEXT_FUNDING_ACCRUED,
  number,       // 11   NEXT_FUNDING_STEP,
  any,          //      PLACEHOLDER,
  number,       // 13   CURRENT_FUNDING,
  any,          //      PLACEHOLDER,
  any,          //      PLACEHOLDER,
  number,       // 15   MARK_PRICE,
  any,          //      PLACEHOLDER,
  any,          //      PLACEHOLDER,
  number,       // 18   OPEN_INTEREST,
  any,          //      PLACEHOLDER,
  any,          //      PLACEHOLDER,
  any,          //      PLACEHOLDER,
  number,       //  22  CLAMP_MIN,
  number,       //  23  CLAMP_MAX
]