-- ============================================
-- DK Associates Products Table
-- Stores insurance policy data
-- ============================================

-- Create dkassociates_products table
CREATE TABLE IF NOT EXISTS public.dkassociates_products (
  tm_ins_id BIGSERIAL PRIMARY KEY,
  "POLICY ISSUE DATE" TEXT NULL,
  "EXP DATE" TEXT NULL,
  "WHO ISSUED POLICY" TEXT NULL,
  "NAME" TEXT NULL,
  "VEHICLE TYPE" TEXT NULL,
  "TYPE" TEXT NULL,
  "VEHICLE NO" TEXT NULL,
  "POLICY NO" TEXT NULL,
  "OD" TEXT NULL,
  "NET" BIGINT NULL,
  "GROSS" BIGINT NULL,
  "REFERENCE" TEXT NULL,
  "REFERENCE 2" TEXT NULL,
  "MB NO" TEXT NULL,
  "MAIL ID" TEXT NULL,
  "PAYMENT MODE" TEXT NULL,
  "COMPANY" TEXT NULL,
  "CC/GVW/SEATING" TEXT NULL,
  "REMARK" TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
) TABLESPACE pg_default;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_dkassociates_policy_no ON public.dkassociates_products("POLICY NO");
CREATE INDEX IF NOT EXISTS idx_dkassociates_customer_name ON public.dkassociates_products("NAME");
CREATE INDEX IF NOT EXISTS idx_dkassociates_vehicle_no ON public.dkassociates_products("VEHICLE NO");
CREATE INDEX IF NOT EXISTS idx_dkassociates_company ON public.dkassociates_products("COMPANY");
CREATE INDEX IF NOT EXISTS idx_dkassociates_policy_type ON public.dkassociates_products("TYPE");
CREATE INDEX IF NOT EXISTS idx_dkassociates_issue_date ON public.dkassociates_products("POLICY ISSUE DATE");
CREATE INDEX IF NOT EXISTS idx_dkassociates_exp_date ON public.dkassociates_products("EXP DATE");

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_dkassociates_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS update_dkassociates_products_updated_at_trigger ON public.dkassociates_products;
CREATE TRIGGER update_dkassociates_products_updated_at_trigger
    BEFORE UPDATE ON public.dkassociates_products
    FOR EACH ROW
    EXECUTE FUNCTION update_dkassociates_products_updated_at();

-- Add comments for documentation
COMMENT ON TABLE public.dkassociates_products IS 'Insurance policy records for DK Associates';
COMMENT ON COLUMN public.dkassociates_products.tm_ins_id IS 'Unique insurance policy ID';
COMMENT ON COLUMN public.dkassociates_products."POLICY ISSUE DATE" IS 'Date when policy was issued';
COMMENT ON COLUMN public.dkassociates_products."EXP DATE" IS 'Policy expiry date';
COMMENT ON COLUMN public.dkassociates_products."WHO ISSUED POLICY" IS 'Agent who issued the policy';
COMMENT ON COLUMN public.dkassociates_products."NAME" IS 'Customer/policyholder name';
COMMENT ON COLUMN public.dkassociates_products."POLICY NO" IS 'Unique policy number';
COMMENT ON COLUMN public.dkassociates_products."COMPANY" IS 'Insurance company name';

-- Insert sample data from the provided example
INSERT INTO public.dkassociates_products (
  "POLICY ISSUE DATE", "EXP DATE", "WHO ISSUED POLICY", "NAME", 
  "VEHICLE TYPE", "TYPE", "VEHICLE NO", "POLICY NO", 
  "OD", "NET", "GROSS", "REFERENCE", "REFERENCE 2", 
  "MB NO", "MAIL ID", "PAYMENT MODE", "COMPANY", "CC/GVW/SEATING", "REMARK"
) VALUES 
(
  '5/1/2022', '5/2/2023', 'SHIVARAM', 'KARIVEDA SAGAR REDDY',
  'CB SHINE', 'TW SOD', 'TS08GJ6784', 'VA136853',
  '196', 196, 231, 'CRR', 'SATHISH ANNA',
  NULL, NULL, 'ONLINE PAYMENT', 'FUTURE', '125', NULL
),
(
  '5/1/2022', '5/3/2023', 'VANITH ANNA', 'SIDDI VINAYAKA INDUSTRIAL GASES PVT LTD',
  'EICHER 11 10', 'GCV FULL', 'AP23Y3567', 'D057450305',
  '693', 18047, 20263, 'MRR', 'SATHISH ANNA',
  NULL, NULL, 'CUSTOMER ONLINE', 'DIGIT', '11950KG', NULL
),
(
  '5/1/2022', '5/3/2023', 'VANITH ANNA', 'SIDDI VINAYAKA INDUSTRIAL GASES PVT LTD',
  'EICHER 10 90', 'GCV FULL', 'AP23Y4477', 'D057450280',
  '525', 17879, 20065, 'MRR', 'SATHISH ANNA',
  NULL, NULL, 'CUSTOMER ONLINE', 'DIGIT', '8720KG', NULL
),
(
  '5/1/2022', '5/1/2023', 'NA', 'MALLAIAH THAVATAM',
  'PLEASURE', 'TW TP', 'AP29AL2272', 'D063502633',
  '802', 802, 946, 'NA', 'SATHISH ANNA',
  NULL, NULL, 'NA', 'DIGIT', '102', NULL
);

-- Verify the insertion
SELECT 
  tm_ins_id,
  "POLICY NO",
  "NAME",
  "VEHICLE TYPE",
  "COMPANY",
  "GROSS",
  "POLICY ISSUE DATE",
  "EXP DATE"
FROM public.dkassociates_products
ORDER BY tm_ins_id DESC
LIMIT 10;

-- Display statistics
SELECT 
  COUNT(*) as total_policies,
  SUM("GROSS") as total_premium,
  AVG("GROSS") as avg_premium,
  COUNT(DISTINCT "COMPANY") as total_companies
FROM public.dkassociates_products;

