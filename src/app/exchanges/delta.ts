import { HttpClient } from "@angular/common/http";
import { IFundingRate } from "../models/funding-rate";
import { catchError, map } from 'rxjs/operators';
import { EMPTY } from "rxjs";
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';

export class XDelta{
  _name: string;
  _baseUrl: string;
  _http: HttpClient;
  symbols:string[] = [];
  fundingRates: IFundingRate[] = [];
  private socket: WebSocketSubject<any>;

  constructor(httpClient: HttpClient){
    this._http = httpClient;
    this._name = "Delta";
    this._baseUrl = "https://api.delta.exchange/v2/";
  }
  
  async start(onFundingRate:any, onError?:any) {
    this.socket = webSocket('wss://socket.delta.exchange');
    await this._http.get<ITickersResponse>(this._baseUrl+"tickers")
    .pipe(
      map(response => {
        if(response.result && response.result.length>0){
          const tickers= response.result;
          this.symbols=[];
          for(let i=0; i<tickers.length; i++){
            if(tickers[i].contract_type=='perpetual_futures'){
              this.symbols.push(tickers[i].symbol);
            }
          }
          this.socket.subscribe(
            msg => {
              if(msg && msg.type=="funding_rate"){
                const fr_res = msg as IDeltaFundingRate;
                const rate = fr_res.funding_rate;
                if(fr_res.symbol.endsWith('USDT')){
                  const fr:IFundingRate={
                    symbol: fr_res.symbol,
                    rate: rate/100
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
          
          const request = {
            type: "subscribe",
            payload: {
                channels: [
                    {
                        name: "funding_rate",
                        symbols: this.symbols
                    },
                ]
            }
          };
          this.socket.next(request);
        }
      }),
      catchError(err => EMPTY),
    ).toPromise();
  }

  async startCoin(onFundingRate:any, onError?:any) {
    this.socket = webSocket('wss://socket.delta.exchange');
    await this._http.get<ITickersResponse>(this._baseUrl+"tickers")
    .pipe(
      map(response => {
        if(response.result && response.result.length>0){
          const tickers= response.result;
          this.symbols=[];
          for(let i=0; i<tickers.length; i++){
            if(tickers[i].contract_type=='perpetual_futures'){
              this.symbols.push(tickers[i].symbol);
            }
          }
          this.socket.subscribe(
            msg => {
              if(msg && msg.type=="funding_rate"){
                const fr_res = msg as IDeltaFundingRate;
                const rate = fr_res.funding_rate;
                if(fr_res.symbol.endsWith('USD') || fr_res.symbol.endsWith('BTC') || fr_res.symbol.includes('USD_')){
                  const fr:IFundingRate={
                    symbol: fr_res.symbol,
                    rate: rate/100
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
          
          const request = {
            type: "subscribe",
            payload: {
                channels: [
                    {
                        name: "funding_rate",
                        symbols: this.symbols
                    },
                ]
            }
          };
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

interface ITicker{
  symbol: string;
  contract_type: string;
}

interface ITickersResponse{
  result: ITicker[];
  success: string;
}

interface IDeltaFundingRate{
  funding_rate: number;
  funding_rate_8h: number;
  next_funding_realization: Date;
  predicted_funding_rate: number;
  predicted_funding_rate_8h: number;
  product_id: number;
  symbol: string;
  timestamp: Date;
  type: string;
}