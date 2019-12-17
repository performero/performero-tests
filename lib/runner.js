const RequestAnalyser = require('./request-analyser');
const autocannon = require('autocannon');

const mapResults = (d) =>{
  return {
    avg: d.average,
    min: d.min,
    max: d.max,
    stddev: d.stddev,
    percentiles: {
      '0.001': d.p0_001,
      '0.01': d.p0_01,
      '0.1': d.p0_1,
      '1': d.p1,
      '2.5': d.p2_5,
      '10': d.p10,
      '25': d.p25,
      '50': d.p50,
      '75': d.p75,
      '90': d.p90,
      '97.5': d.p97_5,
      '99': d.p99,
      '99.9': d.p99_9,
      '99.99': d.p99_99,
      '99.999': d.p99_999
    } 
  }
}
module.exports = (options) => {
  return new Promise((resolve, reject) => {
    const requestAnalyser = new RequestAnalyser();

    options.setupClient = (client) =>{
      client.on('headers', (request) =>{
        requestAnalyser.analyse(request);
      });
    }

    const instance = autocannon(options, (error, result) => {
      if (error) {
        reject(error);
      } else {
        console.log(result)
        resolve({
          result: {
            start: result.start,
            finish: result.finish,

            totalResponses: result.requests.total,
            totalRequests: result.requests.sent,
            totalErrors: result.errors,
            totalTimeouts: result.timeouts,
            totalTimeSeconds: result.duraction,
            codes: {
              '1xx': result['1xx'],
              '2xx': result['2xx'],
              '3xx': result['3xx'],
              '4xx': result['4xx'],
              '5xx': result['5xx'],
            },
            rps: mapResults(result.requests),
            latency: mapResults(result.latency),
            throughput: mapResults(result.throughput),
            ...requestAnalyser.getResult()
          },
          options: options
        });

      }
    });
    
  });
}