# Kusaki
Kusaki is a console tool to find reuploads of YouTube videos using the power of search engines.

[Video Demo](https://youtu.be/gKk_ETAa7y0)
## Use cases
If you're a YouTube archivist like myself, you hate to see missing videos due to copyright takedowns,
YouTube takedowns, or the creator removing the video themselves - resulting in an incomplete archive.

This tool is meant to fix that! It searches many websites (thanks to [Peteyvid](https://peteyvid.com), 
[Archive.org](https://archive.org), and [Dailymotion (via DuckDuckGo searches)](https://dailymotion.com) scraping) to find
reuploads.

## Setup
1. Download the latest release of Kusaki and [Node.js](https://nodejs.org/en/download/).
2. Install the dependencies via ``npm install``.
3. Run ``node kusaki``. (Alternatively, if it's easier, run ``node kusaki --id [id] --title [title]``.)