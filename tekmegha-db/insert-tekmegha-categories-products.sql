-- TEKMEGHA Digital Services - Categories and Products Insert Script
-- Store ID: 6fc1a96a-a609-46ef-a65d-e4338b8fc132
-- Generated for TEKMEGHA website and online services

-- Insert Categories for TEKMEGHA Digital Services
INSERT INTO public.categories (id, name, description, slug, megha_store_id, parent_id, sort_order, is_active, image_url, created_at, updated_at) VALUES
-- Main Categories
(gen_random_uuid(), 'Website Services', 'Complete website development and design services', 'website-services', '6fc1a96a-a609-46ef-a65d-e4338b8fc132'::uuid, NULL, 1, true, '__brand_category_assets__/website-services.png', now(), now()),
(gen_random_uuid(), 'Domain & Hosting', 'Domain registration and web hosting services', 'domain-hosting', '6fc1a96a-a609-46ef-a65d-e4338b8fc132'::uuid, NULL, 2, true, '__brand_category_assets__/domain-hosting.png', now(), now()),
(gen_random_uuid(), 'Maintenance & Support', 'Lifetime maintenance and free upgrades', 'maintenance-support', '6fc1a96a-a609-46ef-a65d-e4338b8fc132'::uuid, NULL, 3, true, '__brand_category_assets__/maintenance-support.png', now(), now()),
(gen_random_uuid(), 'Digital Solutions', 'Modern digital tools and features', 'digital-solutions', '6fc1a96a-a609-46ef-a65d-e4338b8fc132'::uuid, NULL, 4, true, '__brand_category_assets__/digital-solutions.png', now(), now());

