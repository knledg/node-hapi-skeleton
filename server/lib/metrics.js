/* Provides metric check functionality on the server to monitor performance */

import Timing from 'timing';
import Promise from 'bluebird';

// Models
import {Metric} from 'server/models/metric';

// Consts
const timing = new Timing({debug: process.env.TIMING_LOGS_ENABLED});

class Metrics {
  timers = {}

  /**
   * [startTimer - start a timer]
   * @param  {string} name - Primary tag
   * @param  {array} additionalTags
   * @return {null}
   */
  startTimer(name, additionalTags = []) {
    timing.time(name);
    this.timers[name] = {additionalTags};
  }

  /**
   * [endTimer - End timer and store result in database.
   *             Name of the timer is a tag and additional tags can be specified]
   * @param  {string} name - Primary Tag
   * @return {promise}
   */
  endTimer(name) {
    const timerCfg = this.timers[name];
    const result = timing.timeEnd(name);


    delete this.timers[name];
    return new Metric({
      metric: 'Timing',
      measurement: result.duration,
      unit: 'milleseconds',
      tags: timerCfg.additionalTags.concat([ name ]),
    })
      .save();
  }

  /**
   * [memory - Log memory and attach to tags]
   * @param  {Object}
   * @return {promise}
   */
  memory(opts) {
    let inserts = [];
    const values = process.memoryUsage(); // rss: 470634496, heapTotal: 438332160, heapUsed: 145946192 }

    inserts.push(
      new Metric({
        metric: 'Residential Set Size',
        measurement: values.rss,
        unit: 'bytes',
        tags: opts.tags,
        metadata: opts.metadata,
      })
        .save()
    );

    inserts.push(
      new Metric({
        metric: 'Heap Total',
        measurement: values.heapTotal,
        unit: 'bytes',
        tags: opts.tags,
        metadata: opts.metadata,
      })
        .save()
    );

    inserts.push(
      new Metric({
        metric: 'Heap Used',
        measurement: values.heapUsed,
        unit: 'bytes',
        tags: opts.tags,
        metadata: opts.metadata,
      })
        .save()
    );

    return Promise.all(inserts);
  }
}

export const metrics = new Metrics;
