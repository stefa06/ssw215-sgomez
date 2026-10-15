const projectsSection = document.getElementById("projects");

if (!(projectsSection instanceof HTMLElement)) {
  throw new Error("The projects section is required.");
}

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
    const matches = card.textContent.toLocaleLowerCase().includes(query);
    card.classList.toggle("hidden", !matches);
    if (matches) {
      visibleCount += 1;
    }
  }

  projectCount.textContent = `Showing ${visibleCount} of ${projectCards.length} projects`;
  console.log(
    projectCards
      .filter((card) => !card.classList.contains("hidden"))
      .map((card) => card.querySelector(".card__title").textContent.trim()),
  );
});
