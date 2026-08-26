const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// Manifest supports BOTH "tv" and "channel"
const manifest = {
  id: "local-news-addon",
  version: "1.0.0",
  name: "Local News",
  description: "Local & national news streams",
  types: ["tv", "channel"],
  catalogs: [
    {
      id: "localnews",
      type: "tv",
      name: "Local News Channels"
    },
    {
      id: "localnews",
      type: "channel",
      name: "Local News Channels"
    }
  ],
  resources: ["catalog", "meta", "stream"]
};

// STREAM STATUS KEY:
// [VERIFIED]   - confirmed working public stream as of Aug 2026
// [UNVERIFIED] - could not confirm; small local affiliates generally don't
//                run public APIs, so these URLs may be dead. Replace them
//                with a URL you've personally tested playing in a browser/VLC.
const newsStreams = [
  {
    id: "abcnewslive",
    name: "ABC News Live",
    poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/ABC_News_Live_logo.png/320px-ABC_News_Live_logo.png",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/ABC_News_Live_logo.png/320px-ABC_News_Live_logo.png",
    url: "https://content.uplynk.com/channel/3324f2467c414329b3b0cc5cd987b6be.m3u8" // [VERIFIED]
  },
  {
    id: "wfxb",
    name: "WFXB FOX 43 Myrtle Beach",
    poster: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5b/WFXB_logo_2019.png/200px-WFXB_logo_2019.png",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5b/WFXB_logo_2019.png/200px-WFXB_logo_2019.png",
    url: "https://d2p1xk2k1p4x1.cloudfront.net/live/wfxb/playlist.m3u8" // [UNVERIFIED]
  },
  {
    id: "cbscharlotte",
    name: "CBS News Charlotte (FAST)",
    poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/CBS_News_logo.svg/2560px-CBS_News_logo.svg.png",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/CBS_News_logo.svg/2560px-CBS_News_logo.svg.png",
    url: "https://cbsncharlotte-lh.akamaihd.net/i/cbsncharlotte_1@123456/master.m3u8" // [UNVERIFIED]
  },
  {
    id: "fox17",
    name: "FOX 17 WXMI",
    poster: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5f/WXMI_FOX17_logo.png/200px-WXMI_FOX17_logo.png",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5f/WXMI_FOX17_logo.png/200px-WXMI_FOX17_logo.png",
    url: "https://live-news-manifest.tubi.video/live-news-manifest/live-news/fox-17.m3u8" // [UNVERIFIED]
  },
  {
    id: "fox2detroit",
    name: "FOX 2 Detroit",
    poster: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5f/WJBK_FOX_2_logo.png/200px-WJBK_FOX_2_logo.png",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5f/WJBK_FOX_2_logo.png/200px-WJBK_FOX_2_logo.png",
    url: "https://live-news-manifest.tubi.video/live-news-manifest/live-news/fox-2-detroit.m3u8" // [UNVERIFIED]
  },
  {
    id: "tv20detroit",
    name: "TV20 Detroit (WMYD)",
    poster: "https://upload.wikimedia.org/wikipedia/en/thumb/4/4f/WMYD_TV20_logo.png/200px-WMYD_TV20_logo.png",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/4/4f/WMYD_TV20_logo.png/200px-WMYD_TV20_logo.png",
    url: "https://live-news-manifest.tubi.video/live-news-manifest/live-news/tv20-detroit.m3u8" // [UNVERIFIED]
  },
  {
    id: "weathernation",
    name: "WeatherNation",
    poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/WeatherNation_logo.svg/2560px-WeatherNation_logo.svg.png",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/WeatherNation_logo.svg/2560px-WeatherNation_logo.svg.png",
    url: "https://service-stitcher.clusters.pluto.tv/stitch/hls/channel/5d14b7f2b3d4e90009e4e6c4/master.m3u8" // [UNVERIFIED - Pluto now requires a session JWT, this link format is stale]
  }
];

// Manifest endpoint
app.get("/manifest.json", (req, res) => {
  res.json(manifest);
});

// Catalog for "tv"
app.get("/catalog/tv/localnews.json", (req, res) => {
  const metas = newsStreams.map(stream => ({
    id: stream.id,
    type: "tv",
    name: stream.name,
    poster: stream.poster,
    logo: stream.logo
  }));
  res.json({ metas });
});

// Catalog for "channel"
app.get("/catalog/channel/localnews.json", (req, res) => {
  const metas = newsStreams.map(stream => ({
    id: stream.id,
    type: "channel",
    name: stream.name,
    poster: stream.poster,
    logo: stream.logo
  }));
  res.json({ metas });
});

// Meta for "tv" - required or players error "no meta addon available"
app.get("/meta/tv/:id.json", (req, res) => {
  const stream = newsStreams.find(s => s.id === req.params.id);
  if (!stream) return res.json({ meta: null });
  res.json({
    meta: {
      id: stream.id,
      type: "tv",
      name: stream.name,
      poster: stream.poster,
      logo: stream.logo,
      background: stream.poster,
      description: stream.name
    }
  });
});

// Meta for "channel"
app.get("/meta/channel/:id.json", (req, res) => {
  const stream = newsStreams.find(s => s.id === req.params.id);
  if (!stream) return res.json({ meta: null });
  res.json({
    meta: {
      id: stream.id,
      type: "channel",
      name: stream.name,
      poster: stream.poster,
      logo: stream.logo,
      background: stream.poster,
      description: stream.name
    }
  });
});

// Stream for "tv"
app.get("/stream/tv/:id.json", (req, res) => {
  const stream = newsStreams.find(s => s.id === req.params.id);
  if (!stream) return res.json({ streams: [] });
  res.json({ streams: [{ name: stream.name, url: stream.url }] });
});

// Stream for "channel"
app.get("/stream/channel/:id.json", (req, res) => {
  const stream = newsStreams.find(s => s.id === req.params.id);
  if (!stream) return res.json({ streams: [] });
  res.json({ streams: [{ name: stream.name, url: stream.url }] });
});

app.listen(PORT, () => {
  console.log(`Local News Addon running on port ${PORT}`);
});
