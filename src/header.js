document.addEventListener("DOMContentLoaded", () => {
  const headerHTML = `
    <a href="https://fshrmnsfrnd.github.io/"><h1>fshrmnsfrnd</h1></a>
    <nav class="headnav">
        <a href="https://fshrmnsfrnd.github.io/">Home</a>
        <a href="https://fshrmnsfrnd.github.io/BFTag/Feuerwehr/Ablauf.html">BF-Tag</a>
        <a href="https://github.com/fshrmnsfrnd">Github</a>
        <a href="https://fshrmnsfrnd.github.io/Promillerechner/">Promillerechner</a>
        <a href="https://fshrmnsfrnd.github.io/Snake/">Snake</a>
    </nav>
  `;
  document.querySelector("header").innerHTML = headerHTML;
});
