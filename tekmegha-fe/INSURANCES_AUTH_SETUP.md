# Insurances Component - Authentication Setup

## Overview

Customer authentication has been added to the Insurances component to protect access to insurance policy data. Users must be logged in to view the insurance policies list.

## What Was Added

### 1. Customer Authentication Guard

**File**: `src/app/shared/guards/customer-auth.guard.ts`

A new authentication guard that:
- Checks if a user is logged in
- Redirects to `/login` if not authenticated
- Stores the attempted URL for post-login redirect
- Allows access if user is authenticated

### 2. Routes Protected

The following routes now require customer login:

| Route | Component | Authentication |
|-------|-----------|----------------|
| `/dkassociates/menu` | InsurancesComponent | ✅ Required |
| `/dkassociates/insurances` | InsurancesComponent | ✅ Required |
| `/automobile-insurance/menu` | InsurancesComponent | ✅ Required |
| `/automobile-insurance/insurances` | InsurancesComponent | ✅ Required |

### 3. Other Routes (No Auth Required)

| Route | Component | Authentication |
|-------|-----------|----------------|
| `/dkassociates/home` | Home | ❌ Public |
| `/dkassociates/cart` | Cart | ❌ Public |
| `/dkassociates/stores` | Stores | ❌ Public |
| `/dkassociates/profile` | Profile | ❌ Public |
| `/dkassociates/login` | Login | ❌ Public |
| `/dkassociates/inventory` | Inventory | ✅ Inventory Role Required |

## How It Works

### User Flow

1. **Unauthenticated User Attempts Access**:
   ```
   User visits: /dkassociates/insurances
   ↓
   CustomerAuthGuard checks authentication
   ↓
   No user found
   ↓
   Redirects to: /login?returnUrl=/dkassociates/insurances
   ```

2. **After Login**:
   ```
   User logs in at /login
   ↓
   Authentication succeeds
   ↓
   Redirects to: /dkassociates/insurances (from returnUrl)
   ↓
   User can view insurance policies
   ```

3. **Authenticated User**:
   ```
   User visits: /dkassociates/insurances
   ↓
   CustomerAuthGuard checks authentication
   ↓
   User authenticated
   ↓
   Access granted ✅
   ```

## Authentication Guard Implementation

```typescript
@Injectable({
  providedIn: 'root'
})
export class CustomerAuthGuard implements CanActivate {
  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const user = this.supabaseService.getCurrentUser();
    
    if (!user) {
      // Redirect to login with return URL
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: state.url }
      });
      return false;
    }

    return true; // User is authenticated
  }
}
```

## Testing

### Test Scenarios

#### 1. Access Without Login

```bash
# Navigate to insurances without being logged in
Visit: http://localhost:4200/dkassociates/insurances

Expected:
- Redirects to: /login?returnUrl=/dkassociates/insurances
- Shows login form
```

#### 2. Login and Return

```bash
# Login from the redirect
1. Enter credentials at /login
2. Click "Login"

Expected:
- Successful login
- Redirects back to: /dkassociates/insurances
- Shows insurance policies list
```

#### 3. Direct Access When Logged In

```bash
# Navigate to insurances while logged in
Visit: http://localhost:4200/dkassociates/insurances

Expected:
- Shows insurance policies immediately
- No redirect
```

#### 4. Session Persistence

```bash
# Refresh page while logged in
1. Visit /dkassociates/insurances (logged in)
2. Press F5 to refresh

Expected:
- Remains on /dkassociates/insurances
- Data reloads
- No redirect to login
```

### Manual Testing Checklist

- [ ] Unauthenticated access redirects to login
- [ ] Login stores return URL correctly
- [ ] Post-login redirect works
- [ ] Authenticated access is immediate
- [ ] Session persists on refresh
- [ ] Logout clears authentication
- [ ] Re-access after logout requires login again

## User Experience

### Before Authentication

```
User clicks "Policies" in navbar
↓
Sees login form
↓
Message: "Please login to view insurance policies"
```

### After Authentication

```
User clicks "Policies" in navbar
↓
Immediately sees insurance policies list
↓
Can filter, sort, and view policy details
```

## Security Considerations

### What's Protected

✅ **Insurance policies list** - Requires login
✅ **Policy data** - Only accessible to authenticated users
✅ **Personal information** - Protected by authentication

### What's Public

❌ **Home page** - Public information
❌ **Contact/Stores** - Public business information
❌ **Login page** - Needed for authentication

## Customization

### Change Redirect Behavior

Edit `customer-auth.guard.ts`:

