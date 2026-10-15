[1mdiff --git a/labs/lab5/app.js b/labs/lab5/app.js[m
[1mnew file mode 100644[m
[1mindex 0000000..040aa71[m
[1m--- /dev/null[m
[1m+++ b/labs/lab5/app.js[m
[36m@@ -0,0 +1,11 @@[m
[32m+[m[32mconst projectsButton = document.querySelector("[data-projects-button]");[m
[32m+[m[32mconst projectsSection = document.getElementById("projects");[m
[32m+[m
[32m+[m[32mif (!(projectsButton instanceof HTMLButtonElement) || !(projectsSection instanceof HTMLElement)) {[m
[32m+[m[32m  throw new Error("The projects button and section are required.");[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32mprojectsButton.addEventListener("click", () => {[m
[32m+[m[32m  window.location.hash = projectsSection.id;[m
[32m+[m[32m  projectsSection.focus({ preventScroll: true });[m
[32m+[m[32m});[m
[1mdiff --git a/labs/lab5/index.html b/labs/lab5/index.html[m
[1mindex c4e0cce..6cb6ff0 100644[m
[1m--- a/labs/lab5/index.html[m
[1m+++ b/labs/lab5/index.html[m
[36m@@ -5,37 +5,54 @@[m
     <meta name="viewport" content="width=device-width, initial-scale=1">[m
     <title>Stefania Gomez | Portfolio</title>[m
     <link rel="stylesheet" href="./style.css">[m
[32m+[m[32m    <script src="./app.js" defer></script>[m
   </head>[m
[31m-  <body>[m
[31m-    <header class="hero">[m
[31m-      <div class="hero__content">[m
[31m-        <h1>Stefania Gomez</h1>[m
[31m-        <p class="subtitle">I dance professionaly</p>[m
[31m-        <p class="bio">I'm from Spain and Colombia. I love pasta</p>[m
[31m-        <a class="button" href="#projects">See my projects</a>[m
[31m-        <button class="button button--disabled" type="button" disabled>Contact me (coming soon)</button>[m
[31m-      </div>[m
[31m-      <img class="avatar" src="./assets/avatar.jpg" width="240" height="240" alt="Stefania Gomez">[m
[32m+[m[32m  <body class="page">[m
[32m+[m[32m    <header class="site-header">[m
[32m+[m[32m      <nav class="site-nav" aria-label="Main navigation">[m
[32m+[m[32m        <ul class="site-nav__list">[m
[32m+[m[32m          <li><a class="site-nav__link" href="#projects">Projects</a></li>[m
[32m+[m[32m          <li>[m
[32m+[m[32m            <a class="site-nav__link" href="https://github.com/stefaniagomez" target="_blank" rel="noopener">[m
[32m+[m[32m              GitHub[m
[32m+[m[32m            </a>[m
[32m+[m[32m          </li>[m
[32m+[m[32m        </ul>[m
[32m+[m[32m      </nav>[m
[32m+[m[32m      <section class="hero" aria-labelledby="hero-title">[m
[32m+[m[32m        <div class="hero__content">[m
[32m+[m[32m          <h1 class="hero__title" id="hero-title">Stefania Gomez</h1>[m
[32m+[m[32m          <p class="subtitle">I dance professionaly</p>[m
[32m+[m[32m          <p class="bio">I'm from Spain and Colombia. I love pasta</p>[m
[32m+[m[32m          <div class="hero__actions">[m
[32m+[m[32m            <button class="button button--primary" type="button" data-projects-button>[m
[32m+[m[32m              See my projects[m
[32m+[m[32m            </button>[m
[32m+[m[32m            <button class="button button--disabled" type="button" disabled>[m
[32m+[m[32m              Contact me (coming soon)[m
[32m+[m[32m            </button>[m
[32m+[m[32m          </div>[m
[32m+[m[32m        </div>[m
[32m+[m[32m        <img class="avatar" src="./assets/avatar.jpg" alt="Stefania Gomez">[m
[32m+[m[32m      </section>[m
     </header>[m
 [m
[31m-    <main>[m
[31m-      <section id="projects" class="projects" aria-labelledby="projects-title">[m
[31m-        <h2 id="projects-title">Projects</h2>[m
[32m+[m[32m    <main class="main-content">[m
[32m+[m[32m      <section class="projects" id="projects" aria-labelledby="projects-title" tabindex="-1">[m
[32m+[m[32m        <h2 class="section-title" id="projects-title">Projects</h2>[m
         <div class="project-cards">[m
[31m-          [m
[31m-   <article class="card">[m
[31m-    make video games[m
[31m-   </article>[m
[31m-[m
[31m-   <article class="card featured">[m
[31m-    make websites[m
[31m-   </article>[m
[31m-    </div>[m
[31m-      </section> [m
[32m+[m[32m          <article class="card">[m
[32m+[m[32m            <h3 class="card__title">make video games</h3>[m
[32m+[m[32m          </article>[m
[32m+[m[32m          <article class="card">[m
[32m+[m[32m            <h3 class="card__title">make websites</h3>[m
[32m+[m[32m          </article>[m
[32m+[m[32m        </div>[m
[32m+[m[32m      </section>[m
     </main>[m
 [m
     <footer class="site-footer">[m
[31m-      <a href="https://github.com/stefaniagomez" target="_blank" rel="noopener">GitHub</a>[m
[32m+[m[32m      <p class="site-footer__text">Portfolio of Stefania Gomez</p>[m
     </footer>[m
   </body>[m
 </html>[m
[1mdiff --git a/labs/lab5/style.css b/labs/lab5/style.css[m
[1mindex ae7273d..8ead326 100644[m
[1m--- a/labs/lab5/style.css[m
[1m+++ b/labs/lab5/style.css[m
[36m@@ -1,9 +1,6 @@[m
[31m-* {[m
[31m-  box-sizing: border-box;[m
[31m-}[m
[32m+[m[32m*, *::before, *::after { box-sizing: border-box; }[m
 [m
[31m-:root {[m
[31m-  color-scheme: light;[m
[32m+[m[32m.page {[m
   --ink: #202124;[m
   --muted: #5c6670;[m
   --paper: #f7f4ee;[m
[36m@@ -11,50 +8,67 @@[m
   --accent-dark: #893eca;[m
   --line: #deced8;[m
   --card: #ffffff;[m
[31m-}[m
[31m-[m
[31m-html {[m
[31m-  scroll-behavior: auto;[m
[31m-}[m
[31m-[m
[31m-body {[m
   margin: 0;[m
[31m-  overflow-x: hidden;[m
   background: var(--paper);[m
   color: var(--ink);[m
   font-family: Georgia, "Times New Roman", serif;[m
   line-height: 1.5;[m
 }[m
 [m
[32m+[m[32m.site-nav,[m
 .hero,[m
 .projects,[m
 .site-footer {[m
[31m-  width: min(100% - 3rem, 68rem);[m
[32m+[m[32m  width: min(calc(100% - 3rem), 68rem);[m
   margin: 0 auto;[m
 }[m
 [m
[32m+[m[32m.site-nav {[m
[32m+[m[32m  padding: 1.5rem 0 0;[m
[32m+[m[32m  font-family: Arial, sans-serif;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32m.site-nav__list {[m
[32m+[m[32m  display: flex;[m
[32m+[m[32m  flex-wrap: wrap;[m
[32m+[m[32m  justify-content: flex-end;[m
[32m+[m[32m  gap: 1.5rem;[m
[32m+[m[32m  margin: 0;[m
[32m+[m[32m  padding: 0;[m
[32m+[m[32m  list-style: none;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32m.site-nav__link,[m
[32m+[m[32m.site-footer__link {[m
[32m+[m[32m  color: var(--accent-dark);[m
[32m+[m[32m  font-weight: 700;[m
[32m+[m[32m}[m
[32m+[m
 .hero {[m
   display: grid;[m
   grid-template-columns: minmax(0, 1fr) auto;[m
   align-items: center;[m
[31m-  gap: 5rem;/*hand-edited by SGomez*/[m
[31m-  min-height: 78vh;[m
[31m-  padding: 5rem 0;[m
[32m+[m[32m  gap: 4rem;[m
[32m+[m[32m  min-height: 72vh;[m
[32m+[m[32m  padding: 4rem 0;[m
 }[m
 [m
 .hero__content {[m
   max-width: 40rem;[m
 }[m
 [m
[31m-h1,[m
[31m-h2,[m
[31m-p {[m
[32m+[m[32m.hero__title,[m
[32m+[m[32m.section-title,[m
[32m+[m[32m.subtitle,[m
[32m+[m[32m.bio,[m
[32m+[m[32m.card__title,[m
[32m+[m[32m.site-footer__text {[m
   margin-top: 0;[m
 }[m
 [m
[31m-h1 {[m
[32m+[m[32m.hero__title {[m
   margin-bottom: 1rem;[m
[31m-  font-size: clamp(3.2rem, 8vw, 6.5rem);[m
[32m+[m[32m  font-size: 5rem;[m
   line-height: 0.95;[m
   letter-spacing: -0.04em;[m
 }[m
[36m@@ -73,6 +87,12 @@[m [mh1 {[m
   font-size: 1.15rem;[m
 }[m
 [m
[32m+[m[32m.hero__actions {[m
[32m+[m[32m  display: flex;[m
[32m+[m[32m  flex-wrap: wrap;[m
[32m+[m[32m  gap: 0.75rem;[m
[32m+[m[32m}[m
[32m+[m
 .button {[m
   display: inline-block;[m
   padding: 0.8rem 1.2rem;[m
[36m@@ -82,13 +102,17 @@[m [mh1 {[m
   font-family: Arial, sans-serif;[m
   font-size: 0.9rem;[m
   font-weight: 700;[m
[31m-  text-decoration: none;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32m.button--primary {[m
[32m+[m[32m  cursor: pointer;[m
 }[m
 [m
 .button:not(:disabled):hover {[m
   border-color: #6e2da8;[m
[31m-  background: var(--accent-dark);[m
[32m+[m[32m  background: #6e2da8;[m
   box-shadow: 0 0.3rem 0.8rem rgba(32, 33, 36, 0.2);[m
[32m+[m[32m  transform: translateY(-0.1rem);[m
 }[m
 [m
 .button:not(:disabled):focus-visible {[m
[36m@@ -111,15 +135,11 @@[m [mh1 {[m
   opacity: 0.75;[m
 }[m
 [m
[31m-.button--disabled {[m
[31m-  margin-left: 0.5rem;[m
[31m-}[m
[31m-[m
 .avatar {[m
   display: block;[m
[31m-  width: 240px;[m
[31m-  height: 240px;[m
[31m-  border: 8px solid #ffffff;[m
[32m+[m[32m  width: 15rem;[m
[32m+[m[32m  height: 15rem;[m
[32m+[m[32m  border: 0.5rem solid #ffffff;[m
   border-radius: 50%;[m
   object-fit: cover;[m
   box-shadow: 0 1rem 2rem rgba(32, 33, 36, 0.12);[m
[36m@@ -128,41 +148,33 @@[m [mh1 {[m
 .projects {[m
   padding: 4rem 0;[m
   border-top: 1px solid var(--line);[m
[32m+[m[32m  scroll-margin-top: 2rem;[m
 }[m
 [m
[31m-h2 {[m
[32m+[m[32m.section-title {[m
   margin-bottom: 1.5rem;[m
   font-size: 2.5rem;[m
   line-height: 1;[m
 }[m
 [m
[31m-ul {[m
[31m-  display: grid;[m
[31m-  grid-template-columns: repeat(2, minmax(0, 1fr));[m
[31m-  gap: 1rem;[m
[31m-  max-width: 42rem;[m
[31m-  margin: 0;[m
[31m-  padding: 0;[m
[31m-  list-style: none;[m
[31m-}[m
[31m-[m
 .project-cards {[m
[31m-  display: grid;[m
[31m-  grid-template-columns: repeat(2, minmax(0, 1fr));[m
[32m+[m[32m  display: flex;[m
[32m+[m[32m  flex-wrap: wrap;[m
   gap: 1rem;[m
 }[m
 [m
[31m-[m
[31m-/*hand-edited by SGomez*/[m
 .card {[m
[31m-  padding: 2.00rem;[m
[32m+[m[32m  flex: 1 1 18rem;[m
[32m+[m[32m  min-width: 0;[m
[32m+[m[32m  padding: 2rem;[m
   border: 1px solid var(--line);[m
   background: var(--card);[m
   font-size: 1.15rem;[m
 }[m
[31m-/*hand-edited by SGomez*/[m
[31m-.card.featured {[m
[31m-  padding: 2.00rem;[m
[32m+[m
[32m+[m[32m.card__title {[m
[32m+[m[32m  margin-bottom: 0;[m
[32m+[m[32m  font-size: 1.25rem;[m
 }[m
 [m
 .site-footer {[m
[36m@@ -171,32 +183,36 @@[m [mul {[m
   font-family: Arial, sans-serif;[m
 }[m
 [m
[31m-.site-footer a {[m
[31m-  color: var(--accent-dark);[m
[31m-  font-weight: 700;[m
[32m+[m[32m.site-footer__text {[m
[32m+[m[32m  margin-bottom: 0;[m
 }[m
 [m
[31m-@media (max-width: 767px) {[m
[32m+[m[32m@media (max-width: 48rem) {[m
[32m+[m[32m  .site-nav,[m
   .hero,[m
   .projects,[m
   .site-footer {[m
[31m-    width: min(100% - 2rem, 40rem);[m
[32m+[m[32m    width: min(calc(100% - 2rem), 40rem);[m
   }[m
 [m
   .hero {[m
[31m-    grid-template-columns: 1fr;[m
[32m+[m[32m    grid-template-columns: minmax(0, 1fr);[m
     gap: 2.5rem;[m
     min-height: auto;[m
[31m-    padding: 4rem 0;[m
[32m+[m[32m    padding: 3rem 0;[m
[32m+[m[32m  }[m
[32m+[m
[32m+[m[32m  .hero__title {[m
[32m+[m[32m    font-size: 3rem;[m
   }[m
 [m
   .avatar {[m
[31m-    width: 180px;[m
[31m-    height: 180px;[m
[32m+[m[32m    width: 11.25rem;[m
[32m+[m[32m    height: 11.25rem;[m
     margin: 0 auto;[m
   }[m
 [m
[31m-  ul {[m
[31m-    grid-template-columns: 1fr;[m
[32m+[m[32m  .card {[m
[32m+[m[32m    flex-basis: 100%;[m
   }[m
 }[m
