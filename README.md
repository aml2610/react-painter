# react-painter

[![version](https://img.shields.io/npm/v/react-painter.svg)](https://www.npmjs.com/package/react-painter)
![license](https://img.shields.io/npm/l/react-painter.svg)

[DEMO](https://aml2610.github.io/react-painter/)

<p align="center" style="font-size:1.2rem">0 dependency React component that can be used to draw on a canvas with mouse/touch</p>

<hr />

## The problem

You want simple functionality to allow the user to write/draw on image/blank canvas, then save the output to be uploaded to a server/locally.

## The solution

This is a simple component that utilises HTML5 canvases and the File API.
It uses a render prop which gives you maximum flexibility with a minimal API because you are able to extend functionality and render the result as you wish.

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `dependencies`:

```
npm install --save react-painter
```

> This package also depends on `react` and `prop-types`. Make sure they are installed in your project.

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

### initialColor?: string

> defaults to `#000`

Set the initial stroke color.
Stroke can be changed dynamically using `setColor`.

### initialLineWidth?: number

> defaults to `5`

Set the initial stroke line width.
Line width can be changed dynamically using `setLineWidth`.

### lineCap?: 'round' | 'butt' | 'square'

> defaults to `round`

Set the initial stroke line cap.
Line cap can be changed dynamically using `setLineCap`.

### initialLineJoin?: 'round' | 'bevel' | 'miter'

> defaults to `round`

Set the initial stroke line join.
Line join type can be changed dynamically using `setLineJoin`.

### onSave?: (blob: Blob) => void

Your handler when the canvas is saved.

### image?: File | string

The image that would takes up the whole canvas. If it is a string, then it should be an URL for an image.

> Note: It the image is not accessible publicly or via cookies, the image will not be shown. You can check the result via `imageCanDownload` property.

### render?: (props: RenderProps) => ReactNode

This is called with an object. Read more about the properties of the object in the section [Render Prop Function](#render-prop-function).

> Note: If you do not provide the render function. A canvas element will be mounted as default. However, this is not really useful because you cannot trigger the save of the canvas.

## Render Prop Function

This is where you want to render the canvas and the function to trigger save. It is a regular prop called `render`: `<ReactPainter render={/* here */} />`
The properties of the object passed to this function are listed below.

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

### triggerSave: () => void

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

### setColor: (color: string) => void

Set the color of the line.

Example:

```jsx
<ReactPainter
  render={({ canvas, triggerSave, setColor }) => (
    <div>
      <div>Awesome heading</div>
      <input type="color" onChange={e => setColor(e.target.value)} />
      <div className="awesomeContainer">{canvas}</div>
      <button onClick={triggerSave}>Save</button>
    </div>
  )}
/>
```

### setLineWidth: (width: number) => void

Set the width of the line.

Example:

```jsx
<ReactPainter
  render={({ canvas, triggerSave, setLineWidth }) => (
    <div>
      <div>Awesome heading</div>
      <input type="number" onChange={e => setLineWidth(e.target.value)} />
      <div className="awesomeContainer">{canvas}</div>
      <button onClick={triggerSave}>Save</button>
    </div>
  )}
/>
```

### setLineJoin: (type: 'round' | 'bevel' | 'miter') => void

Set the join type of the line.

Example:

```jsx
<ReactPainter
  render={({ canvas, triggerSave, setLineJoin }) => (
    <div>
      <div>Awesome heading</div>
      <select onChange={e => setLineJoin(e.target.value)}>
        <option value="round">round</option>
        <option value="bevel">bevel</option>
        <option value="miter">miter</option>
      </select>
      <div className="awesomeContainer">{canvas}</div>
      <button onClick={triggerSave}>Save</button>
    </div>
  )}
/>
```

### setLineCap: (type: 'round' | 'butt' | 'square') => void

Set the cap type of the line.

Example:

```jsx
<ReactPainter
  render={({ canvas, triggerSave, setLineCap }) => (
    <div>
      <div>Awesome heading</div>
      <select onChange={e => setLineCap(e.target.value)}>
        <option value="round">round</option>
        <option value="butt">butt</option>
        <option value="square">square</option>
      </select>
      <div className="awesomeContainer">{canvas}</div>
      <button onClick={triggerSave}>Save</button>
    </div>
  )}
/>
```

### imageCanDownload: boolean

This properties let you know if the image is inserted successfully. By default it is `null` until the checking of image import is successful.

Example:

```jsx
<ReactPainter
  image={/* your imageUrl prop here */}
  render={({ canvas, triggerSave, imageCanDownload }) => (
    <div>
      <div>Awesome heading</div>
      {imageCanDownload ? <p>Sorry, the image that you have provided is not accessible.</p> : null}
      <div className="awesomeContainer">{canvas}</div>
      <button onClick={triggerSave}>Save</button>
    </div>
  )}
```

### imageDownloadUrl: string;

This properties is the URL can you can use to allow user to download the saved image after invoke `triggerSave`. By default it is `null` until the `triggerSave` is invoked.

Example:

```jsx
<ReactPainter
  render={({ canvas, triggerSave, imageDownloadUrl }) => (
    <div>
      <div>Awesome heading</div>
      <div className="awesomeContainer">{canvas}</div>
      <button onClick={triggerSave}>Save</button>
      {imageDownloadUrl ? (
        <a href={imageDownloadUrl} download>
          Download
        </a>
      ) : null}
    </div>
  )}
/>
```

### getCanvasProps: (any) => CanvasProps;

Prop getter for advanced use case. If you wish to extend the functionality of ReactPainter by adding additional properties to the canvas/getting the `ref` of the canvas, then call this function with those properties and spread the result of this function to the canvas.

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
