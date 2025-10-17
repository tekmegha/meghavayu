# SarcAcademy Setup Guide

## Overview
SarcAcademy is a comprehensive job preparation platform designed for competitive exam preparation. It provides a structured approach to learning with categorized questions, job-specific content, and geographic/political area targeting.

## Features
- **Question Bank**: Comprehensive database of competitive exam questions
- **Categories**: Organized by subject (GK, Math, Science, English, etc.)
- **Job Pills**: Questions tagged for specific job positions (UPSC, SSC, Banking, etc.)
- **Geographic Areas**: Questions applicable to specific regions
- **Political Areas**: Questions relevant to different political jurisdictions
- **Difficulty Levels**: Easy, Medium, Hard, Expert
- **Progress Tracking**: Study progress and performance analytics
- **Mock Tests**: Practice tests with time limits

## Database Schema

### Core Tables

#### 1. megha_stores
- Store registration for SarcAcademy
- Theme configuration and branding
- Business hours and contact information

#### 2. sarcacademy_categories
- Subject categories (GK, Math, Science, English, etc.)
- Visual elements (colors, icons)
- Hierarchical structure support

#### 3. sarcacademy_job_pills
- Job positions and career paths
- Government, Private, Public Sector classifications
- Salary ranges and job levels

#### 4. sarcacademy_geography_areas
- Geographic regions (Country, State, District, City)
- Hierarchical geographic structure
- Population and location data

#### 5. sarcacademy_politics_areas
- Political jurisdictions (National, State, Local)
- Government levels and political parties
- Constituency and ward information

#### 6. sarcacademy_questions
- Core question bank
- Multiple choice, True/False, Fill-in-blank, Essay types
- Difficulty levels and time limits
- Images, diagrams, and multimedia support
- Tags and source information

#### 7. Mapping Tables
- sarcacademy_question_job_pills: Questions to job positions
- sarcacademy_question_geography_areas: Questions to geographic areas
- sarcacademy_question_politics_areas: Questions to political areas

## Setup Instructions

### 1. Database Setup
```sql
-- Run the schema creation script
\i sarcacademy-schema.sql

-- Insert store data and sample content
\i insert-sarcacademy-store.sql
```

### 2. Frontend Setup

#### Layout Component
- **File**: `tekmegha-fe/src/app/layout-academy/`
- **Purpose**: Academy-specific layout with education theme
- **Features**: 
  - Blue gradient header
  - Question cards with difficulty badges
  - Category filters
  - Job pills navigation

#### Questions Component
- **File**: `tekmegha-fe/src/app/academy-questions/`
- **Purpose**: Question display and interaction
- **Features**:
  - Question cards with options
  - Difficulty indicators
  - Time limits
  - Tags and categories
  - Pagination

### 3. Dynamic Layout Integration
The academy layout is integrated into the dynamic layout system:
- **Store Code**: `sarcacademy`
- **Layout**: `layout-academy`
- **Route**: `/sarcacademy`

## Sample Data

### Categories (10)
1. General Knowledge
2. Mathematics
3. Science
4. English Language
5. Logical Reasoning
6. History
7. Geography
8. Economics
9. Polity
10. Current Affairs

### Job Pills (10)
1. UPSC Civil Services
2. SSC CGL
3. Banking Exams
4. Railway Exams
5. Defense Services
6. Teaching Exams
7. State PSC
8. Police Exams
9. Forest Service
10. Engineering Services

### Geographic Areas (15)
- India (Country)
- Maharashtra, Karnataka, Tamil Nadu, etc. (States)
- Mumbai, Delhi (Cities)

### Political Areas (15)
- Lok Sabha, Rajya Sabha (National)
- State Assemblies
- Municipal Corporations

### Sample Questions (5)
- General Knowledge: Capital of India
- Mathematics: Percentage calculation
- History: First Prime Minister
- Science: Chemical symbols
- English: Synonyms

## Usage

### For Students
1. Navigate to `/sarcacademy`
2. Browse categories and select subjects
3. Filter by job positions (UPSC, SSC, etc.)
4. Practice questions with time limits
5. Track progress and performance

### For Administrators
1. Add new questions with categories
2. Tag questions for specific jobs
3. Assign geographic and political areas
4. Set difficulty levels and time limits
5. Upload images and diagrams

## API Endpoints (Future)

### Questions
- `GET /api/sarcacademy/questions` - List questions
- `POST /api/sarcacademy/questions` - Create question
- `PUT /api/sarcacademy/questions/:id` - Update question
- `DELETE /api/sarcacademy/questions/:id` - Delete question

### Categories
- `GET /api/sarcacademy/categories` - List categories
- `POST /api/sarcacademy/categories` - Create category

### Job Pills
- `GET /api/sarcacademy/job-pills` - List job positions
- `POST /api/sarcacademy/job-pills` - Create job position

### Areas
- `GET /api/sarcacademy/geography-areas` - List geographic areas
- `GET /api/sarcacademy/politics-areas` - List political areas

## Customization

### Theme Colors
The academy uses a blue color scheme:
- Primary: #1e40af
- Secondary: #3b82f6
- Accent: #06b6d4

### Layout Features
- Responsive design for mobile and desktop
- Question cards with hover effects
- Difficulty badges with color coding
- Time limit indicators
- Tag system for categorization

## Troubleshooting

### Common Issues
1. **Layout not loading**: Check if `sarcacademy` is added to special layouts
2. **Questions not displaying**: Verify database connection and data insertion
3. **Styling issues**: Check SCSS compilation and CSS imports

### Database Issues
1. **Foreign key constraints**: Ensure all referenced IDs exist
2. **Data insertion errors**: Check JSON format for complex fields
3. **Performance**: Verify indexes are created properly

## Future Enhancements

### Planned Features
1. **User Authentication**: Student and admin login
2. **Progress Tracking**: Study analytics and reports
3. **Mock Tests**: Timed practice tests
4. **Leaderboards**: Competitive rankings
5. **Study Plans**: Personalized learning paths
6. **Mobile App**: Native mobile application
7. **Offline Support**: Download questions for offline study

### Technical Improvements
1. **Search Functionality**: Full-text search across questions
2. **Advanced Filtering**: Multiple filter combinations
3. **Question Analytics**: Usage statistics and insights
4. **Content Management**: Admin panel for content management
5. **API Integration**: RESTful API for external access

## Support

For technical support or questions:
- **Email**: support@sarcacademy.com
- **Phone**: +91-9876543210
- **Documentation**: This guide and inline code comments

## License

This setup is part of the TekMegha platform and follows the same licensing terms.
