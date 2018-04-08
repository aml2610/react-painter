import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
// import { linkTo } from "@storybook/addon-links";
import { withKnobs, color, number } from '@storybook/addon-knobs/react';

// import { Button, Welcome } from "@storybook/react/demo";
import { ReactPainter } from '../src/ReactPainter';

// storiesOf("Welcome", module).add("to Storybook", () => (
//   <Welcome showApp={linkTo("Button")} />
// ));

// storiesOf("Button", module)
//   .add("with text", () => (
//     <Button onClick={action("clicked")}>Hello Button</Button>
//   ))
//   .add("with some emoji", () => (
//     <Button onClick={action("clicked")}>
//       <span role="img" aria-label="so cool">
//         😀 😎 👍 💯
//       </span>
//     </Button>
//   ));

const stories = storiesOf('ReactPainter', module);

stories.addDecorator(withKnobs);

stories.add('basic', () => (
  <ReactPainter
    width={number('width', 300)}
    height={number('height', 300)}
    color={color('color', '#000')}
    onSave={action('canvas saved!')}
    render={({ canvas, triggerSave }) => (
      <div>
        <button onClick={triggerSave}>Save Canvas</button>
        <div>{canvas}</div>
      </div>
    )}
  />
));
