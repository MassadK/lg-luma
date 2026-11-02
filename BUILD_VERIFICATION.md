# Verification record — 2 November 2026

The ARM IPK was compiled and packaged successfully in this environment. It has **not** been installed or launched on an LG C1. No television connection or TV shell command was used.

## Completed checks

| Check                                                      | Result                                                                                                                                          |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Initial standalone ARM build before glass changes          | Passed; original UI baseline retained locally                                                                                                   |
| Initial native desktop startup and app focus               | Passed with SDL offscreen                                                                                                                       |
| Final Rust workspace tests                                 | 273 launcher + 43 helper tests passed; none ignored                                                                                             |
| Clippy, workspace and all desktop targets, warnings denied | Passed                                                                                                                                          |
| Rust formatting and JS lint                                | Passed                                                                                                                                          |
| Standalone identity/lifecycle Node regression              | Passed                                                                                                                                          |
| Version metadata synchronization                           | Passed, 0.1.0                                                                                                                                   |
| Native desktop smoke                                       | Passed: remote slider steps, restart persistence, mode switching, hidden controls, presets, pointer activation, simulated desktop app launch    |
| Native captures                                            | Home, Apps, Appearance settings, Original Luma, Crystal and Frosted, plus Crystal/Frosted settings; no missing images, glyphs or glyph failures |
| Original appearance fidelity                               | Home cards/HDMI region (x=0,y=450,w=1920,h=600) exactly matches baseline; 0 changed channels out of 4,608,000                                   |
| ARM executable                                             | ELF32 little endian, ARM EABI5 soft-float, PIE                                                                                                  |
| Package content verification                               | Passed: separate identity, manifest/version, ARM binaries, SDL-webOS Wayland backend, required assets/licenses and executable permissions       |
| Package isolation                                          | Passed: no maintainer scripts; payload limited to this app/package; no symlinks or foreign app payloads                                         |

Desktop smoke scripts use sample app and input data. They do not contact the TV and do not establish that a Luna request succeeds on webOS. Upstream unit fixtures compile Home helper modules for regression purposes; the packaged helper's command dispatcher only allows app-icon reads.

## Desktop measurement only

Same native development binary, Home page, SDL offscreen, Mesa llvmpipe software renderer, 1280×720 drawable, 4× MSAA. Sixty forced presentations per mode; first ten excluded, fifty measured. No hardware VSync or GPU timestamp measurements. Full-frame redraw for both; sequential single runs, not a controlled hardware benchmark.

| Metric                     | Original Luma | Liquid Glass 55% |
| -------------------------- | ------------: | ---------------: |
| Mean presentation interval |      13.55 ms |          4.73 ms |
| P95 presentation interval  |      29.96 ms |          6.66 ms |
| Mean CPU submission        |      12.93 ms |          4.54 ms |
| Last presented draw calls  |            46 |               34 |
| Cached artwork bytes       |    14,417,460 |       10,412,820 |
| Cached vector bytes        |     2,118,420 |        2,118,420 |

These figures describe this host and these particular scenes. They do not predict LG C1 frame rate or memory use. Artwork-cache bytes exclude the framebuffer, fonts, vectors, process memory and driver allocations. No claim of 60 fps on the TV is made. Raw reports are included under `verification/`.

## Hardware acceptance still needed

Install with webOS Dev Manager, launch from the TV app list, verify real inventory, ordinary app launches, each HDMI input, D-pad/OK/Back and Magic Remote, appearance persistence, text legibility, reduced motion, exit/reopen and uninstall. Confirm the original Luma and LG Home still behave as before. See LIQUID_GLASS.md for steps and rollback.

The GitHub build workflow is supplied as source; no remote fork, workflow run, hosted release or hosted artifact link was created.
