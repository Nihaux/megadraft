/*
 * Copyright (c) 2016, Globo.com (https://github.com/globocom)
 *
 * License: MIT
 */

import React, {Component} from "react";
import icons from "../icons";


export default class LinkInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: props && props.url || ""
    };
    this.onLinkChange = ::this.onLinkChange;
    this.onLinkKeyDown = ::this.onLinkKeyDown;
  }

  setLink() {
    let {url} = this.state;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `http://${url}`;
    }

    const expression = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)?/gi;
    const regex = new RegExp(expression);

    if (!url.match(regex)) {
      this.props.setError(__("Invalid Link"));
      return;
    }

    this.props.setEntity({url});

    this.reset();
  }

  reset() {
    this.setState({
      url: "",
    });

    this.props.cancelEntity();
  }

  onLinkChange(event) {
    event.stopPropagation();
    const url = event.target.value;

    if (url === "") {
      this.props.cancelError();
    }

    this.setState({url: url});
  }

  onLinkKeyDown(event) {
    if (event.key == "Enter") {
      event.preventDefault();
      this.setLink();
      // Force blur to work around Firefox's NS_ERROR_FAILURE
      event.target.blur();
    } else if (event.key == "Escape") {
      event.preventDefault();
      this.reset();
    }
  }

  componentDidMount() {
    this.refs.textInput.focus();
  }

  render() {
    /* global __ */
    return (
      <div style={{whiteSpace: "nowrap"}}>
        <input
          ref="textInput"
          type="text"
          className="toolbar__input"
          onChange={this.onLinkChange}
          value={this.state.url}
          onKeyDown={this.onLinkKeyDown}
          placeholder={__("Type the link and press enter")}/>
        <span className="toolbar__item" style={{verticalAlign: "bottom"}}>
          <button
            onClick={this.props.removeEntity}
            type="button"
            className="toolbar__button toolbar__input-button">
            {
              this.props.entity ?
              <icons.UnlinkIcon/> :
              <icons.CloseIcon />
            }
          </button>
        </span>
      </div>
    );
  }
}
