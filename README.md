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
    render={({ triggerSave, canvas }) => (
      <div>
        <button onClick={triggerSave}>Save Canvas</button>
        <div>{canvas}</div>
      </div>
    )}
  />
);
```

## Props

### height?: number

> defaults to `300`

Set the height of the canvas
This value should not be changed after ReactPainter is mounted as it will mess up the resolution. Remount a new instance when the height changed.

### width?: number

> defaults to `300`

Set the width of the canvas
Similar to height, this value should not be changed after mounted.

### color?: string

> defaults to `#000`

Set the stroke color.
This value can be changed dynamically.

### lineWidth?: number

> defaults to `5`

Set the stroke line width.
This value can be changed dynamically.

### lineCap?: 'round' | 'butt' | 'square'

> defaults to `round`

Set the stroke line cap.
This value can be changed dynamically.

### lineJoin?: 'round' | 'bevel' | 'miter'

> defaults to `round`

Set the stroke line join.
This value can be changed dynamically.

### onSave?: (blob: Blob) => void

Your handler when the canvas is saved.

### image?: File | string

The image that would takes up the whole canvas. If it is a string, then it should be an URL for an image.

> Note: You may not be able to save the image if the image is from other domain due to CORS issue. I'm still researching how to workaround this.

### render?: (props: RenderProps) => ReactNode

This is called with an object. Read more about the properties of the object in the section [Render Prop Function](#render-prop-function).

> Note: If you do not provide the render function. A canvas element will be mounted as default. However, this is not really useful because you cannot trigger the save of the canvas.

## Render Prop Function

This is where you want to render the canvas and the function to trigger save. It is a regular prop called `render`: `<ReactPainter render={/* here */} />`
The properties of the object passed to this function is listed below.

### canvas: ReactNode

This is the canvas node that you can used to mount in your component. Example:

```jsx
<ReactPainter
  render={({ canvas }) => (
    <div>
      <div>Awesome heading</div>
      <div className="awesomeContainer">{canvas}</div>
    </div>
  )}
/>
```

### triggerSave: () => void;

This is the function that you invoke when you want to save the canvas.

Example:

```jsx
<ReactPainter
  render={({ canvas, triggerSave }) => (
    <div>
      <div>Awesome heading</div>
      <div className="awesomeContainer">{canvas}</div>
      <button onClick={triggerSave}>Save</button>
    </div>
  )}
/>
```

### getCanvasProps: (any) => CanvasProps;

Prop getter for advanced use case. If you wish to extends the functionality of ReactPainter by adding additional properties to the canvas/ getting the `ref` of the canvas, then call this function with those properties and spread the result of this function to the canvas.

> Note: Only callback ref is supported. The new `React.createRef` is not supported.

Example:

```jsx
<ReactPainter
  render={({ getCanvasProps, triggerSave }) => (
    <div>
      <div>Awesome heading</div>
      <div className="awesomeContainer">
        <canvas {...getCanvasProps({ ref: ref => (this.canvasRef = ref) })} />
      </div>
      <button onClick={triggerSave}>Save</button>
    </div>
  )}
/>
```

> Read more about prop getter in this [article][prop-getter-blog].

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[prop-getter-blog]: https://blog.kentcdodds.com/how-to-give-rendering-control-to-users-with-prop-getters-549eaef76acf
