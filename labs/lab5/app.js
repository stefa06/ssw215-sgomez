const projectsButton = document.querySelector("[data-projects-button]");
const projectsSection = document.getElementById("projects");

if (!(projectsButton instanceof HTMLButtonElement) || !(projectsSection instanceof HTMLElement)) {
  throw new Error("The projects button and section are required.");
}

projectsButton.addEventListener("click", () => {
  window.location.hash = projectsSection.id;
  projectsSection.focus({ preventScroll: true });
});

const filterInput = document.getElementById("filter-input");
const projectCount = document.getElementById("project-count");
const projectCards = Array.from(projectsSection.querySelectorAll(".card"));

if (!(filterInput instanceof HTMLInputElement) || !(projectCount instanceof HTMLElement)) {
  throw new Error("The project filter input and count are required.");
}

filterInput.addEventListener("input", () => {
  const query = filterInput.value.trim().toLocaleLowerCase();
  let visibleCount = 0;

  for (const card of projectCards) {
    const matches = card.textContent.toLowerCase().includes(query);//hand-edited by SG//
    card.classList.toggle("is-hidden", !matches);//hand-eited by SG//
    if (matches) {
      visibleCount += 1;
    }
  }

  projectCount.textContent = `Showing ${visibleCount} of ${projectCards.length} projects`;
});
