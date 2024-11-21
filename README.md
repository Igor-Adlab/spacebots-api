
# Spacebots Api

  A Node.js project built with Fastify, hosting six specialized Telegram bots for various media and subscription services.

## Overview

This repository contains the codebase for `spacebots-api`, a suite of Telegram bots that provide diverse utilities for managing subscriptions, downloading media, creating videos, converting audio, and more. The API is developed with Node.js and Fastify, focusing on performance, scalability, and efficiency.

### Bots

1. **[Billing Bot](@SpacebotsBillingBot)**
   - Manages user subscriptions and payments within Telegram.
   - Tracks active subscriptions and notifies users about renewal or payment requirements.

2. 📥 **[@AllyDownloaderBot](https://t.me/AllyDownloaderBot)**
   - Download media from popular social platforms like Instagram, TikTok, YouTube, and even messengers. Your ultimate downloader assistant.
   - Allows users to download media files from Instagram, TikTok, and Spotify.
   - Facilitates easy access to media content by downloading and sharing directly through Telegram.

3. 🎶 **[@FmMusicSearchBot](https://t.me/FmMusicSearchBot)**
   - Provides music and track search functionality, powered by the z3.fm API.
   - Delivers relevant search results for users looking for specific tracks or artists.

4. 🎨 **[@TgTokVideoBot](https://t.me/TgTokVideoBot)**
   - Create creative TikTok videos with ease. Whether it’s dynamic edits or catchy effects, this bot has got you covered!
   - Generates engaging vertical videos for TikTok and Instagram Reels.
   - Splits screen content for popular formats, including a story at the top and a background at the bottom.

5. In Progress: 📝 **[@SpaceVideoCaptionsBot](https://t.me/SpaceVideoCaptionsBot)**
   - Creates videos with an audio track based on user-provided text.
   - Adds captions to video, turning stories or texts into narrated video clips.

6. 🎬 **[@GetMediaTextBot](https://t.me/GetMediaTextBot)**
   - Transform videos and audio into text seamlessly. Ideal for transcribing podcasts, interviews, or video scripts.
   - Converts video or audio content into text format.
   - Useful for generating transcripts, notes, or searchable text from audio files.

## Technology Stack

- **Node.js**: Core runtime for server-side operations.
- **Fastify**: Framework for creating fast and lightweight HTTP services.
- **Telegram Bot API**: Integrated with Telegram for bot functionalities.
- **FFmpeg**: Processes and edits audio and video content.
- **OpenAI**: Used for various AI-driven tasks, such as text generation and processing.
- **GrammyJS**: Framework for building Telegram bots with extensive functionality and ease of use.
- **re.video**: Provides tools for video generation and manipulation.
- **Cheerio**: Simplifies HTML/XML parsing, making web scraping more efficient.
- **Third-Party Integrations**: 
  - **z3.fm** for music search and retrieval.
  - **Media platforms** like Instagram, TikTok, and Spotify for downloading media.


## TODO
  
### Core functionality

 - [x] Shared library
   - [x] Implement `Language Settings` menu
   - [x] Add DI Container(Awilix)
   - [x] Implement basic services: gcp store, ffmpeg, OpenAI Whisper, downloader and music finder services
   - [x] Add Billing functionality(usage, subscriptions check)
 - [x] Billing bot
   - [x] Donation
   - [x] Subscription
   - [x] Track subscription in other bots
   - [ ] Add notifications for 1w / 1d before subscription ends
 - [x] Downloader bot
   - [x] Download from TikTok / Instagram 
   - [ ] Investigate how to download from YouTube
 - [x] Music search
   - [x] Integration with z3.fm
   - [ ] Pagination by url
 - [ ] TikTok Videos
   - [x] Code migration
   - [x] Move billing to new system
   - [x] Add support for new Backdrops service(with random start time) 
 - [ ] Captions bot
   - [ ] Implement Re.Video template for captions
   - [x] Investigate to AI tools for ASS(Advanced SubStation Alpha) generation
   - [x] Check existing Re.video template(Youtube shorts)
   - [] Payments integration
 - [x] Video-to-Text(Media to text)
   - [x] Add support for video/video notes
   - [x] Check positiblity to handle video/voice messages files
 - [ ] CI/CD
   - [x] Check various deployment platforms(Google Cloud / Firebase)
   - [ ] Find how to pass Google Credentials(Service Roles) for trigger CloudRun job from Firebase/Heroku/DO clouds


### Translations
 - [x] Common translations(basic buttons)
 - [x] Billing bot - 100/100%
 - [x] Downloader bot - 100/100%
 - [x] Music search - 100/100%
 - [x] TikTok Videos - 100/100%
 - [ ] Captions bot - 0/100%
 - [x] Video-to-Text(Media to text) - 100/100%
