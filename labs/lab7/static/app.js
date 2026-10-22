const projectsSection = document.getElementById("projects");

if (!(projectsSection instanceof HTMLElement)) {
  throw new Error("The projects section is required.");
}

const filterInput = document.getElementById("filter-input");
const projectCount = document.getElementById("project-count");
const createForm = document.querySelector(".project-create");
const newTitleInput = document.getElementById("new-title");
const projectCards = projectsSection.querySelector(".project-cards");
const createButton = createForm && createForm.querySelector('button[type="submit"]');

if (
  !(filterInput instanceof HTMLInputElement) ||
  !(projectCount instanceof HTMLElement) ||
  !(createForm instanceof HTMLFormElement) ||
  !(newTitleInput instanceof HTMLInputElement) ||
  !(projectCards instanceof HTMLElement) ||
  !(createButton instanceof HTMLButtonElement)
) {
  throw new Error("The project filter, count, and create form are required.");
}

function applyFilter() {
  const cards = Array.from(projectsSection.querySelectorAll(".card"));
  const query = filterInput.value.trim().toLocaleLowerCase();
  let visibleCount = 0;

  for (const card of cards) {
    const matches = card.textContent.toLocaleLowerCase().includes(query);
    card.classList.toggle("hidden", !matches);
    if (matches) {
      visibleCount += 1;
    }
  }

  projectCount.textContent = `Showing ${visibleCount} of ${cards.length} projects`;
  console.log(
    cards
      .filter((card) => !card.classList.contains("hidden"))
      .map((card) => card.querySelector(".card__title").textContent.trim()),
  );
}

function updateTrendingBadge(card, likes) {
  let badge = card.querySelector(".trending-badge");

  if (likes > 10 && !badge) {
    badge = document.createElement("p");
    badge.className = "trending-badge";
    badge.textContent = "Trending";
    const likeCount = card.querySelector(".like-count");
    likeCount.parentElement.before(badge);
  } else if (likes <= 10 && badge) {
    badge.remove();
  }
}

function createProjectCard(project) {
  const card = document.createElement("article");
  card.className = "card";
  card.dataset.projectId = String(project.id);

  const title = document.createElement("h3");
  title.className = "card__title";
  title.textContent = project.title;
  card.append(title);

  const description = document.createElement("p");
  description.textContent = project.description;
  card.append(description);

  if (project.likes > 10) {
    const badge = document.createElement("p");
    badge.className = "trending-badge";
    badge.textContent = "Trending";
    card.append(badge);
  }

  const likes = document.createElement("p");
  const likeCount = document.createElement("span");
  likeCount.className = "like-count";
  likeCount.textContent = String(project.likes);
  likes.append(likeCount, " likes");
  card.append(likes);

  const upvoteButton = document.createElement("button");
  upvoteButton.className = "button upvote-btn";
  upvoteButton.type = "button";
  upvoteButton.textContent = "Upvote";
  card.append(upvoteButton);

  return card;
}

filterInput.addEventListener("input", applyFilter);

createForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  createButton.disabled = true;

  try {
    const response = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitleInput.value }),
    });
    if (!response.ok) {
      throw new Error(`Create project request failed with status ${response.status}.`);
    }
    if (response.status !== 201) {
      throw new Error(`Expected create project status 201, received ${response.status}.`);
    }

    const project = await response.json();
    if (
      !Number.isInteger(project.id) ||
      typeof project.title !== "string" ||
      typeof project.description !== "string" ||
      !Number.isInteger(project.likes)
    ) {
      throw new Error("The create project response contained invalid project data.");
    }

    projectCards.append(createProjectCard(project));
    newTitleInput.value = "";
    applyFilter();
  } catch (error) {
    console.error("Failed to create project:", error);
  } finally {
    createButton.disabled = false;
  }
});

projectsSection.addEventListener("click", async (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  const upvoteButton = event.target.closest(".upvote-btn");
  const card = upvoteButton && upvoteButton.closest(".card");
  const likeCount = card && card.querySelector(".like-count");
  const projectId = card && card.dataset.projectId;

  if (
    !(upvoteButton instanceof HTMLButtonElement) ||
    !(card instanceof HTMLElement) ||
    !(likeCount instanceof HTMLElement) ||
    !projectId
  ) {
    return;
  }

  upvoteButton.disabled = true;

  try {
    const response = await fetch(`/api/projects/${projectId}/upvote`, { method: "POST" });
    if (!response.ok) {
      throw new Error(`Upvote request failed with status ${response.status}.`);
    }

    const data = await response.json();
    if (!Number.isInteger(data.likes)) {
      throw new Error("The upvote response did not include an integer like count.");
    }
    likeCount.textContent = String(data.likes);
    updateTrendingBadge(card, data.likes);
  } catch (error) {
    console.error("Failed to upvote project:", error);
  } finally {
    upvoteButton.disabled = false;
  }
});

applyFilter();
