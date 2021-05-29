import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Exchange } from '../exchanges/base-exchange';
import { XBinance } from '../exchanges/binance';
import { XBitfinex } from '../exchanges/bitfinex';
import { XBitmex } from '../exchanges/bitmex';
import { XDeribit } from '../exchanges/deribit';
import { XdYdX } from '../exchanges/dydx';
import { XFTX } from '../exchanges/ftx';
import { XGate } from '../exchanges/gate';
import { XBybit } from '../exchanges/bybit';
import { XHuobi } from '../exchanges/huobi';
import { XKuCoin } from '../exchanges/kucoin';
import { XMxc } from '../exchanges/mxc';
import { XOKEx } from '../exchanges/okex';
import { XPoloniex } from '../exchanges/poloniex';

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {
  exchangs: Exchange[];
  constructor(
    private http: HttpClient,
  ) {
    this.exchangs = [
      new XBinance(this.http),
      new XKuCoin(this.http),
      new XHuobi(this.http),
      new XBitfinex(this.http),
      new XOKEx(this.http),
      new XFTX(this.http),
      new XBitmex(this.http),
      new XDeribit(this.http),
      new XPoloniex(this.http),
      //new XKraken(this.http),
      new XdYdX(this.http),
      new XGate(this.http),
      new XMxc(this.http),
      new XBybit(this.http),
      //----//
      //new XDelta(this.http),
    ];
  }

}
