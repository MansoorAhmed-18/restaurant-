-- ====================================================================
-- RESTAURANT POS & BILLING SYSTEM - SEED DATA SCRIPT
-- Populates initial categories, menu products, tables & orders
-- ====================================================================

-- Categories
INSERT INTO public.categories (id, name, emoji, display_order) VALUES
('c1', 'Starters', '🥟', 1),
('c2', 'Biryani', '🍛', 2),
('c3', 'Main Course', '🍲', 3),
('c4', 'Breads', '🫓', 4),
('c5', 'Beverages', '🥤', 5),
('c6', 'Desserts', '🍨', 6)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, emoji = EXCLUDED.emoji;

-- Products
INSERT INTO public.products (id, name, category_id, price, emoji, veg, available, sold_today) VALUES
('p1', 'Paneer Tikka', 'c1', 240.00, '🧀', true, true, 34),
('p2', 'Chicken 65', 'c1', 280.00, '🍗', false, true, 41),
('p3', 'Veg Spring Rolls', 'c1', 180.00, '🥟', true, true, 12),
('p4', 'Hyderabadi Chicken Biryani', 'c2', 320.00, '🍛', false, true, 58),
('p5', 'Mutton Dum Biryani', 'c2', 420.00, '🍖', false, true, 22),
('p6', 'Veg Biryani', 'c2', 240.00, '🍚', true, true, 19),
('p7', 'Butter Chicken', 'c3', 340.00, '🍲', false, true, 37),
('p8', 'Dal Makhani', 'c3', 220.00, '🥘', true, true, 29),
('p9', 'Kadai Paneer', 'c3', 260.00, '🍛', true, false, 8),
('p10', 'Butter Naan', 'c4', 50.00, '🫓', true, true, 96),
('p11', 'Garlic Naan', 'c4', 60.00, '🧄', true, true, 71),
('p12', 'Tandoori Roti', 'c4', 30.00, '🫓', true, true, 44),
('p13', 'Mango Lassi', 'c5', 120.00, '🥭', true, true, 33),
('p14', 'Masala Chai', 'c5', 40.00, '☕', true, true, 52),
('p15', 'Fresh Lime Soda', 'c5', 90.00, '🍋', true, true, 26),
('p16', 'Gulab Jamun', 'c6', 110.00, '🍡', true, true, 31),
('p17', 'Rasmalai', 'c6', 140.00, '🍮', true, true, 18)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, available = EXCLUDED.available;

-- Tables
INSERT INTO public.restaurant_tables (id, name, seats, status) VALUES
('t1', 'T01', 2, 'available'),
('t2', 'T02', 4, 'occupied'),
('t3', 'T03', 4, 'reserved'),
('t4', 'T04', 6, 'occupied'),
('t5', 'T05', 2, 'available'),
('t6', 'T06', 4, 'available'),
('t7', 'T07', 8, 'reserved'),
('t8', 'T08', 4, 'occupied'),
('t9', 'T09', 2, 'available'),
('t10', 'T10', 6, 'occupied'),
('t11', 'T11', 4, 'available'),
('t12', 'T12', 2, 'available')
ON CONFLICT (id) DO NOTHING;

-- Customers
INSERT INTO public.customers (id, name, phone, email, visits, total_spent) VALUES
('u1', 'Aarav Sharma', '+91 98450 12345', 'aarav@mail.com', 14, 12840.00),
('u2', 'Priya Nair', '+91 99001 22334', 'priya.n@mail.com', 9, 7420.00),
('u3', 'Rohan Gupta', '+91 90080 55667', NULL, 3, 2150.00),
('u4', 'Ananya Iyer', '+91 97411 88990', 'ananya@mail.com', 21, 19870.00),
('u5', 'Kabir Mehta', '+91 98860 44321', NULL, 6, 4960.00),
('u6', 'Sneha Reddy', '+91 91234 56780', 'sneha.r@mail.com', 11, 9310.00)
ON CONFLICT (id) DO NOTHING;

-- Orders
INSERT INTO public.orders (id, number, table_id, customer_id, subtotal, tax, total, status, payment_status, payment_method, order_type, created_at) VALUES
('o1042', 1042, 't2', 'u1', 1030.00, 51.50, 1081.50, 'preparing', 'unpaid', NULL, 'dine-in', NOW() - INTERVAL '15 minutes'),
('o1041', 1041, 't4', 'u4', 540.00, 27.00, 567.00, 'pending', 'unpaid', NULL, 'dine-in', NOW() - INTERVAL '30 minutes'),
('o1040', 1040, 't8', NULL, 700.00, 35.00, 735.00, 'pending', 'unpaid', NULL, 'dine-in', NOW() - INTERVAL '45 minutes'),
('o1039', 1039, 't10', 'u2', 580.00, 29.00, 609.00, 'preparing', 'unpaid', NULL, 'dine-in', NOW() - INTERVAL '1 hour'),
('o1038', 1038, NULL, 'u3', 540.00, 27.00, 567.00, 'completed', 'paid', 'cash', 'takeaway', NOW() - INTERVAL '2 hours'),
('o1037', 1037, NULL, 'u6', 660.00, 33.00, 693.00, 'completed', 'paid', 'card', 'takeaway', NOW() - INTERVAL '3 hours'),
('o1036', 1036, NULL, NULL, 360.00, 18.00, 378.00, 'cancelled', 'refunded', 'upi', 'takeaway', NOW() - INTERVAL '4 hours'),
('o1035', 1035, 't3', 'u4', 1200.00, 60.00, 1260.00, 'completed', 'paid', 'upi', 'dine-in', NOW() - INTERVAL '5 hours'),
('o1034', 1034, NULL, 'u5', 480.00, 24.00, 504.00, 'completed', 'paid', 'cash', 'takeaway', NOW() - INTERVAL '6 hours')
ON CONFLICT (id) DO NOTHING;

-- Order Items
INSERT INTO public.order_items (order_id, product_id, name, price, qty) VALUES
('o1042', 'p4', 'Hyderabadi Chicken Biryani', 320.00, 2),
('o1042', 'p10', 'Butter Naan', 50.00, 3),
('o1042', 'p13', 'Mango Lassi', 120.00, 2),
('o1041', 'p7', 'Butter Chicken', 340.00, 1),
('o1041', 'p11', 'Garlic Naan', 60.00, 2),
('o1041', 'p14', 'Masala Chai', 40.00, 2),
('o1038', 'p4', 'Hyderabadi Chicken Biryani', 320.00, 1),
('o1038', 'p16', 'Gulab Jamun', 110.00, 2),
('o1035', 'p7', 'Butter Chicken', 340.00, 2),
('o1035', 'p11', 'Garlic Naan', 60.00, 4),
('o1035', 'p17', 'Rasmalai', 140.00, 2);
