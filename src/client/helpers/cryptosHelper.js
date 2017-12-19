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

export default null;
