import { HttpClient, HttpHeaders } from "@angular/common/http";
import { IFundingRate } from "../models/funding-rate";
import { Exchange } from "./base-exchange";
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from "rxjs";

export class XFTX extends Exchange{

  constructor(
    httpClient: HttpClient,
    apiKey?: string,
    apiSecret?: string
  ){
    super(httpClient, apiKey, apiSecret);
    this._name = "FTX";
    this._baseUrl = "https://ftx.com/api/";
  }
  
  getFuningRateCoin(): Promise<IFundingRate[]> {
    return of([]).toPromise();
  }
  getFuningRate(): Promise<IFundingRate[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    const start=new Date();
    start.setHours(start.getHours()-8);
    const start_timestamp=Math.floor(start.getTime()/1000);
    return  this._http.get<IFTXFundingRateResponse>(this._baseUrl+"funding_rates?start_time="+start_timestamp, httpOptions)
    .pipe(
      map(response => {
        const result:IFundingRate[] = [];        
        if(response.success && response.result){
          const data = response.result;
          for(let i=0; i<data.length; i++) {
            const _symbol_arr = data[i].future.split('-');
            const rate = data[i].rate;
            if(_symbol_arr[1]==='PERP'){
              try{                
                result.push({
                  symbol: Exchange.processSymbol(_symbol_arr[0]+'USDT'),
                  rate: rate,
                  time: data[i].time
                });  
              }
              catch(error){}
            }

          }
        }
        return result;
      }),
      catchError(err => of([]))
    ).toPromise();
  }
}

interface IFTXFundingRate{
  future: string;
  rate: number;
  time: Date;
}

interface IFTXFundingRateResponse{
  success: boolean,
  result: IFTXFundingRate[],
}