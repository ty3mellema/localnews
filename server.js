Serve2

const express = require("express");
const app = express();
const PORT = process.env.PORT || 7000;

app.use(express.json());

// Manifest
const addonManifest = {
  id: "local-news-addon",
  version: "3.0.0",
  name: "Local News Pack",
  description: "Live TV streams for Myrtle Beach, Charlotte, FOX, ABC, CBS, WeatherNation",
  resources: ["catalog", "stream"],
  types: ["tv"],
  idPrefixes: ["localnews"],
  catalogs: [
    {
      id: "localnews_catalog",
      type: "tv",
      name: "Local News Pack",
      extraSupported: []
    }
  ]
};

// Manifest endpoint
app.get("/manifest.json", (req, res) => {
  res.json(addonManifest);
});

// Catalog endpoint
app.get("/catalog/tv/localnews_catalog.json", (req, res) => {
  res.json({
    metas: [
      {
        id: "localnews_wfxb",
        type: "tv",
        name: "WFXB FOX 43 Myrtle Beach",
        poster: "https://upload.wikimedia.org/wikipedia/commons/6/67/Fox_logo.svg"
      },
      {
        id: "localnews_cbscharlotte",
        type: "tv",
        name: "CBS News Charlotte",
        poster: "https://upload.wikimedia.org/wikipedia/commons/8/89/CBS_News_logo.svg"
      },
      {
        id: "localnews_livenow",
        type: "tv",
        name: "LiveNOW from FOX",
        poster: "https://upload.wikimedia.org/wikipedia/commons/6/67/Fox_logo.svg"
      },
      {
        id: "localnews_fox2detroit",
        type: "tv",
        name: "FOX 2 Detroit",
        poster: "https://upload.wikimedia.org/wikipedia/commons/6/67/Fox_logo.svg"
      },
      {
        id: "localnews_fox17",
        type: "tv",
        name: "FOX 17 Grand Rapids",
        poster
