const prometheus = require('prom-client');
const metrics = {
  productsC: new prometheus.Counter({ name: 'products_c_total', help: 'Total products C made' }),
  unusedA: new prometheus.Counter({ name: 'unused_a_total', help: 'Total unused A components' }),
  unusedB: new prometheus.Counter({ name: 'unused_b_total', help: 'Total unused B components' })
};

// Expose metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', prometheus.register.contentType);
  res.end(await prometheus.register.metrics());
});