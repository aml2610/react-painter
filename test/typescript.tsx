const library = require('react-testing-library');
import * as React from 'react';
import { ReactPainter } from '../src';

afterEach(() => {
  library.cleanup();
});

test('render empty and save', async () => {
  const saveHandler = jest.fn();
  const { getByText, container } = library.renderIntoDocument(
    <ReactPainter
      onSave={saveHandler}
      render={({ canvas, triggerSave }) => (
        <div>
          {canvas}
          <button onClick={triggerSave}>Save Canvas</button>
        </div>
      )}
    />
  );
  library.Simulate.click(getByText('Save Canvas'));
  await library.wait();
  expect(saveHandler).toBeCalled();
  expect(saveHandler.mock.calls.length).toBe(1);
  expect(saveHandler.mock.calls[0][0]).toBeInstanceOf(Blob);
});
