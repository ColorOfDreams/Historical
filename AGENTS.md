# Project goal

Build a standalone frontend prototype for an interactive Vietnamese
history exploration platform.

This is not a reading website, textbook, blog, dashboard, or marketing
landing page. The primary experience is exploration through space,
relationships, time, and interaction.

# Scope

- Frontend only.
- Mock data only.
- No authentication.
- No database.
- No backend or API integration.
- Desktop-first.
- One polished exploration route is more important than many incomplete pages.

# Core experience

The prototype has three connected layers:

1. A real interactive 3D reconstruction of the Battle of Bach Dang 1288.
2. A constellation graph of people, events, dynasties, and places.
3. Guided historical exploration paths.

The user should be able to move naturally between these layers.

# Technical requirements

- React or Next.js with TypeScript.
- Tailwind CSS.
- React Three Fiber and Drei for the 3D scene.
- Framer Motion for HTML UI transitions.
- Zustand for selected node, selected hotspot, and timeline state.
- Mock data stored in typed local files.
- Avoid unnecessary dependencies.
- Do not add backend, auth, database, or API code.

# Visual direction

- Immersive, cinematic, scholarly, and historically grounded.
- Dark navy and near-black background.
- Muted gold and parchment accents.
- Strong contrast and readable Vietnamese typography.
- Restrained glow and animation.
- Avoid generic SaaS cards.
- Avoid excessive gradients.
- Avoid oversized marketing headlines.
- Avoid turning the interface into a book or article.
- Exploration surfaces should dominate the viewport.

# UX requirements

- The 3D scene is a functional WebGL scene, not a static background image.
- Users can orbit, zoom, select hotspots, and move through timeline stages.
- Selecting a hotspot opens contextual information without leaving the scene.
- Selecting a constellation node highlights only directly related nodes and edges.
- Related people, events, places, and dynasties are visibly distinguished.
- The interface always shows the current exploration context.
- Include clear reset and back controls.
- Support prefers-reduced-motion.
- Provide a non-WebGL fallback.

# Validation

Before completing a task:

- Run the app.
- Check for TypeScript and build errors.
- Open the affected route in a browser.
- Verify interactions manually.
- Check at 1440x900 and 1920x1080.
- Take screenshots and compare them with the supplied references.