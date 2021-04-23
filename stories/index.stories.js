import React from 'react';

import { storiesOf, forceReRender } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, number, text, button } from '@storybook/addon-knobs/react';
import { ReactPainter } from '../src';
import { FramedDiv } from './storybookComponent';

const stories = storiesOf('ReactPainter', module);

stories.addDecorator(withKnobs);

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
};

stories.add('basic', () => (
  <ReactPainter
    width={number('width', 300)}
    height={number('height', 300)}
    onSave={action('canvas saved!')}
    render={({ triggerSave, canvas }) => (
      <div style={styles.root}>
        <div>
          <button onClick={forceReRender}>Restart</button>
          <button onClick={triggerSave}>Save Canvas</button>
        </div>
        <FramedDiv>{canvas}</FramedDiv>
      </div>
    )}
  />
));

stories.add('with all controls', () => (
  <ReactPainter
    width={number('width', 300)}
    height={number('height', 300)}
    onSave={action('canvas saved!')}
    render={({
      canvas,
      triggerSave,
      imageCanDownload,
      imageDownloadUrl,
      setColor,
      setLineJoin,
      setLineWidth,
      setLineCap
    }) => (
      <div style={styles.root}>
        <div>
          <button onClick={forceReRender}>
            Rerender (if you want to update canvas size)
          </button>
          <button onClick={triggerSave}>Save Canvas</button>
          <label htmlFor="line-color">Color</label>
          <input type="color" id="line-color" onChange={e => setColor(e.target.value)} />
          <label htmlFor="line-width">Width</label>
          <input
            type="number"
            id="line-width"
            defaultValue={5}
            onChange={e => setLineWidth(e.target.value)}
          />
          <label htmlFor="line-cap">Line Cap</label>
          <select id="line-cap" onChange={e => setLineCap(e.target.value)}>
            <option value="round">round</option>
            <option value="butt">butt</option>
            <option value="square">square</option>
          </select>
          <label htmlFor="line-join">Line Join</label>
          <select id="line-join" onChange={e => setLineJoin(e.target.value)}>
            <option value="round">round</option>
            <option value="bevel">bevel</option>
            <option value="miter">miter</option>
          </select>
          {imageDownloadUrl ? (
            <a href={imageDownloadUrl} download>
              Download
            </a>
          ) : null}
        </div>
        <FramedDiv>{canvas}</FramedDiv>
      </div>
    )}
  />
));

stories.add('with image', () => (
  <ReactPainter
    width={number('width', 300)}
    height={number('height', 300)}
    onSave={action('canvas saved!')}
    image={text('image url', 'https://aml2610.github.io/avatar.jpeg')}
    render={({
      triggerSave,
      getCanvasProps,
      imageCanDownload,
      imageDownloadUrl
    }) => (
      <div style={styles.root}>
        <div>
          <button onClick={forceReRender}>Rerender (Use if you update image url)</button>
          <button onClick={triggerSave} disabled={!imageCanDownload}>
            Save Canvas
          </button>
          {imageDownloadUrl ? (
            <a href={imageDownloadUrl} download>
              Download
            </a>
          ) : null}
        </div>
        <FramedDiv>
          <canvas {...getCanvasProps()} />
        </FramedDiv>
      </div>
    )}
  />
));

class WithFileInputDemo extends React.Component {
  state = {
    image: null
  };

  handleFileInputChange = ev => {
    const { target } = ev;
    const image = target.files ? target.files[0] : null;

    if (image) {
      this.setState({
        image
      });
    } else {
      console.error('image is null in handleImageSelected');
    }
  };

  render() {
    const { width, height, onSave } = this.props;

    return this.state.image ? (
      <ReactPainter
        width={width}
        height={height}
        onSave={onSave}
        image={this.state.image}
        render={({ triggerSave, getCanvasProps, imageDownloadUrl }) => (
          <div style={styles.root}>
            <div>
              <button onClick={forceReRender}>Rerender (To choose another file)</button>
              <button onClick={triggerSave}>Save Canvas</button>
            </div>
            {imageDownloadUrl ? (
              <a href={imageDownloadUrl} download>
                Download
              </a>
            ) : null}
            <FramedDiv>
              <canvas {...getCanvasProps()} />
            </FramedDiv>
          </div>
        )}
      />
    ) : (
      <input type="file" onChange={this.handleFileInputChange} />
    );
  }
}

stories.add('with file input', () => (
  <WithFileInputDemo
    width={number('width', 300)}
    height={number('height', 300)}
    onSave={action('canvas saved!')}
  />
));
