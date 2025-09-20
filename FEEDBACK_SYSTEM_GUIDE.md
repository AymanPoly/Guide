# Feedback System Implementation Guide

## Overview

The feedback system allows guests to leave reviews and ratings for experiences after their bookings are confirmed. This enhances the platform by providing social proof and helping other users make informed decisions.

## Features

### For Guests
- **Leave Feedback**: Guests can rate experiences (1-5 stars) and leave comments after booking confirmation
- **View Reviews**: See all reviews for experiences on the experience detail page
- **Feedback History**: Track which bookings they've already provided feedback for

### For Hosts
- **View Feedback**: See guest feedback for their confirmed bookings
- **Rating Display**: View star ratings and comments from guests
- **Feedback Management**: Monitor guest satisfaction

### For All Users
- **Public Reviews**: All feedback is visible on experience detail pages
- **Rating Summary**: Average ratings and rating distribution
- **Review Display**: Chronological list of all reviews with ratings and comments

## Database Schema

### Feedback Table
```sql
CREATE TABLE public.feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  experience_id UUID REFERENCES public.experiences(id) ON DELETE CASCADE NOT NULL,
  guest_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  host_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(booking_id) -- One feedback per booking
);
```

### Key Features
- **One Review Per Booking**: Each booking can only have one feedback entry
- **Rating Validation**: Ratings must be between 1-5 stars
- **Cascade Deletion**: Feedback is deleted when bookings or experiences are deleted
- **Timestamps**: Automatic creation and update timestamps

## Security (RLS Policies)

### View Permissions
- **Guests**: Can view feedback for experiences they booked
- **Hosts**: Can view feedback for their experiences
- **Public**: Anyone can view published feedback

### Write Permissions
- **Guests**: Can only create feedback for their own confirmed bookings
- **Guests**: Can update/delete their own feedback
- **Hosts**: Cannot modify guest feedback

## Components

### 1. FeedbackForm (`components/FeedbackForm.tsx`)
- Interactive star rating system (1-5 stars)
- Optional comment field (500 character limit)
- Form validation and submission
- Success/error handling

### 2. FeedbackDisplay (`components/FeedbackDisplay.tsx`)
- Rating summary with average and distribution
- Individual review display
- Pagination for large review lists
- Loading states and empty states

## User Interface

### Guest Bookings Page
- **Confirmed Bookings**: Show "Leave Feedback" button
- **Feedback Given**: Show "Thank you for your feedback!" message
- **Form Integration**: Inline feedback form with cancel option

### Host Bookings Page
- **Confirmed Bookings**: Display guest feedback if available
- **No Feedback**: Show "No feedback yet" message
- **Rating Display**: Star ratings with numerical values

### Experience Detail Page
- **Reviews Section**: Complete feedback display
- **Rating Summary**: Average rating and distribution
- **All Reviews**: Chronological list of all feedback

## Setup Instructions

### 1. Database Setup
```bash
# Run the feedback schema in Supabase SQL editor
psql -f supabase/feedback-schema.sql
```

### 2. Verify Installation
```sql
-- Check if feedback table exists
SELECT * FROM information_schema.tables WHERE table_name = 'feedback';

-- Verify RLS policies
SELECT policyname FROM pg_policies WHERE tablename = 'feedback';
```

### 3. Test the System
1. Create a booking as a guest
2. Confirm the booking as a host
3. Leave feedback as the guest
4. View feedback on experience detail page
5. Check feedback display on host bookings page

## Usage Flow

### Guest Feedback Process
1. Guest books an experience
2. Host confirms the booking
3. Guest sees "Leave Feedback" button on their bookings page
4. Guest clicks button and fills out feedback form
5. Feedback is submitted and stored in database
6. Feedback appears on experience detail page
7. Host can see feedback on their bookings page

### Viewing Reviews
1. Navigate to any experience detail page
2. Scroll to "Reviews" section
3. View rating summary and individual reviews
4. See average rating and rating distribution

## Technical Details

### API Endpoints
- **Create Feedback**: `POST /api/feedback` (handled by Supabase)
- **Read Feedback**: `GET /api/feedback` (handled by Supabase)
- **Update Feedback**: `PATCH /api/feedback` (handled by Supabase)

### State Management
- **Guest Bookings**: Tracks which bookings have feedback
- **Feedback Forms**: Manages form state and submission
- **Review Display**: Fetches and displays feedback data

### Performance Considerations
- **Indexes**: Added on experience_id, guest_id, host_id, and rating
- **Pagination**: Reviews are paginated for better performance
- **Caching**: Feedback data is fetched on demand

## Future Enhancements

### Potential Features
- **Photo Reviews**: Allow guests to upload photos with reviews
- **Response System**: Let hosts respond to guest feedback
- **Review Moderation**: Admin tools for managing inappropriate content
- **Review Analytics**: Detailed analytics for hosts
- **Review Notifications**: Email notifications for new reviews

### Technical Improvements
- **Real-time Updates**: WebSocket integration for live feedback updates
- **Advanced Filtering**: Filter reviews by rating, date, etc.
- **Review Aggregation**: Calculate and cache average ratings
- **Search Integration**: Include reviews in search results

## Troubleshooting

### Common Issues
1. **Feedback Not Showing**: Check RLS policies and user permissions
2. **Form Not Submitting**: Verify database connection and validation
3. **Rating Display Issues**: Check star rendering and CSS classes
4. **Permission Errors**: Ensure user has correct role and authentication

### Debug Steps
1. Check browser console for JavaScript errors
2. Verify database schema is correctly applied
3. Test RLS policies with different user roles
4. Check network requests in browser dev tools

## Support

For issues or questions about the feedback system:
1. Check this documentation first
2. Review the database schema and RLS policies
3. Test with different user roles and scenarios
4. Check browser console and network requests for errors
