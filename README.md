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

Before the first run, the repository owner must add an Actions repository secret named `STUDIO_SOURCE_READ_TOKEN`. It must be a fine-grained GitHub token with **Contents: Read-only** access to `hannansatopay/Three-Studios-Streaming-Platform`. Create and enter the token directly in GitHub; do not put it in this repository or send it in a message. The account creating the token must already be allowed to read that private source repository.

To publish, first increase the `version` in the private Studio source repository above the version already released here. Then open the workflow, choose **Run workflow**, and enter the source branch, tag, or commit to build (default: `beta`). The workflow refuses to replace an existing version.

The v2.9.5 installers predate this workflow. Existing installed apps still check their original update server. Install a new GitHub-backed version once to switch them to this Releases feed; later versions can update through the app's **Restart And Install** button.
