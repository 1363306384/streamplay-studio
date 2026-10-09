# Streamplay Studio

Official installer downloads and release notes for Streamplay Studio.

## Latest release / 最新版本

[Streamplay Studio v2.9.5](https://github.com/1363306384/streamplay-studio/releases/tag/v2.9.5)

| Platform / 系统 | File / 文件 |
| --- | --- |
| Windows x64 | `Streamplay.Studio-Setup-2.9.5-x64.exe` |
| macOS Apple Silicon (M-series) | `Streamplay.Studio-2.9.5-Apple-Silicon.dmg` |

**English:** Download the installer matching your operating system from [Releases](https://github.com/1363306384/streamplay-studio/releases). The macOS DMG is for Apple Silicon; no Intel Mac installer is included.

**中文：** 请前往 [Releases 下载页面](https://github.com/1363306384/streamplay-studio/releases) 选择对应系统的安装包。macOS 版本仅支持 Apple Silicon（M 系列芯片），暂不包含 Intel Mac 版本。

This repository distributes releases and does not contain the application source code.

## Publish a Windows update

The [Build and publish Windows update](https://github.com/1363306384/streamplay-studio/actions/workflows/build-and-publish-windows.yml) workflow builds the private Studio source on a Windows runner and publishes the x64 installer, `latest.yml`, and blockmap to this repository's Releases.

Before the first run, the owner of `hannansatopay/Three-Studios-Streaming-Platform` must create a fine-grained GitHub token scoped to that repository with **Contents: Read-only** access. Save it as an Actions repository secret named `STUDIO_SOURCE_READ_TOKEN` in this release repository. Enter the token directly in GitHub; do not put it in this repository or send it in a message. GitHub currently does not support using a fine-grained personal access token as an outside collaborator to access another personal account's repository.

To publish, first increase the `version` in the private Studio source repository above the version already released here. Then open the workflow, choose **Run workflow**, and enter the source branch, tag, or commit to build (default: `beta`). The workflow refuses to replace an existing version.

The v2.9.5 installers predate this workflow. Existing installed apps still check their original update server. Install a new GitHub-backed version once to switch them to this Releases feed; later versions can update through the app's **Restart And Install** button.

### Build configuration

Both workflows check out a committed source ref from the private Studio repository. They do not include uncommitted files from a developer's computer, and this public release repository does not contain Studio source. The source repository ignores `.env`, so the workflow creates an empty `.env` solely to satisfy electron-builder's bundled resource entry. Do not put credentials into an installer: bundled resources are readable by recipients.

Before packaging, `scripts/prepare-studio-build.mjs` sets the Studio backend to `https://streamplay.devkit.sh` and points Windows updates to this GitHub Releases repository. If the source backend config no longer has the expected single active setting, the workflow fails for review instead of silently shipping a local development URL. Other application code and settings come from the selected source commit. Runtime `.env` files on a user's computer may still supply optional settings, but they do not change the backend URL hardcoded into this build.

## Publish an unsigned macOS DMG

Without an Apple Developer signing certificate, the [Build unsigned macOS installer](https://github.com/1363306384/streamplay-studio/actions/workflows/build-and-publish-macos-unsigned.yml) workflow follows the source repository's `desktop:dist:mac:local` command. It builds an Apple Silicon DMG and adds it to an existing release of the same source version. Run the Windows release workflow first to create that release. It uses the same `STUDIO_SOURCE_READ_TOKEN` secret and will not replace an existing DMG.

This DMG is unsigned and unnotarized. It is for manual download and installation only; it does not provide macOS in-app automatic updates. A signed, notarized build plus a ZIP and `latest-mac.yml` are required before enabling that feature.
