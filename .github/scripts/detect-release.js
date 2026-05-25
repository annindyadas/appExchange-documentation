const fs = require('fs');

// Detect which release-notes.md files changed
const changedFiles = JSON.parse(process.env.CHANGED_FILES || '[]');

const releaseNoteFiles = changedFiles.filter(f =>
  f.endsWith('release-notes.md')
);

if (releaseNoteFiles.length === 0) {
  // Fallback: scan all known packages
  const packages = JSON.parse(fs.readFileSync('packages.json', 'utf8')).packages;
  for (const pkg of packages) {
    processPackage(pkg.slug);
  }
} else {
  for (const file of releaseNoteFiles) {
    const slug = file.split('/')[0];
    processPackage(slug);
  }
}

function processPackage(slug) {
  const releaseNotesPath = `${slug}/release-notes.md`;

  if (!fs.existsSync(releaseNotesPath)) {
    console.log(`⚠️  No release-notes.md found for ${slug}, skipping.`);
    return;
  }

  const content = fs.readFileSync(releaseNotesPath, 'utf8');

  // Extract all version headings e.g. "## Version 1.1.0 - May 2026"
  const versionRegex = /^## Version ([^\s-–-]+)/gm;
  const matches = [...content.matchAll(versionRegex)];

  if (matches.length === 0) {
    console.log(`⚠️  No version headings found in ${releaseNotesPath}, skipping.`);
    return;
  }

  // All versions found in the release notes file
  const versionsInFile = matches.map(m => m[1]);
  console.log(`📦 ${slug} - versions found in release-notes.md: ${versionsInFile.join(', ')}`);

  // Update packages.json
  const packagesData = JSON.parse(fs.readFileSync('packages.json', 'utf8'));
  const pkg = packagesData.packages.find(p => p.slug === slug);

  if (!pkg) {
    console.log(`⚠️  Package "${slug}" not found in packages.json, skipping.`);
    return;
  }

  let updated = false;
  for (const version of versionsInFile) {
    if (!pkg.versions.includes(version)) {
      // Prepend new version so latest is first in the picklist
      pkg.versions.unshift(version);
      console.log(`✅ Added version "${version}" to packages.json for ${slug}`);
      updated = true;
    }
  }

  if (updated) {
    fs.writeFileSync('packages.json', JSON.stringify(packagesData, null, 2) + '\n', 'utf8');
    console.log(`✅ packages.json updated for ${slug}`);
  } else {
    console.log(`ℹ️  No new versions detected for ${slug} - packages.json unchanged`);
  }
}
