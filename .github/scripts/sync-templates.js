const fs = require('fs');
const path = require('path');

const packages = JSON.parse(fs.readFileSync('packages.json', 'utf8')).packages;

// ── 1. Generate issue templates ───────────────────────────────────────────
for (const pkg of packages) {
  const versionOptions = pkg.versions.map(v => `        - "${v}"`).join('\n');
  const featureOptions = pkg.features.map(f => `        - ${f}`).join('\n');
  const packageSpecificOptions = pkg.package_specific_field.options
    .map(o => `        - ${o}`).join('\n');

  const template = `name: ${pkg.name} — Bug or Support Request
description: Report an issue or ask a setup question for the ${pkg.name} package
labels: ["${pkg.label}"]
body:
  - type: markdown
    attributes:
      value: |
        Thanks for raising an issue with **${pkg.name}**.
        Please fill in as much detail as possible — it helps us resolve your issue faster.
  - type: dropdown
    id: issue-type
    attributes:
      label: Issue Type
      options:
        - Bug — something is not working
        - Setup Help — post-installation question
        - Feature Request — suggest an improvement
    validations:
      required: true
  - type: dropdown
    id: package-version
    attributes:
      label: Package Version
      description: Find this in Setup → Installed Packages → ${pkg.name}
      options:
${versionOptions}
        - Other (specify in description)
    validations:
      required: true
  - type: dropdown
    id: package-specific
    attributes:
      label: ${pkg.package_specific_field.label}
      description: ${pkg.package_specific_field.description}
      options:
${packageSpecificOptions}
    validations:
      required: true
  - type: textarea
    id: description
    attributes:
      label: Description
      description: What happened? What did you expect to happen?
      placeholder: Describe the issue in detail
    validations:
      required: true
  - type: textarea
    id: steps
    attributes:
      label: Steps to Reproduce
      placeholder: |
        1. 
        2. 
        3. 
        4. Expected:
  - type: dropdown
    id: affected-feature
    attributes:
      label: Affected Feature
      options:
${featureOptions}
    validations:
      required: true
  - type: textarea
    id: org-details
    attributes:
      label: Org Details
      placeholder: |
        ${pkg.org_details_placeholder.split('\n').join('\n        ')}
  - type: textarea
    id: error-message
    attributes:
      label: Error Message (if any)
      description: Paste the exact error message or screenshot description here
      render: shell
`;

  const outPath = path.join('.github', 'ISSUE_TEMPLATE', `${pkg.slug}-issue.yml`);
  fs.writeFileSync(outPath, template, 'utf8');
  console.log(`✅ Generated ${outPath}`);
}

// ── 2. Generate config.yml ────────────────────────────────────────────────
const contactLinks = packages.map(pkg => `  - name: 📦 ${pkg.name} — Raise an Issue
    url: ${pkg.links.raise_issue}
    about: Report a bug or ask a setup question for ${pkg.name}`).join('\n');

const configYml = `blank_issues_enabled: false
contact_links:
${contactLinks}
  - name: 🌐 adasApps AppExchange Listing
    url: https://appexchange.salesforce.com
    about: Visit our AppExchange listing for demos and general information
`;

fs.writeFileSync(path.join('.github', 'ISSUE_TEMPLATE', 'config.yml'), configYml, 'utf8');
console.log('✅ Generated .github/ISSUE_TEMPLATE/config.yml');

// ── 3. Update README.md packages table ───────────────────────────────────
const tableRows = packages.map(pkg => {
  const postInstall = `[Setup Guide](${pkg.links.post_install})`;
  const userGuide = `[User Guide](${pkg.links.user_guide})`;
  const releaseNotes = `[Release Notes](${pkg.links.release_notes})`;
  const demo = pkg.links.demo ? `[▶ Watch Demo](${pkg.links.demo})` : '▶ Coming Soon';
  const raiseIssue = `[Raise Issue](${pkg.links.raise_issue})`;
  return `| **${pkg.name}** — ${pkg.description} | ${postInstall} | ${userGuide} | ${releaseNotes} | ${demo} | ${raiseIssue} |`;
}).join('\n');

const newTable = `<!-- PACKAGES_TABLE_START -->
| Package | Post-Install Guide | User Guide | Release Notes | Demo | Report an Issue |
|---------|--------------------|------------|---------------|------|-----------------|
${tableRows}
<!-- PACKAGES_TABLE_END -->`;

let readme = fs.readFileSync('README.md', 'utf8');

if (readme.includes('<!-- PACKAGES_TABLE_START -->')) {
  readme = readme.replace(
    /<!-- PACKAGES_TABLE_START -->[\s\S]*?<!-- PACKAGES_TABLE_END -->/,
    newTable
  );
} else {
  // Fallback: replace the first markdown table found
  readme = readme.replace(
    /\| Package[\s\S]*?\n\n/,
    newTable + '\n\n'
  );
}

fs.writeFileSync('README.md', readme, 'utf8');
console.log('✅ Updated README.md packages table');
