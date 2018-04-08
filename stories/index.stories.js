import React from 'react';

import { storiesOf, forceReRender } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, color, number, text, button } from '@storybook/addon-knobs/react';
import { ReactPainter } from '../dist/ReactPainter';
import { FramedDiv } from './storybookComponent';

const stories = storiesOf('ReactPainter', module);

stories.addDecorator(withKnobs);

stories.add('basic', () => (
  <ReactPainter
    width={number('width', 300)}
    height={number('height', 300)}
    color={color('color', '#000')}
    onSave={action('canvas saved!')}
    render={({ triggerSave, getCanvasProps }) => (
      <div>
        <button onClick={forceReRender}>Rerender (Use if you update image url)</button>
        <button onClick={triggerSave}>Save Canvas</button>
        <FramedDiv>
          <canvas {...getCanvasProps()} />
        </FramedDiv>
      </div>
    )}
  />
));

stories.add('with image', () => (
  <ReactPainter
    width={number('width', 300)}
    height={number('height', 300)}
    color={color('color', '#000')}
    onSave={action('canvas saved!')}
    image={text('image url', 'https://picsum.photos/200/300')}
    render={({ triggerSave, getCanvasProps }) => (
      <div>
        <button onClick={forceReRender}>Rerender (Use if you update image url)</button>
        <button onClick={triggerSave} disabled>
          Save Canvas (Disabled because the image is from different domain)
        </button>
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
    const { width, height, color, onSave } = this.props;

    return this.state.image ? (
      <ReactPainter
        width={width}
        height={height}
        color={color}
        onSave={onSave}
        image={this.state.image}
        render={({ triggerSave, getCanvasProps }) => (
          <div>
            <button onClick={forceReRender}>Rerender (To choose another file)</button>
            <button onClick={triggerSave}>Save Canvas</button>
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
    color={color('color', '#000')}
    onSave={action('canvas saved!')}
  />
));
