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

for (const card of projectCards) {
  const projectId = card.dataset.projectId;
  const upvoteButton = card.querySelector(".upvote-btn");
  const likeCount = card.querySelector(".like-count");

  if (!projectId || !(upvoteButton instanceof HTMLButtonElement) || !(likeCount instanceof HTMLElement)) {
    throw new Error("Each project card must have an id, an upvote button, and a like count.");
  }

  upvoteButton.addEventListener("click", async () => {
    upvoteButton.disabled = true;

    try {
      const response = await fetch(`/api/projects/${projectId}/upvote`, { method: 'POST' });
      if (!response.ok) {
        throw new Error(`Upvote request failed with status ${response.status}.`);
      }

      const data = await response.json();
      if (!Number.isInteger(data.likes)) {
        throw new Error("The upvote response did not include an integer like count.");
      }
      likeCount.textContent = String(data.likes);
    } catch (error) {
      console.error("Failed to upvote project:", error);
    } finally {
      upvoteButton.disabled = false;
    }
  });
}
