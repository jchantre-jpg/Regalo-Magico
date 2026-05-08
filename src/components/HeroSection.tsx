type Props = {
  onExploreProducts: () => void;
};

export function HeroSection({ onExploreProducts }: Props) {
  return (
    <section className="hero" id="inicio">
      <div className="hero-bg">
        <div className="hero-gradient" />
        <div className="hero-pattern" />
        <div className="hero-shapes">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
          <div className="shape shape-3" />
        </div>
      </div>
      <div className="hero-content">
        <h1 className="hero-title">Encuentra el regalo perfecto</h1>
        <p className="hero-subtitle">
          Selecciona, personaliza y compra por WhatsApp. Sin pasarelas de pago, rápido y seguro.
        </p>
        <button type="button" className="btn btn-primary" onClick={onExploreProducts}>
          Explorar regalos
        </button>
      </div>
    </section>
  );
}
