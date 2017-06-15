
var random = require('lodash').random;
var join = require('path').join;
var writeFileSync = require('fs').writeFileSync;
var bills = [];
var now = new Date;

// Make our mock data with 100 bills:
for (var index = 0; index < 100; index++) {

  // Initialize a new date before we modify it:
  var billdate = new Date(now);
  // Increase the month to simulate a monthly bill:
  now.setMonth(now.getMonth() + 1);

  // Make up some charges:
  var charges = random(10000, 20000);

  // Add to the bills array:
  bills.push({
    Id: (new Date).getTime() + '' + random(1000,9999),
    charges: charges,
    date: billdate,
    // Initialize the new date before "now" is modified again:
    due: new Date(now),
    // Generate some mock-data of unique previous charges (credits or debts) otherwise the original charge:
    total: random(0,5) === 0 ? (charges + random(1000,5000)) : random(0,4) === 0 ? (charges - random(1000,5000)) : charges,
    // Generate some mock-usage data:
    usage: random(50,250)
  });

  // After we've add, step backwards for the next bill:
  now.setMonth(now.getMonth() - 2);

}

// Write the new file:
writeFileSync(join(__dirname,'bills.mock-data.json'), JSON.stringify(bills, null, '  '));
