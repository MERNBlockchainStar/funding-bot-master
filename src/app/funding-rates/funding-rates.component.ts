import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { XDelta } from '../exchanges/delta';
import { IFundingRate } from '../models/funding-rate';
import { ExchangeService } from '../services/exchange.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { XCrypto } from '../exchanges/crypto';

@Component({
  selector: 'funding-rates-panel',
  templateUrl: './funding-rates.component.html',
  styleUrls: ['./funding-rates.component.scss']
})
export class FundingRatesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;

  exchangeNames = [
    "Binance",
    "KuCoin",
    "Huobi",
    "Bitfinex",
    "OKEx",
    "FTX",
    "Bitmex",
    "Deribit",
    "Poloniex",
//    "Kraken",
    "dYdX",
    "Gate",
    "MXC",
    "Bybit",
    "Delta",
    "Crypto"
  ];

  xDelta: XDelta;
  xCrypto: XCrypto;
  isLoading: boolean = false;

  displayedColumns: string[] = ['id', 'symbol', ...this.exchangeNames];
  dataSource: MatTableDataSource<RowData>;

  constructor(
    private exchangeService: ExchangeService,
    private http: HttpClient
  ) {
    this.dataSource = new MatTableDataSource([]);
    this.xDelta = new XDelta(this.http);
    this.xCrypto = new XCrypto(this.http);
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;

    //this.refresh();
  }

  ngOnInit(): void {
  }

  applyFilter(event: Event) {
    const keyword = (event.target as HTMLInputElement).value;
    this.dataSource.filter = keyword.trim().toLowerCase();
  }

  async refresh() {
    this.isLoading = true;
    const buffer: RowData[] = [];
    const x = this.exchangeService.exchangs;

    for (let xIndex = 0; xIndex < x.length; xIndex++) {
      const xKey = x[xIndex].name;
      const data = await x[xIndex].getFuningRate();

      for (let i = 0; i < data.length; i++) {
        if (data[i] !== null && data[i] !== undefined) {
          const symbol = data[i].symbol;
          const rate = data[i].rate;
          const index = this.findSymbolInBuffer(symbol, buffer);

          if (index === -1) {
            const new_index = buffer.length;
            buffer.push(createEmptyRow(symbol));
            buffer[new_index][xKey] = rate;
          }
          else {
            buffer[index][xKey] = rate;
          }
        }
      }
    }
    this.dataSource.data = buffer;
    this.isLoading = false;
    this.xDelta.start(this.onDeltaFundingRate);
    this.xCrypto.start(this.onCryptoFundingRate);
  }

  findSymbolInDatasource(symbol: string) {
    for (let i = 0; i < this.dataSource.data.length; i++) {
      if (this.dataSource.data[i].symbol == symbol) {
        return i;
      }
    }
    return -1;
  }

  findSymbolInBuffer(symbol: string, buffer:RowData[]) {
    for (let i = 0; i < buffer.length; i++) {
      if (buffer[i].symbol == symbol) {
        return i;
      }
    }
    return -1;
  }

  onDeltaFundingRate=(data: IFundingRate)=> {
    let index = this.findSymbolInDatasource(data.symbol);
    if (index === -1) {
      index = this.dataSource.data.length;
      this.dataSource.data.push(createEmptyRow(data.symbol));
    }
    this.dataSource.data[index].Delta = data.rate;
  }

  onCryptoFundingRate=(data: IFundingRate)=> {
    let index = this.findSymbolInDatasource(data.symbol);
    if (index === -1) {
      index = this.dataSource.data.length;
      this.dataSource.data.push(createEmptyRow(data.symbol));
    }
    this.dataSource.data[index].Crypto = data.rate;
  }
}

interface RowData {
  symbol: string;
  Binance: number | null;
  KuCoin: number | null;
  Huobi: number | null;
  Bitfinex: number | null;
  OKEx: number | null;
  FTX: number | null;
  Bitmex: number | null;
  Deribit: number | null;
  Poloniex: number | null;
//  Kraken: number | null;
  dYdX: number | null;
  Gate: number | null;
  MXC: number | null;
  Bybit: number | null;
  Delta: number | null;
  Crypto: number | null;
}

function createEmptyRow(symbol: string) {
  const row: RowData = {
    symbol: symbol,
    Binance: null,
    KuCoin: null,
    Huobi: null,
    Bitfinex: null,
    OKEx: null,
    FTX: null,
    Bitmex: null,
    Deribit: null,
    Poloniex: null,
//    Kraken: null,
    dYdX: null,
    Gate: null,
    MXC: null,
    Bybit: null,
    Delta: null,
    Crypto: null
  };
  return row;
}