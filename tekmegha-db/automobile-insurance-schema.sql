-- ============================================
-- Automobile Insurance Policy Management Schema
-- Created: 2024
-- Description: Database schema for managing vehicle insurance policies
-- ============================================

-- Create insurance_policies table
CREATE TABLE IF NOT EXISTS insurance_policies (
    id BIGSERIAL PRIMARY KEY,
    policy_no VARCHAR(50) UNIQUE NOT NULL,
    
    -- Date information
    policy_issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Policy issuer/agent information
    issued_by VARCHAR(100),
    
    -- Customer information
    customer_name VARCHAR(255) NOT NULL,
    mobile_no VARCHAR(20),
    email VARCHAR(255),
    
    -- Vehicle information
    vehicle_type VARCHAR(100),
    vehicle_no VARCHAR(20) NOT NULL,
    policy_type VARCHAR(50) NOT NULL, -- TW SOD, TW TP, GCV FULL, etc.
    cc_gvw_seating VARCHAR(50), -- CC for bikes, GVW for commercial, Seating capacity
    
    -- Financial information
    od_premium DECIMAL(10, 2) DEFAULT 0.00,
    net_premium DECIMAL(10, 2) NOT NULL,
    gross_premium DECIMAL(10, 2) NOT NULL,
    
    -- Reference information
    reference_1 VARCHAR(50),
    reference_2 VARCHAR(100),
    mb_no VARCHAR(50),
    
    -- Payment information
    payment_mode VARCHAR(50),
    insurance_company VARCHAR(100) NOT NULL,
    
    -- Additional information
    remarks TEXT,
    
    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled', 'renewed')),
    
    -- Indexes for better query performance
    CONSTRAINT valid_dates CHECK (expiry_date > policy_issue_date)
);

-- Create indexes
CREATE INDEX idx_policies_policy_no ON insurance_policies(policy_no);
CREATE INDEX idx_policies_customer_name ON insurance_policies(customer_name);
CREATE INDEX idx_policies_vehicle_no ON insurance_policies(vehicle_no);
CREATE INDEX idx_policies_issue_date ON insurance_policies(policy_issue_date);
CREATE INDEX idx_policies_expiry_date ON insurance_policies(expiry_date);
CREATE INDEX idx_policies_status ON insurance_policies(status);
CREATE INDEX idx_policies_company ON insurance_policies(insurance_company);

