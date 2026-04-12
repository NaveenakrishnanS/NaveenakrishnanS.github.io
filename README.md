# Portfolio Website

Production-ready static structure for GitHub Pages and simple static hosting.

## Folder structure

```text
.
├── index.html              # Primary entrypoint
├── portfolio.html          # Legacy redirect to index.html
├── assets/
│   ├── css/
│   │   └── main.css        # Styles extracted from the original single file
│   ├── js/
│   │   └── main.js         # Interaction and animation logic
│   ├── images/             # Place site images here
│   └── icons/              # Place favicon/app icons here
└── README.md
```

## Local preview

Open `index.html` directly, or run a lightweight static server:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Deployment

This layout is ready for GitHub Pages (root publish) or any static host.
