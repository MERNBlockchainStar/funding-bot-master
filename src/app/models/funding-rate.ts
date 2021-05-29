export interface IFundingRate{
  symbol: string;
//  markPrice: 55241.36857092;
//  indexPrice: 55197.20100000;
//  estimatedSettlePrice: 55283.94064850;
  rate: number;
//  interestRate: 0.00010000;
  nextFundingTime?: Date;
  time?: Date
}