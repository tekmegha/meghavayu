# Supabase Integration Setup Guide

This guide will help you set up Supabase integration for the BrewBuddy coffee delivery app.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. Node.js and npm installed
3. Angular CLI installed

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `brewbuddy-app`
   - Database Password: (choose a strong password)
   - Region: Choose closest to your users
5. Click "Create new project"

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to Settings > API
2. Copy the following values:
   - Project URL
   - Anon public key

## Step 3: Update Environment Variables

1. Open `src/environments/environment.ts`
2. Replace the placeholder values:

```typescript
export const environment = {
  production: false,
  supabase: {
    url: 'https://your-project-id.supabase.co', // Replace with your Project URL
    anonKey: 'your-anon-key' // Replace with your Anon public key
  }
};
```

3. Do the same for `src/environments/environment.prod.ts`

## Step 4: Set Up Database Schema

1. In your Supabase dashboard, go to SQL Editor
2. Copy the contents of `supabase-schema.sql` from the project root
3. Paste it into the SQL Editor
4. Click "Run" to execute the schema

This will create:
- Products table with sample coffee products
- Stores table with sample store locations
- Cart items table for user shopping carts
- Orders and order items tables for order management
- Row Level Security (RLS) policies
- Sample data

## Step 5: Configure Authentication

1. In your Supabase dashboard, go to Authentication > Settings
2. Enable Phone authentication:
   - Go to Auth > Providers
   - Enable "Phone" provider
   - Configure SMS settings (you'll need to set up Twilio or similar for production)

For development/testing, you can use Supabase's built-in SMS service.

## Step 6: Test the Integration

1. Start your Angular development server:
   ```bash
   ng serve
   ```

2. Navigate to `http://localhost:4200`
3. Try the following features:
   - Login with phone number (OTP will be sent)
   - Browse products in the menu
   - Add items to cart
   - View cart items
   - Check store locations

## Step 7: Real-time Features (Optional)

The app includes real-time subscriptions for:
- Cart changes
- Order updates

These work automatically once Supabase is configured.

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your Supabase project allows requests from your domain
2. **Authentication Errors**: Check that phone authentication is enabled
3. **Database Errors**: Verify the schema was created correctly
4. **Environment Variables**: Ensure the correct URL and key are set

### Debug Mode

To see detailed error logs, open browser developer tools and check the console.

## Production Deployment

1. Update `environment.prod.ts` with production Supabase credentials
2. Set up proper SMS provider for phone authentication
3. Configure domain restrictions in Supabase
4. Set up proper backup and monitoring

## Database Schema Overview

### Tables Created

- **products**: Coffee products with pricing, ratings, categories
- **stores**: Store locations with addresses and hours
- **cart_items**: User shopping cart items
- **orders**: Customer orders with status tracking
- **order_items**: Individual items within orders

### Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own cart and orders
- Products and stores are publicly readable

## API Endpoints Used

The app uses these Supabase features:
- Authentication (phone OTP)
- Database queries (products, stores, cart, orders)
- Real-time subscriptions
- Row Level Security

## Support

For issues with Supabase integration:
1. Check the Supabase documentation
2. Review the browser console for errors
3. Verify your project settings in Supabase dashboard
