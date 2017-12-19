import _ from 'lodash';
import { CRYPTO_MAP } from '../../common/constants/cryptos';

export function getCryptoDetails(cryptoQuery) {
  const getCryptoBySymbol = _.get(CRYPTO_MAP, _.toUpper(cryptoQuery), {});

  if (!_.isEmpty(getCryptoBySymbol)) {
    return getCryptoBySymbol;
  }

  const cryptoDetails = _.find(CRYPTO_MAP, (crypto) => {
    const formattedCryptoName = _.toLower(crypto.name).replace(/\s/g, ''); // lowercase & remove spaces
    const formattedCryptoSymbol = _.toLower(crypto.symbol);
    const matchesCryptoId = crypto.id === cryptoQuery;
    const matchesCryptoName = formattedCryptoName === cryptoQuery;
    const matchesCryptoSymbol = formattedCryptoSymbol === cryptoQuery;
    return matchesCryptoId || matchesCryptoName || matchesCryptoSymbol;
  });

  return cryptoDetails || {};
}

const DAYS_OF_THE_WEEK = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const getCurrentDaysOfTheWeek = () => {
  const today = new Date();
  const daysSorted = [];

  for (let i = 0; i < DAYS_OF_THE_WEEK.length; i += 1) {
    const newDate = new Date(today.setDate(today.getDate() - 1));
    daysSorted.push(DAYS_OF_THE_WEEK[newDate.getDay()]);
  }

  return daysSorted.reverse();
};

export function getFormattedCryptoHistoryForRecharts(cryptoPriceHistory) {
  const currentDaysOfTheWeek = getCurrentDaysOfTheWeek();

  return _.map(cryptoPriceHistory, (price, index) => {
    const day = currentDaysOfTheWeek[index];
    return {
      day,
      price,
    };
  });
}

function getPriceDifferencePercentage(currentCryptoPrice, previousCryptoPrice) {
  const priceDifference = currentCryptoPrice - previousCryptoPrice;
  const priceIncrease = priceDifference / currentCryptoPrice;
  return (Math.abs(priceIncrease));
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
