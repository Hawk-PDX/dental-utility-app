# Practice Branding System

## Overview
Each dental practice can have their own branded dashboard with a custom logo. The logo appears in the header across all doctor and patient portal pages.

## Directory Structure
```
/public/logos/practices/
  ws_endo_logo.svg          # WS Endo practice logo
  [practice-name]-logo.svg  # Additional practice logos
```

## How It Works

### 1. Logo Storage
- Practice logos are stored in `/public/logos/practices/`
- Logo paths are stored in the `clinics.logo_url` database column
- Format: `/logos/practices/[filename].svg` or `.png`

### 2. Database Setup
Each doctor is associated with a clinic:
```sql
-- Link doctor to clinic
UPDATE doctors 
SET clinic_id = '[clinic-uuid]'
WHERE id = '[doctor-uuid]';

-- Set clinic logo
UPDATE clinics 
SET logo_url = '/logos/practices/ws_endo_logo.svg'
WHERE id = '[clinic-uuid]';
```

### 3. Header Component
The `DashboardHeader` component (`components/dashboard/DashboardHeader.tsx`) automatically:
- Fetches the user's role (doctor or patient)
- Loads the appropriate clinic logo:
  - For doctors: Shows their clinic's logo
  - For patients: Shows their primary doctor's clinic logo
- Falls back to the default logo if none is configured

### 4. Layout Integration
Both dashboard layouts use the header:
- `app/dashboard/doctor/layout.tsx`
- `app/dashboard/patient/layout.tsx`

## Adding a New Practice Logo

### Step 1: Add Logo File
```bash
cp /path/to/logo.svg public/logos/practices/practice-name-logo.svg
```

### Step 2: Create/Update Clinic Record
```sql
-- In Supabase SQL Editor
INSERT INTO clinics (name, logo_url, primary_color)
VALUES ('Practice Name', '/logos/practices/practice-name-logo.svg', '#3B82F6');
```

### Step 3: Link Doctor to Clinic
```sql
UPDATE doctors 
SET clinic_id = '[clinic-uuid-from-step-2]'
WHERE id = '[doctor-user-id]';
```

## Logo Specifications
- **Format**: SVG preferred (scales better), PNG also supported
- **Dimensions**: Optimized for 180x60px display area
- **Max Height**: 48px (3rem) in the header
- **Background**: Transparent recommended
- **File Size**: Keep under 100KB for optimal performance

## Fallback Behavior
If no logo is configured:
- Default logo: `/logos/practices/ws_endo_logo.svg`
- Alt text: "[Practice Name] logo"
- Component won't crash if logo file is missing (Next.js Image handles 404s)

## Multi-Tenant Support
The system supports multiple practices within the same application:
- Each clinic has its own branding
- Patients see the logo of their primary doctor's practice
- Doctors always see their own practice logo
- No cross-contamination of branding between practices
