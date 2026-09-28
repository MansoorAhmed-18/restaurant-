-- ====================================================================
-- RESTAURANT POS & BILLING SYSTEM - SUPABASE DATABASE SCHEMA
-- Designed for complete billing operations & Power BI analytics
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. RESTAURANT SETTINGS & BILLING METADATA
CREATE TABLE IF NOT EXISTS public.restaurant_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL DEFAULT 'Tadka POS - Spice Route Kitchen',
    address TEXT DEFAULT '123 MG Road, Indiranagar, Bengaluru, Karnataka 560038',
    phone VARCHAR(50) DEFAULT '+91 98765 43210',
    email VARCHAR(100) DEFAULT 'contact@spiceroute.com',
    gstin VARCHAR(50) DEFAULT '29AAAAA0000A1Z5',
    tax_rate DECIMAL(5, 2) DEFAULT 5.00, -- 5% GST
    currency VARCHAR(10) DEFAULT 'INR',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert Default Restaurant Info if empty
INSERT INTO public.restaurant_info (name, address, phone, email, gstin, tax_rate)
SELECT 'Tadka POS - Spice Route Kitchen', '123 MG Road, Indiranagar, Bengaluru, Karnataka 560038', '+91 98765 43210', 'billing@spiceroute.com', '29ABCDE1234F1Z5', 5.00
WHERE NOT EXISTS (SELECT 1 FROM public.restaurant_info);

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    emoji VARCHAR(10) DEFAULT '🍽️',
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCTS / MENU ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    emoji VARCHAR(10) DEFAULT '🍲',
    veg BOOLEAN DEFAULT TRUE,
    available BOOLEAN DEFAULT TRUE,
    description TEXT,
    sold_today INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABLES MANAGEMENT
