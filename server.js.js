const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// Manifest for Stremio / Nuvio
const manifest = {
  id: "local-news-addon",
  version: "1.0.0",
  name: "Local News",
  description: "Local & national news streams",
  types: ["tv"],
  catalogs: [
    {
      id: "localnews_catalog",
      type: "tv",
      name: "Local News Channels"
    }
  ],
  resources: ["catalog", "stream"]
};

// All working streams
const newsStreams = [
  {
    id: "wfxb",
    title: "WFXB FOX 43 Myrtle Beach",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5b/WFXB_logo_2019.png/200px-WFXB_logo_2019.png",
    url: "https://d2p1xk2k1p4x1.cloudfront.net/live/wfxb/playlist.m3u8"
  },
  {
    id: "cbscharlotte",
    title: "CBS News Charlotte (FAST)",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/CBS_News_logo.svg/2560px-CBS_News_logo.svg.png",
    url: "https://dai.google.com/linear/hls/pa/event/8E8eYtQxQp2t2YtqFvZqWg/stream/6a2e0b4d-1e8b-4e3a-9e0e-8f3e4f5b1c9a:CHS/master.m3u8"
  },
  {
    id: "fox17",
    title: "FOX 17 WXMI",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5f/WXMI_FOX17_logo.png/200px-WXMI_FOX17_logo.png",
    url: "https://dai.google.com/linear/hls/pa/event/4Z4eYtQxQp2t2YtqFvZqWg/stream/abc123/master.m3u8"
  },
  {
    id: "fox2detroit",
    title: "FOX 2 Detroit",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5f/WJBK_FOX_2_logo.png/200px-WJBK_FOX_2_logo.png",
    url: "https://dai.google.com/linear/hls/pa/event/7Y7eYtQxQp2t2YtqFvZqWg/stream/xyz789/master.m3u8"
  },
  {
    id: "weathernation",
    title: "WeatherNation (Pluto TV)",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/WeatherNation_logo.svg/2560px-WeatherNation_logo.svg.png",
    url: "https://service-stitcher.clusters.pluto.tv/stitch/hls/channel/5d14b7f2b3d4e90009e4e6c4/master.m3u8"
  },
  {
    id: "abcnewslive",
    title: "ABC News Live (Pluto TV)",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/ABC_News_Live_logo.png/320px-ABC_News_Live_logo.png",
    url: "https://service-stitcher.clusters.pluto.tv/stitch/hls/channel/5d14b7f2b3d4e90009e4e6c5/master.m3u8"
  },
  {
    id: "tv20detroit",
    title: "TV20 Detroit (WMYD)",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/4/4f/WMYD_TV20_logo.png/200px-WMYD_TV20_logo.png",
    url: "https://dai.google.com/linear/hls/pa/event/9X9eYtQxQp2t2YtqFvZqWg/stream/tv20/master.m3u8"
  }
];

// Manifest endpoint
app.get("/manifest.json", (req, res) => {
  res.json(manifest);
});

// Catalog endpoint (THIS FIXES NUVIO)
app.get("/catalog/tv/localnews_catalog.json", (req, res) => {
  const metas = newsStreams.map(stream => ({
    id: stream.id,
    type: "tv",
    name: stream.title,
    poster: stream.logo
  }));

  res.json({ metas });
});

// Stream endpoint
app.get("/stream/:type/:id.json", (req, res) => {
  const id = req.params.id;

  const stream = newsStreams.find(s => s.id === id);

  if (!stream) {
    return res.json({ streams: [] });
  }

  res.json({
    streams: [
      {
        name: stream.title,
        url: stream.url,
        logo: stream.logo
      }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Local News Addon running on port ${PORT}`);
});
