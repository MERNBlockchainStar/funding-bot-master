import { HttpClient, HttpHeaders } from "@angular/common/http";
import { IFundingRate } from "../models/funding-rate";
import { Exchange } from "./base-exchange";
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from "rxjs";

export class XOKEx extends Exchange{

  constructor(
    httpClient: HttpClient,
    apiKey?: string,
    apiSecret?: string
  ){
    super(httpClient, apiKey, apiSecret);
    this._name = "OKEx";
    this._baseUrl = "https://www.okex.com/priapi/v5/";
  }
  
  getFuningRate(): Promise<IFundingRate[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    const now = new Date();
    return  this._http.get<IOKExFundingRateResponse>(this._baseUrl+"public/funding-rate-all?t="+now.getTime()+"&currencyType=1", httpOptions)
    .pipe(
      map(response => {
        const result:IFundingRate[] = [];  
        if(response.data && response.data.length>0 && response.data[0].fundingList.length>0){
          const data = response.data[0].fundingList;
          const timestamp = response.data[0].fundingTime;
          for(let i=0; i<data.length; i++) {
            const _symbol_arr = data[i].instId.split("-");
            const base = _symbol_arr[0];  //this.filterSymbol(_symbol_arr[0]);
            const quote = _symbol_arr[1];  //this.filterSymbol(_symbol_arr[1]);
            const rate = data[i].fundingRate;
            if(quote=='USDT'){
              result.push({
                symbol: Exchange.processSymbol(`${base}${quote}`),
                rate: rate,
                time: timestamp
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
    const now = new Date();
    return  this._http.get<IOKExFundingRateResponse>(this._baseUrl+"public/funding-rate-all?t="+now.getTime()+"&currencyType=2", httpOptions)
    .pipe(
      map(response => {
        const result:IFundingRate[] = [];  
        if(response.data && response.data.length>0 && response.data[0].fundingList.length>0){
          const data = response.data[0].fundingList;
          const timestamp = response.data[0].fundingTime;
          for(let i=0; i<data.length; i++) {
            const _symbol_arr = data[i].instId.split("-");
            const base = _symbol_arr[0];  //this.filterSymbol(_symbol_arr[0]);
            const quote = _symbol_arr[1];  //this.filterSymbol(_symbol_arr[1]);
            const rate = data[i].fundingRate;
            if(quote=='USD'){
              result.push({
                symbol: Exchange.processSymbol(`${base}${quote}`),
                rate: rate,
                time: timestamp
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

interface IOKExFundingRate{
  fundingRate: number;
  instId: string;
  nextFundingRate: number;
}

interface IOKExFundingList{
  fundingTime: Date;
  fundingList: IOKExFundingRate[];
}
interface IOKExFundingRateResponse{
  data: IOKExFundingList[],
  code: number,
  msg: string,
}