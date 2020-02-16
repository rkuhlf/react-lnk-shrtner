import React, { Component } from 'react';
import { render } from 'react-dom';
import LinkItem from "./Components/LinkItem";
import Loading from "./Components/Loading";
import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
  constructor() {
    this.state = {
      shortenedURLs: [],
      longURLs: [],
      indexes: [],
      inputURL: "",
      fetching: false
    }

    // get shortened urls from local storage
    const localStorageUrls = localStorage.getItem("shortURLs");
    const localStorageFullUrls = localStorage.getItem("fullURLs");
    if (localStorageUrls !== null) {
      this.state.shortenedURLs = localStorageUrls.split(",");
      this.state.longURLs = localStorageFullUrls.split(",");
      for (let i = 0; i < this.state.longURLs.length; i++) {
        this.state.indexes.push(i);
      }
    }


    this.handleChange = this.handleChange.bind(this);
    this.handleSubmitClick = this.handleSubmitClick.bind(this);
    this.deleteFunction = this.deleteFunction.bind(this);
  }

  handleChange(event) {
    event.preventDefault();

    this.setState({
      inputURL: event.target.value
    })
  }

  handleSubmitClick(event) {
    event.preventDefault();

    this.setState({
      fetching: true,
      inputURL: ""
    });

    fetch("https://api.shrtco.de/v2/shorten?url=" + this.state.inputURL).then((res) => {
      res.json().then((data) => {
        if (!data.ok) {
          this.setState({
            fetching: false
          })
          return;
        }

        this.setState(prevState => {
          const newURLs = [...prevState.shortenedURLs, data.result.short_link2]
          const newFullURLs = [...prevState.longURLs, data.result.original_link]
          let newIndexes = prevState.indexes;
          newIndexes.push(newIndexes.length);

          // change localstorage
          localStorage.setItem("shortURLs", newURLs);
          localStorage.setItem("fullURLs", newFullURLs);
          return {
            shortenedURLs: newURLs, 
            longURLs: newFullURLs, 
            indexes: newIndexes,
            fetching: false
          }
        });
      }).catch(err => {
        console.log("ERROR", err);
      });
    });
  }

  deleteFunction(url) {
    this.setState(prevState => {
      let newURLs = prevState.shortenedURLs;
      let newFullURLs = prevState.shortenedURLs;
      let newIndexes = prevState.indexes;
      newIndexes.pop();

      const index = newURLs.indexOf(url);
      if (index > -1) {
        newURLs.splice(index, 1);
        newFullURLs.splice(index, 1);
      }
      
      // change local storage
      localStorage.setItem("shortURLs", newURLs);
      return {
        shortenedURLs: newURLs,
        longURLs: newFullURLs,
        indexes: newIndexes
      }
    });

  }

  render() {
    const loading = this.state.fetching;
    let loadingComponent;

    if (loading) {
      loadingComponent = <Loading />;
    }


    return (
      <div className="p-5 m-5 text-center">

        <h1>Link Shortener</h1>
        <form onSubmit={this.handleSubmitClick}>
          <div className="row">
            <input className="form-control col" type="text" value={this.state.inputURL} onChange={this.handleChange}/>

            <input className="btn btn-primary" type="submit" value="Create" />
          </div>
        </form>

        <ul className="list-group mt-3">
          {
            this.state.indexes.map((index) => <LinkItem key={this.state.shortenedURLs[index]} deleteFunction={this.deleteFunction} href={this.state.shortenedURLs[index]} fullHref={this.state.longURLs[index]}/>)
          }
          {loadingComponent}
        </ul>
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
