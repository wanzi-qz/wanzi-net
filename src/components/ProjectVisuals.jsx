function ArtChrome({ left, right, children }) {
  return (
    <div className="project-art">
      <div className="art-topline">
        <span>{left}</span>
        <span>{right}</span>
      </div>
      {children}
      <div className="art-scanline" />
      <div className="art-corner art-corner-tl" />
      <div className="art-corner art-corner-br" />
    </div>
  );
}

function PipelineBar({ pipeline }) {
  if (!pipeline || pipeline.length === 0) return null;
  return (
    <div className="pv-pipeline" aria-label="算法流程">
      {pipeline.map((stage, i) => (
        <div className="pv-stage" key={stage.no} style={{ '--pv-i': i }}>
          <span className="pv-dot" />
          <span className="pv-stage-no">{stage.no}</span>
          <span className="pv-stage-zh">{stage.zh}</span>
          <span className="pv-stage-en">{stage.en}</span>
        </div>
      ))}
    </div>
  );
}

export function MicroscopeVisual({ pipeline }) {
  return (
    <ArtChrome left="IMG / 028" right="FEATURE MAP">
      <div className="micro-wrap">
        <svg
          className="micro-svg"
          viewBox="0 0 1200 640"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <g className="micro-grid">
            {Array.from({ length: 14 }, (_, i) => (
              <line
                key={`v${i}`}
                x1={86 * i}
                y1="0"
                x2={86 * i}
                y2="640"
              />
            ))}
            {Array.from({ length: 8 }, (_, i) => (
              <line
                key={`h${i}`}
                x1="0"
                y1={80 * i}
                x2="1200"
                y2={80 * i}
              />
            ))}
          </g>
          <g className="micro-field">
            <ellipse cx="270" cy="212" rx="92" ry="142" />
            <ellipse cx="520" cy="164" rx="58" ry="88" />
            <ellipse cx="790" cy="238" rx="118" ry="76" />
            <ellipse cx="956" cy="176" rx="64" ry="44" />
            <ellipse cx="610" cy="474" rx="148" ry="92" />
            <ellipse cx="352" cy="532" rx="70" ry="110" />
            <ellipse cx="870" cy="530" rx="86" ry="62" />
            <circle cx="180" cy="500" r="38" />
            <circle cx="1090" cy="370" r="32" />
            <path d="M338 280 C 365 260, 404 252, 452 266" />
            <path d="M670 300 C 712 262, 742 250, 798 258" />
          </g>
          <g className="micro-calls">
            <line x1="286" y1="350" x2="340" y2="394" />
            <line x1="790" y1="314" x2="754" y2="372" />
            <line x1="352" y1="642" x2="352" y2="486" />
            <text x="350" y="410">AREA / 0.874</text>
            <text x="628" y="366">PERIMETER</text>
            <text x="284" y="426">MAJOR / 1.34</text>
            <text x="940" y="156">ROI.02</text>
          </g>
        </svg>
        <PipelineBar pipeline={pipeline} />
      </div>
      <div className="art-bottomline">
        <span>MICROSCOPY / QUANTIFICATION</span>
        <span>SCALE 1.25μm</span>
      </div>
    </ArtChrome>
  );
}

export function ToolkitVisual() {
  return (
    <ArtChrome left="WORKFLOW / PIPELINE" right="DATA OPS">
      <div className="toolkit-wrap">
        <div className="toolkit-column">
          <span className="toolkit-kicker">01 / QUERY</span>
          <div className="sql-block">
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
        <div className="toolkit-column">
          <span className="toolkit-kicker">02 / ANALYZE</span>
          <div className="chart-block">
            {[42, 64, 52, 88, 70, 96, 78, 60].map((height, index) => (
              <span key={`${height}-${index}`} style={{ height: `${height}%` }} />
            ))}
          </div>
        </div>
        <div className="toolkit-column">
          <span className="toolkit-kicker">03 / SHARE</span>
          <div className="dash-block">
            <span className="dash-row" />
            <span className="dash-row" />
            <span className="dash-row" />
          </div>
        </div>
      </div>
      <div className="art-bottomline">
        <span>PYTHON / OPENCV / MATLAB</span>
        <span>REUSABLE</span>
      </div>
    </ArtChrome>
  );
}

export function ProjectVisual({ type, image, pipeline }) {
  if (image) {
    return (
      <div className="project-art project-art-image">
        <div className="project-art-stage">
        <img
          className="project-art-photo"
          src={`${import.meta.env.BASE_URL}${image.replace(/^\//, '')}?v=20261020a`}
          alt="项目截图"
        />
        <PipelineBar pipeline={pipeline} />
        </div>
      </div>
    );
  }
  if (type === 'microscope') return <MicroscopeVisual pipeline={pipeline} />;
  return <ToolkitVisual />;
}
