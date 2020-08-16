# Kusaki
Kusaki is a tool to find reuploads of YouTube videos using the power of search engines.

## Setup

1. Download the latest release of Kusaki and [Node.js](https://nodejs.org/en/download/).
2. Install the dependencies via ``npm install``.
3. Run Kusaki via ``node kusaki --help``

## How it works

First, it searches DuckDuckGo (in HTML version of the site) for the ID, specifies what kind of result (English video sites),
scrapes the results and throws the results in a JSON file.

## Example

Terminal Input:

```node kusaki -i 7pNezfD7CLw```

Terminal Output:

```

kusaki - youtube archival tool
===============================
- searching for the entire internet for the id...

- pushing to array... [result 1]
- pushing to array... [result 2]
- pushing to array... [result 3]
- pushing to array... [result 4]
- pushing to array... [result 5]

- writing results to json file...

[!] finished file `./json/data-7pNezfD7CLw.json`

```

File Output (pretty-ified):

```json
[
    {
        "linkTitle":"D'oh! Actually: A Special Simpsons Episode [Um ... - YouTube",
        "url":"https://www.youtube.com/watch?v=7pNezfD7CLw"
    },
    {
        "linkTitle":"collegehumor.com URL-Extractor Report",
        "url":"https://www.pentesterking.com/tools/urlextractor/collegehumor.com"
    },
    {
        "linkTitle":"D'oh! Actually: A Special Simpsons Episode [Um Actually ...",
        "url":"https://www.transcriptdb.com/watch/7pNezfD7CLw"
    },
    {
        "linkTitle":"CollegeHumor - rsssearchhub.com",
        "url":"https://www.rsssearchhub.com/feed/c41274469df7851e534dcbec2a4cf8d8/collegehumor-picture-galleries"
    },
    {
        "linkTitle":"CollegeHumor - US",
        "url":"https://invidio.us/feed/channel/UCPDXXXJj9nax0fr0Wfc048g"
    }
]
```