# Authentic Local Experiences - PWA

A full-stack Progressive Web App that connects tourists with vetted local guides and families for authentic local experiences.

## Features

- **User Authentication**: Email/password signup and login with role-based access (Guest/Host)
- **Experience Management**: Hosts can create, edit, and manage their local experiences
- **Booking System**: Guests can request bookings with custom messages
- **Real-time Updates**: Live booking status updates and notifications
- **PWA Features**: Offline support, installable, and mobile-optimized
- **Responsive Design**: Mobile-first design with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **PWA**: Service Worker, Manifest, Offline caching
- **Deployment**: Vercel/Netlify ready

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (free tier)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd authentic-local-experiences
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Copy `env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup

1. In your Supabase dashboard, go to SQL Editor
2. Copy and run the contents of `supabase/schema.sql` to create tables and policies
3. Enable Row Level Security (RLS) is already configured in the schema

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
├── app/                    # Next.js 14 app directory
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── experiences/       # Experience detail pages
│   ├── guest/            # Guest-specific pages
│   ├── host/             # Host-specific pages
│   ├── profile/          # Profile management
│   └── providers.tsx     # Auth context provider
├── lib/                  # Utility libraries
│   ├── supabase.ts       # Supabase client
│   ├── pwa.ts           # PWA utilities
│   └── offline.ts       # Offline data management
├── public/               # Static assets
│   ├── manifest.json    # PWA manifest
│   ├── sw.js           # Service worker
│   └── offline.html    # Offline fallback page
├── supabase/            # Database schema
│   └── schema.sql      # Database tables and policies
└── tailwind.config.js  # Tailwind configuration
```

## Database Schema

### Tables

- **profiles**: User profiles with role (guest/host) and verification status
- **experiences**: Host-created experiences with details and pricing
- **bookings**: Guest booking requests with status tracking

### Row Level Security (RLS)

- Users can only update their own profiles
- Hosts can manage their own experiences
- Guests can view their own bookings
- Hosts can view bookings for their experiences

## PWA Features

### Offline Support
- Service worker caches pages and API responses
- Offline booking requests stored locally and synced when online
- Offline fallback page for disconnected users

### Installable
- Web app manifest for mobile installation
- Install prompts for supported browsers
- Standalone display mode

### Performance
- Optimized images and assets
- Lazy loading and code splitting
- Fast loading with Next.js optimizations

## User Roles

### Guest (Tourist)
- Browse and search experiences by city
- View experience details and host information
- Request bookings with custom messages
- Track booking status
- Manage profile settings

### Host (Local Guide/Family)
- Create and manage experiences
- Set pricing and contact preferences
- View and respond to booking requests
- Toggle experience visibility
- Manage profile and verification status

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Netlify

1. Build command: `npm run build`
2. Publish directory: `.next`
3. Add environment variables in Netlify dashboard

### Environment Variables

Make sure to set these in your deployment platform:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Customization

### Styling
- Modify `tailwind.config.js` for theme customization
- Update colors in `app/globals.css`
- Customize components in the `app/` directory

### Features
- Add payment integration (Stripe, PayPal)
- Implement real-time chat between guests and hosts
- Add image upload for experiences
- Include review and rating system
- Add location-based search with maps

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@localexp.com or create an issue in the repository.

