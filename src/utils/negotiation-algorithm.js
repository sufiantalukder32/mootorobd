export function suggestFairPrice(sellerAsk, buyerOffer, fairValue) {
  const weighted = fairValue * 0.4 + sellerAsk * 0.3 + buyerOffer * 0.3;
  return Math.round(weighted);
}

export function canAgree(sellerAsk, buyerOffer) {
  const ask = Number(sellerAsk);
  const offer = Number(buyerOffer);
  if (!ask) return false;
  const percentDiff = Math.abs(ask - offer) / ask;
  return percentDiff <= 0.05;
}
