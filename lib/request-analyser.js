'use strict';

const hdr = require("hdr-histogram-js");

const histogramResult = (histogram) => {
  return {
    min: histogram.minNonZeroValue,
    max: histogram.maxValue, 
    avg: histogram.getMean(),
    percentile: {
      '0.001': histogram.getValueAtPercentile(0.001),
      '0.01': histogram.getValueAtPercentile(0.01),
      '0.1': histogram.getValueAtPercentile(0.1),
      '1': histogram.getValueAtPercentile(1),
      '2.5': histogram.getValueAtPercentile(2.5),
      '10': histogram.getValueAtPercentile(10),
      '25': histogram.getValueAtPercentile(25),
      '50': histogram.getValueAtPercentile(50),
      '75': histogram.getValueAtPercentile(75),
			'90': histogram.getValueAtPercentile(90),
			'97.5': histogram.getValueAtPercentile(97.5),
			'99': histogram.getValueAtPercentile(99),
			'99.9': histogram.getValueAtPercentile(99.9),
			'99.99': histogram.getValueAtPercentile(99.99),
			'99.999': histogram.getValueAtPercentile(99.999),
    }
  };
};


module.exports = class RequestAnalyser {
  

  constructor() {
    this.rssHistogram = hdr.build();
    this.heapTotalHistogram = hdr.build();
    this.heapUsedHistogram = hdr.build();
    this.externalHistogram = hdr.build();
  }
  analyse(request) {
    for (let i = 0; i < request.headers.length; i = i + 2) {
      const headerName = request.headers[i].toLowerCase();
      switch (headerName) {
        case 'performero-memoryusage-rss': this.rssHistogram.recordValue(parseInt(request.headers[i +1], 10)); break;
        case 'performero-memoryusage-heaptotal': this.heapTotalHistogram.recordValue(parseInt(request.headers[i +1], 10)); break;
        case 'performero-memoryusage-heapused': this.heapUsedHistogram.recordValue(parseInt(request.headers[i +1], 10)); break;
        case 'performero-memoryusage-external': this.externalHistogram.recordValue(parseInt(request.headers[i +1], 10)); break;
      
        default:
          break;
      }
    }
  }

  getResult() {
    return {
      memoryUsageRSS: histogramResult(this.rssHistogram),
      memoryUsageHeapTotal: histogramResult(this.heapTotalHistogram),
      memoryUsageHeapUsed: histogramResult(this.heapUsedHistogram),
      memoryUsageExternal: histogramResult(this.externalHistogram)
    }
  }
  
};