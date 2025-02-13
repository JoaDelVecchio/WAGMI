export interface IPortfolio extends Document {
  _id: string;
  userId: string;
  portfolioName: string;
  tokens: { tokenId: string; amount: number }[];
}
