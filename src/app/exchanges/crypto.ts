import { HttpClient } from "@angular/common/http";
import { IFundingRate } from "../models/funding-rate";
import { catchError, map } from 'rxjs/operators';
import { EMPTY } from "rxjs";
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';

export class XCrypto{
  _name: string;
  _baseUrl: string;
  _http: HttpClient;
  symbols:string[] = [];
  fundingRates: IFundingRate[] = [];
  private socket: WebSocketSubject<any>;

  constructor(httpClient: HttpClient){
    this._http = httpClient;
    this._name = "Crypto";
    this._baseUrl = "https://deriv-api.crypto.com/v1/";
  }
  
  async start(onFundingRate:any, onError?:any) {
    this.socket = webSocket('wss://deriv-stream.crypto.com/v1/market');
    await this._http.get<IPubicInfoResponse>(this._baseUrl+"common/public_info")
    .pipe(
      map(response => {
        if(response && response.data 
        && response.data.market && response.data.market.headerSymbol 
        && response.data.market.headerSymbol.length>0){
          this.symbols=response.data.market.headerSymbol;
          this.socket.subscribe(
            msg => {
              if(msg.result && msg.result.channel=="funding"){
                const fr_res = msg as ICryptoFundingRateResponse;
                const fris= fr_res.result.data;
                if(fris.length>0){
                  const fr:IFundingRate={
                    symbol: fr_res.result.instrument_name.replace('-PERP', '').replace(/USD$/gi, 'USDT'),
                    rate: fris[0].v
                  }
                  onFundingRate(fr);
                }
                
              }
            },
            err => {
              if(onError)
                onError(err);
            },
            () => {}
          );
          const chanels = [];
          for(let i = 0; i <this.symbols.length; i++){
            chanels.push('funding.'+this.symbols[i])
          }
          const now = new Date();
          const request = {
            id: now.getTime(),
            method: "subscribe",
            params: {
                channels: chanels
            },
            nonce: now.getTime()
        }
        this.socket.next(request);
        }
      }),
      catchError(err => EMPTY),
    ).toPromise();
  }

  async restart(onFundingRate:any, onError?:any) {
    this.socket.unsubscribe();
    await this.start(onFundingRate, onError);
  }
}

interface ICryptoFundingRateValue{
  v: number; //-0.00011,
  t: Date; //1619029380000
}
interface ICryptoFundingRate{
  channel: string; // 'funding',
  subscription: string; //funding.BTCUSD-PERP,
  data: ICryptoFundingRateValue[],
  instrument_name: string; //BTCUSD-PERP
}

interface IPubicInfoResponse{
  code: number;
  data: {
    market: {
      coinList: any[];
      headerSymbol: string[];
      // ...
    }
  };
  msg: string;
}

interface ICryptoFundingRateResponse{
  id: number,
  method: string,
  code: number,
  result: ICryptoFundingRate
}