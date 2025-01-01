#!/usr/bin/env node

const yargs = require('yargs/yargs');
const fs = require('fs/promises');

const argv = yargs(process.argv.slice(2))
  .command('* <url>', 'Download markdown from URL', (yargs) => {
    return yargs.positional('url', {
      describe: 'Target URL to fetch markdown from',
      type: 'string'
    });
  })
  .option('k', {
    alias: 'key',
    describe: 'API Bearer token',
    type: 'string'
  })
  .usage('Usage: $0 <url> [-k api_token]')
  .example('$0 example.com', 'Download markdown without authentication')
  .example('$0 example.com -k mytoken', 'Download markdown with Bearer token')
  .help('h')
  .alias('h', 'help')
  .argv;

const url = argv.url;
const apiToken = argv.key;

async function run() {
  try {
    // Encode the URL
    const encodedUrl = encodeURIComponent(url);

    // Prepare headers
    const headers = {
      'Accept': 'text/plain'
    };

    // Add authorization header if API token is provided
    if (apiToken) {
      headers['Authorization'] = `Bearer ${apiToken}`;
    }

    // Make the request using native fetch
    const response = await fetch(`https://r.jina.ai/${encodedUrl}`, {
      headers
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const markdown = await response.text();

    // Extract title from markdown
    const titleMatch = markdown.match(/^Title:\s*(.+)$/m);
    if (!titleMatch) {
      throw new Error('Could not find title in the response');
    }
    const title = titleMatch[1];

    // Convert title to kebab case
    const kebabTitle = title
      .toLowerCase()                    // Convert to lowercase
      .replace(/\s+/g, ' ')            // Replace multiple spaces with single space
      .trim()                          // Remove leading/trailing spaces
      .replace(/[^a-z0-9-\s]/g, '')    // Remove special characters
      .replace(/\s+/g, '-')            // Replace spaces with hyphens
      .replace(/^-+|-+$/g, '');        // Remove leading/trailing hyphens

    // Create filename
    const filename = `${kebabTitle}.md`;

    // Write to file
    await fs.writeFile(filename, markdown);
    console.log(`Successfully saved markdown to ${filename}`);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

run();