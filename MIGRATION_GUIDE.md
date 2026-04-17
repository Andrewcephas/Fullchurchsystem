"""
Church Management System - React to Django API Migration Guide

This guide explains how to migrate React components from Supabase
to Django REST API calls.
"""

# Key Changes

## 1. API Base URL
- OLD: Supabase client (supabase.from('table').select())
- NEW: Django REST API (http://localhost:8000/api/)

## 2. Authentication
- OLD: Supabase Auth (.auth.signIn())
- NEW: Django Session Auth (login via /api-auth/login/)

## 3. Data Fetching
- OLD: Supabase client methods
- NEW: Fetch API or axios with Django endpoints

# Hook Migration Examples

## Before (Supabase)
```typescript
import { useEffect, useState } from 'react';
import { supabase } from '../integrations/supabase/client';

export function useMembers(branchId: string) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('members')
      .select('*')
      .eq('branch_id', branchId)
      .then(({ data }) => {
        setMembers(data);
        setLoading(false);
      });
  }, [branchId]);

  return { members, loading };
}
```

## After (Django)
```typescript
import { useEffect, useState } from 'react';
import apiService from '../services/api';

export function useMembers(branchId: string) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getMembers({ branch: branchId }).then(({ data }) => {
      setMembers(data.results || []);
      setLoading(false);
    });
  }, [branchId]);

  return { members, loading };
}
```

# Component Updates

## Members Component

### Before (Supabase)
```typescript
async function loadMembers() {
  const { data } = await supabase
    .from('members')
    .select('*')
    .eq('branch_id', userBranch);
  setMembers(data);
}
```

### After (Django)
```typescript
async function loadMembers() {
  const { data } = await apiService.getMembers({ 
    branch: userBranch 
  });
  setMembers(data?.results || []);
}
```

## Finance Component

### Before (Supabase)
```typescript
async function createFinance(record: any) {
  const { data, error } = await supabase
    .from('finance')
    .insert([record]);
  return { data, error };
}
```

### After (Django)
```typescript
async function createFinance(record: any) {
  return await apiService.createFinance(record);
}
```

## Attendance Component

### Before (Supabase)
```typescript
async function checkInMember(attendanceId: string, memberId: string) {
  const { error } = await supabase
    .from('attendance_members')
    .insert([{
      attendance_id: attendanceId,
      member_id: memberId
    }]);
}
```

### After (Django)
```typescript
async function checkInMember(attendanceId: string, memberId: string) {
  return await apiService.checkInMember(attendanceId, memberId);
}
```

# Query Parameters

## Filtering
```typescript
// Get members in a specific branch
apiService.getMembers({ branch: 'branch-uuid' })

// Get finance records by category
apiService.getFinance({ category: 'tithe' })

// Get pending member transfers
apiService.getMemberTransfers({ status: 'pending' })
```

## Searching
```typescript
// Search members by name or email
apiService.getMembers({ search: 'John Doe' })

// Search events
apiService.getEvents({ search: 'Christmas' })
```

## Ordering
```typescript
// Order members by name
apiService.getMembers({ ordering: 'name' })

// Order finance by date (descending)
apiService.getFinance({ ordering: '-date' })
```

## Pagination
```typescript
// Get page 2 with 50 items per page
apiService.getMembers({ page: 2, page_size: 50 })
```

# Error Handling

## Before (Supabase)
```typescript
const { data, error } = await supabase
  .from('members')
  .select('*');

if (error) {
  console.error(error.message);
}
```

## After (Django)
```typescript
const { data, error } = await apiService.getMembers();

if (error) {
  console.error('Error fetching members:', error);
  // Show user-friendly error message
}
```

# React Query Integration

## Example with TanStack Query
```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import apiService from '../services/api';

// Get members
const { data: members, isLoading } = useQuery({
  queryKey: ['members', branchId],
  queryFn: () => apiService.getMembers({ branch: branchId })
});

// Create member
const { mutate: createMember } = useMutation({
  mutationFn: (newMember) => apiService.createMember(newMember),
  onSuccess: () => {
    // Refetch or update cache
  }
});
```

# Authentication Flow

## Django Login
```typescript
// POST to Django login endpoint
const response = await fetch('http://localhost:8000/api-auth/login/', {
  method: 'POST',
  credentials: 'include',
  body: JSON.stringify({
    username: email,
    password: password
  })
});

// Session cookie is automatically set
// Subsequent requests will be authenticated
```

## Logout
```typescript
const response = await fetch('http://localhost:8000/api-auth/logout/', {
  method: 'POST',
  credentials: 'include'
});
```

# Environment Variables

Add to `.env.local`:
```
VITE_API_URL=http://localhost:8000/api
```

Update `vite.config.ts`:
```typescript
export default defineConfig({
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(
      process.env.VITE_API_URL || 'http://localhost:8000/api'
    )
  }
})
```

# File Structure

After migration, your structure should be:
```
src/
├── services/
│   └── api.ts (NEW - Django API client)
├── hooks/
│   ├── use-members.ts (UPDATED)
│   ├── use-finance.ts (UPDATED)
│   ├── use-attendance.ts (UPDATED)
│   └── ...
├── components/
│   ├── admin/
│   │   ├── MemberProfiles.tsx (UPDATED)
│   │   ├── Finance.tsx (UPDATED)
│   │   └── ...
│   └── ...
└── ...
```

# Testing the API

## Using cURL
```bash
# Get all branches
curl http://localhost:8000/api/branches/

# Get members in a branch
curl "http://localhost:8000/api/members/?branch=<uuid>"

# Create a member
curl -X POST http://localhost:8000/api/members/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1-555-1001",
    "branch": "<uuid>"
  }'
```

## Using Postman
1. Create new Collection: "Church API"
2. Add environment variable: `api_url = http://localhost:8000/api`
3. Import endpoints from Django REST framework documentation

## Using Browser DevTools
1. Open Network tab
2. Make requests through your React app
3. Check request/response headers and body

# Common Issues & Solutions

## CORS Error
**Problem**: "Access to XMLHttpRequest blocked by CORS policy"
**Solution**: Verify CORS_ALLOWED_ORIGINS in Django settings includes your React URL

## 401 Unauthorized
**Problem**: "Authentication credentials were not provided"
**Solution**: 
1. Login first
2. Ensure credentials: 'include' in fetch
3. Check session cookie is being sent

## 404 Not Found
**Problem**: "Resource not found"
**Solution**: Verify endpoint URL and resource ID

## 400 Bad Request
**Problem**: "Invalid request data"
**Solution**: 
1. Check request body format
2. Validate required fields
3. Review API serializer documentation

# Performance Optimization

## Reduce API Calls
```typescript
// Get member with full details
const { data: member } = await apiService.getMemberProfile(id);
// Instead of separate calls for profile, transfers, etc.
```

## Use Pagination
```typescript
// Always paginate large datasets
const { data } = await apiService.getMembers({ 
  page: 1,
  page_size: 50 
});
```

## Cache Results
```typescript
// TanStack Query handles this automatically
useQuery({
  queryKey: ['members'],
  queryFn: () => apiService.getMembers(),
  staleTime: 5 * 60 * 1000 // 5 minutes
})
```

# Deployment Considerations

## Production API URL
```typescript
// Use environment variable
const API_URL = import.meta.env.VITE_API_URL || 'https://api.yourchurch.com/api'
```

## HTTPS in Production
1. Obtain SSL certificate
2. Update Django ALLOWED_HOSTS
3. Set SECURE_SSL_REDIRECT = True
4. Update CORS_ALLOWED_ORIGINS to use https://

## Database Backups
Use Django management command:
```bash
python manage.py dumpdata > backup.json
```

Or create backups via API:
```typescript
await apiService.createBackup('full');
```

# Next Steps

1. Install dependencies: `pip install -r requirements.txt`
2. Configure MySQL database
3. Run migrations: `python manage.py migrate`
4. Seed data: `python manage.py seed_database`
5. Start Django: `python manage.py runserver`
6. Update React components to use apiService
7. Test all endpoints thoroughly
8. Deploy to production

