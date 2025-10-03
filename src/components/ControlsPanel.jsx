export default function ControlsPanel({
  count, onCount,
  speed, onSpeed,
  hue, onHue,
  saturation, onSaturation,
  lightness, onLightness,
  glow, onGlow,
}) {
  return (
    <aside className="rounded-xl bg-zinc-900/70 ring-1 ring-white/10 p-5 sticky top-6">
      <h3 className="text-xl font-semibold mb-1">Controls</h3>
      <p className="text-sm text-zinc-400 mb-5">Adjust the goo. Click the canvas to add blobs. Hold and drag to attract.</p>

      <div className="space-y-5">
        <Control label="Blobs" value={count} min={1} max={32} step={1} onChange={onCount} />
        <Control label="Speed" value={speed} min={0.2} max={3} step={0.1} onChange={onSpeed} />

        <div>
          <Label>Hue: {Math.round(hue)}</Label>
          <input
            className="w-full accent-fuchsia-500"
            type="range" min={0} max={360} step={1}
            value={hue}
            onChange={(e) => onHue(Number(e.target.value))}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Sat: {Math.round(saturation)}%</Label>
            <input
              className="w-full accent-fuchsia-500"
              type="range" min={20} max={100} step={1}
              value={saturation}
              onChange={(e) => onSaturation(Number(e.target.value))}
            />
          </div>
          <div>
            <Label>Light: {Math.round(lightness)}%</Label>
            <input
              className="w-full accent-fuchsia-500"
              type="range" min={10} max={80} step={1}
              value={lightness}
              onChange={(e) => onLightness(Number(e.target.value))}
            />
          </div>
          <div>
            <Label>Glow: {Math.round(glow)}px</Label>
            <input
              className="w-full accent-fuchsia-500"
              type="range" min={6} max={40} step={1}
              value={glow}
              onChange={(e) => onGlow(Number(e.target.value))}
            />
          </div>
        </div>

        <Palette hue={hue} saturation={saturation} lightness={lightness} />
      </div>
    </aside>
  );
}

function Control({ label, value, min, max, step, onChange }) {
  return (
    <div>
      <Label>{label}: {Math.round(value)}</Label>
      <input
        className="w-full accent-fuchsia-500"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

function Label({ children }) {
  return <div className="mb-1 text-sm text-zinc-300">{children}</div>;
}

function Palette({ hue, saturation, lightness }) {
  const stops = [0, 0.2, 0.4, 0.6, 0.8, 1].map((t, i) => (
    <div key={i} className="h-7 flex-1" style={{ background: `hsla(${hue} ${saturation}% ${lightness * (0.8 + t * 0.4)}% / 1)` }} />
  ));
  return (
    <div className="mt-2">
      <div className="text-sm text-zinc-400 mb-1">Preview</div>
      <div className="flex overflow-hidden rounded-md ring-1 ring-white/10">
        {stops}
      </div>
    </div>
  );
}
