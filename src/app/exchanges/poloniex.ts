import { HttpClient } from "@angular/common/http";
import { IFundingRate } from "../models/funding-rate";
import { Exchange } from "./base-exchange";
import { catchError, map } from 'rxjs/operators';
import { of } from "rxjs";

export class XPoloniex extends Exchange{
  protected _passPhase: string;
  constructor(
    httpClient: HttpClient,
    apiKey?: string,
    apiSecret?: string,
    passPhase?: string
  ){
    super(httpClient, apiKey, apiSecret);
    this._passPhase = passPhase;
    this._name = "Poloniex";
    this._baseUrl = "https://futures-api.poloniex.com/api/v1/";
  }
  
  getFuningRate(): Promise<IFundingRate[]> {
    const now = new Date().getTime().toString();
    return  this._http.get<IPoloniexContractsResponse>(this._baseUrl+"contracts/active")
    .pipe(
      map(resp => {
        const result:IFundingRate[] = [];
        if(resp.data && resp.data.length>0){
          const data=resp.data;
          for(let i=0; i<data.length; i++) {
            const symbol = data[i].symbol;
            const rate = data[i].fundingFeeRate;
            if(symbol.match(/PERP$/gi) ){
              result.push({
                symbol: symbol.replace(/PERP$/gi, ''),
                rate: rate
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
    return of([]).toPromise();
  }
}

interface IPoloniexContract{
  "symbol": string; //"BTCUSDTPERP",
  "takerFixFee": number; //0E-10,
  "nextFundingRateTime": Date; //13324478,
  "openInterest": number; //"26969",
  "highPriceOf24h": number; //57494,
  "fundingFeeRate": number; //0.000000,
  "volumeOf24h": number; //106.98100000,
  "riskStep": number; //1000000,
  "makerFixFee": number; //0E-10,
  "isQuanto": boolean; //true,
  "maxRiskLimit": number; //2000000,
  "type": string; //"FFWCSX",
  "predictedFundingFeeRate": number; //0.000000,
  "turnoverOf24h": number; //5934222.00820922,
  "rootSymbol": string; //"USDT",
  "baseCurrency": string; //"XBT",
  "firstOpenDate": number; //1584721775000,
  "tickSize": number; //1.0,
  "initialMargin": number; //0.01,
  "isDeleverage": boolean; //true,
  "markMethod": string; //"FairPrice",
  "indexSymbol": string; //".PXBTUSDT",
  "markPrice": number; //54770.23,
  "minRiskLimit": number; //2000000,
  "fundingBaseSymbol": string; //".XBTINT8H",
  "lowPriceOf24h": number; //53407,
  "lastTradePrice": number; //54900.0000000000,
  "indexPriceTickSize": number; //0.01,
  "fairMethod": string; //"FundingRate",
  "takerFeeRate": number; //0.00075,
  "fundingRateSymbol": string; //".BTCUSDTPERPFPI8H",
  "indexPrice": number; //54770.23,
  "makerFeeRate": number; //0.00010,
  "isInverse": boolean; //false,
  "lotSize": number; //1,
  "multiplier": number; //0.001,
  "settleCurrency": string; //"USDT",
  "maxLeverage": number; //100,
  "fundingQuoteSymbol": string; //".USDTINT8H",
  "quoteCurrency": string; //"USDT",
  "maxOrderQty": number; //1000000,
  "maxPrice": number; //1000000.0000000000,
  "maintainMargin": number; //0.0055,
  "status": string; //"Open"
}

interface IPoloniexContractsResponse{
  code: number;
  data: IPoloniexContract[];
}