# Portfolio Website

A fast, responsive personal portfolio website built with **React + TypeScript + Vite**.

This site is my personal home on the web — it introduces who I am, highlights the projects I’ve built, and makes it easy for someone to contact me or explore my work. The layout is intended to be clean and quick to navigate, with a focus on readaility and smooth performance.

What you’ll typically find on the site:
- A landing/hero section with a short introduction
- Projects/work highlights (with links and brief descriptions)
- Skills/experience summary
- Contact links (email + social profiles)

Tech notes:
- Built with React + TypeScript for a component-based UI and type safety
- Vite for a fast dev server and optimized production builds
- Styling via the CSS files in `src/` (including the Aurora background component)

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`

## Vercel Deployment Checklist

1. Build output directory is `dist` (default Vite output).
2. Framework preset on Vercel: `Vite`.
3. Build command on Vercel: `npm run build`.
