import { useState } from 'react';
import HeroCover from './components/HeroCover';
import LavaLamp from './components/LavaLamp';
import ControlsPanel from './components/ControlsPanel';
import InfoSection from './components/InfoSection';
import Footer from './components/Footer';

export default function App() {
  const [count, setCount] = useState(8);
  const [speed, setSpeed] = useState(1);
  const [hue, setHue] = useState(285);
  const [saturation, setSaturation] = useState(85);
  const [lightness, setLightness] = useState(60);
  const [glow, setGlow] = useState(22);

  return (
    <div className="min-h-screen bg-black text-white">
      <HeroCover />

      <main className="relative z-10">
        <section id="play" className="container mx-auto px-4 py-16">
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Interactive Lava Lamp</h2>
            <p className="text-zinc-300 mt-2 max-w-2xl">Blobs of goo float, collide, and visually merge using a metaball-inspired rendering on HTML Canvas. Tweak parameters live and play with the physics.</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <div className="rounded-xl overflow-hidden bg-zinc-900 ring-1 ring-white/10">
                <LavaLamp
                  count={count}
                  speed={speed}
                  hue={hue}
                  saturation={saturation}
                  lightness={lightness}
                  glow={glow}
                />
              </div>
            </div>
            <div className="lg:col-span-4">
              <ControlsPanel
                count={count}
                onCount={setCount}
                speed={speed}
                onSpeed={setSpeed}
                hue={hue}
                onHue={setHue}
                saturation={saturation}
                onSaturation={setSaturation}
                lightness={lightness}
                onLightness={setLightness}
                glow={glow}
                onGlow={setGlow}
              />
            </div>
          </div>
        </section>

        <InfoSection />
      </main>

      <Footer />
    </div>
  );
}