CREATE TABLE IF NOT EXISTS public.restaurant_tables (
    id TEXT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    seats INT DEFAULT 4,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'reserved')),
    order_id TEXT,
    reserved_for VARCHAR(100),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS public.customers (
    id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255),
    visits INT DEFAULT 1,
    total_spent DECIMAL(12, 2) DEFAULT 0.00,
    last_visit TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ORDERS TABLE (BILLING LEDGER)
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    number INT UNIQUE NOT NULL,
    table_id TEXT REFERENCES public.restaurant_tables(id) ON DELETE SET NULL,
    customer_id TEXT REFERENCES public.customers(id) ON DELETE SET NULL,
    subtotal DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    tax DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    total DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'completed', 'cancelled')),
    payment_status VARCHAR(20) DEFAULT 'unpaid' CHECK (payment_status IN ('paid', 'unpaid', 'refunded')),
    payment_method VARCHAR(20) CHECK (payment_method IN ('cash', 'card', 'upi')),
    order_type VARCHAR(20) DEFAULT 'dine-in' CHECK (order_type IN ('dine-in', 'takeaway')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ORDER ITEMS TABLE (LINE ITEMS)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    qty INT NOT NULL DEFAULT 1,
    subtotal DECIMAL(10, 2) GENERATED ALWAYS AS (price * qty) STORED,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- POWER BI ANALYTICAL VIEWS
-- Connect Power BI to Supabase PostgreSQL & directly query these views!
-- ====================================================================

-- View 1: Power BI Daily Earnings & Revenue Summary
CREATE OR REPLACE VIEW public.v_powerbi_daily_earnings AS
SELECT 
    DATE(created_at) AS order_date,
    COUNT(id) AS total_orders,
    SUM(CASE WHEN payment_status = 'paid' THEN 1 ELSE 0 END) AS paid_orders,
    SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled_orders,
    COALESCE(SUM(CASE WHEN payment_status = 'paid' THEN subtotal ELSE 0 END), 0) AS gross_sales,
    COALESCE(SUM(CASE WHEN payment_status = 'paid' THEN tax ELSE 0 END), 0) AS total_tax_collected,
    COALESCE(SUM(CASE WHEN payment_status = 'paid' THEN total ELSE 0 END), 0) AS total_net_earnings,
    COALESCE(AVG(CASE WHEN payment_status = 'paid' THEN total ELSE NULL END), 0) AS avg_order_value
FROM public.orders
GROUP BY DATE(created_at)
ORDER BY order_date DESC;

-- View 2: Power BI Hourly Sales Trend (Today & Historical)
CREATE OR REPLACE VIEW public.v_powerbi_hourly_earnings AS
SELECT 
    DATE(created_at) AS order_date,
    EXTRACT(HOUR FROM created_at) AS hour_of_day,
    TO_CHAR(created_at, 'HH12 AM') AS hour_formatted,
    COUNT(id) AS total_orders,
    COALESCE(SUM(total), 0) AS hourly_sales
FROM public.orders
WHERE payment_status = 'paid'
GROUP BY DATE(created_at), EXTRACT(HOUR FROM created_at), TO_CHAR(created_at, 'HH12 AM')
ORDER BY order_date DESC, hour_of_day ASC;

-- View 3: Power BI Category Performance
CREATE OR REPLACE VIEW public.v_powerbi_sales_by_category AS
SELECT 
    COALESCE(c.name, 'Uncategorized') AS category_name,
    COALESCE(c.emoji, '🍽️') AS category_emoji,
    SUM(oi.qty) AS items_sold,
    COALESCE(SUM(oi.price * oi.qty), 0) AS category_revenue
FROM public.order_items oi
JOIN public.orders o ON oi.order_id = o.id
LEFT JOIN public.products p ON oi.product_id = p.id
LEFT JOIN public.categories c ON p.category_id = c.id
WHERE o.payment_status = 'paid'
GROUP BY c.id, c.name, c.emoji
ORDER BY category_revenue DESC;

-- View 4: Power BI Top Selling Dishes
CREATE OR REPLACE VIEW public.v_powerbi_top_dishes AS
SELECT 
    oi.name AS item_name,
    p.emoji AS item_emoji,
    c.name AS category_name,
    SUM(oi.qty) AS total_quantity_sold,
    COALESCE(SUM(oi.price * oi.qty), 0) AS total_item_revenue,
    p.price AS current_unit_price
FROM public.order_items oi
JOIN public.orders o ON oi.order_id = o.id
LEFT JOIN public.products p ON oi.product_id = p.id
LEFT JOIN public.categories c ON p.category_id = c.id
WHERE o.payment_status = 'paid'
GROUP BY oi.name, p.emoji, c.name, p.price
ORDER BY total_quantity_sold DESC;

-- View 5: Power BI Payment Method Summary (Cash vs Card vs UPI)
CREATE OR REPLACE VIEW public.v_powerbi_payment_summary AS
SELECT 
    COALESCE(payment_method, 'unassigned') AS payment_method,
    COUNT(id) AS transaction_count,
    COALESCE(SUM(total), 0) AS total_collected
FROM public.orders
WHERE payment_status = 'paid'
GROUP BY payment_method;

-- View 6: Power BI Dine-In vs Takeaway Comparison
CREATE OR REPLACE VIEW public.v_powerbi_order_type_breakdown AS
SELECT 
    order_type,
    COUNT(id) AS order_count,
    COALESCE(SUM(total), 0) AS total_revenue,
    COALESCE(AVG(total), 0) AS avg_bill_amount
FROM public.orders
WHERE payment_status = 'paid'
GROUP BY order_type;

-- View 7: Power BI Customer VIP & Spending Analytics
CREATE OR REPLACE VIEW public.v_powerbi_customer_analytics AS
SELECT 
    c.id AS customer_id,
    c.name AS customer_name,
    c.phone AS customer_phone,
    c.visits AS total_visits,
    c.total_spent AS lifetime_spent,
    c.last_visit,
    COUNT(o.id) AS total_paid_orders
FROM public.customers c
LEFT JOIN public.orders o ON o.customer_id = c.id AND o.payment_status = 'paid'
GROUP BY c.id, c.name, c.phone, c.visits, c.total_spent, c.last_visit
ORDER BY c.total_spent DESC;

-- View 8: Power BI Monthly Revenue & Sales Trends
CREATE OR REPLACE VIEW public.v_powerbi_monthly_earnings AS
SELECT 
    EXTRACT(YEAR FROM created_at) AS sales_year,
    EXTRACT(MONTH FROM created_at) AS month_number,
    TO_CHAR(created_at, 'Month YYYY') AS month_year_formatted,
    COUNT(id) AS total_orders,
    COALESCE(SUM(subtotal), 0) AS gross_sales,
    COALESCE(SUM(tax), 0) AS total_tax,
    COALESCE(SUM(total), 0) AS total_monthly_revenue,
    COALESCE(AVG(total), 0) AS avg_order_value
FROM public.orders
WHERE payment_status = 'paid'
GROUP BY EXTRACT(YEAR FROM created_at), EXTRACT(MONTH FROM created_at), TO_CHAR(created_at, 'Month YYYY')
ORDER BY sales_year DESC, month_number DESC;

-- Row Level Security (RLS) policies - enable public access for anon key (can be customized)
ALTER TABLE public.restaurant_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON public.restaurant_info FOR SELECT USING (true);
CREATE POLICY "Allow public all access" ON public.categories FOR ALL USING (true);
CREATE POLICY "Allow public all access" ON public.products FOR ALL USING (true);
CREATE POLICY "Allow public all access" ON public.restaurant_tables FOR ALL USING (true);
CREATE POLICY "Allow public all access" ON public.customers FOR ALL USING (true);
CREATE POLICY "Allow public all access" ON public.orders FOR ALL USING (true);
CREATE POLICY "Allow public all access" ON public.order_items FOR ALL USING (true);

-- Seed Data insertion script available in project repository
