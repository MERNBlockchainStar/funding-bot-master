import { HttpClient } from "@angular/common/http";
import { IFundingRate } from "../models/funding-rate";
import { Exchange } from "./base-exchange";
import { catchError, map } from 'rxjs/operators';
import { combineLatest, Observable, of } from "rxjs";

export class XMxc extends Exchange{

  constructor(
    httpClient: HttpClient,
    apiKey?: string,
    apiSecret?: string
  ){
    super(httpClient, apiKey, apiSecret);
    this._name = "MXC";
    this._baseUrl = "https://contract.mxc.com/api/v1/";
  }
  
  getFuningRate(): Promise<IFundingRate[]> {
    return this._http.get<IMxcContractsResponse>(this._baseUrl+"contract/detail")
    .pipe(
      map(async response => {
        const result:IFundingRate[] = [];
        if(response.success && response.data && response.data.length>0){
          const contracts = response.data;
          for(let i=0; i<contracts.length; i++){
            if(contracts[i].quoteCoin=='USDT'){
              const fundingResponse = await this._http.get<IMxcFundingRateResponse>(this._baseUrl+"contract/funding_rate/"+contracts[i].symbol).toPromise();
              const rate = fundingResponse.data.fundingRate;
              if(fundingResponse.success && fundingResponse.data){
                const fundingRateObj:IFundingRate ={
                  symbol: `${contracts[i].baseCoin}${contracts[i].quoteCoin}`,
                  rate: rate,
                  time: fundingResponse.data.timestamp
                }
                result.push(fundingRateObj);
              }
            }
          }
        }
        return result;
      }),
      catchError(err => of(null))
    ).toPromise();
  }

  getFuningRateCoin(): Promise<IFundingRate[]> {
    return this._http.get<IMxcContractsResponse>(this._baseUrl+"contract/detail")
    .pipe(
      map(async response => {
        const result:IFundingRate[] = [];
        if(response.success && response.data && response.data.length>0){
          const contracts = response.data;
          for(let i=0; i<contracts.length; i++){
            if(contracts[i].quoteCoin=='USD'){
              const fundingResponse = await this._http.get<IMxcFundingRateResponse>(this._baseUrl+"contract/funding_rate/"+contracts[i].symbol).toPromise();
              const rate = fundingResponse.data.fundingRate; 
              if(fundingResponse.success && fundingResponse.data){
                const fundingRateObj:IFundingRate ={
                  symbol: `${contracts[i].baseCoin}${contracts[i].quoteCoin}`,
                  rate: rate,
                  time: fundingResponse.data.timestamp
                }
                result.push(fundingRateObj);
              }
            }
          }
        }
        return result;
      }),
      catchError(err => of(null))
    ).toPromise();
  }
}

interface IMxcContract{
  symbol: string;
  baseCoin: string;
  quoteCoin: string;
}

interface IMxcContractsResponse{
  success: boolean,
  code: number,
  data: IMxcContract[]
}

interface IMxcFundingRate{
  "symbol": string,
  "fundingRate": number,
  "maxFundingRate":number,
  "minFundingRate": number,
  "collectCycle": number,
  "nextSettleTime": Date,
  "timestamp": Date,
}

interface IMxcFundingRateResponse{
    "success": boolean,
    "code": number,
    "data": IMxcFundingRate
}