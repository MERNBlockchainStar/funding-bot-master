import { HttpClient } from "@angular/common/http";
import { IFundingRate } from "../models/funding-rate";
import { Exchange } from "./base-exchange";
import { catchError, map } from 'rxjs/operators';
import { combineLatest, Observable, of } from "rxjs";

export class XdYdX extends Exchange {

  constructor(
    httpClient: HttpClient,
    apiKey?: string,
    apiSecret?: string
  ) {
    super(httpClient, apiKey, apiSecret);
    this._name = "dYdX";
    this._baseUrl = "https://api.dydx.exchange/v3/";
  }

  getFuningRateCoin(): Promise<IFundingRate[]> {
    return of([]).toPromise();
  }
  
  async getFuningRate(): Promise<IFundingRate[]> {
    const dYdX_markets = await this.getMarketList();
    const responses: Observable<IFundingRate>[] = [];
    for (let i = 0; i < dYdX_markets.length; i++) {
      responses.push(this.getFundingRateBySymbol(dYdX_markets[i]));
    }
    return combineLatest(responses)
    .pipe(
      map(data=>{
        const result:IFundingRate[]=[];
        for(let i=0; i<data.length; i++) {
          if(data[i])
            result.push(data[i]);
        }
        return result;
      })
    ).toPromise();
  }

  filterSymbol(symbol: string){
    return symbol.replace(/^USD$/gi, 'USDT');
  }
  
  getFundingRateBySymbol(market: IMarket): Observable < IFundingRate | null > {
    return  this._http.get<IdYdXHistoricalFundingResponse>(this._baseUrl + "historical-funding/" + market.market)
      .pipe(
        map(data => {
          if (data && data.historicalFunding && data.historicalFunding.length > 0) {
            try {
              const rate = data.historicalFunding[0].rate;              
              const result: IFundingRate = {
                symbol: Exchange.processSymbol(`${this.filterSymbol(market.base)}${this.filterSymbol(market.quote)}`),
                rate: rate,
              };
              return result;
            }
            catch (error) {
              return null;
            }
          }
          else {
            return null
          }
        }),
        catchError(err => of(null))
      );
  }

  async getMarketList(){
    return await this._http.get<IdYdXMarketsResponse>(this._baseUrl + "markets")
    .pipe(
      map(data => {
        if (data && data.markets) {
          const dYdX_markets: IMarket[] = [];
          try {
            for (var market in data.markets) {              
              const m:IMarket = {
                market: data.markets[market].market,
                base: data.markets[market].baseAsset,
                quote: data.markets[market].quoteAsset,
                type: data.markets[market].type,
              }
              if (m.type == 'PERPETUAL') {
                dYdX_markets.push(m);
              }
            }
            return dYdX_markets;
          }
          catch (error) {
            return [];
          }
        }
        else {
          return []
        }
      }),
      catchError(err => of([]))
    ).toPromise();
  }


}

interface IdYdXHistoricalFunding {
  market: string;
  rate: number;
  price: number;
  qffectiveAt: Date;
}

interface IdYdXHistoricalFundingResponse {
  historicalFunding: IdYdXHistoricalFunding[]
}

interface IdYdXMarketsResponse {
  markets: any;
}

interface IMarket {
  market: string;
  base: string;
  quote: string;
  type: string;
}