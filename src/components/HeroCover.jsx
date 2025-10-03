import Spline from '@splinetool/react-spline';
import './hero-font.css';

export default function HeroCover() {
  return (
    <header className="relative w-full h-[100svh] overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/g2cnMT7B1IgkJ7Ie/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black pointer-events-none" />

      <div className="relative z-10 h-full flex items-center justify-center px-6">
        <div className="max-w-3xl text-center">
          <h1 className="font-instrument text-4xl md:text-6xl font-semibold tracking-tight leading-tight">
            <em className="not-italic bg-gradient-to-r from-fuchsia-400 via-pink-400 to-violet-400 bg-clip-text text-transparent italic">Liquid Light</em>:
            <span className="block md:inline md:ml-2">Interactive Lava Lamp</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-zinc-300">
            Float, merge, and play with digital goo. <em className="italic text-fuchsia-300/90">Real-time metaballs</em> meet vibrant, futuristic vibes.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#play"
              className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-fuchsia-500/90 hover:bg-fuchsia-500 text-white px-6 py-3 font-medium shadow-lg shadow-fuchsia-500/25 transition"
            >
              Start Playing
            </a>
            <a
              href="#about"
              className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 text-white px-6 py-3 font-medium backdrop-blur transition"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>

      <div id="play" className="absolute bottom-4 left-1/2 -translate-x-1/2 text-zinc-300/80 text-sm">
        Scroll to explore
      </div>
    </header>
  );
}
