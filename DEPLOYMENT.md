# Deployment Guide

## Quick Deploy Options

### Option 1: Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/authentic-local-experiences.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Deploy automatically

### Option 2: Netlify

1. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: `18.x`

2. **Environment Variables**
   - Add in Netlify dashboard under Site settings > Environment variables

### Option 3: Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## Environment Setup

### Required Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Getting Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the Project URL and anon/public key
4. Add these to your deployment platform's environment variables

## Database Setup

### 1. Create Supabase Project
- Go to [supabase.com](https://supabase.com)
- Create a new project
- Wait for the project to be ready

### 2. Run Database Schema
- Go to SQL Editor in your Supabase dashboard
- Copy and paste the contents of `supabase/schema.sql`
- Click "Run" to execute the schema

### 3. Verify Tables
- Go to Table Editor
- You should see: `profiles`, `experiences`, `bookings`
- Check that RLS (Row Level Security) is enabled

## PWA Configuration

### Service Worker
- Automatically registered on app load
- Caches pages and API responses
- Handles offline functionality

### Manifest
- Configured for mobile installation
- Icons generated automatically
- Standalone display mode

### Testing PWA Features
1. **Install Prompt**: Should appear on supported browsers
2. **Offline Mode**: Disconnect internet and test browsing
3. **Mobile**: Test on mobile devices for best experience

## Performance Optimization

### Build Optimization
- Next.js automatically optimizes images and code
- Service worker caches static assets
- Lazy loading implemented for components

### Database Optimization
- Indexed columns for fast queries
- RLS policies for security
- Optimized queries with proper joins

## Monitoring & Analytics

### Recommended Tools
- **Vercel Analytics**: Built-in with Vercel deployment
- **Supabase Dashboard**: Monitor database usage
- **Google Analytics**: Add tracking code if needed

### Error Monitoring
- Error boundary catches React errors
- Console logging for debugging
- Toast notifications for user feedback

## Security Considerations

### Database Security
- Row Level Security (RLS) enabled
- User can only access their own data
- Hosts can only manage their experiences

### Authentication
- Supabase handles secure authentication
- JWT tokens for session management
- Email verification required

### API Security
- Environment variables for sensitive data
- No API keys exposed to client
- Proper CORS configuration

## Troubleshooting

### Common Issues

1. **Build Errors**
   - Check Node.js version (18+)
   - Clear node_modules and reinstall
   - Verify all dependencies are installed

2. **Database Connection**
   - Verify Supabase URL and keys
   - Check if database schema is applied
   - Ensure RLS policies are correct

3. **PWA Not Working**
   - Check service worker registration
   - Verify manifest.json is accessible
   - Test on HTTPS (required for PWA)

4. **Authentication Issues**
   - Check Supabase auth configuration
   - Verify email templates are set up
   - Check redirect URLs in Supabase

### Debug Mode
- Set `NODE_ENV=development` for detailed logs
- Use browser dev tools for client-side debugging
- Check Supabase logs in dashboard

## Scaling Considerations

### Database Scaling
- Supabase handles automatic scaling
- Monitor usage in dashboard
- Consider read replicas for high traffic

### Application Scaling
- Vercel/Netlify handle automatic scaling
- CDN for static assets
- Edge functions for global performance

### Cost Optimization
- Monitor Supabase usage
- Optimize database queries
- Use caching strategies

## Maintenance

### Regular Tasks
- Monitor error logs
- Update dependencies
- Backup database
- Review user feedback

### Updates
- Keep Next.js and dependencies updated
- Monitor Supabase updates
- Test PWA functionality after updates

## Support

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Community
- [Next.js Discord](https://discord.gg/nextjs)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/yourusername/authentic-local-experiences/issues)

