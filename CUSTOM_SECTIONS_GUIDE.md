# Custom Sections Feature Guide

## Overview

The custom sections feature allows you to add flexible, custom content sections to any project detail page without modifying the existing codebase. You can create custom sections directly in the `content.json` file for specific projects.

## How It Works

Custom sections are rendered after the existing sections (Design Process, Technical Details, Design Journey) and before the project navigation. They use a flexible block-based system that supports multiple content types.

## Adding Custom Sections

### Basic Structure

Add a custom section to any project in `content.json` using this structure:

```json
{
  "type": "custom-section",
  "title": "Your Section Title",
  "customBlocks": [
    // Array of content blocks
  ]
}
```

### Supported Block Types

#### 1. Text Block
```json
{
  "type": "text",
  "title": "Optional Block Title",
  "content": "Your text content here..."
}
```

#### 2. Paragraph Block
```json
{
  "type": "paragraph",
  "title": "Optional Block Title",
  "content": "Your paragraph content here..."
}
```

#### 3. Image Block
```json
{
  "type": "image",
  "title": "Optional Block Title",
  "src": "https://example.com/image.jpg",
  "alt": "Image description"
}
```

#### 4. Video Block
```json
{
  "type": "video",
  "title": "Optional Block Title",
  "src": "https://example.com/video.mp4",
  "alt": "Video description"
}
```

#### 5. YouTube Video Block
```json
{
  "type": "youtube-video",
  "title": "Optional Block Title",
  "youtubeUrl": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

#### 6. External Links Block
```json
{
  "type": "external-links",
  "title": "Optional Block Title",
  "externalLinks": [
    {
      "label": "Link Text",
      "href": "https://example.com"
    }
  ]
}
```

#### 7. Marquee Block
```json
{
  "type": "marquee",
  "title": "Optional Block Title",
  "marqueeLeftImage": "https://example.com/left-image.jpg",
  "marqueeLeftAlt": "Left image description",
  "marqueeItems": [
    "https://example.com/item1.jpg",
    "https://example.com/item2.jpg"
  ]
}
```

#### 8. Marquee Inline Block
```json
{
  "type": "marquee-inline",
  "title": "Optional Block Title",
  "marqueeInlineLeftImage": "https://example.com/left-image.jpg",
  "marqueeInlineItems": [
    "https://example.com/item1.jpg",
    "https://example.com/item2.jpg"
  ]
}
```

#### 9. Accordion Projects Block
```json
{
  "type": "accordion-projects",
  "title": "Optional Block Title",
  "accordionItems": [
    {
      "title": "Project Title",
      "year": "2024",
      "image": "https://example.com/project.jpg",
      "description": "Project description",
      "linkHref": "https://example.com",
      "linkLabel": "View Project"
    }
  ]
}
```

#### 10. HTML Block
```json
{
  "type": "html",
  "title": "Optional Block Title",
  "htmlContent": "<p>Your <strong>HTML</strong> content here...</p>"
}
```

## Complete Example

Here's a complete example of a custom section:

```json
{
  "type": "custom-section",
  "title": "Project Insights & Learnings",
  "customBlocks": [
    {
      "type": "paragraph",
      "title": "Key Challenges",
      "content": "One of the biggest challenges was creating an intuitive interface that could handle complex categorization while remaining simple enough for daily use."
    },
    {
      "type": "image",
      "title": "Process Overview",
      "src": "https://example.com/process-diagram.jpg",
      "alt": "Process flow diagram"
    },
    {
      "type": "external-links",
      "title": "Development Resources",
      "externalLinks": [
        {
          "label": "GitHub Repository",
          "href": "https://github.com/example/project"
        },
        {
          "label": "Design System",
          "href": "https://figma.com/example/design-system"
        }
      ]
    }
  ]
}
```

## Features

- **Flexible Content**: Mix and match different block types within a single section
- **Optional Titles**: Each block can have an optional title
- **Consistent Styling**: All custom sections follow the same design system as existing sections
- **Responsive Design**: Custom sections automatically adapt to different screen sizes
- **No Code Changes**: Add custom sections without modifying any React components

## Best Practices

1. **Use Descriptive Titles**: Give your custom sections clear, descriptive titles
2. **Organize Content**: Group related content into logical blocks
3. **Optimize Images**: Use appropriately sized images for web display
4. **Test Links**: Ensure all external links are working and accessible
5. **Keep It Relevant**: Only add custom sections that provide value to the project showcase

## Compatibility

This feature works with:
- Project Detail pages (`ProjectDetail.tsx`)
- Experimental Project Detail pages (`ExperimentalProjectDetail.tsx`)
- Blog Post Detail pages (`BlogPostDetail.tsx`)

## Example Use Cases

- **Project Insights**: Share lessons learned, challenges faced, and achievements
- **Technical Deep Dive**: Add detailed technical information beyond the main technical details section
- **Resources & Links**: Provide additional resources, documentation, or related projects
- **Process Documentation**: Show detailed workflows, wireframes, or process diagrams
- **Client Testimonials**: Include client feedback or case study information
- **Future Plans**: Share roadmap or future development plans

The custom sections feature gives you complete flexibility to enhance your project detail pages with any additional content you need, all through simple JSON configuration.
