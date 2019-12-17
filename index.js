const runnerPromise = require('./lib/runner');


runnerPromise({
	url: '[url goes here]',
  amount: 1000,
  connections: 100,
  method: 'GET',
}).then((data)=>{
  console.log('done');
  console.log(data.result);
  console.log(data.options)
});
