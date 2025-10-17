-- ============================================
-- SARCACADEMY Database Schema
-- Job Preparation Platform
-- ============================================

-- ============================================
-- 1. Store Registration
-- ============================================

-- Insert SarcAcademy store into megha_stores table
INSERT INTO megha_stores (
  store_code,
  store_name,
  store_type,
  domain,
  theme_config,
  business_hours,
  contact_email,
  support_phone,
  description,
  address,
  city,
  state,
  postal_code,
  country,
  features,
  social_links,
  settings,
  is_active,
  is_verified
) VALUES (
  'sarcacademy',
  'SarcAcademy',
  'education',
  'sarcacademy.com',
  '{
    "primaryColor": "#1e40af",
    "secondaryColor": "#3b82f6",
    "accentColor": "#06b6d4",
    "warningColor": "#f59e0b",
    "dangerColor": "#dc2626",
    "backgroundColor": "#f8fafc",
    "surfaceColor": "#ffffff",
    "textPrimary": "#1e293b",
    "textSecondary": "#64748b",
    "fontFamily": "Inter, sans-serif",
    "logo": "assets/images/sarcacademy/logo.png",
    "layout": "layout-academy"
  }',
  '{
    "monday": {"open": "09:00", "close": "21:00"},
    "tuesday": {"open": "09:00", "close": "21:00"},
    "wednesday": {"open": "09:00", "close": "21:00"},
    "thursday": {"open": "09:00", "close": "21:00"},
    "friday": {"open": "09:00", "close": "21:00"},
    "saturday": {"open": "09:00", "close": "18:00"},
    "sunday": {"open": "10:00", "close": "17:00"}
  }',
  'support@sarcacademy.com',
  '+91-9876543210',
  'Comprehensive job preparation platform with competitive exam questions, mock tests, and personalized study plans.',
  '123 Education Street, Knowledge City',
  'Mumbai',
  'Maharashtra',
  '400001',
  'India',
  '{
    "inventory": false,
    "delivery": false,
    "multiStore": false,
    "userRoles": true,
    "payment": true,
    "analytics": true,
    "loyaltyProgram": true,
    "studyTracking": true,
    "mockTests": true,
    "progressTracking": true
  }',
  '{
    "facebook": "https://facebook.com/sarcacademy",
    "instagram": "https://instagram.com/sarcacademy",
    "twitter": "https://twitter.com/sarcacademy",
    "linkedin": "https://linkedin.com/company/sarcacademy",
    "youtube": "https://youtube.com/@sarcacademy"
  }',
  '{
    "enableMockTests": true,
    "enableProgressTracking": true,
    "enableStudyPlans": true,
    "enableLeaderboards": true,
    "maxQuestionsPerTest": 100,
    "timeLimitPerQuestion": 120
  }',
  true,
  true
);

-- ============================================
-- 2. Categories Table
-- ============================================

CREATE TABLE IF NOT EXISTS sarcacademy_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES megha_stores(id) ON DELETE CASCADE,
  
  -- Category identification
  category_code VARCHAR(50) NOT NULL,
  category_name VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Visual elements
  image_url VARCHAR(500),
  icon_url VARCHAR(500),
  color_code VARCHAR(7), -- Hex color code
  
  -- Hierarchy
  parent_category_id UUID REFERENCES sarcacademy_categories(id),
  sort_order INTEGER DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  -- Constraints
  UNIQUE(store_id, category_code)
);

-- ============================================
-- 3. Job Pills Table (Applicable Jobs)
-- ============================================

CREATE TABLE IF NOT EXISTS sarcacademy_job_pills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES megha_stores(id) ON DELETE CASCADE,
  
  -- Job identification
  job_code VARCHAR(50) NOT NULL,
  job_title VARCHAR(255) NOT NULL,
  job_description TEXT,
  
  -- Visual elements
  icon_url VARCHAR(500),
  color_code VARCHAR(7), -- Hex color code
  
  -- Job details
  job_level VARCHAR(50), -- Entry, Mid, Senior, Executive
  job_type VARCHAR(50), -- Government, Private, Public Sector
  salary_range JSONB, -- {min: 50000, max: 100000, currency: "INR"}
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  -- Constraints
  UNIQUE(store_id, job_code)
);

-- ============================================
-- 4. Geography Areas Table
-- ============================================

