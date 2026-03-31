import React, { useState } from 'react';
import { ReactPainter } from 'react-painter';

type DemoMode = 'blank' | 'image-url' | 'image-file';

const App: React.FC = () => {
  const [mode, setMode] = useState<DemoMode>('blank');
  const [width, setWidth] = useState(500);
  const [height, setHeight] = useState(400);
  const [imageUrl, setImageUrl] = useState('https://aml2610.github.io/avatar.jpeg');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [key, setKey] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setImageFile(file);
    }
  };

  const restart = () => setKey((k) => k + 1);

  const image =
    mode === 'image-url' ? imageUrl : mode === 'image-file' ? imageFile : undefined;

  return (
    <div className="app">
      <header className="app-header">
        <h1>react-painter</h1>
        <p className="subtitle">A React component for freehand drawing on a canvas</p>
      </header>

      <div className="app-body">
        <aside className="sidebar">
          <section className="sidebar-section">
            <h3>Mode</h3>
            <div className="mode-buttons">
              <button
                className={mode === 'blank' ? 'active' : ''}
                onClick={() => { setMode('blank'); restart(); }}
              >
                Blank Canvas
              </button>
              <button
                className={mode === 'image-url' ? 'active' : ''}
                onClick={() => { setMode('image-url'); restart(); }}
              >
                Image URL
              </button>
              <button
                className={mode === 'image-file' ? 'active' : ''}
                onClick={() => { setMode('image-file'); restart(); }}
              >
                File Upload
              </button>
            </div>
          </section>

          {mode === 'blank' && (
            <section className="sidebar-section">
              <h3>Canvas Size</h3>
              <label>
                Width
                <input
                  type="number"
                  value={width}
                  min={100}
                  max={1200}
                  onChange={(e) => setWidth(Number(e.target.value))}
                />
              </label>
              <label>
                Height
                <input
                  type="number"
                  value={height}
                  min={100}
                  max={800}
                  onChange={(e) => setHeight(Number(e.target.value))}
                />
              </label>
              <button className="secondary" onClick={restart}>
                Apply Size
              </button>
            </section>
          )}

          {mode === 'image-url' && (
            <section className="sidebar-section">
              <h3>Image URL</h3>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
              <button className="secondary" onClick={restart}>
                Load Image
              </button>
            </section>
          )}

          {mode === 'image-file' && (
            <section className="sidebar-section">
              <h3>Upload Image</h3>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              {imageFile && (
                <button className="secondary" onClick={restart}>
                  Reload
                </button>
              )}
            </section>
          )}
        </aside>

        <main className="canvas-area">
          {mode === 'image-file' && !imageFile ? (
            <div className="placeholder">Select an image file to begin drawing</div>
          ) : (
            <ReactPainter
              key={key}
              width={width}
              height={height}
              image={image}
              onSave={(blob: Blob) => console.log('Saved canvas blob:', blob)}
              render={({
                canvas,
                triggerSave,
                imageDownloadUrl,
                imageCanDownload,
                setColor,
                setLineWidth,
                setLineCap,
                setLineJoin,
              }) => (
                <div className="painter-wrapper">
                  <div className="toolbar">
                    <div className="toolbar-group">
                      <label>
                        Color
                        <input
                          type="color"
                          defaultValue="#000000"
                          onChange={(e) => setColor(e.target.value)}
                        />
                      </label>
                    </div>

                    <div className="toolbar-group">
                      <label>
                        Line Width
                        <input
                          type="range"
                          min={1}
                          max={50}
                          defaultValue={5}
                          onChange={(e) => setLineWidth(Number(e.target.value))}
                        />
                      </label>
                    </div>

                    <div className="toolbar-group">
                      <label>
                        Line Cap
                        <select
                          defaultValue="round"
                          onChange={(e) =>
                            setLineCap(e.target.value as 'round' | 'butt' | 'square')
                          }
                        >
                          <option value="round">Round</option>
                          <option value="butt">Butt</option>
                          <option value="square">Square</option>
                        </select>
                      </label>
                    </div>

                    <div className="toolbar-group">
                      <label>
                        Line Join
                        <select
                          defaultValue="round"
                          onChange={(e) =>
                            setLineJoin(e.target.value as 'round' | 'bevel' | 'miter')
                          }
                        >
                          <option value="round">Round</option>
                          <option value="bevel">Bevel</option>
                          <option value="miter">Miter</option>
                        </select>
                      </label>
                    </div>

                    <div className="toolbar-group toolbar-actions">
                      <button
                        onClick={triggerSave}
                        disabled={mode !== 'blank' && imageCanDownload === false}
                      >
                        Save
                      </button>
                      {imageDownloadUrl && (
                        <a
                          href={imageDownloadUrl}
                          download="painting.png"
                          className="download-link"
                        >
                          Download
                        </a>
                      )}
                      <button className="secondary" onClick={restart}>
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className="canvas-frame">{canvas}</div>
                </div>
              )}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
