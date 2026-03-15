# Cosmic CRM Dashboard

![App Preview](https://imgix.cosmicjs.com/bb178eb0-2003-11f1-8281-718de20a7d4e-autopilot-photo-1596526131083-e8c633c948d2-1773533582080.jpeg?w=1200&h=630&fit=crop&auto=format,compress)

A full-featured CRM dashboard application built with Next.js 16 and powered by [Cosmic](https://www.cosmicjs.com) as the headless CMS backend. Manage contacts, track activity, configure automation settings, and monitor email sequences — all from a beautiful, modern interface.

## Features

- 📊 **Dashboard** — KPI cards, recent activity feed, and contact overview at a glance
- 👥 **Contact Management** — Create, read, update, and delete CRM contacts with search and status filters
- 📋 **Activity Log** — Chronological feed of all CRM actions with filtering by action type
- ⚙️ **Settings** — Configure cron schedule, auto-welcome email, inactive threshold, and notification email
- ✉️ **Email Sequences** — View automated email sequences and their associated templates
- 🔍 **Search & Filter** — Instant search across contacts by name, email, or company
- 📱 **Responsive Design** — Works beautifully on desktop, tablet, and mobile
- 🎨 **Modern UI** — Clean sidebar navigation with Tailwind CSS styling

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](http://localhost:3040/projects/new?clone_bucket=691cfed53376bfc6e819ddcd&clone_repository=69b615c4795fe27333f408ef)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "Create content models for a headless CMS backend with pages, blog posts, and site settings. User instructions: A simple internal CRM dashboard for managing sales contacts and tracking activity. Built with Next.js and Tailwind CSS. Features: contacts table with search, dashboard with metrics, activity feed. Connect to Cosmic CMS for data storage using existing object types: crm-contacts, activity-log, user-signups, email-sequences, email-templates, crm-settings."

### Code Generation Prompt

> "Build a Next.js application for a content management system called 'Cosmic CRM'. Create a beautiful, modern, responsive design with a homepage and pages for each content type. A CRM dashboard app for managing Cosmic users. Features include: Dashboard showing all CRM contacts with status, company, lead source, and lifetime value; Contact detail pages with full profile and activity history; Activity log showing all actions; CRM Settings page to configure cron schedule, auto welcome email toggle, inactive threshold, notification email; Ability to create, edit, and delete contacts; Email sending functionality for onboarding sequences; Clean, modern UI with sidebar navigation; Built on Next.js with Cosmic CMS as the backend using existing content types: crm-contacts, activity-logs, crm-settings, email-templates, email-sequences."

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## Technologies

- [Next.js 16](https://nextjs.org/) — React framework with App Router
- [React 19](https://react.dev/) — UI library
- [TypeScript](https://www.typescriptlang.org/) — Type-safe development
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS framework
- [Cosmic](https://www.cosmicjs.com) — Headless CMS backend ([docs](https://www.cosmicjs.com/docs))

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- A [Cosmic](https://www.cosmicjs.com) account with a bucket containing the required object types

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd cosmic-crm-dashboard

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Cosmic credentials

# Run the development server
bun dev
```

### Environment Variables

```
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-read-key
COSMIC_WRITE_KEY=your-write-key
```

## Cosmic SDK Examples

### Fetching Contacts
```typescript
import { cosmic } from '@/lib/cosmic'

const { objects: contacts } = await cosmic.objects
  .find({ type: 'crm-contacts' })
  .props(['id', 'title', 'slug', 'metadata', 'created_at'])
  .depth(1)
```

### Creating a Contact
```typescript
await cosmic.objects.insertOne({
  type: 'crm-contacts',
  title: 'John Doe',
  metadata: {
    name: 'John Doe',
    email: 'john@example.com',
    company: 'Acme Inc',
    status: 'Active',
  }
})
```

### Updating a Contact
```typescript
await cosmic.objects.updateOne(contactId, {
  metadata: {
    status: 'Inactive'
  }
})
```

## Cosmic CMS Integration

This app uses the following Cosmic object types:

| Object Type | Purpose |
|---|---|
| `crm-contacts` | Contact records with profile data |
| `activity-log` | Action history linked to contacts |
| `crm-settings` | App configuration (singleton) |
| `email-sequences` | Automated email sequence definitions |
| `email-templates` | Individual email templates |
| `user-signups` | User registration tracking |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project on [Vercel](https://vercel.com)
3. Add environment variables in the Vercel dashboard
4. Deploy

### Netlify

1. Push your code to GitHub
2. Import the project on [Netlify](https://netlify.com)
3. Set the build command to `bun run build`
4. Add environment variables in the Netlify dashboard
5. Deploy

<!-- README_END -->