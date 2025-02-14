export interface IPortfolio extends Document {
  _id: string;
  userId: string;
  portfolioName: string;
  tokens: { _id: IToken; amount: number }[];
}

export interface IToken extends Document {
  _id: string;
  contract: string;
  symbol: string;
  name: string;
  price: number;
  image: string;
}
