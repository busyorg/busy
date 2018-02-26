import _ from 'lodash';
import { CRYPTO_MAP } from '../../common/constants/cryptos';

export function getCryptoDetails(cryptoQuery) {
  const getCryptoBySymbol = _.get(CRYPTO_MAP, _.toUpper(cryptoQuery), {});

  if (!_.isEmpty(getCryptoBySymbol)) {
    return getCryptoBySymbol;
  }

  const cryptoDetails = _.find(CRYPTO_MAP, crypto => {
    const formattedCryptoName = _.toLower(crypto.name).replace(/\s/g, ''); // lowercase & remove spaces
    const formattedCryptoSymbol = _.toLower(crypto.symbol);
    const matchesCryptoId = crypto.id === cryptoQuery;
    const matchesCryptoName = formattedCryptoName === cryptoQuery;
    const matchesCryptoSymbol = formattedCryptoSymbol === cryptoQuery;
    return matchesCryptoId || matchesCryptoName || matchesCryptoSymbol;
  });

  return cryptoDetails || {};
}

export const getCurrentDaysOfTheWeek = currentLocale => {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  const daysOfTheWeek = [];
  const locale = currentLocale === 'auto' ? window.navigator.language : currentLocale;

  for (let i = 0; i < 7; i += 1) {
    date.setDate(date.getDate() + 1);
    const dateLocale = date.toLocaleString(locale, { weekday: 'short' });
    daysOfTheWeek.push(dateLocale);
  }

  return daysOfTheWeek;
};

function getPriceDifferencePercentage(currentCryptoPrice, previousCryptoPrice) {
  const priceDifference = currentCryptoPrice - previousCryptoPrice;
  const priceIncrease = priceDifference / currentCryptoPrice;
  return Math.abs(priceIncrease);
}

export function getCryptoPriceIncreaseDetails(usdCryptoPriceHistory, btcCryptoPriceHistory) {
  const currentUSDPrice = _.last(usdCryptoPriceHistory);
  const previousUSDPrice = _.nth(usdCryptoPriceHistory, -2);
  const cryptoUSDIncrease = currentUSDPrice > previousUSDPrice;
  const usdPriceDifferencePercent = getPriceDifferencePercentage(currentUSDPrice, previousUSDPrice);

  const currentBTCPrice = _.last(btcCryptoPriceHistory);
  const previousBTCPrice = _.nth(btcCryptoPriceHistory, -2);
  const cryptoBTCIncrease = currentBTCPrice > previousBTCPrice;
  const btcPriceDifferencePercent = getPriceDifferencePercentage(currentBTCPrice, previousBTCPrice);

  return {
    currentUSDPrice,
    currentBTCPrice,
    cryptoUSDIncrease,
    cryptoBTCIncrease,
    usdPriceDifferencePercent,
    btcPriceDifferencePercent,
  };
}
