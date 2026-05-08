export function HowItWorksSection() {
  return (
    <section className="section how-it-works" id="como-funciona">
      <div className="container">
        <h2 className="section-title">¿Cómo comprar?</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Elige tu regalo</h3>
            <p>Explora nuestro catálogo y añade los productos que te gusten al carrito.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Revisa tu pedido</h3>
            <p>Revisa los productos seleccionados y añade datos de envío si aplica.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Hacer pedido</h3>
            <p>
              Usa «Hacer pedido» en el carrito para enviar tu lista por WhatsApp. Te confirmamos disponibilidad y
              pago.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
