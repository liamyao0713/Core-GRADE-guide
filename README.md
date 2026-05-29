# Core Grade Handbook

Static website for the Core Grade handbook.

Open `index.html` locally, or publish the repository with GitHub Pages from the `main` branch root.

## Content Admin

Open `admin.html` from the local preview server to edit website text in `content.json`.

The admin scans these pages and splits editable content by the existing page title, chapter title, section/subsection heading, and body content:

- `index.html`
- `chapter1.html`
- `chapter2.html`
- `chapter3.html`
- `chapter4.html`

The public website reads saved content overrides from `content.json` through `content-loader.js`.

Body content is edited as rich HTML so existing links, lists, figures, and inline formatting can be preserved.
