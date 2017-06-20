
var _ = require('lodash');
var join = require('path').join;
var writeFileSync = require('fs').writeFileSync;
var payments = [];
var now = new Date;

// Make our mock data with 100 payments:
for (var index = 0; index < 100; index++) {

  var account = _.sample([
    ['visa', '1111'],
    ['mastercard', '2222'],
    ['echeck', '333']
  ]);

  // Add to the bills array:
  payments.push({
    Id: now.getTime() + '' + _.random(1000,9999),
    date: new Date(now),
    amount: _.random(10000,20000),
    status: _.sample(['full', 'processing', 'rejected', 'partial']),
    method: account[0],
    account: account[1]
  });

  // After we've add, step backwards for the next payment:
  now.setMonth(now.getMonth() - 1);

}

// Write the new file:
writeFileSync(join(__dirname,'payments.mock-data.json'), JSON.stringify(payments, null, '  '));
