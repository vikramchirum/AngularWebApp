
var _ = require('lodash');
var join = require('path').join;
var writeFileSync = require('fs').writeFileSync;
var transactions = [];

// Make our mock data with 25 transactions:
for (
  var index = 0,
    Id = null,
    isABill = true,
    now = new Date;
  index < 15;
  index++
) {

  Id = now.getTime() + '' + _.random(1000,9999);

  isABill = !isABill;

  if (isABill) {
    transactions.push({
      Id: Id,
      type: 'bill',
      date: new Date(now)
    });
  } else {
    var weekAgo = new Date(now);
    transactions.push({
      Id: Id,
      type: 'payment',
      date: weekAgo.setDate(weekAgo.getDate() - 7)
    });
  }

  now.setMonth(now.getMonth() -1);

}

// Create the balance from the bottom-up:
for (
  var index = transactions.length - 1,
    balance = 0;
  index >= 0;
  index--
) {
  transactions[index].balance = balance;
  if (transactions[index].type === 'bill') {
    // Generate a random bill:
    transactions[index].amount = _.random(10000,20000);
    balance -= transactions[index].amount;
  } else {
    // Generate a payment to cover the difference in balance:
    transactions[index].amount = balance === 0 ? 30000 : Math.abs(balance);
    balance += transactions[index].amount;
  }
}

// Write the new file:
writeFileSync(join(__dirname,'ledger.mock-data.json'), JSON.stringify(transactions, null, '  '));
