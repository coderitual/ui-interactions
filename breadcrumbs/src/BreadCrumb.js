import React from "react";
import cx from 'classnames';
import './BreadCrumb.css';

const testData = [
  "home",
  "articles",
  "groups",
  "comments",
  "current path long"
];

const CLS_COLLAPSED = 'breadcrumb-item--collapsed';

class BreadCrumbItem extends React.Component {

  setElipsis(value) {
    if (value === true) {
      this.el.classList.add(CLS_COLLAPSED);
    } else {
      this.el.classList.remove(CLS_COLLAPSED);
    }
  }

  getElipsis() {
    return this.el.classList.contains(CLS_COLLAPSED);
  }

  render() {
    const classNames = cx(this.props.className, 'breadcrumb-item')
  	return (
      <span className={classNames} ref={(el) => this.el = el}>
        <span className="breadcrumb-item__ellipsis">...</span>
        <span className="breadcrumb-item__text">{this.props.text}</span>
      </span>
    );
  }
}

export default class BreadCrumb extends React.Component {

  _items = new Set();

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.addEventListeners();
    this.rebuildElements();
  }

  rebuildElements() {
    console.log(this.inner.scrollWidth, this.container.clientWidth)
    if (this.inner.scrollWidth < this.container.clientWidth) {
      Array.from(this._items).reverse().forEach((item, idx, arr) => {
        if(this.inner.scrollWidth < this.container.clientWidth && item.getElipsis()) {
          item.setElipsis(false);
        }
      });
    }

    if (this.inner.scrollWidth > this.container.clientWidth) {
      this._items.forEach((item) => {
        if(this.inner.scrollWidth > this.container.clientWidth && !item.getElipsis()) {
          item.setElipsis(true);
        }
      });
    }
  }

  addEventListeners() {
    window.addEventListener('resize', this.onResize);
  };

  onResize = () => {
    this.rebuildElements();
  }

  render() {
    const elements = testData;
    return (
      <div className="breadcrumb" ref={(el) => this.container = el}>
        <span className="breadcrumb__inner" ref={(el) => this.inner = el}>
          {/*Display all data*/}
          {elements.filter((_, idx, arr) => idx < arr.length - 1).map(element =>
            <span><BreadCrumbItem text={element} ref={(element) => {this._items.add(element)}} />></span>
          )}

          {/*Display last element */}
          <span>
            {<BreadCrumbItem className="breadcrumb__current" text={elements[testData.length - 1]}/>}
          </span>
        </span>
      </div>
    );
  }
}
