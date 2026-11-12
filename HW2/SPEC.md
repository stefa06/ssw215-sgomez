# SPEC: Personal Developer Project Showcase

## 1. Purpose and Scope
- Build a single-page personal portfolio for showcasing the owner's software projects.
- Use Flask, Flask-SQLAlchemy, SQLite, HTML, CSS, and JavaScript.
- Keep the design cute, simple, minimalist, and pink.
- The project-creation form is intended for the portfolio owner. Do not add a login
  system or a complicated dashboard for this version.
- Do not add likes, upvotes, like counts, or trending badges.

## 2. Data and Persistence
- All project records MUST be stored in a SQLite database managed by
  Flask-SQLAlchemy. The database, not a JSON file or a hardcoded Python list, is the
  source of truth for projects.
- The database MUST be created using `db.create_all()` inside an application context
  when the server starts.
- Each project MUST have:
  - an integer primary key;
  - a non-empty title;
  - a description;
  - a category;
  - technologies;
  - a GitHub URL.
- Project data MUST remain available after the server restarts.
- If seed data is used, it MUST be inserted only when the projects table is empty, and
  every seeded project MUST provide all required project fields.
- The add-project endpoint MUST validate submitted project data. Invalid data MUST
  receive an appropriate client error response without crashing the server.
- A successfully created project MUST be saved to SQLite and returned as JSON with
  status code 201.

## 3. Application Structure
- `app.py` MUST create the Flask application and configure Flask-SQLAlchemy to use the
  SQLite database.
- The portfolio page MUST be rendered from `templates/index.html`.
- CSS and JavaScript MUST be served from the `static/` directory and linked using
  Flask's `url_for('static', filename=...)`.
- All page styling MUST be in the stylesheet; do not use inline style attributes.
- All page JavaScript MUST be in the external JavaScript file; do not use inline event
  handlers or inline script code.
- The project list shown on the page MUST come from a database query.

## 4. Page and Project Cards
- The page MUST use semantic landmarks, including a header, navigation, main content,
  and footer.
- The projects section MUST have a heading and display one card for each project in the
  database.
- Each project MUST be displayed in an attractive pink-themed card.
- Each card MUST show the project's title and category, and provide access to its
  description, technologies, and GitHub URL.
- The layout MUST adapt to narrow screens without horizontal overflow.

## 5. Save Project Interaction
- Every project card MUST contain a "Save Project" button.
- Clicking the button MUST toggle that card between saved and unsaved states without
  reloading the page.
- The button's text MUST reflect its current state, and its `aria-pressed` attribute
  MUST be updated to `"true"` or `"false"` accordingly.
- The page MUST display a saved-project count and update it whenever a project's saved
  state changes.
- Saved state is a page interaction; it MUST NOT be represented as likes or upvotes.

## 6. More Details Interaction
- Every project card MUST contain a "More Details" button.
- Clicking it MUST expand the additional project information; clicking again MUST
  collapse it, without reloading the page.
- The button's `aria-expanded` attribute MUST be updated to `"true"` or `"false"`
  accordingly.
- The button MUST identify the details section it controls using `aria-controls`.
- The expanded information MUST include the project's description, technologies, and
  GitHub URL.

## 7. Search and Category Filtering
- The projects section MUST provide a text search control with an associated label.
- Search MUST update the visible project cards as the user types, without a page reload.
- The projects section MUST provide a category filter based on each project's stored
  category, including an option to show all categories.
- Search and category filtering MUST work together.
- The page MUST provide a clear status or result count, including when no projects
  match.

## 8. Add Project Form
- The page MUST provide an "Add Project" form for the owner to add a project to the
  portfolio. No authentication or login system is required for this version.
- The form MUST collect the title, description, category, technologies, and GitHub URL.
- Submitting valid data MUST save the project through the Flask application to SQLite
  and display the new project without requiring a manual page reload.
- The form MUST provide a visible success or error message.
- The add-project form MUST be separate from the project-card layout.

## 9. Visual Design and Accessibility
- The visual design MUST be cute, simple, minimalist, and consistently pink-themed.
- Cards, controls, spacing, and typography MUST remain readable and visually cohesive.
- Interactive elements MUST be operable by keyboard and have visible focus states.
- Buttons and controls MUST have accessible labels and expose their state with the
  required ARIA attributes.
- Do not load an external CSS framework or CDN.

## 10. Acceptance Checklist
- [ ] Starting the Flask server creates or connects to the SQLite database and renders
  one card for each project record.
- [ ] Each project record includes a title, description, category, technologies, and
  GitHub URL, and remains stored after a server restart.
- [ ] Project cards use the pink-themed responsive design.
- [ ] Save Project toggles the saved state, updates button text and `aria-pressed`, and
  updates the saved-project count.
- [ ] More Details expands and collapses the additional information and updates
  `aria-expanded`.
- [ ] Search filters projects as the user types.
- [ ] Category filtering uses the category stored with each project; search and category
  filtering can be combined.
- [ ] The Add Project form saves valid projects to SQLite and shows the new card without
  a manual page reload.
- [ ] Invalid project submissions produce a visible error and do not crash the server.
- [ ] No likes, upvotes, like counts, or trending badges appear in the application.
