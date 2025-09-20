# Quick Setup Guide

## 1. Install Dependencies

```bash
npm install
```

## 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Copy `env.example` to `.env.local`:

```bash
cp env.example .env.local
```

4. Fill in your Supabase credentials in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 3. Set up Database

1. In your Supabase dashboard, go to SQL Editor
2. Copy and run the contents of `supabase/schema.sql`
3. This will create all necessary tables and security policies

## 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 5. Test the App

1. **Register as a Guest**: Sign up with role "Find local experiences"
2. **Register as a Host**: Sign up with role "Offer local experiences"
3. **Create an Experience**: As a host, create and publish an experience
4. **Book an Experience**: As a guest, browse and book experiences
5. **Manage Bookings**: As a host, view and respond to booking requests

## 6. PWA Features

- **Install**: Look for the install prompt in your browser
- **Offline**: Disconnect internet and try browsing cached experiences
- **Mobile**: Test on mobile devices for the best experience

## 7. Deploy

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

### Netlify
1. Build command: `npm run build`
2. Publish directory: `.next`
3. Add environment variables
4. Deploy

## Troubleshooting

- **Database errors**: Make sure you've run the SQL schema
- **Auth issues**: Check your Supabase URL and keys
- **PWA not working**: Check browser console for service worker errors
- **Styling issues**: Make sure Tailwind CSS is properly configured

## Next Steps

- Add real images for experiences
- Implement payment processing
- Add real-time chat
- Include maps integration
- Add review system

