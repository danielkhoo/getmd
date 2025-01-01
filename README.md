# getmd

[![](https://img.shields.io/npm/v/getmd.svg?style=flat)](https://github.com/danielkhoo/getmd)

A simple CLI utility wrapper JINA AI's [reader url-to-markdown api](https://jina.ai/reader).
Option `-k` arg to add an api key for a higher rate limit.

## Usage

Fetch and save a target url's page as a markdown file

```bash
$ npx getmd "https://www.stanford.edu/"
---------------------------
Markdown saved as: stanford-university.md
```

Fetch with a JINA AI api key (for higher api rate limits)

```bash
$ npx getmd "https://www.stanford.edu/" -k "YOUR_JINA_API_KEY"
---------------------------
Markdown saved as: stanford-university.md
```

## License

MIT
