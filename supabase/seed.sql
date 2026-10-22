-- ====================================================================
-- RESTAURANT POS & BILLING SYSTEM - SEED DATA SCRIPT
-- Populates Meat Theory categories, menu products, tables & orders
-- ====================================================================

-- 1. Meat Theory Categories
INSERT INTO public.categories (id, name, emoji, display_order) VALUES
('c_curry', 'Beef Tawa Curry', '🍛', 1),
('c_beef_tikkas', 'Beef Tikkas', '🥩', 2),
('c_chicken_tikkas', 'Chicken Tikkas', '🍗', 3),
('c_roles_roti', 'Roles & Roti', '🌯', 4),
('c_beef_steaks', 'Beef Steaks', '🥩', 5),
('c_signatures', 'Signatures', '⭐', 6),
('c_chicken_tandoori', 'Chicken Tandoori', '🔥', 7),
('c_chinese', 'Chinese', '🥢', 8)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, emoji = EXCLUDED.emoji, display_order = EXCLUDED.display_order;

-- 2. Meat Theory Menu Products
INSERT INTO public.products (id, name, category_id, price, emoji, veg, available, description, sold_today) VALUES
-- Beef Tawa Curry
('p_curry_half', 'Beef Tawa Curry (Half)', 'c_curry', 70.00, '🍛', false, true, 'Slow-cooked spiced beef tawa curry - Half portion', 18),
('p_curry_full', 'Beef Tawa Curry (Full)', 'c_curry', 100.00, '🍛', false, true, 'Rich and hearty beef tawa curry - Full portion', 26),

-- Beef Tikkas
('p_bt_achari', 'Achari Beef Tikka', 'c_beef_tikkas', 99.00, '🥩', false, true, 'Tender beef chunks marinated in tangy achari pickle spices', 15),
('p_bt_hariyali', 'Hariyali Beef Tikka', 'c_beef_tikkas', 119.00, '🌿', false, true, 'Char-grilled beef tikka infused with mint and fresh herbs', 12),
('p_bt_malai', 'Malai Beef Tikka', 'c_beef_tikkas', 119.00, '🥩', false, true, 'Velvety, cream-marinated succulent beef skewers', 21),
('p_bt_afghani', 'Afghani Beef Tikka', 'c_beef_tikkas', 119.00, '🥩', false, true, 'Mild spiced cashew-cream traditional Afghani beef skewers', 14),
('p_bt_mixed', 'Mixed Beef Tikka', 'c_beef_tikkas', 149.00, '🥩', false, true, 'Assorted platter of chef special seasoned beef tikkas', 28),

-- Chicken Tikkas
('p_ct_achari', 'Achari Chicken Tikka', 'c_chicken_tikkas', 149.00, '🍗', false, true, 'Zesty pickling spice-rubbed grilled chicken morsels', 32),
('p_ct_hariyali', 'Hariyali Chicken Tikka', 'c_chicken_tikkas', 149.00, '🌿', false, true, 'Fresh green herb and coriander flame-roasted chicken', 19),
('p_ct_malai', 'Malai Chicken Tikka', 'c_chicken_tikkas', 149.00, '🍗', false, true, 'Melt-in-mouth creamy char-grilled boneless chicken', 36),
('p_ct_afghani', 'Afghani Chicken Tikka', 'c_chicken_tikkas', 149.00, '🍗', false, true, 'Rich, mildly spiced cashew and cream roasted chicken', 24),
('p_ct_mixed', 'Mixed Chicken Tikka', 'c_chicken_tikkas', 199.00, '🍗', false, true, 'Grand assortment of grilled chicken tikkas', 41),

-- Roles & Roti
('p_role_chicken', 'Chicken Seekh Role', 'c_roles_roti', 120.00, '🌯', false, true, 'Juicy chicken seekh kebab rolled in fresh rumali with mint dip', 48),
('p_role_beef', 'Beef Seekh Role', 'c_roles_roti', 110.00, '🌯', false, true, 'Spiced chargrilled beef seekh wrapped with sliced onions', 53),
('p_roti_rumali', 'Rumali Roti', 'c_roles_roti', 15.00, '🫓', true, true, 'Paper-thin, piping hot traditional rumali roti', 112),

-- Beef Steaks
('p_steak_sirloin', 'Sirlion Beef Steak', 'c_beef_steaks', 299.00, '🥩', false, true, 'Lean and juicy prime cut sirloin steak grilled with herb butter', 17),
('p_steak_ribeye', 'Rib Eye Beef Steak', 'c_beef_steaks', 399.00, '🥩', false, true, 'Richly marbled tender rib eye with smoky sear', 23),
('p_steak_tomjerry', 'Tom & Jerry Beef Steak', 'c_beef_steaks', 349.00, '🥩', false, true, 'House-special duo cut spiced beef steak sensation', 15),
('p_steak_tbone', 'T-Bone Beef Steak', 'c_beef_steaks', 449.00, '🥩', false, true, 'Classic robust cut with tenderloin and strip on the bone', 19),
('p_steak_tomahawk', 'Toma Hawk Beef Steak', 'c_beef_steaks', 549.00, '🥩', false, true, 'Showstopping massive bone-in long cut steak', 11),

