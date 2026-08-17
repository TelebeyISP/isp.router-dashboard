const Subscriber = require('./models/subscriber');

const DEMO_IMSI = '001010000000001';

module.exports = function seedDemoSubscriber() {
  Subscriber.count(function (err, count) {
    if (err) {
      console.error('Demo subscriber seed failed:', err.message);
      return;
    }
    if (count) {
      return;
    }

    const doc = new Subscriber({
      imsi: DEMO_IMSI,
      msisdn: ['1234567890'],
      security: {
        k: '465B5CE8B199B49FAA5F0A2EE238A6BC',
        amf: '8000',
        op_type: 0,
        opc: 'E8ED289DEBA952E4283B54E88E6183CA'
      },
      ambr: {
        downlink: { value: 1, unit: 3 },
        uplink: { value: 1, unit: 3 }
      },
      slice: [{
        sst: 1,
        default_indicator: true,
        session: [{
          name: 'internet',
          type: 3,
          qos: {
            index: 9,
            arp: {
              priority_level: 8,
              pre_emption_capability: 1,
              pre_emption_vulnerability: 1
            }
          },
          ambr: {
            downlink: { value: 1, unit: 3 },
            uplink: { value: 1, unit: 3 }
          }
        }]
      }]
    });

    doc.save(function (saveErr) {
      if (saveErr) {
        console.error('Demo subscriber seed failed:', saveErr.message);
        return;
      }
      console.log('Seeded demo subscriber IMSI', DEMO_IMSI);
    });
  });
};
