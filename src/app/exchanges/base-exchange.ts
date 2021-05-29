import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IFundingRate } from "../models/funding-rate";

export abstract class Exchange {
  protected _apiKey: string;
  protected _apiSecret: string;
  protected _name: string;
  protected _baseUrl: string;
  protected _http: HttpClient;

  get name(){
    return this._name;
  }

  constructor(
    httpClient: HttpClient,
    apiKey?: string,
    apiSecret?: string
  ) {
    this._apiKey = apiKey?apiKey:"";
    this._apiSecret = apiSecret?apiSecret:"";
    this._http = httpClient;
  }

  abstract getFuningRate():Promise<IFundingRate[]>;
  abstract getFuningRateCoin():Promise<IFundingRate[]>;

  static processSymbol(symbol:string) {
    symbol = symbol.replace('_PERP', '').replace('-', '');
    return symbol;
  }
}


