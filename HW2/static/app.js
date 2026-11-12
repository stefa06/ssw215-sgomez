const projectsSection = document.getElementById("projects");
const filterInput = document.getElementById("filter-input");
const projectCount = document.getElementById("project-count");
const clearSearch = document.querySelector(".clear-search");
const createForm = document.querySelector(".project-create");
const newTitleInput = document.getElementById("new-title");
const newDescriptionInput = document.getElementById("new-description");
const newTechnologiesInput = document.getElementById("new-technologies");
const newGithubUrlInput = document.getElementById("new-github-url");
const projectCards = projectsSection?.querySelector(".project-cards");
const projectStatus = document.querySelector(".project-status");
const createButton = createForm?.querySelector('button[type="submit"]');
const savedCount = document.querySelector(".saved-count");

if (
  !(projectsSection instanceof HTMLElement) ||
  !(filterInput instanceof HTMLInputElement) ||
  !(projectCount instanceof HTMLElement) ||
  !(clearSearch instanceof HTMLButtonElement) ||
  !(createForm instanceof HTMLFormElement) ||
  !(newTitleInput instanceof HTMLInputElement) ||
  !(newDescriptionInput instanceof HTMLTextAreaElement) ||
  !(newTechnologiesInput instanceof HTMLInputElement) ||
  !(newGithubUrlInput instanceof HTMLInputElement) ||
  !(projectCards instanceof HTMLElement) ||
  !(projectStatus instanceof HTMLElement) ||
  !(createButton instanceof HTMLButtonElement) ||
  !(savedCount instanceof HTMLElement)
) {
  throw new Error("The portfolio project controls are missing.");
}

function showStatus(message, isError = false) {
  projectStatus.textContent = message;
  projectStatus.setAttribute("role", isError ? "alert" : "status");
}

async function readResponse(response) {
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error(`The server returned an invalid response (${response.status}).`);
  }

  if (!response.ok) {
    throw new Error(
      typeof data.error === "string"
        ? data.error
        : `The request failed (${response.status}).`,
    );
  }
  return data;
}

function applyFilter() {
  const cards = Array.from(projectCards.querySelectorAll(".card"));
  const query = filterInput.value.trim().toLocaleLowerCase();
  let visibleCount = 0;

  for (const card of cards) {
    const title = card.querySelector(".card__title");
    const matches = title?.textContent.toLocaleLowerCase().includes(query) ?? false;
    card.classList.toggle("hidden", !matches);
    if (matches) {
      visibleCount += 1;
    }
  }

  clearSearch.disabled = query === "";
  projectCount.textContent =
    query === ""
      ? `Showing ${cards.length} projects.`
      : visibleCount === 0
        ? "No projects found—try another search."
        : `Showing ${visibleCount} of ${cards.length} projects.`;
}

function updateSavedCount() {
  const count = projectCards.querySelectorAll(
    '.favorite-button[aria-pressed="true"]',
  ).length;
  savedCount.textContent =
    count === 0
      ? "No projects saved."
      : `${count} ${count === 1 ? "project" : "projects"} saved.`;
}

function createProjectCard(project) {
  const card = document.createElement("article");
  card.className = "card";
  card.dataset.projectId = String(project.id);

  const title = document.createElement("h3");
  title.className = "card__title";
  title.textContent = project.title;
  card.append(title);

  const author = document.createElement("p");
  author.className = "card__author";
  author.textContent = `By ${project.author_name || "Unknown"}`;
  card.append(author);

  const favoriteButton = document.createElement("button");
  favoriteButton.className = "favorite-button";
  favoriteButton.type = "button";
  favoriteButton.setAttribute("aria-pressed", "false");
  favoriteButton.textContent = "♡ Save project";
  card.append(favoriteButton);

  const detailsId = `project-details-${project.id}`;
  const projectDetails = document.createElement("div");
  projectDetails.className = "project-details";
  projectDetails.id = detailsId;
  projectDetails.hidden = true;

  for (const [label, value] of [
    ["Description", project.description],
    ["Technologies", project.technologies],
  ]) {
    const detail = document.createElement("p");
    detail.className = "project-detail";
    const detailLabel = document.createElement("strong");
    detailLabel.textContent = `${label}: `;
    detail.append(detailLabel, value || "Not specified");
    projectDetails.append(detail);
  }

  const githubDetail = document.createElement("p");
  githubDetail.className = "project-detail";
  const githubLabel = document.createElement("strong");
  githubLabel.textContent = "GitHub URL: ";
  githubDetail.append(githubLabel);
  if (project.github_url) {
    const githubLink = document.createElement("a");
    githubLink.href = project.github_url;
    githubLink.target = "_blank";
    githubLink.rel = "noopener";
    githubLink.textContent = project.github_url;
    githubDetail.append(githubLink);
  } else {
    githubDetail.append("Not specified");
  }
  projectDetails.append(githubDetail);
  card.append(projectDetails);

  const detailsButton = document.createElement("button");
  detailsButton.className = "details-button";
  detailsButton.type = "button";
  detailsButton.setAttribute("aria-expanded", "false");
  detailsButton.setAttribute("aria-controls", detailsId);
  detailsButton.textContent = "More details";
  card.append(detailsButton);

  return card;
}

