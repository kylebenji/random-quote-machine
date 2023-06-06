import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";

const quotes = [
  {
    text: "To be or not to be, that is the question.",
    author: "Shakepeare",
  },
  {
    text: "Never learn to do anything: if you don't learn, you'll always find someone else to do it for you.",
    author: "Mark Twain",
  },
  {
    text: "Power consists in one's capacity to link his will with the purpose of others, to lead by reason and a gift of cooperation.",
    author: "Woodrow Wilson",
  },
];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getQuote();
    this.randomQuote = this.randomQuote.bind(this);
  }

  getQuote() {
    const ind = Math.trunc(Math.random() * quotes.length);
    return {
      quote: quotes[ind].text,
      author: quotes[ind].author,
    };
  }

  randomQuote() {
    this.setState(this.getQuote());
  }

  render() {
    return (
      <div id="quote-box" className="text-center border border-primary rounded">
        <h1 className="p-3">Quotes</h1>
        <div className="p-2">
          <p id="text">{this.state.quote}</p>
          <p id="author">-{this.state.author}</p>
        </div>
        <button id="new-quote" className="m-2" onClick={this.randomQuote}>
          New Quote
        </button>
        <a id="tweet-quote" className="m-2" href="twitter.com/intent/tweet">
          Tweet Quote
        </a>
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.querySelector("#root"));
root.render(<App />);
