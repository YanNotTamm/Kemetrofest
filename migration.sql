-- KeMetroFest Database Schema
-- Generated for migration from LocalStorage to SQL (PostgreSQL/MySQL)

-- 1. Settings Table (Store as one row or key-value pairs)
-- Using one row for simplicity as it's a small set of singleton config
CREATE TABLE IF NOT EXISTS settings (
    id INT PRIMARY KEY DEFAULT 1,
    event_name VARCHAR(255),
    event_tagline TEXT,
    start_date DATE,
    end_date DATE,
    start_time TIME,
    end_time TIME,
    location_name VARCHAR(255),
    location_address TEXT,
    logo_image TEXT, -- Base64 or URL
    hero_image TEXT,
    about_image TEXT,
    experience_image TEXT,
    form_image TEXT,
    slot_image TEXT,
    whatsapp_number VARCHAR(20),
    email VARCHAR(255),
    bank_name VARCHAR(100),
    bank_account VARCHAR(50),
    bank_holder VARCHAR(100),
    about_badge VARCHAR(50),
    about_title VARCHAR(255),
    about_description TEXT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    instagram_url TEXT,
    youtube_url TEXT,
    facebook_url TEXT,
    show_instagram BOOLEAN DEFAULT TRUE,
    show_youtube BOOLEAN DEFAULT TRUE,
    show_facebook BOOLEAN DEFAULT TRUE,
    registration_deadline DATE,
    organizer_name VARCHAR(255),
    wa_template_partner TEXT,
    wa_template_media TEXT,
    wa_template_tenant TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Slots Config Table
CREATE TABLE IF NOT EXISTS slots (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    total_slots INT NOT NULL DEFAULT 0,
    position TEXT,
    image TEXT,
    available BOOLEAN DEFAULT TRUE
);

-- 3. Partnership Tiers Table
CREATE TABLE IF NOT EXISTS partnership_tiers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50), -- 'crown', 'gem', 'award'
    color VARCHAR(50),
    benefits TEXT,
    price VARCHAR(100)
);

-- 4. Experiences Table (The newly added feature)
CREATE TABLE IF NOT EXISTS experiences (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    series VARCHAR(100),
    description TEXT,
    image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Media Partners Table
CREATE TABLE IF NOT EXISTS media_partners (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo TEXT
);

-- 6. Tenant Submissions Table
CREATE TABLE IF NOT EXISTS tenants (
    id VARCHAR(50) PRIMARY KEY,
    business_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    category VARCHAR(100),
    block_id VARCHAR(50) REFERENCES slots(id),
    assigned_slot VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Partners Data (Sponsors/Media Partners)
CREATE TABLE IF NOT EXISTS partners (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(20), -- 'media', 'sponsor'
    tier_id VARCHAR(50) REFERENCES partnership_tiers(id),
    contact_person VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    logo TEXT,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive'
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