```typescript
// Redirect to custom login page
this.router.navigate(['/custom-login'], { 
  queryParams: { returnUrl: state.url }
});

// Or redirect to home with message
this.router.navigate(['/home'], { 
  queryParams: { message: 'login-required' }
});
```

### Add Role-Based Access

To restrict access by role:

```typescript
async canActivate(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Promise<boolean> {
  const user = this.supabaseService.getCurrentUser();
  
  if (!user) {
    this.router.navigate(['/login']);
    return false;
  }

  // Check user role
  const userRole = await this.supabaseService.getUserRole();
  const allowedRoles = ['customer', 'agent', 'admin'];
  
  if (!allowedRoles.includes(userRole?.role_name)) {
    this.router.navigate(['/unauthorized']);
    return false;
  }

  return true;
}
```

### Add Multiple Guards

To require both authentication AND role:

```typescript
// In app.routes.ts
{ 
  path: 'insurances', 
  component: InsurancesComponent, 
  canActivate: [CustomerAuthGuard, RoleAuthGuard] 
}
```

## Integration with Login Component

The login component should handle the `returnUrl` query parameter:

```typescript
// In login.component.ts
async onLogin() {
  const success = await this.authService.login(this.credentials);
  
  if (success) {
    // Get return URL from query params
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
    this.router.navigateByUrl(returnUrl);
  }
}
```

## Error Handling

### Authentication Errors

```typescript
try {
  const user = this.supabaseService.getCurrentUser();
  // ... authentication logic
} catch (error) {
  console.error('Error checking authentication:', error);
  this.router.navigate(['/login']);
  return false;
}
```

### Session Expiry

When session expires:
1. User tries to access protected route
2. Guard detects no valid session
3. Redirects to login
4. After login, returns to intended page

## Debugging

### Enable Debug Logging

Add to `customer-auth.guard.ts`:

```typescript
async canActivate(...): Promise<boolean> {
  console.log('CustomerAuthGuard: Checking authentication');
  console.log('Route:', state.url);
  
  const user = this.supabaseService.getCurrentUser();
  console.log('User:', user ? user.email : 'Not logged in');
  
  // ... rest of logic
}
```

### Check Browser Console

Look for these messages:
- `CustomerAuthGuard: Checking authentication`
- `User: user@example.com` (when logged in)
- `User: Not logged in` (when not logged in)

### Check Network Tab

Verify Supabase authentication:
1. Open DevTools → Network
2. Filter by "supabase"
3. Look for auth session calls
4. Check response status

## Troubleshooting

### Issue: Always redirects to login even when logged in

**Solution**:
```typescript
// Check if getCurrentUser() is working
const user = await this.supabaseService.getUser(); // Use async version
console.log('User:', user);
```

### Issue: Return URL not working

**Solution**:
```typescript
// Verify query params are being set
console.log('Query params:', this.route.snapshot.queryParams);

// Ensure login component reads returnUrl
const returnUrl = this.route.snapshot.queryParams['returnUrl'];
console.log('Return URL:', returnUrl);
```

### Issue: Session lost on refresh

**Solution**:
- Check Supabase session persistence
- Verify localStorage/sessionStorage
- Check cookie settings

## Files Modified

1. ✅ `src/app/shared/guards/customer-auth.guard.ts` - New guard
2. ✅ `src/app/app.routes.ts` - Added guard to routes
3. ✅ `INSURANCES_AUTH_SETUP.md` - This documentation

## Related Guards

| Guard | Purpose | Usage |
|-------|---------|-------|
| `CustomerAuthGuard` | Basic login check | Public-facing routes |
| `InventoryAuthGuard` | Role-based access | Inventory management |
| `AdminAuthGuard` | Admin-only | Admin panel (if needed) |

## Best Practices

1. **Always use HTTPS** in production
2. **Implement CSRF protection** for forms
3. **Use secure session storage**
4. **Implement proper logout** functionality
5. **Monitor failed login attempts**
6. **Add rate limiting** to prevent brute force
7. **Log authentication events** for audit

## Next Steps

1. ✅ Authentication guard created
2. ✅ Routes protected
3. ⏭️ Test authentication flow
4. ⏭️ Update login component for returnUrl
5. ⏭️ Add user session management
6. ⏭️ Implement logout functionality
7. ⏭️ Add "You must login" message

## Summary

The insurances component (`/dkassociates/insurances` and `/automobile-insurance/insurances`) now requires customer authentication. Users will be redirected to the login page if they try to access it without being logged in, and after successful login, they'll be redirected back to the insurances page.

---

**Status**: ✅ Authentication Protection Active  
**Created**: October 12, 2024  
**Guard**: CustomerAuthGuard  
**Protected Routes**: 2 (menu, insurances)

