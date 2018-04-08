# react-painter

[![version](https://img.shields.io/npm/v/react-painter.svg)](https://www.npmjs.com/package/react-painter)
![license](https://img.shields.io/npm/l/react-painter.svg)

[DEMO](https://malcolm-kee.github.io/react-painter/)

<p align="center" style="font-size:1.2rem">0 dependencies react component to draw with mouse/touch</p>

<hr />

## The problem

You want a simple functionality to allow user to write/draw on image/ blank canvas, then save the output to be uploaded to server/locally.

## This solution

This is a simple component wraps around html canvas component. It uses a render
prop which gives you maximum flexibility with a minimal API
because you are able to extends functionality and render the result as you wish.

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `dependencies`:

```
npm install --save react-painter
```

## Usage

```jsx
import { ReactPainter } from 'react-painter';

const Drawable = () => (
  <ReactPainter
    width={300}
    height={300}
    onSave={blob => console.log(blob)}
    render={({ triggerSave, getCanvasProps }) => (
      <div>
        <button onClick={triggerSave}>Save Canvas</button>
        <div>
          <canvas {...getCanvasProps()} />
        </div>
      </div>
    )}
  />
);
```

## Props

TODO 😓

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
