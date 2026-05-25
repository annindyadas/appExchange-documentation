const https = require('https');

const packages = JSON.parse(
  require('fs').readFileSync('packages.json', 'utf8')
).packages;

const token = process.env.GH_TOKEN;
const repo = 'annindyadas/appExchange-documentation';

async function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'api.github.com',
      path,
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'adasApps-label-sync',
        'X-GitHub-Api-Version': '2022-11-28',
        ...(data ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } : {})
      }
    };

    const req = https.request(options, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: body ? JSON.parse(body) : null }));
    });

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function syncLabels() {
  // Get existing labels
  const { body: existing } = await request('GET', `/repos/${repo}/labels?per_page=100`, null);
  const existingNames = existing.map(l => l.name);

  for (const pkg of packages) {
    if (existingNames.includes(pkg.label)) {
      // Update colour if it changed
      const existingLabel = existing.find(l => l.name === pkg.label);
      if (existingLabel.color !== pkg.label_color) {
        await request('PATCH', `/repos/${repo}/labels/${pkg.label}`, {
          color: pkg.label_color
        });
        console.log(`✅ Updated colour for label "${pkg.label}"`);
      } else {
        console.log(`ℹ️  Label "${pkg.label}" already exists and colour matches`);
      }
    } else {
      // Create new label
      const { status } = await request('POST', `/repos/${repo}/labels`, {
        name: pkg.label,
        color: pkg.label_color,
        description: `Issues for ${pkg.name}`
      });

      if (status === 201) {
        console.log(`✅ Created label "${pkg.label}"`);
      } else {
        console.log(`⚠️  Failed to create label "${pkg.label}" - status ${status}`);
      }
    }
  }
}

syncLabels().catch(err => {
  console.error('Error syncing labels:', err);
  process.exit(1);
});
