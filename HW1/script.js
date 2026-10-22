const projectCards = document.querySelector(".project-cards"); 
const savedCount = document.querySelector(".saved-count");
const categoryFilter = document.querySelector("#project-category");
const projectSearch = document.querySelector("#project-search");
const clearSearch = document.querySelector(".clear-search");
const filterMessage = document.querySelector(".filter-message");
const cards = projectCards.querySelectorAll(".card");

projectCards.querySelectorAll(".favorite-button").forEach((button) => {
  button.addEventListener("click", () => {
    const isSaved = button.getAttribute("aria-pressed") !== "true";
    const card = button.closest(".card");

    button.setAttribute("aria-pressed", String(isSaved));
    button.textContent = isSaved ? "♥ Saved" : "♡ Save project";
    card.classList.toggle("card--saved", isSaved);

    const count = projectCards.querySelectorAll(
      '.favorite-button[aria-pressed="true"]',
    ).length;

    savedCount.textContent =
      count === 0
        ? "No projects saved."
        : `${count} ${count === 1 ? "project" : "projects"} saved.`;
  });
});

projectCards.querySelectorAll(".details-button").forEach((button) => {
  button.addEventListener("click", () => {
    const isExpanded = button.getAttribute("aria-expanded") !== "true";
    const details = button
      .closest(".card")
      .querySelector(".project-details");

    details.hidden = !isExpanded;
    button.setAttribute("aria-expanded", String(isExpanded));
    button.textContent = isExpanded ? "Hide details" : "More details";
  });
});

function updateVisibleProjects() {
  const selectedCategory = categoryFilter.value;
  const searchTerm = projectSearch.value.trim().toLowerCase();
  let visibleCount = 0;

  cards.forEach((card) => {
    const matchesCategory =
      selectedCategory === "all" ||
      card.dataset.category === selectedCategory;
    const projectName = card.querySelector("p").textContent.toLowerCase();
    const matchesSearch = projectName.includes(searchTerm);
    const isVisible = matchesCategory && matchesSearch;

    card.hidden = !isVisible;
    if (isVisible) {
      visibleCount += 1;
    }
  });

  clearSearch.disabled = searchTerm === "";

  if (visibleCount === 0) {
    filterMessage.textContent = "No projects found—try another search";
  } else if (searchTerm !== "" || selectedCategory === "all") {
    filterMessage.textContent = `Showing ${visibleCount} ${
      visibleCount === 1 ? "project" : "projects"
    }.`;
  } else {
    const categoryName = selectedCategory === "games" ? "game" : "website";
    const plural = visibleCount === 1 ? "" : "s";
    filterMessage.textContent = `Showing ${visibleCount} ${categoryName}${plural} project${plural}.`;
  }
}

categoryFilter.addEventListener("change", updateVisibleProjects);
projectSearch.addEventListener("input", updateVisibleProjects);

clearSearch.addEventListener("click", () => {
  projectSearch.value = "";
  categoryFilter.value = "all";
  updateVisibleProjects();
});

updateVisibleProjects();
