// manifest.json
{
  "name": "AdBlock",
  "version": "1.0",
  "description": "A simple AdBlockPro extension for Chrome by IMON.",
  "manifest_version": 2,
  "content_scripts": [
    {
      "matches": ["*://*/*"],
      "js": ["contentscript.js"]
    }
  ],
  "permissions": ["tabs", "contextMenus"]
}

// contentscript.js
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status == "complete") {
    // Block all ads.
    chrome.webRequest.onHeadersReceived.addListener(
      function(details) {
        if (details.url.match(/\b(ad|ads)\b/)) {
          details.responseHeaders["Content-Length"] = "0";
        }
      },
      {
        urls: ["*://*/*"],
        types: ["main_frame"],
        frameId: details.frameId
      }
    );
    // Block analytics features.
    chrome.webRequest.onHeadersReceived.addListener(
      function(details) {
        if (details.url.match(/\b(analytics|ga)\b/)) {
          details.responseHeaders["Content-Length"] = "0";
        }
      },
      {
        urls: ["*://*/*"],
        types: ["main_frame"],
        frameId: details.frameId
      }
    );
  }
});

// popup.html
<!DOCTYPE html>
<html>
<head>
  <title>AdBlock</title>
</head>
<body>
  <h1>AdBlock</h1>
  <p>This extension blocks all ads and analytics features on websites.</p>
  <p>You can turn off blocking for specific websites by clicking the "Allow Ads" button.</p>
  <button id="allowAds">Allow Ads</button>
</body>
</html>

// popup.js
chrome.runtime.onInstalled.addListener(function() {
  chrome.tabs.create({
    url: "popup.html"
  });
});

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  if (request == "allowAds") {
    chrome.webRequest.onHeadersReceived.removeListener(
      function(details) {
        if (details.url.match(/\b(ad|ads)\b/)) {
          details.responseHeaders["Content-Length"] = "0";
        }
      },
      {
        urls: ["*://*/*"],
        types: ["main_frame"],
        frameId: details.frameId
      }
    );
    chrome.webRequest.onHeadersReceived.removeListener(
      function(details) {
        if (details.url.match(/\b(analytics|ga)\b/)) {
          details.responseHeaders["Content-Length"] = "0";
        }
      },
      {
        urls: ["*://*/*"],
        types: ["main_frame"],
        frameId: details.frameId
      }
    );
    sendResponse("success");
  }
});