CREATE TABLE IF NOT EXISTS sarcacademy_geography_areas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES megha_stores(id) ON DELETE CASCADE,
  
  -- Area identification
  area_code VARCHAR(50) NOT NULL,
  area_name VARCHAR(255) NOT NULL,
  area_type VARCHAR(50) NOT NULL, -- State, District, City, Region
  
  -- Geographic details
  parent_area_id UUID REFERENCES sarcacademy_geography_areas(id),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Additional info
  description TEXT,
  population BIGINT,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  -- Constraints
  UNIQUE(store_id, area_code)
);

-- ============================================
-- 5. Politics Areas Table
-- ============================================

CREATE TABLE IF NOT EXISTS sarcacademy_politics_areas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES megha_stores(id) ON DELETE CASCADE,
  
  -- Political area identification
  area_code VARCHAR(50) NOT NULL,
  area_name VARCHAR(255) NOT NULL,
  area_type VARCHAR(50) NOT NULL, -- National, State, District, Constituency
  
  -- Political details
  parent_area_id UUID REFERENCES sarcacademy_politics_areas(id),
  government_level VARCHAR(50), -- Central, State, Local
  political_party VARCHAR(100),
  
  -- Additional info
  description TEXT,
  population BIGINT,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  -- Constraints
  UNIQUE(store_id, area_code)
);

-- ============================================
-- 6. Questions Table
-- ============================================

CREATE TABLE IF NOT EXISTS sarcacademy_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES megha_stores(id) ON DELETE CASCADE,
  category_id UUID REFERENCES sarcacademy_categories(id) ON DELETE CASCADE,
  
  -- Question identification
  question_code VARCHAR(50) NOT NULL,
  question_text TEXT NOT NULL,
  question_type VARCHAR(50) NOT NULL, -- Multiple Choice, True/False, Fill in the Blank, Essay
  
  -- Question details
  difficulty_level VARCHAR(20) NOT NULL, -- Easy, Medium, Hard, Expert
  time_limit_seconds INTEGER DEFAULT 120,
  points INTEGER DEFAULT 1,
  
  -- Visual elements
  image_url VARCHAR(500),
  diagram_url VARCHAR(500),
  
  -- Question options (for multiple choice)
  options JSONB, -- [{"id": "A", "text": "Option A", "is_correct": true}, ...]
  correct_answer TEXT,
  explanation TEXT,
  
  -- Tags and metadata
  tags JSONB, -- ["UPSC", "SSC", "Banking", "Railway"]
  source VARCHAR(255), -- Previous year paper, Mock test, etc.
  year INTEGER,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  -- Constraints
  UNIQUE(store_id, question_code)
);

-- ============================================
-- 7. Question Job Pills Mapping
-- ============================================

CREATE TABLE IF NOT EXISTS sarcacademy_question_job_pills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID REFERENCES sarcacademy_questions(id) ON DELETE CASCADE,
  job_pill_id UUID REFERENCES sarcacademy_job_pills(id) ON DELETE CASCADE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(question_id, job_pill_id)
);

-- ============================================
-- 8. Question Geography Areas Mapping
-- ============================================

CREATE TABLE IF NOT EXISTS sarcacademy_question_geography_areas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID REFERENCES sarcacademy_questions(id) ON DELETE CASCADE,
  geography_area_id UUID REFERENCES sarcacademy_geography_areas(id) ON DELETE CASCADE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(question_id, geography_area_id)
);

-- ============================================
-- 9. Question Politics Areas Mapping
-- ============================================

CREATE TABLE IF NOT EXISTS sarcacademy_question_politics_areas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID REFERENCES sarcacademy_questions(id) ON DELETE CASCADE,
  politics_area_id UUID REFERENCES sarcacademy_politics_areas(id) ON DELETE CASCADE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(question_id, politics_area_id)
);

-- ============================================
-- 10. Indexes for Performance
-- ============================================

-- Categories indexes
CREATE INDEX IF NOT EXISTS idx_sarcacademy_categories_store_id ON sarcacademy_categories(store_id);
CREATE INDEX IF NOT EXISTS idx_sarcacademy_categories_parent_id ON sarcacademy_categories(parent_category_id);
CREATE INDEX IF NOT EXISTS idx_sarcacademy_categories_is_active ON sarcacademy_categories(is_active);

