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

export function MicroscopeVisual() {
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
      </div>
      <div className="art-bottomline">
        <span>MICROSCOPY / QUANTIFICATION</span>
        <span>SCALE 1.25μm</span>
      </div>
    </ArtChrome>
  );
}

export function ContestVisual() {
  return (
    <ArtChrome left="MODEL / 2024" right="NATIONAL AWARD">
      <div className="contest-wrap">
        <svg viewBox="0 0 800 430" preserveAspectRatio="none" aria-hidden="true">
          <g className="contest-axis">
            <line x1="60" y1="42" x2="60" y2="366" />
            <line x1="60" y1="366" x2="760" y2="366" />
          </g>
          <g className="contest-grid">
            <line x1="60" y1="115" x2="760" y2="115" />
            <line x1="60" y1="201" x2="760" y2="201" />
            <line x1="60" y1="287" x2="760" y2="287" />
          </g>
          <g className="contest-line">
            <path d="M70 342 L150 322 L230 296 L310 274 L390 226 L470 198 L550 174 L630 122 L710 84" />
            <path
              d="M70 342 C 150 338, 230 330, 310 302 C 390 282, 470 260, 550 216 C 630 170, 690 128, 710 84"
              fill="none"
            />
          </g>
          <g className="contest-points">
            <circle cx="70" cy="342" r="5" />
            <circle cx="310" cy="302" r="5" />
            <circle cx="550" cy="216" r="5" />
            <circle cx="710" cy="84" r="6" />
          </g>
          <g className="contest-labels">
            <text x="72" y="402">预处理</text>
            <text x="286" y="402">建模</text>
            <text x="530" y="402">检验</text>
            <text x="672" y="402">交付</text>
            <text x="20" y="65">0.90</text>
            <text x="20" y="151">0.70</text>
            <text x="20" y="237">0.50</text>
          </g>
        </svg>
      </div>
      <div className="art-bottomline">
        <span>PROBLEM → MODEL → VERIFY</span>
        <span>ITERATION 08</span>
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
        <span>SQL / PYTHON / TABLEAU</span>
        <span>REUSABLE</span>
      </div>
    </ArtChrome>
  );
}

export function ProjectVisual({ type, image }) {
  if (image) {
    return (
      <div className="project-art project-art-image">
        <img
          className="project-art-photo"
          src={`${import.meta.env.BASE_URL}${image.replace(/^\//, '')}?v=20260908b`}
          alt="项目截图"
        />
      </div>
    );
  }
  if (type === 'microscope') return <MicroscopeVisual />;
  if (type === 'contest') return <ContestVisual />;
  return <ToolkitVisual />;
}