-- Create insurance_companies table
CREATE TABLE IF NOT EXISTS insurance_companies (
    id SERIAL PRIMARY KEY,
    company_code VARCHAR(50) UNIQUE NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create agents table
CREATE TABLE IF NOT EXISTS insurance_agents (
    id SERIAL PRIMARY KEY,
    agent_code VARCHAR(50) UNIQUE NOT NULL,
    agent_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    commission_rate DECIMAL(5, 2) DEFAULT 0.00,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create policy_types table
CREATE TABLE IF NOT EXISTS policy_types (
    id SERIAL PRIMARY KEY,
    type_code VARCHAR(50) UNIQUE NOT NULL,
    type_name VARCHAR(255) NOT NULL,
    vehicle_category VARCHAR(50), -- Two Wheeler, Four Wheeler, Commercial
    description TEXT,
    active BOOLEAN DEFAULT true
);

-- Create renewals tracking table
CREATE TABLE IF NOT EXISTS policy_renewals (
    id BIGSERIAL PRIMARY KEY,
    old_policy_no VARCHAR(50) NOT NULL,
    new_policy_no VARCHAR(50) NOT NULL,
    renewal_date DATE NOT NULL,
    renewed_by VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (new_policy_no) REFERENCES insurance_policies(policy_no)
);

-- Create payments table
CREATE TABLE IF NOT EXISTS policy_payments (
    id BIGSERIAL PRIMARY KEY,
    policy_no VARCHAR(50) NOT NULL,
    payment_date DATE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_mode VARCHAR(50) NOT NULL,
    transaction_reference VARCHAR(100),
    payment_status VARCHAR(20) DEFAULT 'completed' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (policy_no) REFERENCES insurance_policies(policy_no)
);

-- Create reminders table for policy expiry
CREATE TABLE IF NOT EXISTS policy_reminders (
    id BIGSERIAL PRIMARY KEY,
    policy_no VARCHAR(50) NOT NULL,
    reminder_date DATE NOT NULL,
    reminder_type VARCHAR(50) DEFAULT 'expiry' CHECK (reminder_type IN ('expiry', 'payment', 'renewal')),
    sent BOOLEAN DEFAULT false,
    sent_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (policy_no) REFERENCES insurance_policies(policy_no)
);

-- Create audit log table
CREATE TABLE IF NOT EXISTS policy_audit_log (
    id BIGSERIAL PRIMARY KEY,
    policy_no VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL, -- created, updated, cancelled, renewed
    changed_by VARCHAR(100),
    changes JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default insurance companies
INSERT INTO insurance_companies (company_code, company_name) VALUES
('DIGIT', 'Digit Insurance'),
('FUTURE', 'Future Generali India Insurance'),
('HDFC', 'HDFC ERGO General Insurance'),
('ICICI', 'ICICI Lombard General Insurance'),
('BAJAJ', 'Bajaj Allianz General Insurance'),
('SBI', 'SBI General Insurance'),
('TATA', 'TATA AIG General Insurance'),
('RELIANCE', 'Reliance General Insurance')
ON CONFLICT (company_code) DO NOTHING;

-- Insert default policy types
INSERT INTO policy_types (type_code, type_name, vehicle_category, description) VALUES
('TW SOD', 'Two Wheeler - Stand Alone Own Damage', 'Two Wheeler', 'Own damage coverage only for two-wheelers'),
('TW TP', 'Two Wheeler - Third Party', 'Two Wheeler', 'Third party liability coverage for two-wheelers'),
('TW FULL', 'Two Wheeler - Comprehensive', 'Two Wheeler', 'Comprehensive coverage for two-wheelers'),
('GCV FULL', 'Goods Carrier Vehicle - Comprehensive', 'Commercial', 'Comprehensive coverage for goods carrier vehicles'),
('PCV FULL', 'Passenger Carrier Vehicle - Comprehensive', 'Commercial', 'Comprehensive coverage for passenger carrier vehicles'),
('CAR FULL', 'Private Car - Comprehensive', 'Four Wheeler', 'Comprehensive coverage for private cars'),
('CAR TP', 'Private Car - Third Party', 'Four Wheeler', 'Third party liability coverage for private cars')
ON CONFLICT (type_code) DO NOTHING;

-- Insert default agents
INSERT INTO insurance_agents (agent_code, agent_name, commission_rate) VALUES
('SHIVARAM', 'Shivaram', 5.00),
('VANITH ANNA', 'Vanith Anna', 5.00),
('SATHISH ANNA', 'Sathish Anna', 5.00)
ON CONFLICT (agent_code) DO NOTHING;

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for insurance_policies
CREATE TRIGGER update_insurance_policies_updated_at 
    BEFORE UPDATE ON insurance_policies 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to log changes
CREATE OR REPLACE FUNCTION log_policy_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO policy_audit_log (policy_no, action, changes)
        VALUES (NEW.policy_no, 'created', row_to_json(NEW)::jsonb);
        RETURN NEW;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO policy_audit_log (policy_no, action, changes)
        VALUES (NEW.policy_no, 'updated', jsonb_build_object(
            'old', row_to_json(OLD)::jsonb,
            'new', row_to_json(NEW)::jsonb
        ));
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO policy_audit_log (policy_no, action, changes)
        VALUES (OLD.policy_no, 'deleted', row_to_json(OLD)::jsonb);
        RETURN OLD;
    END IF;
END;
$$ language 'plpgsql';

-- Create trigger for audit logging
CREATE TRIGGER log_policy_changes_trigger
    AFTER INSERT OR UPDATE OR DELETE ON insurance_policies
    FOR EACH ROW
    EXECUTE FUNCTION log_policy_changes();

-- Create view for policies expiring soon (next 30 days)
CREATE OR REPLACE VIEW policies_expiring_soon AS
SELECT 
    p.*,
    ic.company_name,
    EXTRACT(DAY FROM (p.expiry_date - CURRENT_DATE)) as days_to_expiry
FROM insurance_policies p
LEFT JOIN insurance_companies ic ON p.insurance_company = ic.company_code
WHERE p.expiry_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
  AND p.status = 'active'
ORDER BY p.expiry_date ASC;

-- Create view for policy statistics
CREATE OR REPLACE VIEW policy_statistics AS
SELECT 
    insurance_company,
    policy_type,
    COUNT(*) as total_policies,
    SUM(gross_premium) as total_premium,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_policies,
    COUNT(CASE WHEN expiry_date < CURRENT_DATE THEN 1 END) as expired_policies
FROM insurance_policies
GROUP BY insurance_company, policy_type;

COMMENT ON TABLE insurance_policies IS 'Main table storing all vehicle insurance policy information';
COMMENT ON TABLE insurance_companies IS 'Master data for insurance companies';
COMMENT ON TABLE insurance_agents IS 'Insurance agents/brokers information';
COMMENT ON TABLE policy_types IS 'Different types of insurance policies offered';
COMMENT ON TABLE policy_renewals IS 'Tracking policy renewals';
COMMENT ON TABLE policy_payments IS 'Payment records for policies';
COMMENT ON TABLE policy_reminders IS 'Automated reminders for policy expiry and renewals';
COMMENT ON TABLE policy_audit_log IS 'Audit trail of all policy changes';

