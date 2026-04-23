-- ============================================================
-- Novure E-Commerce — Database Schema
-- Run this script in your MySQL client to set up the DB.
-- ============================================================

CREATE DATABASE IF NOT EXISTS novure_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE novure_db;

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255)   NOT NULL,
  description TEXT,
  category    ENUM('tees', 'jeans', 'accessories') NOT NULL DEFAULT 'tees',
  price       DECIMAL(10,2)  NOT NULL,
  rating      TINYINT        NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  sizes       VARCHAR(100)   DEFAULT 'S - XXL',
  image       VARCHAR(500)   NOT NULL,
  colors      JSON,          -- e.g. ["#e8e8e8","#333333"]
  in_stock    BOOLEAN        NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
);

-- Seed data
INSERT INTO products (name, description, category, price, rating, sizes, image, colors) VALUES
('Boxy Sage Green Tee',       'Ultra-soft modal blend with a relaxed boxy silhouette. Perfect for layering or wearing solo.', 'tees',  250.00, 5, 'S - XXL', '/images/model1.jpg', '["#8da38a","#e8e8e8","#333333"]'),
('Charcoal Heavyweight Tee',  'Dense 280gsm cotton for a structured look that keeps its shape wash after wash.',              'tees',  350.00, 4, 'M - XXL', '/images/model2.jpg', '["#333333","#7a7a7a"]'),
('Classic White Boxy Fit',    'The essential wardrobe anchor. Enzyme-washed for instant softness.',                           'tees',  500.00, 5, 'S - L',   '/images/model3.jpg', '["#e8e8e8","#f5f5f3"]'),
('Earth Brown Loose Tee',     'Earthy pigment-dyed cotton that deepens in colour with every wash.',                           'tees',  280.00, 4, 'S - XL',  '/images/tees2.png',  '["#6b4423","#8d6240"]'),
('Vintage Grey Oversized',    'Pre-distressed for that lived-in look straight out of the box.',                               'tees',  320.00, 5, 'S - XXL', '/images/tees4.png',  '["#7a7a7a","#555555"]'),
('Blue Baggy Denim',          'Japanese selvedge denim with a relaxed baggy cut. Sanforized for minimal shrinkage.',         'jeans', 890.00, 5, 'W28 - W36','/images/jeans1.png', '["#2b4c7e","#5b84b1"]'),
('Washed Black Denim',        'Raw black denim pre-washed to a rich, deep fade. Tapered leg, full comfort waistband.',       'jeans', 950.00, 4, 'W28 - W34','/images/jeans2.png', '["#1a1a1a","#2d2d2d"]'),
('Light Wash Straight Denim', 'Cloud-washed straight leg for an easy, effortless everyday look.',                            'jeans', 820.00, 5, 'W30 - W36','/images/jeans3.png', '["#5b84b1","#8aaed4"]');
