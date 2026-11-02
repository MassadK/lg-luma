# Luma Liquid Glass 0.1.0

Based on ecklf/lg-luma 2.16.2, upstream commit `e5608cd053be5376a54a806129a332952dfabcef`.

## Standalone application

- New native application identity `com.lumaglass.launcher`, display name Luma Liquid Glass and a distinct icon.
- Independent desktop and webOS preferences, wallpaper storage and app installation paths. No upstream settings migration.
- Retain Rust, SDL2, GLES2, ARMv7 gnueabi soft-float, the pinned real SDL-webOS runtime, vector assets, fonts, app inventory, HDMI handling and remote/pointer navigation.
- Refuse Home lifecycle launches; do not redirect to an existing Home takeover.
- Replace takeover, autostart and self-update shell entry points with refusing stubs. Disable upstream update checks, installation actions, result recovery and splash synchronization.
- Limit the packaged elevated helper to bounded app-icon reads. Its Home, TV input registration, splash write and app-uninstall commands are unavailable.
- Protect original Luma and the fork from deletion through the launcher.
- Verify that IPK control data contains no installation hooks and its payload contains no foreign application paths.

## Native appearance

- Add Settings → Appearance → Interface Style with Original Luma and Liquid Glass.
- Original Luma retains upstream surface colors, app-face artwork, wallpaper shading, dimensions and navigation. Appearance adds one sidebar section; standalone update/deletion restrictions apply in both modes.
- Liquid Glass renders floating translucent navigation, app faces, HDMI tiles, settings and dialogs through existing rounded gradients and contour draw commands.
- Add a cooler glass tint, luminous contours, existing depth shadows and cinematic native wallpaper presentation. Retain original focus rings, nav-pill motion, panel fades and reduced-motion behavior.
- Use a low-cost compositing approximation. No real blur, refraction, new shaders, fullscreen blur textures or GPU readback.
- Keep real installed app art inset in a glass frame; retain curated vector logos and fallback marks.

## Preferences and controls

- Default interface: Liquid Glass. Default Glass Transparency: 55%.
- Slider values 0–100 in five-point steps using Left/Right; OK increases by five.
- Crystal (0), Balanced (55), and Frosted (100) presets support D-pad and pointer input.
- Apply changes on the next native frame and save using upstream atomic preferences storage.
- Hide glass controls in Original mode and preserve the last slider value across mode changes and restarts.
- Clamp persisted opacity to 0–100 and normalize to five-point steps.

## Build and verification

- Provide an isolated liquid-glass branch, complete source, ARM IPK, SHA-256, native desktop captures and reproducible build commands.
- Replace upstream release/PR automation with a read-only build workflow that uploads the standalone IPK as an Actions artifact. The workflow is supplied but has not been run on GitHub.
- Add regression coverage for slider limits, step size, persistence data, mode visibility, disabled updates and lifecycle payloads.
- Adapt upstream visual fixtures to exercise Original Luma, change identity fixtures to the fork, and replace updater-specific tests for the removed installer with standalone rejection tests.
- Add native desktop restart/pointer tests and screenshot commands.

## Known limitations

- No direct LG C1 access: package installation, tile launch, jail permissions, Luna app/HDMI launching, physical remote behavior, standby and on-TV performance remain unverified.
- Inventory/artwork requests still depend on the existing elevated Homebrew Channel read service. Firmware permissions may require troubleshooting after a normal tile launch.
- Glass is an optimized translucent approximation; no live backdrop blur/refraction, new spring-scale app animation or adaptive dynamic contrast engine.
- New Appearance labels are English; inherited interface translations remain bundled.
- App deletion is intentionally unavailable through the restricted helper; the upstream menu may still offer Delete for ordinary third-party apps and will report an error. Use the TV app manager for deletion.
- Self-update, Home takeover, boot hooks, Home remapping, splash writes and TV input registration are intentionally disabled.
- No hosted GitHub fork/release was created: the available GitHub connection exposes no fork/create-repository or release-upload action. A local branch and reproducible artifact workflow are provided instead.
- The preserved upstream developer/readme documents describe features that are disabled in this fork; use LIQUID_GLASS.md for installation and rollback.