async function loadProjects() {
  projectCount.textContent = "Loading projects...";
  showStatus("");

  try {
    const response = await fetch("/api/projects", { method: "GET" });
    const projects = await readResponse(response);
    if (
      !Array.isArray(projects) ||
      projects.some(
        (project) =>
          project === null ||
          typeof project !== "object" ||
          !Number.isInteger(project.id) ||
          typeof project.title !== "string" ||
          typeof project.description !== "string" ||
          typeof project.technologies !== "string" ||
          typeof project.github_url !== "string" ||
          (project.author_name !== null &&
            typeof project.author_name !== "string"),
      )
    ) {
      throw new Error("The server returned an invalid project list.");
    }

    projectCards.replaceChildren(...projects.map(createProjectCard));
    applyFilter();
    updateSavedCount();
  } catch (error) {
    projectCount.textContent = "Projects could not be loaded.";
    showStatus(`Unable to load projects: ${error.message}`, true);
  }
}

filterInput.addEventListener("input", applyFilter);
clearSearch.addEventListener("click", () => {
  filterInput.value = "";
  applyFilter();
});

createForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  createButton.disabled = true;
  showStatus("");

  try {
    const response = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitleInput.value.trim(),
        description: newDescriptionInput.value.trim(),
        technologies: newTechnologiesInput.value.trim(),
        github_url: newGithubUrlInput.value.trim(),
      }),
    });
    const project = await readResponse(response);
    if (
      response.status !== 201 ||
      !Number.isInteger(project.id) ||
      typeof project.title !== "string" ||
      typeof project.description !== "string" ||
      typeof project.technologies !== "string" ||
      typeof project.github_url !== "string" ||
      (project.author_name !== null &&
        typeof project.author_name !== "string")
    ) {
      throw new Error("The server returned an invalid project.");
    }

    projectCards.append(createProjectCard(project));
    updateSavedCount();
    createForm.reset();
    applyFilter();
    showStatus("Project added successfully.");
  } catch (error) {
    showStatus(error.message, true);
  } finally {
    createButton.disabled = false;
  }
});

projectsSection.addEventListener("click", async (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  const card = event.target.closest(".card");
  if (!(card instanceof HTMLElement)) {
    return;
  }

  const favoriteButton = event.target.closest(".favorite-button");
  if (favoriteButton instanceof HTMLButtonElement) {
    const isSaved = favoriteButton.getAttribute("aria-pressed") !== "true";
    favoriteButton.setAttribute("aria-pressed", String(isSaved));
    favoriteButton.textContent = isSaved ? "♥ Saved" : "♡ Save project";
    card.classList.toggle("card--saved", isSaved);
    updateSavedCount();
    return;
  }

  const detailsButton = event.target.closest(".details-button");
  if (detailsButton instanceof HTMLButtonElement) {
    const isExpanded = detailsButton.getAttribute("aria-expanded") !== "true";
    const details = card.querySelector(".project-details");
    if (details instanceof HTMLElement) {
      details.hidden = !isExpanded;
      detailsButton.setAttribute("aria-expanded", String(isExpanded));
      detailsButton.textContent = isExpanded ? "Hide details" : "More details";
    }
    return;
  }

});

loadProjects();
