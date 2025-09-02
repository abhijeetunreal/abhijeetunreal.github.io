# AI Brutal Forge

A modern portfolio website with AI-powered chat functionality built with React, TypeScript, and Gemini AI.

## Features

- Interactive portfolio showcase
- AI-powered virtual self chat using Gemini 2.0 Flash
- Modern UI with shadcn/ui components
- Responsive design with Tailwind CSS
- TypeScript for type safety

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with:
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```
   
   Get your Gemini API key from: https://makersuite.google.com/app/apikey

4. Run the development server:
   ```bash
   npm run dev
   ```

## Tech Stack

- **Frontend**: Vite + React + TypeScript
- **UI Components**: shadcn/ui + Tailwind CSS
- **AI Integration**: Google Gemini 2.0 Flash API
- **Styling**: Tailwind CSS with custom design system

## Build

```bash
npm run build
```

## Development

```bash
npm run dev
```

---

## Content & Marquee Integration Guide

The site is driven by a JSON content model. Update `src/data/content.json` to change projects and page content. Types live in `src/types/content.ts`.

Relevant pages/components:
- `src/pages/ProjectDetail.tsx`
- `src/pages/ExperimentalProjectDetail.tsx`
- `src/components/DetailMarquee.tsx` (layout with static-left + marquee-right)
- `src/components/Marquee.tsx` (infinite scroller)

### Project structure (high level)
Each project has:
- `title`, `description`, `tags`
- `cardImage`, `heroImage`, `designProcessImage`
- `fullDescription`, `designProcess`, `technicalDetails`
- `sections?: ProjectSection[]`

### Section types
- `image`: `{ type: "image", src, alt? }`
- `paragraph`: `{ type: "paragraph", content }`
- `youtube-video`: `{ type: "youtube-video", youtubeUrl }`
- `external-links`: `{ type: "external-links", externalLinks: [{ label, href }] }`
- `marquee`: featured full-width marquee (DetailMarquee)
- `marquee-inline`: inline marquee that can be placed in special slots

### Featured marquee (section.type = "marquee")
```json
{
  "type": "marquee",
  "marqueeLeftImage": "/path/to/left.jpg",
  "marqueeLeftAlt": "Left Alt",
  "marqueeItems": [
    "/path/to/01.jpg",
    "/path/to/02.jpg"
  ]
}
```
- `marqueeItems` accepts image URLs as strings or `{ "image": "url" }` objects.
- Left image falls back to project `heroImage`/`cardImage` if omitted.

### Inline marquee (section.type = "marquee-inline")
Positions supported via `position`:
- `top`: after hero image, before full description
- `after-description`: after full description, before Design Process
- `between-design-and-technical`: after Design Process, before Technical Details
- `journey` (or omitted): rendered in the sections list where defined

Shape:
```json
{
  "type": "marquee-inline",
  "position": "top | after-description | between-design-and-technical | journey",
  "marqueeInlineLeftImage": "/path/to/left.jpg",
  "marqueeInlineItems": [
    "/path/to/01.jpg",
    "/path/to/02.jpg",
    "/path/to/03.jpg"
  ]
}
```

### Examples
- Inline between hero and description:
```json
{
  "type": "marquee-inline",
  "position": "top",
  "marqueeInlineLeftImage": "https://picsum.photos/id/1015/1200/900",
  "marqueeInlineItems": [
    "https://picsum.photos/id/1043/800/600",
    "https://picsum.photos/id/1050/800/600",
    "https://picsum.photos/id/1062/800/600"
  ]
}
```
- Inline after description:
```json
{
  "type": "marquee-inline",
  "position": "after-description",
  "marqueeInlineItems": [
    "https://picsum.photos/id/1039/800/600",
    "https://picsum.photos/id/1024/800/600"
  ]
}
```
- Inline between Design and Technical:
```json
{
  "type": "marquee-inline",
  "position": "between-design-and-technical",
  "marqueeInlineItems": [
    "https://picsum.photos/id/1018/800/600",
    "https://picsum.photos/id/1050/800/600"
  ]
}
```
- Inline inside journey flow (no position):
```json
{
  "type": "marquee-inline",
  "marqueeInlineItems": [
    "https://picsum.photos/id/1018/800/600",
    "https://picsum.photos/id/1024/800/600",
    "https://picsum.photos/id/1039/800/600"
  ]
}
```

### Behavior & styling
- Marquee loops infinitely, supports drag with inertia.
- Cards match the hero card aspect (3:4) and are smaller on mobile (`w-36`) then scale up (`sm:w-48 md:w-64 lg:w-80`).
- Square corners for all marquee cards.
- Subtle left-edge fade where the scroller meets the static left image.

### Avoid duplicate rendering
- Journey list renders `marquee-inline` only when `position` is missing or equals `"journey"`.
- Blocks with `position` set to `"top"`, `"after-description"`, or `"between-design-and-technical"` render only in their respective slot.

That’s it — edit `content.json`, and the pages update automatically.

