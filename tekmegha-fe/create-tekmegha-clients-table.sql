-- Create TekMegha Clients Table
-- This table stores information about all TekMegha clients

-- Create the tekmegha_all_clients table
CREATE TABLE IF NOT EXISTS tekmegha_all_clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),
    renewal_date DATE NOT NULL,
    products TEXT[], -- Array of products provided
    tm_billing_month INTEGER NOT NULL CHECK (tm_billing_month >= 1 AND tm_billing_month <= 12), -- Billing month (1-12)
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tekmegha_clients_name ON tekmegha_all_clients(client_name);
CREATE INDEX IF NOT EXISTS idx_tekmegha_clients_email ON tekmegha_all_clients(email);
CREATE INDEX IF NOT EXISTS idx_tekmegha_clients_status ON tekmegha_all_clients(status);
CREATE INDEX IF NOT EXISTS idx_tekmegha_clients_renewal ON tekmegha_all_clients(renewal_date);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_tekmegha_clients_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_tekmegha_clients_updated_at
    BEFORE UPDATE ON tekmegha_all_clients
    FOR EACH ROW
    EXECUTE FUNCTION update_tekmegha_clients_updated_at();

-- Enable RLS
ALTER TABLE tekmegha_all_clients ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tekmegha_all_clients
-- Allow authenticated users to read all clients
CREATE POLICY "Authenticated users can read all clients"
ON tekmegha_all_clients
FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to insert clients
CREATE POLICY "Authenticated users can insert clients"
ON tekmegha_all_clients
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update clients
CREATE POLICY "Authenticated users can update clients"
ON tekmegha_all_clients
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete clients
CREATE POLICY "Authenticated users can delete clients"
ON tekmegha_all_clients
FOR DELETE
TO authenticated
USING (true);

-- Insert sample data
INSERT INTO tekmegha_all_clients (
    client_name, 
    contact_person, 
    email, 
    phone, 
    address, 
    city, 
    state, 
    pincode, 
    renewal_date, 
    products, 
    tm_billing_month,
    status
) VALUES 
(
    'Acme Corporation',
    'John Smith',
    'john@acme.com',
    '+1-555-0123',
    '123 Business St',
    'New York',
    'NY',
    '10001',
    '2024-12-15',
    ARRAY['Web Development', 'Mobile App', 'Cloud Services'],
    12, -- December billing
    'active'
),
(
    'TechStart Inc',
    'Sarah Johnson',
    'sarah@techstart.com',
    '+1-555-0456',
    '456 Innovation Ave',
    'San Francisco',
    'CA',
    '94105',
    '2024-11-20',
    ARRAY['E-commerce Platform', 'API Development'],
    11, -- November billing
    'active'
),
(
    'Global Solutions Ltd',
    'Mike Wilson',
    'mike@globalsolutions.com',
    '+1-555-0789',
    '789 Corporate Blvd',
    'Chicago',
    'IL',
    '60601',
    '2024-10-30',
    ARRAY['Enterprise Software', 'Database Management', 'Security Services'],
    10, -- October billing
    'pending'
),
(
    'Digital Innovations',
    'Emily Chen',
    'emily@digitalinnovations.com',
    '+1-555-0321',
    '321 Tech Park',
    'Austin',
    'TX',
    '73301',
    '2024-09-15',
    ARRAY['AI Solutions', 'Machine Learning', 'Data Analytics'],
    9, -- September billing
    'inactive'
),
(
    'Future Systems',
    'David Brown',
    'david@futuresystems.com',
    '+1-555-0654',
    '654 Future Lane',
    'Seattle',
    'WA',
    '98101',
    '2025-01-10',
    ARRAY['IoT Development', 'Smart Solutions', 'Automation'],
    1, -- January billing
    'active'
);

-- Verification query
SELECT 
    client_name,
    contact_person,
    email,
    renewal_date,
    status,
    array_length(products, 1) as product_count
FROM tekmegha_all_clients
ORDER BY client_name;