-- Job pills indexes
CREATE INDEX IF NOT EXISTS idx_sarcacademy_job_pills_store_id ON sarcacademy_job_pills(store_id);
CREATE INDEX IF NOT EXISTS idx_sarcacademy_job_pills_is_active ON sarcacademy_job_pills(is_active);

-- Geography areas indexes
CREATE INDEX IF NOT EXISTS idx_sarcacademy_geography_areas_store_id ON sarcacademy_geography_areas(store_id);
CREATE INDEX IF NOT EXISTS idx_sarcacademy_geography_areas_parent_id ON sarcacademy_geography_areas(parent_area_id);
CREATE INDEX IF NOT EXISTS idx_sarcacademy_geography_areas_type ON sarcacademy_geography_areas(area_type);

-- Politics areas indexes
CREATE INDEX IF NOT EXISTS idx_sarcacademy_politics_areas_store_id ON sarcacademy_politics_areas(store_id);
CREATE INDEX IF NOT EXISTS idx_sarcacademy_politics_areas_parent_id ON sarcacademy_politics_areas(parent_area_id);
CREATE INDEX IF NOT EXISTS idx_sarcacademy_politics_areas_type ON sarcacademy_politics_areas(area_type);

-- Questions indexes
CREATE INDEX IF NOT EXISTS idx_sarcacademy_questions_store_id ON sarcacademy_questions(store_id);
CREATE INDEX IF NOT EXISTS idx_sarcacademy_questions_category_id ON sarcacademy_questions(category_id);
CREATE INDEX IF NOT EXISTS idx_sarcacademy_questions_difficulty ON sarcacademy_questions(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_sarcacademy_questions_type ON sarcacademy_questions(question_type);
CREATE INDEX IF NOT EXISTS idx_sarcacademy_questions_is_active ON sarcacademy_questions(is_active);
CREATE INDEX IF NOT EXISTS idx_sarcacademy_questions_year ON sarcacademy_questions(year);

-- Mapping table indexes
CREATE INDEX IF NOT EXISTS idx_question_job_pills_question_id ON sarcacademy_question_job_pills(question_id);
CREATE INDEX IF NOT EXISTS idx_question_job_pills_job_pill_id ON sarcacademy_question_job_pills(job_pill_id);
CREATE INDEX IF NOT EXISTS idx_question_geography_question_id ON sarcacademy_question_geography_areas(question_id);
CREATE INDEX IF NOT EXISTS idx_question_geography_area_id ON sarcacademy_question_geography_areas(geography_area_id);
CREATE INDEX IF NOT EXISTS idx_question_politics_question_id ON sarcacademy_question_politics_areas(question_id);
CREATE INDEX IF NOT EXISTS idx_question_politics_area_id ON sarcacademy_question_politics_areas(politics_area_id);

-- ============================================
-- 11. Update Triggers
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_sarcacademy_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables
CREATE TRIGGER update_sarcacademy_categories_updated_at_trigger
    BEFORE UPDATE ON sarcacademy_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_sarcacademy_updated_at();

CREATE TRIGGER update_sarcacademy_job_pills_updated_at_trigger
    BEFORE UPDATE ON sarcacademy_job_pills
    FOR EACH ROW
    EXECUTE FUNCTION update_sarcacademy_updated_at();

CREATE TRIGGER update_sarcacademy_geography_areas_updated_at_trigger
    BEFORE UPDATE ON sarcacademy_geography_areas
    FOR EACH ROW
    EXECUTE FUNCTION update_sarcacademy_updated_at();

CREATE TRIGGER update_sarcacademy_politics_areas_updated_at_trigger
    BEFORE UPDATE ON sarcacademy_politics_areas
    FOR EACH ROW
    EXECUTE FUNCTION update_sarcacademy_updated_at();

CREATE TRIGGER update_sarcacademy_questions_updated_at_trigger
    BEFORE UPDATE ON sarcacademy_questions
    FOR EACH ROW
    EXECUTE FUNCTION update_sarcacademy_updated_at();

-- ============================================
-- 12. Comments for Documentation
-- ============================================

COMMENT ON TABLE sarcacademy_categories IS 'Categories for organizing questions (e.g., General Knowledge, Mathematics, Science)';
COMMENT ON TABLE sarcacademy_job_pills IS 'Job positions that questions are applicable for (e.g., UPSC, SSC, Banking)';
COMMENT ON TABLE sarcacademy_geography_areas IS 'Geographic areas for question applicability (e.g., States, Districts)';
COMMENT ON TABLE sarcacademy_politics_areas IS 'Political areas for question applicability (e.g., Constituencies, Wards)';
COMMENT ON TABLE sarcacademy_questions IS 'Competitive exam questions with answers and metadata';
COMMENT ON TABLE sarcacademy_question_job_pills IS 'Many-to-many mapping between questions and applicable job positions';
COMMENT ON TABLE sarcacademy_question_geography_areas IS 'Many-to-many mapping between questions and geographic areas';
COMMENT ON TABLE sarcacademy_question_politics_areas IS 'Many-to-many mapping between questions and political areas';

-- ============================================
-- 13. Sample Data Insertion
-- ============================================

-- Get the store ID for SarcAcademy
DO $$
DECLARE
    store_uuid UUID;
BEGIN
    SELECT id INTO store_uuid FROM megha_stores WHERE store_code = 'sarcacademy';
    
    -- Insert sample categories
    INSERT INTO sarcacademy_categories (store_id, category_code, category_name, description, color_code, sort_order) VALUES
    (store_uuid, 'gk', 'General Knowledge', 'Current affairs, history, geography, and general awareness', '#3b82f6', 1),
    (store_uuid, 'math', 'Mathematics', 'Quantitative aptitude, arithmetic, algebra, and geometry', '#10b981', 2),
    (store_uuid, 'science', 'Science', 'Physics, chemistry, biology, and environmental science', '#f59e0b', 3),
    (store_uuid, 'english', 'English Language', 'Grammar, vocabulary, comprehension, and literature', '#8b5cf6', 4),
    (store_uuid, 'reasoning', 'Logical Reasoning', 'Analytical and logical reasoning questions', '#ef4444', 5);
    
    -- Insert sample job pills
    INSERT INTO sarcacademy_job_pills (store_id, job_code, job_title, job_description, job_level, job_type, color_code) VALUES
    (store_uuid, 'upsc', 'UPSC Civil Services', 'Union Public Service Commission - IAS, IPS, IFS', 'Senior', 'Government', '#1e40af'),
    (store_uuid, 'ssc', 'SSC CGL', 'Staff Selection Commission - Combined Graduate Level', 'Mid', 'Government', '#059669'),
    (store_uuid, 'banking', 'Banking Exams', 'IBPS, SBI, RBI and other banking recruitment', 'Mid', 'Public Sector', '#dc2626'),
    (store_uuid, 'railway', 'Railway Exams', 'RRB NTPC, RRB Group D, Railway recruitment', 'Mid', 'Government', '#7c3aed'),
    (store_uuid, 'defense', 'Defense Services', 'NDA, CDS, AFCAT and other defense exams', 'Mid', 'Government', '#ea580c');
    
    -- Insert sample geography areas
    INSERT INTO sarcacademy_geography_areas (store_id, area_code, area_name, area_type, description) VALUES
    (store_uuid, 'india', 'India', 'Country', 'Republic of India'),
    (store_uuid, 'maharashtra', 'Maharashtra', 'State', 'Western state of India'),
    (store_uuid, 'mumbai', 'Mumbai', 'City', 'Financial capital of India'),
    (store_uuid, 'delhi', 'Delhi', 'Union Territory', 'National capital territory'),
    (store_uuid, 'karnataka', 'Karnataka', 'State', 'Southern state of India');
    
    -- Insert sample politics areas
    INSERT INTO sarcacademy_politics_areas (store_id, area_code, area_name, area_type, government_level) VALUES
    (store_uuid, 'lok_sabha', 'Lok Sabha', 'National', 'Central'),
    (store_uuid, 'rajya_sabha', 'Rajya Sabha', 'National', 'Central'),
    (store_uuid, 'maharashtra_assembly', 'Maharashtra Assembly', 'State', 'State'),
    (store_uuid, 'mumbai_municipal', 'Mumbai Municipal Corporation', 'Local', 'Local'),
    (store_uuid, 'delhi_assembly', 'Delhi Assembly', 'State', 'State');
    
END $$;
