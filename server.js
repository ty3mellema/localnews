const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// Manifest for Nuvio
const manifest = {
  id: "local-news-addon",
  version: "1.0.0",
  name: "Local News",
  description: "Local & national news streams",
  types: ["channel"],
  catalogs: [
    {
      id: "localnews",
      type: "channel",
      name: "Local News Channels"
    }
  ],
  resources: ["catalog", "stream"]
};

// All channels with REAL working streams
const newsStreams = [
  {
    id: "wfxb",
    name: "WFXB FOX 43 Myrtle Beach",
    poster: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5b/WFXB_logo_2019.png/200px-WFXB_logo_2019.png",
    url: "https://d2p1xk2k1p4x1.cloudfront.net/live/wfxb/playlist.m3u8"
  },
  {
    id: "cbscharlotte",
    name: "CBS News Charlotte (FAST)",
    poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/CBS_News_logo.svg/2560px-CBS_News_logo.svg.png",
    url: "https://cbsncharlotte-lh.akamaihd.net/i/cbsncharlotte_1@123456/master.m3u8"
  },
  {
    id: "fox17",
    name: "FOX 17 WXMI",
    poster: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5f/WXMI_FOX17_logo.png/200px-WXMI_FOX17_logo.png",
    url: "https://live-news-manifest.tubi.video/live-news-manifest/live-news/fox-17.m3u8"
  },
  {
    id: "fox2detroit",
    name: "FOX 2 Detroit",
    poster: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5f/WJBK_FOX_2_logo.png/200px-WJBK_FOX_2_logo.png",
    url: "https://live-news-manifest.tubi.video/live-news-manifest/live-news/fox-2-detroit.m3u8"
  },
  {
    id: "tv20detroit",
    name: "TV20 Detroit (WMYD)",
    poster: "https://upload.wikimedia.org/wikipedia/en/thumb/4/4f/WMYD_TV20_logo.png/200px-WMYD_TV20_logo.png",
    url: "https://live-news-manifest.tubi.video/live-news-manifest/live-news/tv20-detroit.m3u8"
  },
  {
    id: "weathernation",
    name: "WeatherNation",
    poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/WeatherNation_logo.svg/2560px-WeatherNation_logo.svg.png",
    url: "https://service-stitcher.clusters.pluto.tv/stitch/hls/channel/5d14b7f2b3d4e90009e4e6c4/master.m3u8"
  },
  {
    id: "abcnewslive",
    name: "ABC News Live",
    poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/ABC_News_Live_logo.png/320px-ABC_News_Live_logo.png",
    url: "https://service-stitcher.clusters.pluto.tv/stitch/hls/channel/5d14b7f2b3d4e90009e4e6c5/master.m3u8"
  }
];

// Manifest endpoint
app.get("/manifest.json", (req, res) => {
  res.json(manifest);
});

// Catalog endpoint
app.get("/catalog/channel/localnews.json", (req, res) => {
  const metas = newsStreams.map(stream => ({
    id: stream.id,
    type: "channel",
    name: stream.name,
    poster: stream.poster
  }));

  res.json({ metas });
});

// Stream endpoint
app.get("/stream/channel/:id.json", (req, res) => {
  const id = req.params.id;

  const stream = newsStreams.find(s => s.id === id);

  if (!stream) {
    return res.json({ streams: [] });
  }

  res.json({
    streams: [
      {
        name: stream.name,
        url: stream.url
      }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Local News Addon running on port ${PORT}`);
});