-- Get the generated category IDs for subcategories
WITH category_ids AS (
  SELECT 
    id as website_services_id,
    LEAD(id, 1) OVER (ORDER BY created_at) as domain_services_id,
    LEAD(id, 2) OVER (ORDER BY created_at) as maintenance_id,
    LEAD(id, 3) OVER (ORDER BY created_at) as digital_solutions_id
  FROM categories 
  WHERE megha_store_id = '6fc1a96a-a609-46ef-a65d-e4338b8fc132'::uuid 
  AND slug IN ('website-services', 'domain-hosting', 'maintenance-support', 'digital-solutions')
  ORDER BY created_at
  LIMIT 4
)
INSERT INTO public.categories (id, name, description, slug, megha_store_id, parent_id, sort_order, is_active, image_url, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  'Custom Websites',
  'Tailored website development for your business',
  'custom-websites',
  '6fc1a96a-a609-46ef-a65d-e4338b8fc132'::uuid,
  website_services_id,
  1,
  true,
  '__brand_category_assets__/custom-websites.png',
  now(),
  now()
FROM category_ids WHERE website_services_id IS NOT NULL
UNION ALL
SELECT 
  gen_random_uuid(),
  'Tekmegha Pages',
  'Get your own page under Tekmegha for online visibility',
  'tekmegha-pages',
  '6fc1a96a-a609-46ef-a65d-e4338b8fc132'::uuid,
  website_services_id,
  2,
  true,
  '__brand_category_assets__/tekmegha-pages.png',
  now(),
  now()
FROM category_ids WHERE website_services_id IS NOT NULL
UNION ALL
SELECT 
  gen_random_uuid(),
  'Website Redesign',
  'Modernize your outdated website',
  'website-redesign',
  '6fc1a96a-a609-46ef-a65d-e4338b8fc132'::uuid,
  website_services_id,
  3,
  true,
  '__brand_category_assets__/website-redesign.png',
  now(),
  now()
FROM category_ids WHERE website_services_id IS NOT NULL
UNION ALL
SELECT 
  gen_random_uuid(),
  'Domain Registration',
  'Register your perfect domain name',
  'domain-registration',
  '6fc1a96a-a609-46ef-a65d-e4338b8fc132'::uuid,
  domain_services_id,
  1,
  true,
  '__brand_category_assets__/domain-registration.png',
  now(),
  now()
FROM category_ids WHERE domain_services_id IS NOT NULL
UNION ALL
SELECT 
  gen_random_uuid(),
  'Web Hosting',
  'Reliable hosting solutions for your website',
  'web-hosting',
  '6fc1a96a-a609-46ef-a65d-e4338b8fc132'::uuid,
  domain_services_id,
  2,
  true,
  '__brand_category_assets__/web-hosting.png',
  now(),
  now()
FROM category_ids WHERE domain_services_id IS NOT NULL
UNION ALL
SELECT 
  gen_random_uuid(),
  'Digital Bill Feature',
  'Create and share bills from mobile',
  'digital-bill',
  '6fc1a96a-a609-46ef-a65d-e4338b8fc132'::uuid,
  digital_solutions_id,
  1,
  true,
  '__brand_category_assets__/digital-bill.png',
  now(),
  now()
FROM category_ids WHERE digital_solutions_id IS NOT NULL
UNION ALL
SELECT 
  gen_random_uuid(),
  'Online Presence',
  'Boost your digital visibility',
  'online-presence',
  '6fc1a96a-a609-46ef-a65d-e4338b8fc132'::uuid,
  digital_solutions_id,
  2,
  true,
  '__brand_category_assets__/online-presence.png',
  now(),
  now()
FROM category_ids WHERE digital_solutions_id IS NOT NULL;

-- Insert Products for TEKMEGHA Digital Services
INSERT INTO public.products (id, megha_store_id, sku, name, price, rating, review_count, serves, description, image_url, gallery_images, customisable, customization_options, category, tags, discount_percentage, old_price, nutritional_info, allergen_info, preparation_time, is_available, is_featured, sort_order, created_at, updated_at) VALUES

-- Custom Website Products
(gen_random_uuid(), '6fc1a96a-a609-46ef-a65d-e4338b8fc132'::uuid, 'CWS-BASIC', 'Basic Custom Website', 9000.00, 4.8, 25, 1, 'Complete website development with 5 pages, responsive design, and basic SEO optimization. Perfect for small businesses starting their online journey. Annual subscription includes lifetime maintenance.', '__brand_product_assets__/cws-basic.png', NULL, true, '{"pages": [1,2,3,4,5], "features": ["responsive", "seo", "contact-form", "annual-subscription"]}', 'Custom Websites', '["website", "development", "responsive", "seo", "annual"]', 0, NULL, NULL, NULL, 14, true, true, 1, now(), now()),

(gen_random_uuid(), '6fc1a96a-a609-46ef-a65d-e4338b8fc132'::uuid, 'CWS-PREMIUM', 'Premium Custom Website', 9000.00, 4.9, 18, 1, 'Advanced website with unlimited pages, e-commerce integration, custom features, and premium design. Includes content management system. Annual subscription includes lifetime maintenance.', '__brand_product_assets__/cws-premium.png', NULL, true, '{"pages": "unlimited", "features": ["responsive", "seo", "ecommerce", "cms", "custom-features", "annual-subscription"]}', 'Custom Websites', '["website", "development", "ecommerce", "cms", "premium", "annual"]', 0, NULL, NULL, NULL, 21, true, true, 2, now(), now()),

(gen_random_uuid(), '6fc1a96a-a609-46ef-a65d-e4338b8fc132'::uuid, 'CWS-ENTERPRISE', 'Enterprise Website Solution', 9000.00, 5.0, 12, 1, 'Complete enterprise solution with advanced features, multi-user management, API integrations, and dedicated support. Annual subscription includes lifetime maintenance.', '__brand_product_assets__/cws-enterprise.png', NULL, true, '{"pages": "unlimited", "features": ["responsive", "seo", "ecommerce", "cms", "api", "multi-user", "enterprise", "annual-subscription"]}', 'Custom Websites', '["website", "enterprise", "api", "multi-user", "advanced", "annual"]', 0, NULL, NULL, NULL, 30, true, true, 3, now(), now()),

-- Tekmegha Pages Products
(gen_random_uuid(), '6fc1a96a-a609-46ef-a65d-e4338b8fc132'::uuid, 'TP-BASIC', 'Basic Tekmegha Page', 2999.00, 4.5, 35, 1, 'Get your own page under Tekmegha domain. Perfect for businesses wanting online presence without full website costs. Includes contact form and social media integration.', '__brand_product_assets__/tp-basic.png', NULL, true, '{"features": ["contact-form", "social-links", "basic-info"]}', 'Tekmegha Pages', '["page", "online-presence", "affordable", "quick-setup"]', 0, NULL, NULL, NULL, 3, true, false, 4, now(), now()),

(gen_random_uuid(), '6fc1a96a-a609-46ef-a65d-e4338b8fc132'::uuid, 'TP-PREMIUM', 'Premium Tekmegha Page', 5999.00, 4.7, 22, 1, 'Enhanced Tekmegha page with custom design, multiple sections, image gallery, and advanced contact options. Great for professional presence.', '__brand_product_assets__/tp-premium.png', NULL, true, '{"features": ["custom-design", "gallery", "multiple-sections", "advanced-contact"]}', 'Tekmegha framework', '["page", "premium", "custom-design", "gallery"]', 0, NULL, NULL, NULL, 5, true, true, 5, now(), now()),

-- Website Redesign Products
(gen_random_uuid(), '6fc1a96a-a609-46ef-a65d-e4338b8fc132'::uuid, 'WR-REDESIGN', 'Website Redesign & Modernization', 25000.00, 4.8, 28, 1, 'Transform your outdated website into a modern, mobile-friendly platform. Includes content migration, new design, and improved functionality.', '__brand_product_assets__/wr-redesign.png', NULL, true, '{"features": ["modern-design", "mobile-responsive", "content-migration", "seo-optimization"]}', 'Website Redesign', '["redesign", "modernization", "mobile-friendly", "seo"]', 0, NULL, NULL, NULL, 10, true, true, 6, now(), now()),

-- Domain Registration Products
(gen_random_uuid(), '6fc1a96a-a609-46ef-a65d-e4338b8fc132'::uuid, 'DR-REG', 'Domain Registration (.com/.in)', 999.00, 4.6, 45, 1, 'Register your perfect domain name with .com or .in extension. Includes DNS management and domain privacy protection.', '__brand_product_assets__/dr-reg.png', NULL, false, NULL, 'Domain Registration', '["domain", "registration", "dns", "privacy"]', 0, NULL, NULL, NULL, 1, true, false, 7, now(), now()),

(gen_random_uuid(), '6fc1a96a-a609-46ef-a65d-e4338b8fc132'::uuid, 'DR-PREMIUM', 'Premium Domain Registration', 2999.00, 4.8, 15, 1, 'Premium domain registration with additional services including SSL certificate, email setup, and priority support.', '__brand_product_assets__/dr-premium.png', NULL, false, NULL, 'Domain Registration', '["domain", "premium", "ssl", "email", "support"]', 0, NULL, NULL, NULL, 2, true, false, 8, now(), now()),

-- Web Hosting Products
(gen_random_uuid(), '6fc1a96a-a609-46ef-a65d-e4338b8fc132'::uuid, 'WH-BASIC', 'Basic Web Hosting', 2999.00, 4.5, 40, 1, 'Reliable web hosting with 10GB storage, unlimited bandwidth, and 24/7 support. Perfect for small websites and blogs.', '__brand_product_assets__/wh-basic.png', NULL, false, NULL, 'Web Hosting', '["hosting", "storage", "bandwidth", "support"]', 0, NULL, NULL, NULL, 1, true, false, 9, now(), now()),

(gen_random_uuid(), '6fc1a96a-a609-46ef-a65d-e4338b8fc132'::uuid, 'WH-PREMIUM', 'Premium Web Hosting', 7999.00, 4.8, 25, 1, 'Premium hosting with 50GB storage, unlimited bandwidth, SSL certificate, and priority support. Ideal for business websites.', '__brand_product_assets__/wh-premium.png', NULL, false, NULL, 'Web Hosting', '["hosting", "premium", "ssl", "business", "priority"]', 0, NULL, NULL, NULL, 1, true, true, 10, now(), now()),

-- Maintenance & Support Products
(gen_random_uuid(), '6fc1a96a-a609-46ef-a65d-e4338b8fc132'::uuid, 'MNT-BASIC', 'Basic Maintenance Plan', 4999.00, 4.7, 30, 1, 'Basic maintenance plan including regular updates, security monitoring, and email support. Ensures your website stays secure and up-to-date.', '__brand_product_assets__/mnt-basic.png', NULL, false, NULL, 'Maintenance & Support', '["maintenance", "updates", "security", "support"]', 0, NULL, NULL, NULL, 0, true, false, 11, now(), now()),

(gen_random_uuid(), '6fc1a96a-a609-46ef-a65d-e4338b8fc132'::uuid, 'MNT-PREMIUM', 'Premium Maintenance Plan', 9999.00, 4.9, 20, 1, 'Premium maintenance with lifetime updates, priority support, performance optimization, and regular backups. Keep your website running smoothly.', '__brand_product_assets__/mnt-premium.png', NULL, false, NULL, 'Maintenance & Support', '["maintenance", "lifetime", "priority", "optimization", "backups"]', 0, NULL, NULL, NULL, 0, true, true, 12, now(), now()),

-- Digital Bill Feature
(gen_random_uuid(), '6fc1a96a-a609-46ef-a65d-e4338b8fc132'::uuid, 'DB-BILL', 'Digital Bill Feature', 1999.00, 4.6, 50, 1, 'Create professional bills from your mobile device. Share easily with customers and help save trees. Perfect for small businesses and freelancers.', '__brand_product_assets__/db-bill.png', NULL, true, '{"features": ["mobile-billing", "easy-sharing", "professional-templates", "customer-management"]}', 'Digital Bill Feature', '["billing", "mobile", "eco-friendly", "professional"]', 0, NULL, NULL, NULL, 1, true, true, 13, now(), now()),

-- Online Presence Boost
(gen_random_uuid(), '6fc1a96a-a609-46ef-a65d-e4338b8fc132'::uuid, 'OP-BOOST', 'Online Presence Boost', 3999.00, 4.7, 35, 1, 'Boost your online visibility with social media integration, Google My Business setup, and basic SEO optimization. Get found by more customers.', '__brand_product_assets__/op-boost.png', NULL, true, '{"features": ["social-media", "google-my-business", "seo", "visibility"]}', 'Online Presence', '["seo", "social-media", "visibility", "google-business"]', 0, NULL, NULL, NULL, 7, true, false, 14, now(), now()),

-- Email Services
(gen_random_uuid(), '6fc1a96a-a609-46ef-a65d-e4338b8fc132'::uuid, 'EMAIL-MONTHLY', 'Professional Email Service', 50.00, 4.7, 40, 1, 'Professional email hosting service with custom domain email addresses. Includes 5GB storage per mailbox, spam protection, and webmail access. Monthly subscription.', '__brand_product_assets__/email-monthly.png', NULL, false, NULL, 'Domain & Hosting', '["email", "hosting", "professional", "monthly"]', 0, NULL, NULL, NULL, 1, true, false, 15, now(), now()),

-- Consultation Services
(gen_random_uuid(), '6fc1a96a-a609-46ef-a65d-e4338b8fc132'::uuid, 'CONS-1HR', 'Digital Strategy Consultation', 1500.00, 4.8, 15, 1, 'One-hour consultation to discuss your digital needs and create a customized strategy for your online presence. Expert advice from TEKMEGHA professionals.', '__brand_product_assets__/cons-1hr.png', NULL, true, '{"duration": "1-hour", "type": "strategy", "includes": ["analysis", "recommendations", "action-plan"]}', 'Online Presence', '["consultation", "strategy", "expert-advice", "customized"]', 0, NULL, NULL, NULL, 1, true, false, 16, now(), now());

-- Insert some featured products and promotions
UPDATE public.products SET is_featured = true WHERE sku IN ('CWS-PREMIUM', 'TP-PREMIUM', 'WR-REDESIGN', 'WH-PREMIUM', 'MNT-PREMIUM', 'DB-BILL', 'EMAIL-MONTHLY');

-- Add some promotional pricing for popular products
UPDATE public.products SET discount_percentage = 10, old_price = 9999.00 WHERE sku = 'CWS-BASIC';
UPDATE public.products SET discount_percentage = 15, old_price = 3529.00 WHERE sku = 'TP-BASIC';
UPDATE public.products SET discount_percentage = 10, old_price = 1111.00 WHERE sku = 'DR-REG';
UPDATE public.products SET discount_percentage = 20, old_price = 62.50 WHERE sku = 'EMAIL-MONTHLY';

COMMIT;
