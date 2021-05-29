import { HttpClient } from "@angular/common/http";
import { IFundingRate } from "../models/funding-rate";
import { Exchange } from "./base-exchange";
import { catchError, map } from 'rxjs/operators';
import { combineLatest, Observable, of } from "rxjs";

export class XDeribit extends Exchange{

  constructor(
    httpClient: HttpClient,
    apiKey?: string,
    apiSecret?: string
  ){
    super(httpClient, apiKey, apiSecret);
    this._name = "Deribit";
    this._baseUrl = "https://www.deribit.com/api/v2/";
  }
  
  getFuningRate(): Promise<IFundingRate[]> {
    // const startTime = new Date();
    // startTime.setHours(startTime.getHours() -8 );
    // const endTime = new Date();
    // const res_btc = this.getFundingRateBySymbol('BTC', startTime, endTime);
    // const res_eth = this.getFundingRateBySymbol('ETH', startTime, endTime);
    // return combineLatest(res_btc, res_eth)
    //   .pipe(
    //     map((data)=> {
    //       const result:IFundingRate[]=[];
    //       // no usdt
    //       return result;
    //     }),
    //     catchError(err => of([]))
    //   ).toPromise();
    return of([]).toPromise();
  }

  getFuningRateCoin(): Promise<IFundingRate[]> {
    const startTime = new Date();
    startTime.setHours(startTime.getHours() -8 );
    const endTime = new Date();
    const res_btc = this.getFundingRateBySymbol('BTC', startTime, endTime);
    const res_eth = this.getFundingRateBySymbol('ETH', startTime, endTime);
    return combineLatest(res_btc, res_eth)
      .pipe(
        map((data)=> {
          const result:IFundingRate[]=[];
          if(data && data.length>0){
            for(let i=0; i<data.length; i++){
              if(data[i]){
                result.push(data[i]);
              }
            }
          }
          return result;
        }),
        catchError(err => of([]))
      ).toPromise();
  }

  getFundingRateBySymbol(symbol:string, starttime:Date, endtime:Date):Observable<IFundingRate>{
    return  this._http.get<IDeribitFundingRate>(this._baseUrl+"public/get_funding_rate_value?end_timestamp="+endtime.getTime()+"&instrument_name="+symbol+"-PERPETUAL&start_timestamp="+starttime.getTime())
    .pipe(
      map(data => {
        if(data){
          const result:IFundingRate = {
            symbol: symbol+'USD',
            rate: data.result
          };
          return result;
        }
        else{
          return null;
        }
      }),
      catchError(err => of(null))
    );
  }
}

interface IDeribitFundingRate{
  jsonrpc: string;
  result: number;
  usIn: number;
  usOut: number;
  usDiff: number;
  testnet: boolean;
}