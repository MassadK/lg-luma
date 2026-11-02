# Native desktop captures

These 1920×1080 images are framebuffers rendered by the actual Rust/SDL/OpenGL application with sample desktop inventory. They are not photographs or LG C1 hardware captures.

- `home.png`: Liquid Glass Home, Balanced 55%.
- `apps.png`: Liquid Glass app library.
- `settings.png`: Appearance settings, Balanced 55%.
- `original-luma.png`: Original Luma rendering paths.
- `crystal-clear.png`: Home, maximum transparency at 0%.
- `frosted.png`: Home, maximum opacity at 100%.
- `crystal-settings.png` and `frosted-settings.png`: endpoint settings states.

Recreate with `cargo build --locked` followed by `pnpm screenshots:glass`. On a desktop, set SDL_VIDEODRIVER appropriately; the script defaults to `offscreen` for this environment. On a headless Linux host with Xvfb, use `SDL_VIDEODRIVER=x11 xvfb-run -a pnpm screenshots:glass`.
