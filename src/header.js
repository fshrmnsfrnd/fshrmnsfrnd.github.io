class HeaderComponent extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <nav class="headnav">
                <a href="https://fshrmnsfrnd.github.io/">Home</a>
                <a href="https://github.com/fshrmnsfrnd">Github</a>
                <a href="https://fshrmnsfrnd.github.io/Luna/">Luna</a>
                <a href="https://fshrmnsfrnd.github.io/Promillerechner/">Promillerechner</a>
                <a href="https://fshrmnsfrnd.github.io/Snake/">Snake</a>
                <!-- Neue Seitenlinks können hier hinzugefügt werden -->
            </nav>
    `;
  }
}
customElements.define("header-component", HeaderComponent);
