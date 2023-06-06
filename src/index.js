/*
TODO:
error handling and display
Add Spinner so user knows when a quote is loading
get tweet link working
restyle
*/

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import secrets from "./secrets.json";

const TIMEOUT_SEC = 3;
const QUOTE_ID_PREFIX = "5cd96e05de30eff6ebc";
const QUOTE_LOW = 845801;
const QUOTE_HIGH = 848192;

function App() {
  const [quoteID, setQuoteID] = React.useState();
  const [quote, setQuote] = React.useState({});

  function randNum(low, high) {
    return Math.trunc(Math.random() * (high - low)) + 1 + low;
  }

  function newQuoteID() {
    const newId = QUOTE_ID_PREFIX + randNum(QUOTE_LOW, QUOTE_HIGH).toString(16);
    setQuoteID(newId);
  }

  React.useEffect(() => {
    const timeout = function (s) {
      return new Promise(function (_, reject) {
        setTimeout(function () {
          reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
      });
    };

    const AJAX = async function (url, header) {
      try {
        const fetchPro = fetch(url, { headers: header });
        const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
        const data = await res.json();

        if (!res.ok) throw new Error(`${data.message} (${res.status})`);

        return data;
      } catch (error) {
        throw error;
      }
    };

    const getQuote = async function () {
      if (!quoteID) return;
      const rawQuote = await AJAX(
        `https://the-one-api.dev/v2/quote/${quoteID}`,
        secrets.lotrAPIHeaders
      );
      let quote = rawQuote.docs[0];
      const rawCharacter = await AJAX(
        `https://the-one-api.dev/v2/character/${quote.character}`,
        secrets.lotrAPIHeaders
      );
      quote.character =
        rawCharacter.docs[0].name === "MINOR_CHARACTER"
          ? "Unnamed Character"
          : rawCharacter.docs[0].name;
      const rawMovie = await AJAX(
        `https://the-one-api.dev/v2/movie/${quote.movie}`,
        secrets.lotrAPIHeaders
      );
      quote.movie = rawMovie.docs[0].name;
      console.log(quote);
      setQuote(quote);
    };

    getQuote();
  }, [quoteID]);

  function quoteMarkup(quote) {
    return (
      <>
        <p id="text">{quote.dialog}</p>
        <p id="attribution">
          -{quote.character} ({quote.movie})
        </p>
      </>
    );
  }

  return (
    <div id="quote-box" className="text-center border border-primary rounded">
      <h1 className="p-3">Quotes</h1>
      <div className="p-2">{quote.dialog ? quoteMarkup(quote) : ""}</div>
      <button id="new-quote" className="m-2" onClick={newQuoteID}>
        New Quote
      </button>
      <a id="tweet-quote" className="m-2" href="twitter.com/intent/tweet">
        Tweet Quote
      </a>
    </div>
  );
}

const root = ReactDOM.createRoot(document.querySelector("#root"));
root.render(<App />);
