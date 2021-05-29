import { HttpClient, HttpHeaders } from "@angular/common/http";
import { IFundingRate } from "../models/funding-rate";
import { Exchange } from "./base-exchange";
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from "rxjs";
import * as CryptoJS from 'crypto-js';

export class XKuCoin extends Exchange{
  protected _passPhase: string;
  constructor(
    httpClient: HttpClient,
    apiKey?: string,
    apiSecret?: string,
    passPhase?: string
  ){
    super(httpClient, apiKey, apiSecret);
    this._passPhase = passPhase;
    this._name = "KuCoin";
    this._baseUrl = "https://api-futures.kucoin.com/api/v1/";
  }
  
  getFuningRate(): Promise<IFundingRate[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return  this._http.get<IKuCoinContractsResponse>(this._baseUrl+"contracts/active", httpOptions)
    .pipe(
      map(resp => {
        const result:IFundingRate[] = [];
        if(resp.data && resp.data.length>0){
          const data = resp.data;
          for(let i=0; i<data.length; i++) {
            if(data[i].quoteCurrency!='USD'){
              let symbol = `${this.filterSymbol(data[i].baseCurrency)}${this.filterSymbol(data[i].quoteCurrency)}`,
                  rate = data[i].fundingFeeRate;              
              result.push({
                symbol: symbol,
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
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return  this._http.get<IKuCoinContractsResponse>(this._baseUrl+"contracts/active", httpOptions)
    .pipe(
      map(resp => {
        const result:IFundingRate[] = [];
        if(resp.data && resp.data.length>0){
          const data = resp.data;
          for(let i=0; i<data.length; i++) {
            if(data[i].quoteCurrency=='USD'){
              let symbol = `${this.filterSymbol(data[i].baseCurrency)}${this.filterSymbol(data[i].quoteCurrency)}`,
                  rate = data[i].fundingFeeRate;              
              result.push({
                symbol: symbol,
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

  filterSymbol(symbol: string){

    return symbol.replace(/^XBT$/, 'BTC');
  }
}

interface IKuCoinContract{
  symbol: string;
  baseCurrency: string;
  quoteCurrency: string;
  fundingFeeRate: number;

}

interface IKuCoinContractsResponse{
  code: number;
  data: IKuCoinContract[];
}