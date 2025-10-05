-- Insert sample products for CCTV Device (DIRECT INSERT VERSION)
-- This version uses direct INSERT statements to avoid casting issues

-- First, get the store ID for CCTV Device
DO $$
DECLARE
    cctv_store_id uuid;
BEGIN
    -- Get the store ID
    SELECT id INTO cctv_store_id FROM megha_stores WHERE store_code = 'cctv-device' LIMIT 1;
    
    IF cctv_store_id IS NULL THEN
        RAISE EXCEPTION 'CCTV Device store not found. Please run insert-cctv-device-store.sql first.';
    END IF;
    
    -- Insert sample security products
    INSERT INTO products (
        megha_store_id, sku, name, price, rating, review_count, serves, description, image_url,
        gallery_images, customisable, customization_options, category, tags, discount_percentage,
        old_price, nutritional_info, allergen_info, preparation_time, is_available, is_featured,
        sort_order, created_at, updated_at
    ) VALUES
    -- CCTV Cameras
    (cctv_store_id, 'CCTV-001', '4K Ultra HD IP Camera', 15999.00, 4.8, 1250, 1,
     'Professional 4K IP camera with night vision, motion detection, and remote viewing capabilities.',
     'assets/images/cctv-device/4k-ip-camera.jpg',
     '["assets/images/cctv-device/4k-camera-1.jpg", "assets/images/cctv-device/4k-camera-2.jpg"]'::jsonb,
     true, '{"resolution": ["4K", "1080p", "720p"], "lens": ["2.8mm", "3.6mm", "6mm"], "color": ["White", "Black", "Gray"]}'::jsonb,
     'CCTV Cameras', '["4k", "ip-camera", "night-vision", "motion-detection"]'::jsonb, 20, 19999.00,
     NULL, NULL, NULL, true, true, 1, NOW(), NOW()),
    
    (cctv_store_id, 'CCTV-002', 'Wireless WiFi Camera', 8999.00, 4.6, 850, 1,
     'Wireless IP camera with WiFi connectivity, mobile app control, and cloud storage.',
     'assets/images/cctv-device/wireless-camera.jpg',
     '["assets/images/cctv-device/wireless-1.jpg", "assets/images/cctv-device/wireless-2.jpg"]'::jsonb,
     true, '{"resolution": ["1080p", "720p"], "storage": ["32GB", "64GB", "128GB"], "mounting": ["Wall", "Ceiling", "Table"]}'::jsonb,
     'CCTV Cameras', '["wireless", "wifi", "mobile-app", "cloud-storage"]'::jsonb, 15, 10588.00,
     NULL, NULL, NULL, true, true, 2, NOW(), NOW()),
    
    (cctv_store_id, 'CCTV-003', 'PTZ Security Camera', 24999.00, 4.7, 650, 1,
     'Pan-tilt-zoom camera with 360° coverage, auto-tracking, and remote control.',
     'assets/images/cctv-device/ptz-camera.jpg',
     '["assets/images/cctv-device/ptz-1.jpg"]'::jsonb,
     true, '{"zoom": ["10x", "20x", "30x"], "control": ["Manual", "Auto", "Preset"], "coverage": ["360°", "180°", "90°"]}'::jsonb,
     'CCTV Cameras', '["ptz", "360-degree", "auto-tracking", "remote-control"]'::jsonb, 25, 33332.00,
     NULL, NULL, NULL, true, true, 3, NOW(), NOW()),
    
    -- Security Systems
    (cctv_store_id, 'SEC-001', 'Complete Home Security System', 49999.00, 4.9, 980, 1,
     'Complete home security package with 4 cameras, DVR, motion sensors, and mobile app.',
     'assets/images/cctv-device/home-security-system.jpg',
     '["assets/images/cctv-device/home-system-1.jpg", "assets/images/cctv-device/home-system-2.jpg"]'::jsonb,
     true, '{"cameras": ["2", "4", "8", "16"], "storage": ["1TB", "2TB", "4TB"], "monitoring": ["Basic", "Premium", "Professional"]}'::jsonb,
     'Security Systems', '["home-security", "complete-system", "dvr", "motion-sensors"]'::jsonb, 30, 71429.00,
     NULL, NULL, NULL, true, true, 4, NOW(), NOW()),
    
    (cctv_store_id, 'SEC-002', 'Commercial Security Package', 99999.00, 4.8, 450, 1,
     'Professional commercial security system with 16 cameras, NVR, access control, and 24/7 monitoring.',
     'assets/images/cctv-device/commercial-security.jpg',
     '["assets/images/cctv-device/commercial-1.jpg"]'::jsonb,
     true, '{"cameras": ["8", "16", "32", "64"], "storage": ["4TB", "8TB", "16TB"], "monitoring": ["24/7", "Business Hours", "Custom"]}'::jsonb,
     'Security Systems', '["commercial", "professional", "nvr", "access-control", "24-7-monitoring"]'::jsonb, 35, 153846.00,
     NULL, NULL, NULL, true, true, 5, NOW(), NOW()),
    
    -- Access Control
    (cctv_store_id, 'ACC-001', 'Biometric Fingerprint Scanner', 12999.00, 4.5, 720, 1,
     'High-security biometric fingerprint scanner with database storage and access logging.',
     'assets/images/cctv-device/biometric-scanner.jpg',
     '["assets/images/cctv-device/biometric-1.jpg"]'::jsonb,
     true, '{"capacity": ["1000", "5000", "10000"], "interface": ["USB", "Network", "Wireless"], "mounting": ["Wall", "Stand", "Desk"]}'::jsonb,
     'Access Control', '["biometric", "fingerprint", "high-security", "access-logging"]'::jsonb, 18, 15854.00,
     NULL, NULL, NULL, true, true, 6, NOW(), NOW()),
    
    (cctv_store_id, 'ACC-002', 'RFID Card Reader System', 7999.00, 4.4, 580, 1,
     'RFID card reader with door controller, cards, and management software.',
     'assets/images/cctv-device/rfid-reader.jpg',
     '["assets/images/cctv-device/rfid-1.jpg"]'::jsonb,
     true, '{"cards": ["10", "50", "100", "500"], "range": ["5cm", "10cm", "15cm"], "interface": ["Wiegand", "RS485", "Network"]}'::jsonb,
     'Access Control', '["rfid", "card-reader", "door-controller", "access-cards"]'::jsonb, 22, 10256.00,
     NULL, NULL, NULL, true, false, 7, NOW(), NOW()),
    
    -- Alarm Systems
    (cctv_store_id, 'ALM-001', 'Wireless Intrusion Alarm', 14999.00, 4.6, 890, 1,
     'Complete wireless alarm system with door/window sensors, motion detectors, and siren.',
     'assets/images/cctv-device/wireless-alarm.jpg',
     '["assets/images/cctv-device/alarm-1.jpg", "assets/images/cctv-device/alarm-2.jpg"]'::jsonb,
     true, '{"zones": ["8", "16", "32", "64"], "sensors": ["Door", "Window", "Motion", "Glass"], "monitoring": ["Self", "Professional"]}'::jsonb,
     'Alarm Systems', '["wireless", "intrusion", "motion-detection", "siren"]'::jsonb, 25, 19999.00,
     NULL, NULL, NULL, true, true, 8, NOW(), NOW()),
    
    (cctv_store_id, 'ALM-002', 'Fire Detection System', 19999.00, 4.7, 650, 1,
     'Professional fire detection system with smoke detectors, heat sensors, and alarm panel.',
     'assets/images/cctv-device/fire-detection.jpg',
     '["assets/images/cctv-device/fire-1.jpg"]'::jsonb,
     true, '{"detectors": ["4", "8", "16", "32"], "type": ["Smoke", "Heat", "Combined"], "power": ["Battery", "Mains", "Wireless"]}'::jsonb,
     'Alarm Systems', '["fire-detection", "smoke-detector", "heat-sensor", "alarm-panel"]'::jsonb, 20, 24999.00,
     NULL, NULL, NULL, true, true, 9, NOW(), NOW()),
    
    -- Network Security
    (cctv_store_id, 'NET-001', 'Network Video Recorder (NVR)', 29999.00, 4.8, 450, 1,
     'Professional NVR with 16 channels, 4TB storage, and remote access capabilities.',
     'assets/images/cctv-device/nvr-16ch.jpg',
     '["assets/images/cctv-device/nvr-1.jpg"]'::jsonb,
     true, '{"channels": ["8", "16", "32", "64"], "storage": ["2TB", "4TB", "8TB", "16TB"], "resolution": ["4K", "1080p", "720p"]}'::jsonb,
     'Network Security', '["nvr", "16-channel", "4tb-storage", "remote-access"]'::jsonb, 28, 41667.00,
     NULL, NULL, NULL, true, true, 10, NOW(), NOW()),
    
    (cctv_store_id, 'NET-002', 'PoE Network Switch', 8999.00, 4.5, 320, 1,
     'Power over Ethernet switch for IP cameras with 16 ports and 150W power budget.',
     'assets/images/cctv-device/poe-switch.jpg',
     '["assets/images/cctv-device/poe-1.jpg"]'::jsonb,
     true, '{"ports": ["8", "16", "24", "48"], "power": ["60W", "150W", "300W", "500W"], "speed": ["100Mbps", "1Gbps", "10Gbps"]}'::jsonb,
     'Network Security', '["poe", "network-switch", "power-over-ethernet", "ip-cameras"]'::jsonb, 15, 10588.00,
     NULL, NULL, NULL, true, false, 11, NOW(), NOW()),
    
    -- Smart Security
    (cctv_store_id, 'SMART-001', 'AI Video Analytics System', 39999.00, 4.9, 280, 1,
     'Advanced AI-powered video analytics with face recognition, object detection, and behavior analysis.',
     'assets/images/cctv-device/ai-analytics.jpg',
     '["assets/images/cctv-device/ai-1.jpg"]'::jsonb,
     true, '{"analytics": ["Face Recognition", "Object Detection", "Behavior Analysis", "Crowd Counting"], "cameras": ["4", "8", "16", "32"]}'::jsonb,
     'Smart Security', '["ai-analytics", "face-recognition", "object-detection", "behavior-analysis"]'::jsonb, 35, 61538.00,
     NULL, NULL, NULL, true, true, 12, NOW(), NOW()),
    
    (cctv_store_id, 'SMART-002', 'Smart Home Security Hub', 24999.00, 4.6, 520, 1,
     'Central hub for smart home security with voice control, automation, and mobile app.',
     'assets/images/cctv-device/smart-hub.jpg',
     '["assets/images/cctv-device/hub-1.jpg"]'::jsonb,
     true, '{"voice": ["Alexa", "Google", "Siri"], "automation": ["Basic", "Advanced", "Custom"], "devices": ["10", "25", "50", "100"]}'::jsonb,
     'Smart Security', '["smart-hub", "voice-control", "automation", "mobile-app"]'::jsonb, 30, 35714.00,
     NULL, NULL, NULL, true, true, 13, NOW(), NOW()),
    
    -- Installation & Services
    (cctv_store_id, 'INST-001', 'Professional Installation Service', 9999.00, 4.8, 1200, 1,
     'Complete installation service including wiring, setup, testing, and training.',
     'assets/images/cctv-device/installation-service.jpg',
     '["assets/images/cctv-device/install-1.jpg"]'::jsonb,
     true, '{"coverage": ["Local", "Regional", "National"], "warranty": ["1 Year", "2 Years", "3 Years"], "support": ["Basic", "Premium", "24/7"]}'::jsonb,
     'Installation', '["installation", "professional", "wiring", "setup", "training"]'::jsonb, 0, 9999.00,
     NULL, NULL, NULL, true, true, 14, NOW(), NOW()),
    
    (cctv_store_id, 'MAINT-001', 'Annual Maintenance Contract', 19999.00, 4.7, 350, 1,
     'Comprehensive annual maintenance including cleaning, testing, updates, and 24/7 support.',
     'assets/images/cctv-device/maintenance-contract.jpg',
     '["assets/images/cctv-device/maintenance-1.jpg"]'::jsonb,
     true, '{"visits": ["Monthly", "Quarterly", "Bi-annual"], "support": ["Business Hours", "24/7", "Emergency"], "coverage": ["Hardware", "Software", "Network"]}'::jsonb,
     'Maintenance', '["maintenance", "annual-contract", "cleaning", "testing", "24-7-support"]'::jsonb, 10, 22222.00,
     NULL, NULL, NULL, true, true, 15, NOW(), NOW());
    
    RAISE NOTICE 'Successfully inserted 15 CCTV Device products for store ID: %', cctv_store_id;
END $$;

-- Verify the products
SELECT 
  p.id,
  p.sku,
  p.name,
  p.price,
  p.rating,
  p.category,
  p.is_featured,
  p.is_available
FROM products p
WHERE p.megha_store_id = (SELECT id FROM megha_stores WHERE store_code = 'cctv-device')
ORDER BY p.sort_order, p.name;