-- Signatures
('p_sig_saucy_kadai', 'Saucy Kadai Beef Steak', 'c_signatures', 349.00, '🍲', false, true, 'Pan-seared beef steak tossed in spicy kadai gravy', 29),
('p_sig_chinese_pan_fry', 'Chinese Pan Fry Beef', 'c_signatures', 349.00, '🥘', false, true, 'Wok-seared beef strips glazed in dark oriental sauce', 34),
('p_sig_butter_malai', 'Butter Malai Beef Steak', 'c_signatures', 359.00, '🥩', false, true, 'Velvety butter-cream infused luscious beef steak', 26),
('p_sig_tandoori_chicken', 'Meat Theory Tandoori Chicken', 'c_signatures', 499.00, '🔥', false, true, 'Full signature fire-roasted clay oven spiced chicken', 38),

-- Chicken Tandoori
('p_tan_achari_qtr', 'Achari Tandoori (Qtr)', 'c_chicken_tandoori', 120.00, '🍗', false, true, 'Achari spiced chicken tandoori - Quarter', 14),
('p_tan_achari_half', 'Achari Tandoori (Half)', 'c_chicken_tandoori', 240.00, '🍗', false, true, 'Achari spiced chicken tandoori - Half', 22),
('p_tan_achari_full', 'Achari Tandoori (Full)', 'c_chicken_tandoori', 450.00, '🍗', false, true, 'Achari spiced chicken tandoori - Full bird', 16),
('p_tan_hariyali_qtr', 'Hariyali Tandoori (Qtr)', 'c_chicken_tandoori', 130.00, '🍗', false, true, 'Mint-herb coated chicken tandoori - Quarter', 11),
('p_tan_hariyali_half', 'Hariyali Tandoori (Half)', 'c_chicken_tandoori', 250.00, '🍗', false, true, 'Mint-herb coated chicken tandoori - Half', 17),
('p_tan_hariyali_full', 'Hariyali Tandoori (Full)', 'c_chicken_tandoori', 480.00, '🍗', false, true, 'Mint-herb coated chicken tandoori - Full bird', 15),
('p_tan_malai_qtr', 'Malai Tandori (Qtr)', 'c_chicken_tandoori', 140.00, '🍗', false, true, 'Creamy cardamom-scented malai tandoori - Quarter', 19),
('p_tan_malai_half', 'Malai Tandori (Half)', 'c_chicken_tandoori', 260.00, '🍗', false, true, 'Creamy cardamom-scented malai tandoori - Half', 25),
('p_tan_malai_full', 'Malai Tandori (Full)', 'c_chicken_tandoori', 449.00, '🍗', false, true, 'Creamy cardamom-scented malai tandoori - Full bird', 21),

-- Chinese
('p_ch_egg_rice', 'Egg Fried Rice', 'c_chinese', 99.00, '🍚', false, true, 'Wok-tossed basmati rice with eggs & scallions', 30),
('p_ch_chk_rice', 'Chicken Fried Rice', 'c_chinese', 140.00, '🍚', false, true, 'Classic Chinese wok rice with shredded chicken', 42),
('p_ch_chk_noodles', 'Chicken Fried Noodles', 'c_chinese', 140.00, '🍜', false, true, 'Stir-fried noodles with chicken, garlic & cabbage', 37),
('p_ch_chilly_chk', 'Chilly Chicken', 'c_chinese', 140.00, '🍗', false, true, 'Crispy chicken cubes tossed with chillies & soya glaze', 45),
('p_ch_beef_rice', 'Beef Fried Rice', 'c_chinese', 140.00, '🍚', false, true, 'Fragrant wok-fried rice with tender spiced beef cuts', 51),
('p_ch_beef_noodles', 'Beef Fried Noodles', 'c_chinese', 140.00, '🍜', false, true, 'Wok noodles tossed with spiced beef strips & veggies', 39),
('p_ch_chilly_beef', 'Chilly Beef', 'c_chinese', 149.00, '🥩', false, true, 'Fiery dry pan-fried beef with onions & green chillies', 56),
('p_ch_spl_beef_rice', 'Spl Beef Tawa Rice', 'c_chinese', 149.00, '🍛', false, true, 'Meat Theory special hot plate sizzled beef rice', 62),
('p_ch_spl_beef_kadai', 'Spl Beef Tawa Kadai', 'c_chinese', 149.00, '🥘', false, true, 'Chef''s special spicy wok-tossed beef kadai gravy', 47)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, available = EXCLUDED.available, name = EXCLUDED.name, description = EXCLUDED.description;

-- 3. Restaurant Tables
INSERT INTO public.restaurant_tables (id, name, seats, status) VALUES
('t1', 'T01', 2, 'available'),
('t2', 'T02', 4, 'available'),
('t3', 'T03', 4, 'available'),
('t4', 'T04', 6, 'available'),
('t5', 'T05', 2, 'available'),
('t6', 'T06', 4, 'available'),
('t7', 'T07', 8, 'available'),
('t8', 'T08', 4, 'available'),
('t9', 'T09', 2, 'available'),
('t10', 'T10', 6, 'available'),
('t11', 'T11', 4, 'available'),
('t12', 'T12', 2, 'available')
ON CONFLICT (id) DO NOTHING;
