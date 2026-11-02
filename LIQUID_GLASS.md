# Luma Liquid Glass 0.1.0

Native Rust/SDL2/OpenGL ES 2 fork of [Luma by ecklf](https://github.com/ecklf/lg-luma), based on upstream commit e5608cd053be5376a54a806129a332952dfabcef (2.16.2). The upstream MIT license and asset licenses are retained. This is an independent project, not an official Luma release.

## Standalone installation

Application ID: `com.lumaglass.launcher`. Display name: **Luma Liquid Glass**.
The package is an ARMv7 soft-float native application, using the upstream pinned SDL-webOS runtime and 1920×1080 logical layout. Target: LG C1/webOS 6; actual hardware verification is still required.

1. Connect webOS Dev Manager to your television using your existing supported connection. This build does not set up root or change TV firmware.
2. Open **Apps**, choose **Install**, and select `com.lumaglass.launcher_0.1.0_arm.ipk`.
3. Confirm that the installed application ID is `com.lumaglass.launcher`, separate from `com.ecklf.luma`.
4. Open **Luma Liquid Glass** from the TV's installed app list, or use Dev Manager's Launch action for that ID.
5. Check D-pad, OK, Back, pointer hover/click, app inventory, launching an ordinary app, and every HDMI input you use.
6. Exit with Settings → System → Quit app. Use LG Home normally.

The inventory and installed artwork readers retain upstream Homebrew Channel read-only requests; your existing elevated Homebrew service must be available for those functions. This does not mean running the launcher binary manually as root. Developer-mode install permissions and app launching must be verified from a normal tile launch.

No Home replacement, remapping, autostart or boot setup is required or supported. Do not run takeover instructions from the upstream documentation. Packaged `home.sh` and `autostart.sh` refuse all operations. Self-update and splash synchronization are disabled. The packaged helper accepts only read-app-icon; app deletion is unavailable in this release.

## Rollback

Quit Luma Liquid Glass, then uninstall **only** `com.lumaglass.launcher` through Dev Manager or the TV app manager. Open LG Home or the original Luma exactly as before. Existing Home mappings are untouched. No recovery shell commands or partition changes are necessary.

Preferences are isolated in this app's user-writable directory: `/media/developer/com.lumaglass.launcher/preferences.json`, `/media/developer/temp/com.lumaglass.launcher/preferences.json`, or `/media/internal/.com.lumaglass.launcher/preferences.json`, depending on jail permissions. Uninstall may retain preferences. Retaining them is harmless; no upstream preferences are imported. Desktop preferences use `~/.config/luma-liquid-glass/preferences.json`.

## Build from source

Use Linux x86_64 or another host supported by the upstream SDK setup. Install Git, Rust 1.93 with rustfmt/clippy, Node 24, pnpm 10.34.5, SDL2 development libraries, pkg-config, woff2, Python 3 with fontTools, CMake, curl and tar. On headless Linux, add Xvfb, Mesa and xauth. `nix develop` supplies the upstream host dependencies if Nix is available.

```sh
git switch liquid-glass
corepack pnpm install --frozen-lockfile
rustup target add armv7-unknown-linux-gnueabi
corepack pnpm sdk
export WEBOS_NDK="$PWD/.build/toolchain/arm-webos-linux-gnueabi_sdk-buildroot"
corepack pnpm assets
corepack pnpm build
node tools/package.mjs
```

The package tool verifies ARM soft-float ELF headers, actual app metadata, assets, permissions and the bundled SDL Wayland backend, then writes the IPK and SHA-256 into `dist/`. Do not substitute an upstream IPK: that has the upstream application identity.

```sh
cargo test --locked --workspace
cargo build --locked --no-default-features
xvfb-run -a cargo run --locked -- --preferences .build/manual.json --script home,down --frames 90 --screenshot .build/manual.png
```

## Fork hosting

This checkout is on `liquid-glass`. If no hosted fork is supplied, create a fork of ecklf/lg-luma in GitHub, then push this branch to that fork. Do not push to upstream. A git bundle in the deliverables preserves the complete history and modified branch.

## Manual LG C1 acceptance checklist

- Install alongside upstream Luma, confirm both icons remain, launch from the TV list.
- Confirm stock Home and any pre-existing mapping behave as before installation.
- Confirm real inventory; failures must show an error, never desktop demo apps.
- Test D-pad, OK, Back, Magic Remote, all HDMI inputs and return after app launching.
- Switch appearance modes; restart and confirm persistence.
- Set transparency to 0, 55 and 100, test 5-point remote adjustments, restart.
- Check labels against your brightest wallpaper at normal viewing distance.
- Test reduced motion, dialogs, background selection, original mode and settings.
- Compare measured frame pacing and memory on the TV before claiming a performance target.
- Uninstall the fork and confirm upstream Luma and LG Home still work.

Desktop framebuffers, test fixtures and cross-compilation do not verify TV installation, jail permissions, app launch, remote behavior or physical display performance.

## Appearance controls

Open **Settings → Appearance → Interface Style**. Press **OK** to toggle Original Luma and Liquid Glass. In Liquid Glass, press **Down** to Glass Transparency and use **Left/Right** for five-point changes. Press Down again to choose Crystal, Balanced or Frosted with OK; pointer clicks also work. Changes apply immediately and survive restarting the app. Original mode hides the glass controls while retaining their last values.

## Validation and screenshots

See `BUILD_VERIFICATION.md` for measured desktop results and hardware gaps, `GLASS_CHANGELOG.md` for changes and limitations, and `docs/liquid-glass/` for the actual native desktop captures. No hosted fork or release has been created; the GitHub connection lacks repository/fork creation and release asset upload actions.

The source ZIP also contains `liquid-glass.bundle`, preserving the development branch as an incremental Git bundle. To restore it with upstream history:

```sh
git clone https://github.com/ecklf/lg-luma.git luma-liquid-glass
cd luma-liquid-glass
git fetch /absolute/path/to/liquid-glass.bundle liquid-glass:liquid-glass
git switch liquid-glass
```

The source ZIP itself contains all source files and licensed assets and can be built without restoring Git history. To publish the branch, create your own GitHub fork, add that fork as a remote, and push `liquid-glass` there.
