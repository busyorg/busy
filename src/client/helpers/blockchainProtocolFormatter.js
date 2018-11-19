// https://github.com/steemit/steem-js/blob/1ebe788987d395af5fd8c80c1bbf06e24614a86c/src/api/methods.js
import blockchainAPI from '../blockchainAPI';

// Vendor file - disable eslint
/* eslint-disable */
const createFormatter = api => {
  function numberWithCommas(x) {
    return x.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function SCOREvalueInTME(account, gprops) {
    const score = parseFloat(account.SCORE.split(' ')[0]);
    const totalSCORE = parseFloat(gprops.totalSCORE.split(' ')[0]);
    const totalSCOREvalueInTME = parseFloat(gprops.totalTMEfundForSCORE.split(' ')[0]);
    const accountSCOREvalueInTME = totalSCOREvalueInTME * (score / totalSCORE);
    return accountSCOREvalueInTME;
  }

  function processOrders(open_orders, assetPrecision) {
    const TSDorders = !open_orders ?
      0 :
      open_orders.reduce((o, order) => {
        if (order.sell_price.base.indexOf('TSD') !== -1) {
          o += order.for_sale;
        }
        return o;
      }, 0) / assetPrecision;

    const ordersTME = !open_orders ?
      0 :
      open_orders.reduce((o, order) => {
        if (order.sell_price.base.indexOf('TME') !== -1) {
          o += order.for_sale;
        }
        return o;
      }, 0) / assetPrecision;

    return {
      ordersTME,
      TSDorders
    };
  }

  function calculateSaving(savings_withdraws) {
    let TMEsavingsPending = 0;
    let TSDpendingSavings = 0;
    savings_withdraws.forEach(withdraw => {
      const [amount, asset] = withdraw.amount.split(' ');
      if (asset === 'TME') TMEsavingsPending += parseFloat(amount);
      else if (asset === 'TSD') TSDpendingSavings += parseFloat(amount);
    });
    return {
      TMEsavingsPending,
      TSDpendingSavings
    };
  }

  function estimateAccountValue(
    account, {
      gprops,
      feed_price,
      open_orders,
      savings_withdraws,
      SCOREvalueInTME
    } = {},
  ) {
    const promises = [];
    const username = account.name;
    const assetPrecision = 1000;
    let orders, savings;

    if (!SCOREvalueInTME || !feed_price) {
      if (!gprops || !feed_price) {
        promises.push(
          api.sendAsync('get-state', [`/@${username}`]).then(data => {
            gprops = data.props;
            feed_price = data.feed_price;
            SCOREvalueInTME = SCOREvalueInTME(account, gprops);
          }),
        );
      } else {
        SCOREvalueInTME = SCOREvalueInTME(account, gprops);
      }
    }

    if (!open_orders) {
      promises.push(
        api.sendAsync('get_open_orders', [username]).then(open_orders => {
          orders = processOrders(open_orders, assetPrecision);
        }),
      );
    } else {
      orders = processOrders(open_orders, assetPrecision);
    }

    if (!savings_withdraws) {
      promises.push(
        api.sendAsync('get_savings_withdraw_from', [username]).then(savings_withdraws => {
          savings = calculateSaving(savings_withdraws);
        }),
      );
    } else {
      savings = calculateSaving(savings_withdraws);
    }

    return Promise.all(promises).then(() => {
      let TMEtoTSDprice;
      const {
        base,
        quote
      } = feed_price;
      if (/ TSD$/.test(base) && / TME$/.test(quote)) {
        TMEtoTSDprice = parseFloat(base.split(' ')[0]);
      }
      const TMEsavingsBalance = account.TMEsavingsBalance;
      const TSDsavingsBalance = account.TSDsavingsBalance;
      const balanceTME_Parsed = parseFloat(account.balance.split(' ')[0]);
      const saving_balanceTME_Parsed = parseFloat(TMEsavingsBalance.split(' ')[0]);
      const TSDbalance_Parsed = parseFloat(account.TSDbalance);
      const TSDsavingsBalance_Parsed = parseFloat(TSDsavingsBalance.split(' ')[0]);

      let conversionValue = 0;
      const currentTime = new Date().getTime();
      (account.other_history || []).reduce((out, item) => {
        if (get(item, [1, 'op', 0], '') !== 'convert') return out;

        const timestamp = new Date(get(item, [1, 'timestamp'])).getTime();
        const finishTime = timestamp + 86400000 * 3.5; // add 3.5day conversion delay
        if (finishTime < currentTime) return out;

        const amount = parseFloat(get(item, [1, 'op', 1, 'amount']).replace(' TSD', ''));
        conversionValue += amount;
      }, []);

      const TSDtotal =
        TSDbalance_Parsed +
        TSDsavingsBalance_Parsed +
        savings.TSDpendingSavings +
        orders.TSDorders +
        conversionValue;

      const totalTME =
        SCOREvalueInTME +
        balanceTME_Parsed +
        saving_balanceTME_Parsed +
        savings.TMEsavingsPending +
        orders.ordersTME;

      return (totalTME * TMEtoTSDprice + TSDtotal).toFixed(2);
    });
  }

  return {
    reputationFloat(reputation) {
      if (reputation == null) return reputation;
      reputation = parseInt(reputation);
      let rep = String(reputation);
      const neg = rep.charAt(0) === '-';
      rep = neg ? rep.substring(1) : rep;
      const str = rep;
      const leadingDigits = parseInt(str.substring(0, 4));
      const log = Math.log(leadingDigits) / Math.log(10);
      const n = str.length - 1;
      let out = n + (log - parseInt(log));
      if (isNaN(out)) out = 0;
      out = Math.max(out - 9, 0);
      out = (neg ? -1 : 1) * out;
      out = out * 9 + 25;
      return parseFloat(out);
    },

    reputation(reputation) {
      return parseInt(this.reputationFloat(reputation));
    },

    SCOREinTMEvalue(SCORE, totalSCORE, SCOREbackingTMEfundBalance) {
      return (
        parseFloat(SCOREbackingTMEfundBalance) *
        (parseFloat(SCORE) / parseFloat(totalSCORE))
      );
    },

    commentPermlink(parentAuthor, parentPermlink) {
      const timeStr = new Date()
        .toISOString()
        .replace(/[^a-zA-Z0-9]+/g, '')
        .toLowerCase();
      parentPermlink = parentPermlink.replace(/(-\d{8}t\d{9}z)/g, '');
      return `re-${parentAuthor}-${parentPermlink}-${timeStr}`;
    },

    amount(amount, asset) {
      return `${amount.toFixed(3)} ${asset}`;
    },
    numberWithCommas,
    SCOREvalueInTME,
    estimateAccountValue,
  };
};

export default createFormatter(blockchainAPI);
