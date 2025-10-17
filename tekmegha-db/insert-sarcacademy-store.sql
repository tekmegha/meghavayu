-- ============================================
-- SARCACADEMY Store Data Insertion
-- Job Preparation Platform Setup
-- ============================================

-- First, run the schema creation script
-- \i sarcacademy-schema.sql

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

-- Get the store ID for SarcAcademy
DO $$
DECLARE
    store_uuid UUID;
BEGIN
    SELECT id INTO store_uuid FROM megha_stores WHERE store_code = 'sarcacademy';
    
    -- Insert categories
    INSERT INTO sarcacademy_categories (store_id, category_code, category_name, description, color_code, sort_order) VALUES
    (store_uuid, 'gk', 'General Knowledge', 'Current affairs, history, geography, and general awareness', '#3b82f6', 1),
    (store_uuid, 'math', 'Mathematics', 'Quantitative aptitude, arithmetic, algebra, and geometry', '#10b981', 2),
    (store_uuid, 'science', 'Science', 'Physics, chemistry, biology, and environmental science', '#f59e0b', 3),
    (store_uuid, 'english', 'English Language', 'Grammar, vocabulary, comprehension, and literature', '#8b5cf6', 4),
    (store_uuid, 'reasoning', 'Logical Reasoning', 'Analytical and logical reasoning questions', '#ef4444', 5),
    (store_uuid, 'history', 'History', 'Indian and world history, freedom struggle, ancient civilizations', '#7c3aed', 6),
    (store_uuid, 'geography', 'Geography', 'Physical and human geography, climate, resources', '#059669', 7),
    (store_uuid, 'economics', 'Economics', 'Micro and macro economics, Indian economy, banking', '#dc2626', 8),
    (store_uuid, 'polity', 'Polity', 'Constitution, governance, political system, rights and duties', '#ea580c', 9),
    (store_uuid, 'current_affairs', 'Current Affairs', 'Recent events, government schemes, international relations', '#0891b2', 10);
    
    -- Insert job pills
    INSERT INTO sarcacademy_job_pills (store_id, job_code, job_title, job_description, job_level, job_type, color_code) VALUES
    (store_uuid, 'upsc', 'UPSC Civil Services', 'Union Public Service Commission - IAS, IPS, IFS', 'Senior', 'Government', '#1e40af'),
    (store_uuid, 'ssc', 'SSC CGL', 'Staff Selection Commission - Combined Graduate Level', 'Mid', 'Government', '#059669'),
    (store_uuid, 'banking', 'Banking Exams', 'IBPS, SBI, RBI and other banking recruitment', 'Mid', 'Public Sector', '#dc2626'),
    (store_uuid, 'railway', 'Railway Exams', 'RRB NTPC, RRB Group D, Railway recruitment', 'Mid', 'Government', '#7c3aed'),
    (store_uuid, 'defense', 'Defense Services', 'NDA, CDS, AFCAT and other defense exams', 'Mid', 'Government', '#ea580c'),
    (store_uuid, 'teaching', 'Teaching Exams', 'CTET, TET, KVS, NVS and other teaching recruitment', 'Mid', 'Government', '#0891b2'),
    (store_uuid, 'state_psc', 'State PSC', 'State Public Service Commission exams', 'Mid', 'Government', '#7c2d12'),
    (store_uuid, 'police', 'Police Exams', 'Constable, SI, ASI and other police recruitment', 'Mid', 'Government', '#be123c'),
    (store_uuid, 'forest', 'Forest Service', 'IFS, Forest Guard and other forest department exams', 'Mid', 'Government', '#059669'),
    (store_uuid, 'engineering', 'Engineering Services', 'IES, ESE and other engineering recruitment', 'Senior', 'Government', '#7c3aed');
    
    -- Insert geography areas
    INSERT INTO sarcacademy_geography_areas (store_id, area_code, area_name, area_type, description) VALUES
    (store_uuid, 'india', 'India', 'Country', 'Republic of India'),
    (store_uuid, 'maharashtra', 'Maharashtra', 'State', 'Western state of India'),
    (store_uuid, 'mumbai', 'Mumbai', 'City', 'Financial capital of India'),
    (store_uuid, 'delhi', 'Delhi', 'Union Territory', 'National capital territory'),
    (store_uuid, 'karnataka', 'Karnataka', 'State', 'Southern state of India'),
    (store_uuid, 'tamil_nadu', 'Tamil Nadu', 'State', 'Southern state of India'),
    (store_uuid, 'west_bengal', 'West Bengal', 'State', 'Eastern state of India'),
    (store_uuid, 'gujarat', 'Gujarat', 'State', 'Western state of India'),
    (store_uuid, 'rajasthan', 'Rajasthan', 'State', 'Northern state of India'),
    (store_uuid, 'uttar_pradesh', 'Uttar Pradesh', 'State', 'Northern state of India'),
    (store_uuid, 'bihar', 'Bihar', 'State', 'Eastern state of India'),
    (store_uuid, 'kerala', 'Kerala', 'State', 'Southern state of India'),
    (store_uuid, 'punjab', 'Punjab', 'State', 'Northern state of India'),
    (store_uuid, 'haryana', 'Haryana', 'State', 'Northern state of India'),
    (store_uuid, 'himachal_pradesh', 'Himachal Pradesh', 'State', 'Northern state of India');
    
    -- Insert politics areas
    INSERT INTO sarcacademy_politics_areas (store_id, area_code, area_name, area_type, government_level) VALUES
    (store_uuid, 'lok_sabha', 'Lok Sabha', 'National', 'Central'),
    (store_uuid, 'rajya_sabha', 'Rajya Sabha', 'National', 'Central'),
    (store_uuid, 'maharashtra_assembly', 'Maharashtra Assembly', 'State', 'State'),
    (store_uuid, 'mumbai_municipal', 'Mumbai Municipal Corporation', 'Local', 'Local'),
    (store_uuid, 'delhi_assembly', 'Delhi Assembly', 'State', 'State'),
    (store_uuid, 'karnataka_assembly', 'Karnataka Assembly', 'State', 'State'),
    (store_uuid, 'tamil_nadu_assembly', 'Tamil Nadu Assembly', 'State', 'State'),
    (store_uuid, 'west_bengal_assembly', 'West Bengal Assembly', 'State', 'State'),
    (store_uuid, 'gujarat_assembly', 'Gujarat Assembly', 'State', 'State'),
    (store_uuid, 'rajasthan_assembly', 'Rajasthan Assembly', 'State', 'State'),
    (store_uuid, 'uttar_pradesh_assembly', 'Uttar Pradesh Assembly', 'State', 'State'),
    (store_uuid, 'bihar_assembly', 'Bihar Assembly', 'State', 'State'),
    (store_uuid, 'kerala_assembly', 'Kerala Assembly', 'State', 'State'),
    (store_uuid, 'punjab_assembly', 'Punjab Assembly', 'State', 'State'),
    (store_uuid, 'haryana_assembly', 'Haryana Assembly', 'State', 'State');
    
    -- Insert sample questions
    INSERT INTO sarcacademy_questions (
        store_id, category_id, question_code, question_text, question_type, 
        difficulty_level, time_limit_seconds, points, options, correct_answer, 
        explanation, tags, source, year
    ) VALUES
    (
        store_uuid, 
        (SELECT id FROM sarcacademy_categories WHERE category_code = 'gk' AND store_id = store_uuid),
        'GK001',
        'Which of the following is the capital of India?',
        'multiple_choice',
        'easy',
        60,
        1,
        '[{"id": "A", "text": "Mumbai", "is_correct": false}, {"id": "B", "text": "New Delhi", "is_correct": true}, {"id": "C", "text": "Kolkata", "is_correct": false}, {"id": "D", "text": "Chennai", "is_correct": false}]',
        'B',
        'New Delhi is the capital of India, officially known as the National Capital Territory of Delhi.',
        '["Geography", "India", "Capital"]',
        'Previous Year Paper',
        2023
    ),
    (
        store_uuid,
        (SELECT id FROM sarcacademy_categories WHERE category_code = 'math' AND store_id = store_uuid),
        'MATH001',
        'What is the value of 15% of 240?',
        'multiple_choice',
        'medium',
        90,
        1,
        '[{"id": "A", "text": "32", "is_correct": false}, {"id": "B", "text": "36", "is_correct": true}, {"id": "C", "text": "40", "is_correct": false}, {"id": "D", "text": "44", "is_correct": false}]',
        'B',
        '15% of 240 = (15/100) × 240 = 0.15 × 240 = 36',
        '["Percentage", "Arithmetic", "Calculation"]',
        'Mock Test',
        2024
    ),
    (
        store_uuid,
        (SELECT id FROM sarcacademy_categories WHERE category_code = 'history' AND store_id = store_uuid),
        'HIST001',
        'Who was the first Prime Minister of India?',
        'multiple_choice',
        'easy',
        60,
        1,
        '[{"id": "A", "text": "Mahatma Gandhi", "is_correct": false}, {"id": "B", "text": "Jawaharlal Nehru", "is_correct": true}, {"id": "C", "text": "Sardar Patel", "is_correct": false}, {"id": "D", "text": "Dr. Rajendra Prasad", "is_correct": false}]',
        'B',
        'Jawaharlal Nehru was the first Prime Minister of India, serving from 1947 to 1964.',
        '["History", "India", "Independence", "Politics"]',
        'Previous Year Paper',
        2023
    ),
    (
        store_uuid,
        (SELECT id FROM sarcacademy_categories WHERE category_code = 'science' AND store_id = store_uuid),
        'SCI001',
        'What is the chemical symbol for Gold?',
        'multiple_choice',
        'easy',
        45,
        1,
        '[{"id": "A", "text": "Go", "is_correct": false}, {"id": "B", "text": "Gd", "is_correct": false}, {"id": "C", "text": "Au", "is_correct": true}, {"id": "D", "text": "Ag", "is_correct": false}]',
        'C',
        'The chemical symbol for Gold is Au, derived from the Latin word "aurum".',
        '["Chemistry", "Elements", "Symbols"]',
        'Previous Year Paper',
        2023
    ),
    (
        store_uuid,
        (SELECT id FROM sarcacademy_categories WHERE category_code = 'english' AND store_id = store_uuid),
        'ENG001',
        'Choose the correct synonym for "Abundant":',
        'multiple_choice',
        'medium',
        75,
        1,
        '[{"id": "A", "text": "Scarce", "is_correct": false}, {"id": "B", "text": "Plentiful", "is_correct": true}, {"id": "C", "text": "Rare", "is_correct": false}, {"id": "D", "text": "Limited", "is_correct": false}]',
        'B',
        'Abundant means existing in large quantities; plentiful. Scarce, rare, and limited are antonyms.',
        '["Vocabulary", "Synonyms", "English"]',
        'Mock Test',
        2024
    );
    
    -- Create question-job pills mappings
    INSERT INTO sarcacademy_question_job_pills (question_id, job_pill_id)
    SELECT 
        q.id as question_id,
        jp.id as job_pill_id
    FROM sarcacademy_questions q
    CROSS JOIN sarcacademy_job_pills jp
    WHERE q.store_id = store_uuid 
    AND jp.store_id = store_uuid
    AND jp.job_code IN ('upsc', 'ssc', 'banking');
    
    -- Create question-geography areas mappings
    INSERT INTO sarcacademy_question_geography_areas (question_id, geography_area_id)
    SELECT 
        q.id as question_id,
        ga.id as geography_area_id
    FROM sarcacademy_questions q
    CROSS JOIN sarcacademy_geography_areas ga
    WHERE q.store_id = store_uuid 
    AND ga.store_id = store_uuid
    AND ga.area_code IN ('india', 'maharashtra', 'delhi');
    
    -- Create question-politics areas mappings
    INSERT INTO sarcacademy_question_politics_areas (question_id, politics_area_id)
    SELECT 
        q.id as question_id,
        pa.id as politics_area_id
    FROM sarcacademy_questions q
    CROSS JOIN sarcacademy_politics_areas pa
    WHERE q.store_id = store_uuid 
    AND pa.store_id = store_uuid
    AND pa.area_code IN ('lok_sabha', 'rajya_sabha');
    
    RAISE NOTICE 'SarcAcademy store setup completed successfully!';
    RAISE NOTICE 'Store ID: %', store_uuid;
    RAISE NOTICE 'Categories inserted: 10';
    RAISE NOTICE 'Job pills inserted: 10';
    RAISE NOTICE 'Geography areas inserted: 15';
    RAISE NOTICE 'Politics areas inserted: 15';
    RAISE NOTICE 'Sample questions inserted: 5';
    
END $$;

-- Verify the setup
SELECT 
    'SarcAcademy Setup Complete' as status,
    (SELECT COUNT(*) FROM sarcacademy_categories WHERE store_id = (SELECT id FROM megha_stores WHERE store_code = 'sarcacademy')) as categories_count,
    (SELECT COUNT(*) FROM sarcacademy_job_pills WHERE store_id = (SELECT id FROM megha_stores WHERE store_code = 'sarcacademy')) as job_pills_count,
    (SELECT COUNT(*) FROM sarcacademy_geography_areas WHERE store_id = (SELECT id FROM megha_stores WHERE store_code = 'sarcacademy')) as geography_areas_count,
    (SELECT COUNT(*) FROM sarcacademy_politics_areas WHERE store_id = (SELECT id FROM megha_stores WHERE store_code = 'sarcacademy')) as politics_areas_count,
    (SELECT COUNT(*) FROM sarcacademy_questions WHERE store_id = (SELECT id FROM megha_stores WHERE store_code = 'sarcacademy')) as questions_count;
