var express = require("express");
var router = express.Router();
var axios = require("axios");
const jsdom = require("jsdom");

const { JSDOM } = jsdom;

var data = {};

var dataA = {
  amazon: {
    title: "",
    img: "",
    price: "",
    site: "",
  },
};

var dataF = {
  flipkart: {
    title: "",
    img: "",
    price: "",
    site: "",
  },
};

const getSearchUrlA = (query) =>
  `https://www.amazon.in/s?k=${query.replace(" ", "+")}&sprefix=${query.replace(
    " ",
    "+"
  )}`;

const getSearchUrlF = (query) =>
  `https://www.flipkart.com/search?q=${query.replace(" ", "+")}`;

async function amazonSearch(query) {
  const url = getSearchUrlA(query);
  const { data: html } = await axios.get(url, {
    headers: {
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      Host: "www.amazon.in",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
      pragma: "no-cache",
      rtt: 150,
      "sec-ch-device-memory": 8,
      "sec-ch-dpr": 1.125,
      "sec-ch-ua": `"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111" `,
      "sec-ch-ua-mobile": `?0`,
      "sec-ch-ua-platform": "Windows",
      "sec-ch-ua-platform-version": "10.0.0",
      "sec-ch-viewport-width": 1707,
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same - origin",
      "sec-fetch-user": `?1`,
      "upgrade-insecure-requests": 1,
    },
  });
  const dom = new JSDOM(html);
  const $ = (selector) => dom.window.document.querySelectorAll(selector);
  const firstElement = $('[data-component-type="s-search-result"]');

  var temp = { amazon: {} };

  for (var i = 0; i < firstElement.length; i++) {
    const titleTemp =
      firstElement[i].querySelector(
        "span.a-size-medium.a-color-base.a-text-normal"
      ) ||
      firstElement[i].querySelector(
        "span.a-size-base-plus.a-color-base.a-text-normal"
      );

    var string = "item" + (i + 1);

    temp["amazon"][string] = {
      title: titleTemp.innerHTML,
      img:
        firstElement[i].querySelector("img").src ||
        firstElement[i].querySelector("s-image").src,
      price: firstElement[i].querySelector("span.a-offscreen").innerHTML,
      site: `https://www.amazon.in${
        firstElement[i].querySelector(
          "a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal"
        ).href
      }`,
    };
  }

  dataA = {
    ...temp,
  };

  return dataA;
}

async function flipkartSearch(query) {
  const url = getSearchUrlF(query);

  const { data: html } = await axios.get(url, {
    headers: {
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      Host: "www.flipkart.com",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
      pragma: "no-cache",
      "sec-ch-device-memory": 8,
      "sec-ch-dpr": 1.125,
      "sec-ch-ua": `"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111" `,
      "sec-ch-ua-mobile": `?0`,
      "sec-ch-ua-platform": "Windows",
      "sec-ch-ua-platform-version": "10.0.0",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "none",
      "sec-fetch-user": `?1`,
      "upgrade-insecure-requests": 1,
    },
  });

  const dom = new JSDOM(html);
  const $ = (selector) => dom.window.document.querySelectorAll(selector);
  const firstElement = $('[class="_1AtVbE col-12-12"]');

  var temp = {};
  temp["flipkart"] = {};
  if (firstElement[1].querySelectorAll("div._4ddWXP")[0] != null) {
    var count = 1;
    for (var i = 1; i < firstElement.length - 4; i++) {
      for (var j = 0; j < 4; j++) {
        var selector = firstElement[i].querySelectorAll("div._4ddWXP")[j];
        var string = "item" + count;
        temp["flipkart"][string] = {
          title: selector.querySelector("a.s1Q9rs").innerHTML,
          img: selector.querySelector("img._396cs4").src,
          price: selector.querySelector("div._30jeq3").innerHTML,
          link: `https://www.flipkart.com${
            selector.querySelector("a.s1Q9rs").href
          }`,
        };
        count += 1;
      }
    }
  } else {
    var count = 1;
    for (var i = 2; i < 26; i++) {
      var string = "item" + (i - count);

      var title = firstElement[i].querySelector("div._4rR01T")
        ? firstElement[i].querySelector("div._4rR01T").innerHTML
        : null;
      var img = firstElement[i].querySelector("img._396cs4")
        ? firstElement[i].querySelector("img._396cs4").src
        : null;
      var price = firstElement[i].querySelector("div._30jeq3")
        ? firstElement[i].querySelector("div._30jeq3").innerHTML
        : null;
      var site = firstElement[i].querySelector("a._1fQZEK")
        ? `https://www.flipkart.com${
            firstElement[i].querySelector("a._1fQZEK").href
          }`
        : null;

      if (title && img && price && site) {
        temp["flipkart"][string] = {
          title: firstElement[i].querySelector("div._4rR01T")
            ? firstElement[i].querySelector("div._4rR01T").innerHTML
            : null,
          img: firstElement[i].querySelector("img._396cs4").src,
          price: firstElement[i].querySelector("div._30jeq3").innerHTML,
          site: `https://www.flipkart.com${
            firstElement[i].querySelector("a._1fQZEK").href
          }`,
        };
      } else {
        count++;
      }
    }
  }

  dataF = {
    ...temp,
  };

  return dataF;
}

const searchHandler = async (item) => {
  if (item === "") {
    return null;
  }
  dataA = await amazonSearch(item);
  dataF = await flipkartSearch(item);

  data = {
    ...dataA,
    ...dataF,
  };
  console.log(data);
};

router.post("/", async function (req, res, next) {
  console.log(req.body);
  await searchHandler(req.body.Title);
  res.json({ status: "success", data: data });
});

router.get("/", function (req, res, next) {
  res.send("API");
});
module.exports = router;
