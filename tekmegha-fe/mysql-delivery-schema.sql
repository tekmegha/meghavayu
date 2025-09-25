-- MySQL Schema for BrewBuddy Delivery System
-- This schema supports multi-store delivery management

-- Create database
CREATE DATABASE IF NOT EXISTS brewbuddy_delivery;
USE brewbuddy_delivery;

-- Delivery Requests Table
CREATE TABLE delivery_requests (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL UNIQUE,
    store_id VARCHAR(36) NOT NULL,
    customer_id VARCHAR(36) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_instructions TEXT,
    status ENUM('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled') DEFAULT 'pending',
    estimated_delivery_time DATETIME NOT NULL,
    actual_delivery_time DATETIME NULL,
    delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_store_id (store_id),
    INDEX idx_customer_id (customer_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Delivery Items Table (items in each delivery request)
CREATE TABLE delivery_items (
    id VARCHAR(36) PRIMARY KEY,
    delivery_request_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (delivery_request_id) REFERENCES delivery_requests(id) ON DELETE CASCADE,
    INDEX idx_delivery_request_id (delivery_request_id),
    INDEX idx_product_id (product_id)
);

-- Delivery Tracking Table
CREATE TABLE delivery_tracking (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL,
    status VARCHAR(50) NOT NULL,
    message TEXT,
    location_lat DECIMAL(10, 8) NULL,
    location_lng DECIMAL(11, 8) NULL,
    driver_name VARCHAR(255) NULL,
    driver_phone VARCHAR(20) NULL,
    vehicle_info VARCHAR(255) NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES delivery_requests(order_id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_timestamp (timestamp)
);

-- Store Delivery Settings Table
CREATE TABLE store_delivery_settings (
    id VARCHAR(36) PRIMARY KEY,
    store_id VARCHAR(36) NOT NULL,
    delivery_radius_km DECIMAL(5,2) NOT NULL DEFAULT 10.00,
    base_delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 30.00,
    fee_per_km DECIMAL(10,2) NOT NULL DEFAULT 5.00,
    min_order_amount DECIMAL(10,2) NOT NULL DEFAULT 100.00,
    max_delivery_time_minutes INT NOT NULL DEFAULT 60,
    is_delivery_available BOOLEAN DEFAULT TRUE,
    delivery_start_time TIME DEFAULT '07:00:00',
    delivery_end_time TIME DEFAULT '22:00:00',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_store (store_id),
    INDEX idx_delivery_available (is_delivery_available)
);

-- Driver Assignments Table
CREATE TABLE driver_assignments (
    id VARCHAR(36) PRIMARY KEY,
    delivery_request_id VARCHAR(36) NOT NULL,
    driver_id VARCHAR(36) NOT NULL,
    driver_name VARCHAR(255) NOT NULL,
    driver_phone VARCHAR(20) NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL,
    vehicle_number VARCHAR(20) NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('assigned', 'accepted', 'picked_up', 'delivered', 'cancelled') DEFAULT 'assigned',
    
    FOREIGN KEY (delivery_request_id) REFERENCES delivery_requests(id) ON DELETE CASCADE,
    INDEX idx_delivery_request_id (delivery_request_id),
    INDEX idx_driver_id (driver_id),
    INDEX idx_status (status)
);

-- Delivery Analytics Table
CREATE TABLE delivery_analytics (
    id VARCHAR(36) PRIMARY KEY,
    store_id VARCHAR(36) NOT NULL,
    date DATE NOT NULL,
    total_orders INT DEFAULT 0,
    total_delivery_fee DECIMAL(10,2) DEFAULT 0.00,
    avg_delivery_time_minutes DECIMAL(5,2) DEFAULT 0.00,
    total_distance_km DECIMAL(10,2) DEFAULT 0.00,
    successful_deliveries INT DEFAULT 0,
    failed_deliveries INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_store_date (store_id, date),
    INDEX idx_store_id (store_id),
    INDEX idx_date (date)
);

-- Insert sample delivery settings for stores
INSERT INTO store_delivery_settings (id, store_id, delivery_radius_km, base_delivery_fee, fee_per_km, min_order_amount, max_delivery_time_minutes, delivery_start_time, delivery_end_time) VALUES
('store_settings_1', 'hyderabad-store1', 15.00, 30.00, 5.00, 100.00, 45, '07:00:00', '22:00:00'),
('store_settings_2', 'hyderabad-store2', 12.00, 35.00, 6.00, 120.00, 40, '07:00:00', '22:00:00'),
('store_settings_3', 'hyderabad-store3', 10.00, 25.00, 4.00, 80.00, 35, '08:00:00', '21:00:00'),
('store_settings_4', 'hyderabad-store4', 18.00, 40.00, 7.00, 150.00, 60, '07:00:00', '23:00:00'),
('store_settings_5', 'hyderabad-store5', 14.00, 32.00, 5.50, 110.00, 50, '07:30:00', '21:30:00');

-- Insert sample delivery requests
INSERT INTO delivery_requests (id, order_id, store_id, customer_id, customer_name, customer_phone, delivery_address, status, estimated_delivery_time, delivery_fee, total_amount) VALUES
('delivery_1', 'order_001', 'hyderabad-store1', 'customer_001', 'John Doe', '+91 9876543210', '123 Main Street, Gachibowli, Hyderabad', 'pending', DATE_ADD(NOW(), INTERVAL 30 MINUTE), 35.00, 285.00),
('delivery_2', 'order_002', 'hyderabad-store2', 'customer_002', 'Jane Smith', '+91 9876543211', '456 Tech Park, Jubilee Hills, Hyderabad', 'confirmed', DATE_ADD(NOW(), INTERVAL 25 MINUTE), 30.00, 195.00),
('delivery_3', 'order_003', 'hyderabad-store3', 'customer_003', 'Mike Johnson', '+91 9876543212', '789 Business District, Banjara Hills, Hyderabad', 'preparing', DATE_ADD(NOW(), INTERVAL 20 MINUTE), 28.00, 320.00);

-- Insert sample delivery items
INSERT INTO delivery_items (id, delivery_request_id, product_id, product_name, quantity, price, total_price) VALUES
('item_1', 'delivery_1', 'product_1', 'Cappuccino', 2, 120.00, 240.00),
('item_2', 'delivery_1', 'product_2', 'Chocolate Croissant', 1, 45.00, 45.00),
('item_3', 'delivery_2', 'product_3', 'Americano', 1, 95.00, 95.00),
('item_4', 'delivery_2', 'product_4', 'Blueberry Muffin', 1, 70.00, 70.00),
('item_5', 'delivery_3', 'product_5', 'Latte', 3, 110.00, 330.00);

-- Insert sample tracking data
INSERT INTO delivery_tracking (id, order_id, status, message, timestamp) VALUES
('track_1', 'order_001', 'order_placed', 'Order placed successfully', NOW()),
('track_2', 'order_002', 'order_confirmed', 'Order confirmed by store', NOW()),
('track_3', 'order_002', 'preparing', 'Your order is being prepared', NOW()),
('track_4', 'order_003', 'ready', 'Order is ready for pickup', NOW());

-- Create views for common queries

-- View for active deliveries
CREATE VIEW active_deliveries AS
SELECT 
    dr.id,
    dr.order_id,
    dr.store_id,
    dr.customer_name,
    dr.customer_phone,
    dr.delivery_address,
    dr.status,
    dr.estimated_delivery_time,
    dr.delivery_fee,
    dr.total_amount,
    COUNT(di.id) as item_count
FROM delivery_requests dr
LEFT JOIN delivery_items di ON dr.id = di.delivery_request_id
WHERE dr.status IN ('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery')
GROUP BY dr.id;

-- View for delivery performance
CREATE VIEW delivery_performance AS
SELECT 
    dr.store_id,
    COUNT(*) as total_orders,
    AVG(TIMESTAMPDIFF(MINUTE, dr.created_at, dr.actual_delivery_time)) as avg_delivery_time,
    SUM(dr.delivery_fee) as total_delivery_fees,
    SUM(CASE WHEN dr.status = 'delivered' THEN 1 ELSE 0 END) as successful_deliveries,
    SUM(CASE WHEN dr.status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_deliveries
FROM delivery_requests dr
WHERE dr.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY dr.store_id;

-- Create stored procedures

-- Procedure to update delivery status
DELIMITER //
CREATE PROCEDURE UpdateDeliveryStatus(
    IN p_order_id VARCHAR(36),
    IN p_status VARCHAR(50),
    IN p_message TEXT,
    IN p_driver_name VARCHAR(255),
    IN p_driver_phone VARCHAR(20)
)
BEGIN
    DECLARE v_delivery_id VARCHAR(36);
    
    -- Get delivery request ID
    SELECT id INTO v_delivery_id FROM delivery_requests WHERE order_id = p_order_id;
    
    -- Update delivery request status
    UPDATE delivery_requests 
    SET status = p_status, updated_at = NOW()
    WHERE order_id = p_order_id;
    
    -- Add tracking entry
    INSERT INTO delivery_tracking (id, order_id, status, message, driver_name, driver_phone, timestamp)
    VALUES (UUID(), p_order_id, p_status, p_message, p_driver_name, p_driver_phone, NOW());
    
    -- If delivered, update actual delivery time
    IF p_status = 'delivered' THEN
        UPDATE delivery_requests 
        SET actual_delivery_time = NOW()
        WHERE order_id = p_order_id;
    END IF;
END //
DELIMITER ;

-- Procedure to get delivery options for a location
DELIMITER //
CREATE PROCEDURE GetDeliveryOptions(
    IN p_latitude DECIMAL(10, 8),
    IN p_longitude DECIMAL(11, 8)
)
BEGIN
    SELECT 
        s.id as store_id,
        s.name as store_name,
        s.address as store_address,
        s.phone as store_phone,
        sds.delivery_radius_km,
        sds.base_delivery_fee,
        sds.fee_per_km,
        sds.min_order_amount,
        sds.max_delivery_time_minutes,
        sds.is_delivery_available,
        sds.delivery_start_time,
        sds.delivery_end_time,
        -- Calculate estimated delivery time (mock calculation)
        sds.max_delivery_time_minutes as estimated_time,
        -- Calculate delivery fee (mock calculation)
        sds.base_delivery_fee as delivery_fee
    FROM stores s
    JOIN store_delivery_settings sds ON s.id = sds.store_id
    WHERE sds.is_delivery_available = TRUE
    AND TIME(NOW()) BETWEEN sds.delivery_start_time AND sds.delivery_end_time
    ORDER BY sds.base_delivery_fee ASC;
END //
DELIMITER ;

-- Create indexes for performance
CREATE INDEX idx_delivery_requests_status_created ON delivery_requests(status, created_at);
CREATE INDEX idx_delivery_tracking_order_status ON delivery_tracking(order_id, status);
CREATE INDEX idx_driver_assignments_status ON driver_assignments(status);

-- Grant permissions (adjust as needed for your setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON brewbuddy_delivery.* TO 'brewbuddy_user'@'%';
-- FLUSH PRIVILEGES;
