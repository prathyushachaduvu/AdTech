--
-- PostgreSQL database dump
--

-- Dumped from database version 15.13
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: enum_Analytics_period; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Analytics_period" AS ENUM (
    'hourly',
    'daily',
    'weekly',
    'monthly'
);


ALTER TYPE public."enum_Analytics_period" OWNER TO postgres;

--
-- Name: enum_analyses_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_analyses_status AS ENUM (
    'pending',
    'processing',
    'completed',
    'failed'
);


ALTER TYPE public.enum_analyses_status OWNER TO postgres;

--
-- Name: enum_analyses_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_analyses_type AS ENUM (
    'text',
    'url',
    'image',
    'bulk'
);


ALTER TYPE public.enum_analyses_type OWNER TO postgres;

--
-- Name: enum_assets_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_assets_status AS ENUM (
    'uploading',
    'processing',
    'ready',
    'error',
    'deleted'
);


ALTER TYPE public.enum_assets_status OWNER TO postgres;

--
-- Name: enum_assets_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_assets_type AS ENUM (
    'image',
    'video',
    'audio',
    'document',
    'other'
);


ALTER TYPE public.enum_assets_type OWNER TO postgres;

--
-- Name: enum_billing_info_card_brand; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_billing_info_card_brand AS ENUM (
    'visa',
    'mastercard',
    'amex',
    'discover',
    'other'
);


ALTER TYPE public.enum_billing_info_card_brand OWNER TO postgres;

--
-- Name: enum_billing_info_payment_method_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_billing_info_payment_method_type AS ENUM (
    'credit_card',
    'debit_card',
    'bank_transfer',
    'paypal',
    'stripe'
);


ALTER TYPE public.enum_billing_info_payment_method_type OWNER TO postgres;

--
-- Name: enum_campaigns_budget_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_campaigns_budget_type AS ENUM (
    'daily',
    'lifetime',
    'monthly'
);


ALTER TYPE public.enum_campaigns_budget_type OWNER TO postgres;

--
-- Name: enum_campaigns_objective; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_campaigns_objective AS ENUM (
    'awareness',
    'consideration',
    'conversions',
    'traffic',
    'engagement',
    'app_installs'
);


ALTER TYPE public.enum_campaigns_objective OWNER TO postgres;

--
-- Name: enum_campaigns_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_campaigns_status AS ENUM (
    'draft',
    'pending',
    'active',
    'paused',
    'completed',
    'cancelled'
);


ALTER TYPE public.enum_campaigns_status OWNER TO postgres;

--
-- Name: enum_campaigns_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_campaigns_type AS ENUM (
    'display',
    'video',
    'social',
    'search',
    'native',
    'email'
);


ALTER TYPE public.enum_campaigns_type OWNER TO postgres;

--
-- Name: enum_files_access_level; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_files_access_level AS ENUM (
    'private',
    'shared',
    'public'
);


ALTER TYPE public.enum_files_access_level OWNER TO postgres;

--
-- Name: enum_files_cdn_provider; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_files_cdn_provider AS ENUM (
    'aws_s3',
    'cloudflare',
    'local'
);


ALTER TYPE public.enum_files_cdn_provider OWNER TO postgres;

--
-- Name: enum_files_file_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_files_file_type AS ENUM (
    'image',
    'video',
    'document',
    'audio',
    'other'
);


ALTER TYPE public.enum_files_file_type OWNER TO postgres;

--
-- Name: enum_files_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_files_status AS ENUM (
    'uploading',
    'processing',
    'ready',
    'error',
    'quarantined'
);


ALTER TYPE public.enum_files_status OWNER TO postgres;

--
-- Name: enum_targeting_frequency_period; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_targeting_frequency_period AS ENUM (
    'hour',
    'day',
    'week',
    'month'
);


ALTER TYPE public.enum_targeting_frequency_period OWNER TO postgres;

--
-- Name: enum_targeting_gender; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_targeting_gender AS ENUM (
    'all',
    'male',
    'female',
    'other'
);


ALTER TYPE public.enum_targeting_gender OWNER TO postgres;

--
-- Name: enum_targeting_location_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_targeting_location_type AS ENUM (
    'include',
    'exclude'
);


ALTER TYPE public.enum_targeting_location_type OWNER TO postgres;

--
-- Name: enum_user_profiles_company_size; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_user_profiles_company_size AS ENUM (
    '1-10',
    '11-50',
    '51-200',
    '201-500',
    '501-1000',
    '1000+'
);


ALTER TYPE public.enum_user_profiles_company_size OWNER TO postgres;

--
-- Name: enum_user_profiles_gender; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_user_profiles_gender AS ENUM (
    'male',
    'female',
    'other',
    'prefer_not_to_say'
);


ALTER TYPE public.enum_user_profiles_gender OWNER TO postgres;

--
-- Name: enum_users_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_users_role AS ENUM (
    'user',
    'admin',
    'moderator'
);


ALTER TYPE public.enum_users_role OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Analytics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Analytics" (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    campaign_id uuid NOT NULL,
    date date NOT NULL,
    period public."enum_Analytics_period" DEFAULT 'daily'::public."enum_Analytics_period" NOT NULL,
    impressions integer DEFAULT 0 NOT NULL,
    clicks integer DEFAULT 0 NOT NULL,
    conversions integer DEFAULT 0 NOT NULL,
    spend numeric(10,2) DEFAULT 0 NOT NULL,
    ctr numeric(5,4) DEFAULT 0 NOT NULL,
    cpc numeric(10,2) DEFAULT 0 NOT NULL,
    cpm numeric(10,2) DEFAULT 0 NOT NULL,
    conversion_rate numeric(5,4) DEFAULT 0 NOT NULL,
    unique_users integer DEFAULT 0 NOT NULL,
    sessions integer DEFAULT 0 NOT NULL,
    bounce_rate numeric(5,4) DEFAULT 0 NOT NULL,
    avg_session_duration integer DEFAULT 0 NOT NULL,
    geographic_data jsonb,
    device_data jsonb,
    source_data jsonb,
    custom_metrics jsonb,
    processed boolean DEFAULT false NOT NULL,
    last_updated timestamp with time zone NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public."Analytics" OWNER TO postgres;

--
-- Name: COLUMN "Analytics".user_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Analytics".user_id IS 'User who owns this analytics data';


--
-- Name: COLUMN "Analytics".campaign_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Analytics".campaign_id IS 'Associated campaign';


--
-- Name: COLUMN "Analytics".date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Analytics".date IS 'Date of the analytics data';


--
-- Name: COLUMN "Analytics".period; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Analytics".period IS 'Time period for the analytics';


--
-- Name: COLUMN "Analytics".impressions; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Analytics".impressions IS 'Number of impressions';


--
-- Name: COLUMN "Analytics".clicks; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Analytics".clicks IS 'Number of clicks';


--
-- Name: COLUMN "Analytics".conversions; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Analytics".conversions IS 'Number of conversions';


--
-- Name: COLUMN "Analytics".spend; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Analytics".spend IS 'Amount spent';


--
-- Name: COLUMN "Analytics".ctr; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Analytics".ctr IS 'Click-through rate';


--
-- Name: COLUMN "Analytics".cpc; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Analytics".cpc IS 'Cost per click';


--
-- Name: COLUMN "Analytics".cpm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Analytics".cpm IS 'Cost per thousand impressions';


--
-- Name: COLUMN "Analytics".conversion_rate; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Analytics".conversion_rate IS 'Conversion rate';


--
-- Name: COLUMN "Analytics".unique_users; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Analytics".unique_users IS 'Number of unique users';


--
-- Name: COLUMN "Analytics".sessions; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Analytics".sessions IS 'Number of sessions';


--
-- Name: COLUMN "Analytics".bounce_rate; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Analytics".bounce_rate IS 'Bounce rate';


--
-- Name: COLUMN "Analytics".avg_session_duration; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Analytics".avg_session_duration IS 'Average session duration in seconds';


--
-- Name: COLUMN "Analytics".geographic_data; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Analytics".geographic_data IS 'Geographic distribution of users';


--
-- Name: COLUMN "Analytics".device_data; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Analytics".device_data IS 'Device type distribution';


--
-- Name: COLUMN "Analytics".source_data; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Analytics".source_data IS 'Traffic source distribution';


--
-- Name: COLUMN "Analytics".custom_metrics; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Analytics".custom_metrics IS 'Custom metrics specific to the campaign';


--
-- Name: COLUMN "Analytics".processed; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Analytics".processed IS 'Whether the data has been processed';


--
-- Name: COLUMN "Analytics".last_updated; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Analytics".last_updated IS 'Last time the analytics were updated';


--
-- Name: Events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Events" (
    id uuid NOT NULL,
    event_type character varying(255) NOT NULL,
    campaign_id uuid NOT NULL,
    user_id uuid,
    "timestamp" timestamp with time zone NOT NULL,
    metadata jsonb,
    processed boolean DEFAULT false NOT NULL,
    session_id character varying(255),
    ip_address character varying(255),
    user_agent text,
    referrer character varying(255),
    location jsonb,
    device_info jsonb,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public."Events" OWNER TO postgres;

--
-- Name: COLUMN "Events".event_type; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Events".event_type IS 'Type of event (impression, click, conversion, etc.)';


--
-- Name: COLUMN "Events".campaign_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Events".campaign_id IS 'Associated campaign ID';


--
-- Name: COLUMN "Events".user_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Events".user_id IS 'User who triggered the event (nullable for anonymous events)';


--
-- Name: COLUMN "Events"."timestamp"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Events"."timestamp" IS 'When the event occurred';


--
-- Name: COLUMN "Events".metadata; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Events".metadata IS 'Additional event data (user agent, IP, etc.)';


--
-- Name: COLUMN "Events".processed; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Events".processed IS 'Whether the event has been processed by analytics';


--
-- Name: COLUMN "Events".session_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Events".session_id IS 'Session identifier for grouping related events';


--
-- Name: COLUMN "Events".ip_address; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Events".ip_address IS 'IP address of the event source';


--
-- Name: COLUMN "Events".user_agent; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Events".user_agent IS 'User agent string';


--
-- Name: COLUMN "Events".referrer; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Events".referrer IS 'Referrer URL';


--
-- Name: COLUMN "Events".location; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Events".location IS 'Geographic location data';


--
-- Name: COLUMN "Events".device_info; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Events".device_info IS 'Device information (browser, OS, etc.)';


--
-- Name: analyses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.analyses (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    campaign_id uuid NOT NULL,
    type public.enum_analyses_type NOT NULL,
    content text NOT NULL,
    results jsonb NOT NULL,
    options jsonb DEFAULT '{}'::jsonb,
    status public.enum_analyses_status DEFAULT 'completed'::public.enum_analyses_status,
    processing_time integer,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.analyses OWNER TO postgres;

--
-- Name: assets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assets (
    id uuid NOT NULL,
    campaign_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    original_name character varying(255) NOT NULL,
    file_name character varying(255) NOT NULL,
    file_path character varying(500) NOT NULL,
    file_size integer NOT NULL,
    mime_type character varying(100) NOT NULL,
    file_extension character varying(10) NOT NULL,
    type public.enum_assets_type NOT NULL,
    width integer,
    height integer,
    duration integer,
    thumbnail_path character varying(500),
    thumbnail_width integer,
    thumbnail_height integer,
    status public.enum_assets_status DEFAULT 'uploading'::public.enum_assets_status,
    processing_status json DEFAULT '{}'::json,
    is_active boolean DEFAULT true,
    is_public boolean DEFAULT false,
    tags json DEFAULT '[]'::json,
    categories json DEFAULT '[]'::json,
    usage_count integer DEFAULT 0,
    last_used timestamp with time zone,
    user_id uuid NOT NULL,
    settings json DEFAULT '{}'::json,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.assets OWNER TO postgres;

--
-- Name: COLUMN assets.file_size; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.assets.file_size IS 'File size in bytes';


--
-- Name: COLUMN assets.width; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.assets.width IS 'Width in pixels (for images/videos)';


--
-- Name: COLUMN assets.height; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.assets.height IS 'Height in pixels (for images/videos)';


--
-- Name: COLUMN assets.duration; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.assets.duration IS 'Duration in seconds (for videos/audio)';


--
-- Name: COLUMN assets.processing_status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.assets.processing_status IS 'Processing status and metadata';


--
-- Name: COLUMN assets.usage_count; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.assets.usage_count IS 'Number of times this asset has been used';


--
-- Name: billing_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.billing_info (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    payment_method_type public.enum_billing_info_payment_method_type NOT NULL,
    payment_method_name character varying(255) NOT NULL,
    card_last_four character varying(255),
    card_brand public.enum_billing_info_card_brand,
    card_expiry_month integer,
    card_expiry_year integer,
    billing_name character varying(255) NOT NULL,
    billing_email character varying(255) NOT NULL,
    billing_phone character varying(255),
    billing_address_line1 character varying(255) NOT NULL,
    billing_address_line2 character varying(255),
    billing_city character varying(255) NOT NULL,
    billing_state character varying(255) NOT NULL,
    billing_postal_code character varying(255) NOT NULL,
    billing_country character varying(255) NOT NULL,
    tax_id character varying(255),
    tax_exempt boolean DEFAULT false,
    payment_gateway_id character varying(255),
    payment_gateway_customer_id character varying(255),
    is_default boolean DEFAULT false,
    is_active boolean DEFAULT true,
    notes text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.billing_info OWNER TO postgres;

--
-- Name: campaigns; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.campaigns (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    status public.enum_campaigns_status DEFAULT 'draft'::public.enum_campaigns_status NOT NULL,
    type public.enum_campaigns_type NOT NULL,
    objective public.enum_campaigns_objective NOT NULL,
    budget_type public.enum_campaigns_budget_type DEFAULT 'daily'::public.enum_campaigns_budget_type NOT NULL,
    budget_amount numeric(10,2) NOT NULL,
    budget_spent numeric(10,2) DEFAULT 0,
    start_date timestamp with time zone NOT NULL,
    end_date timestamp with time zone NOT NULL,
    timezone character varying(50) DEFAULT 'UTC'::character varying,
    impressions integer DEFAULT 0,
    clicks integer DEFAULT 0,
    conversions integer DEFAULT 0,
    spend numeric(10,2) DEFAULT 0,
    is_active boolean DEFAULT true,
    tags json DEFAULT '[]'::json,
    settings json DEFAULT '{}'::json,
    user_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.campaigns OWNER TO postgres;

--
-- Name: files; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.files (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    campaign_id uuid,
    original_name character varying(255) NOT NULL,
    file_name character varying(255) NOT NULL,
    file_path character varying(255) NOT NULL,
    file_size bigint NOT NULL,
    mime_type character varying(255) NOT NULL,
    file_type public.enum_files_file_type NOT NULL,
    extension character varying(10) NOT NULL,
    is_scanned boolean DEFAULT false,
    is_clean boolean,
    scan_result jsonb,
    scan_date timestamp with time zone,
    has_thumbnail boolean DEFAULT false,
    thumbnail_path character varying(255),
    thumbnail_url character varying(255),
    cdn_url character varying(255),
    cdn_provider public.enum_files_cdn_provider DEFAULT 'local'::public.enum_files_cdn_provider,
    cdn_region character varying(255),
    version integer DEFAULT 1,
    parent_file_id uuid,
    is_latest boolean DEFAULT true,
    metadata jsonb DEFAULT '{}'::jsonb,
    dimensions jsonb,
    duration integer,
    status public.enum_files_status DEFAULT 'uploading'::public.enum_files_status,
    processing_progress integer DEFAULT 0,
    error_message text,
    is_public boolean DEFAULT false,
    access_level public.enum_files_access_level DEFAULT 'private'::public.enum_files_access_level,
    tags jsonb DEFAULT '[]'::jsonb,
    category character varying(255),
    description text,
    download_count integer DEFAULT 0,
    view_count integer DEFAULT 0,
    last_accessed timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.files OWNER TO postgres;

--
-- Name: permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permissions (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    resource character varying(255) NOT NULL,
    action character varying(255) NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    is_system boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.permissions OWNER TO postgres;

--
-- Name: COLUMN permissions.resource; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.permissions.resource IS 'The resource this permission applies to (e.g., users, profiles, billing)';


--
-- Name: COLUMN permissions.action; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.permissions.action IS 'The action this permission allows (e.g., create, read, update, delete)';


--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role_permissions (
    id uuid NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    granted_by uuid,
    granted_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    role_id uuid,
    permission_id uuid
);


ALTER TABLE public.role_permissions OWNER TO postgres;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    is_active boolean DEFAULT true NOT NULL,
    is_system boolean DEFAULT false NOT NULL,
    priority integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: COLUMN roles.priority; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.roles.priority IS 'Higher number means higher priority/authority';


--
-- Name: targeting; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.targeting (
    id uuid NOT NULL,
    campaign_id uuid NOT NULL,
    locations json DEFAULT '[]'::json,
    location_type public.enum_targeting_location_type DEFAULT 'include'::public.enum_targeting_location_type,
    age_range json,
    gender public.enum_targeting_gender DEFAULT 'all'::public.enum_targeting_gender,
    interests json DEFAULT '[]'::json,
    behaviors json DEFAULT '[]'::json,
    devices json DEFAULT '["desktop","mobile","tablet"]'::json,
    platforms json DEFAULT '["web","ios","android"]'::json,
    browsers json DEFAULT '[]'::json,
    keywords json DEFAULT '[]'::json,
    categories json DEFAULT '[]'::json,
    topics json DEFAULT '[]'::json,
    time_slots json DEFAULT '[]'::json,
    days_of_week json DEFAULT '[0,1,2,3,4,5,6]'::json,
    frequency_cap integer,
    frequency_period public.enum_targeting_frequency_period DEFAULT 'day'::public.enum_targeting_frequency_period,
    custom_audiences json DEFAULT '[]'::json,
    lookalike_audiences json DEFAULT '[]'::json,
    excluded_audiences json DEFAULT '[]'::json,
    excluded_categories json DEFAULT '[]'::json,
    is_active boolean DEFAULT true,
    settings json DEFAULT '{}'::json,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.targeting OWNER TO postgres;

--
-- Name: COLUMN targeting.locations; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.targeting.locations IS 'Array of country codes, states, cities';


--
-- Name: COLUMN targeting.age_range; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.targeting.age_range IS '{"min": 18, "max": 65}';


--
-- Name: COLUMN targeting.interests; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.targeting.interests IS 'Array of interest categories';


--
-- Name: COLUMN targeting.behaviors; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.targeting.behaviors IS 'Array of behavior categories';


--
-- Name: COLUMN targeting.devices; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.targeting.devices IS 'Array of device types';


--
-- Name: COLUMN targeting.platforms; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.targeting.platforms IS 'Array of platforms';


--
-- Name: COLUMN targeting.browsers; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.targeting.browsers IS 'Array of browser types';


--
-- Name: COLUMN targeting.keywords; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.targeting.keywords IS 'Array of keywords for contextual matching';


--
-- Name: COLUMN targeting.categories; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.targeting.categories IS 'Array of content categories';


--
-- Name: COLUMN targeting.topics; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.targeting.topics IS 'Array of content topics';


--
-- Name: COLUMN targeting.time_slots; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.targeting.time_slots IS 'Array of time slots for dayparting';


--
-- Name: COLUMN targeting.days_of_week; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.targeting.days_of_week IS 'Array of days (0=Sunday, 6=Saturday)';


--
-- Name: COLUMN targeting.frequency_cap; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.targeting.frequency_cap IS 'Maximum impressions per user per time period';


--
-- Name: COLUMN targeting.custom_audiences; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.targeting.custom_audiences IS 'Array of custom audience IDs';


--
-- Name: COLUMN targeting.lookalike_audiences; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.targeting.lookalike_audiences IS 'Array of lookalike audience configurations';


--
-- Name: COLUMN targeting.excluded_audiences; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.targeting.excluded_audiences IS 'Array of excluded audience IDs';


--
-- Name: COLUMN targeting.excluded_categories; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.targeting.excluded_categories IS 'Array of excluded content categories';


--
-- Name: user_profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_profiles (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    phone_number character varying(255),
    date_of_birth date,
    gender public.enum_user_profiles_gender,
    profile_picture character varying(255),
    bio text,
    timezone character varying(255) DEFAULT 'UTC'::character varying,
    language character varying(255) DEFAULT 'en'::character varying,
    company_name character varying(255),
    job_title character varying(255),
    department character varying(255),
    company_website character varying(255),
    company_size public.enum_user_profiles_company_size,
    industry character varying(255),
    address_line1 character varying(255),
    address_line2 character varying(255),
    city character varying(255),
    state character varying(255),
    postal_code character varying(255),
    country character varying(255),
    billing_address_line1 character varying(255),
    billing_address_line2 character varying(255),
    billing_city character varying(255),
    billing_state character varying(255),
    billing_postal_code character varying(255),
    billing_country character varying(255),
    tax_id character varying(255),
    email_notifications jsonb DEFAULT '{"updates": true, "security": true, "marketing": true, "newsletter": false}'::jsonb,
    push_notifications jsonb DEFAULT '{"enabled": true, "updates": true, "security": true, "marketing": false}'::jsonb,
    privacy_settings jsonb DEFAULT '{"showEmail": false, "showPhone": false, "allowContact": true, "profileVisibility": "public"}'::jsonb,
    linkedin_url character varying(255),
    twitter_url character varying(255),
    github_url character varying(255),
    skills character varying(255)[] DEFAULT (ARRAY[]::character varying[])::character varying(255)[],
    interests character varying(255)[] DEFAULT (ARRAY[]::character varying[])::character varying(255)[],
    is_profile_complete boolean DEFAULT false,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.user_profiles OWNER TO postgres;

--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_roles (
    id uuid NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    is_primary boolean DEFAULT false NOT NULL,
    assigned_by uuid,
    assigned_at timestamp with time zone NOT NULL,
    expires_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    user_id uuid,
    role_id uuid
);


ALTER TABLE public.user_roles OWNER TO postgres;

--
-- Name: COLUMN user_roles.is_primary; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.user_roles.is_primary IS 'Indicates if this is the primary role for the user';


--
-- Name: COLUMN user_roles.expires_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.user_roles.expires_at IS 'When this role assignment expires (null = never expires)';


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    first_name character varying(255) NOT NULL,
    last_name character varying(255) NOT NULL,
    role public.enum_users_role DEFAULT 'user'::public.enum_users_role NOT NULL,
    is_email_verified boolean DEFAULT false,
    email_verification_token character varying(255),
    email_verification_expires timestamp with time zone,
    reset_password_token character varying(255),
    reset_password_expires timestamp with time zone,
    last_login timestamp with time zone,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: Analytics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Analytics" (id, user_id, campaign_id, date, period, impressions, clicks, conversions, spend, ctr, cpc, cpm, conversion_rate, unique_users, sessions, bounce_rate, avg_session_duration, geographic_data, device_data, source_data, custom_metrics, processed, last_updated, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: Events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Events" (id, event_type, campaign_id, user_id, "timestamp", metadata, processed, session_id, ip_address, user_agent, referrer, location, device_info, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: analyses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.analyses (id, user_id, campaign_id, type, content, results, options, status, processing_time, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: assets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assets (id, campaign_id, name, description, original_name, file_name, file_path, file_size, mime_type, file_extension, type, width, height, duration, thumbnail_path, thumbnail_width, thumbnail_height, status, processing_status, is_active, is_public, tags, categories, usage_count, last_used, user_id, settings, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: billing_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.billing_info (id, user_id, payment_method_type, payment_method_name, card_last_four, card_brand, card_expiry_month, card_expiry_year, billing_name, billing_email, billing_phone, billing_address_line1, billing_address_line2, billing_city, billing_state, billing_postal_code, billing_country, tax_id, tax_exempt, payment_gateway_id, payment_gateway_customer_id, is_default, is_active, notes, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: campaigns; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.campaigns (id, name, description, status, type, objective, budget_type, budget_amount, budget_spent, start_date, end_date, timezone, impressions, clicks, conversions, spend, is_active, tags, settings, user_id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.files (id, user_id, campaign_id, original_name, file_name, file_path, file_size, mime_type, file_type, extension, is_scanned, is_clean, scan_result, scan_date, has_thumbnail, thumbnail_path, thumbnail_url, cdn_url, cdn_provider, cdn_region, version, parent_file_id, is_latest, metadata, dimensions, duration, status, processing_progress, error_message, is_public, access_level, tags, category, description, download_count, view_count, last_accessed, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permissions (id, name, description, resource, action, is_active, is_system, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role_permissions (id, is_active, granted_by, granted_at, created_at, updated_at, deleted_at, role_id, permission_id) FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name, description, is_active, is_system, priority, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: targeting; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.targeting (id, campaign_id, locations, location_type, age_range, gender, interests, behaviors, devices, platforms, browsers, keywords, categories, topics, time_slots, days_of_week, frequency_cap, frequency_period, custom_audiences, lookalike_audiences, excluded_audiences, excluded_categories, is_active, settings, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: user_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_profiles (id, user_id, phone_number, date_of_birth, gender, profile_picture, bio, timezone, language, company_name, job_title, department, company_website, company_size, industry, address_line1, address_line2, city, state, postal_code, country, billing_address_line1, billing_address_line2, billing_city, billing_state, billing_postal_code, billing_country, tax_id, email_notifications, push_notifications, privacy_settings, linkedin_url, twitter_url, github_url, skills, interests, is_profile_complete, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_roles (id, is_active, is_primary, assigned_by, assigned_at, expires_at, created_at, updated_at, deleted_at, user_id, role_id) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password, first_name, last_name, role, is_email_verified, email_verification_token, email_verification_expires, reset_password_token, reset_password_expires, last_login, is_active, created_at, updated_at, deleted_at) FROM stdin;
2fcf6b84-0540-47bf-85e0-1d9d23101fdb	chaduvuprathyushareddy@gmail.com	$2a$12$jcIthCrkBWcKZS5CV3b3BOaim8nMAyg9.b168H2NjtKhXNWdgTGLa	Prathyusha	Reddy	user	t	\N	\N	\N	\N	2025-07-14 18:35:01.275+00	t	2025-07-14 18:34:23.278+00	2025-07-14 18:35:01.276+00	\N
\.


--
-- Name: Analytics Analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Analytics"
    ADD CONSTRAINT "Analytics_pkey" PRIMARY KEY (id);


--
-- Name: Events Events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Events"
    ADD CONSTRAINT "Events_pkey" PRIMARY KEY (id);


--
-- Name: analyses analyses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analyses
    ADD CONSTRAINT analyses_pkey PRIMARY KEY (id);


--
-- Name: assets assets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_pkey PRIMARY KEY (id);


--
-- Name: billing_info billing_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.billing_info
    ADD CONSTRAINT billing_info_pkey PRIMARY KEY (id);


--
-- Name: campaigns campaigns_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT campaigns_pkey PRIMARY KEY (id);


--
-- Name: files files_file_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_file_name_key UNIQUE (file_name);


--
-- Name: files files_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key UNIQUE (name);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_role_id_permission_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_permission_id_key UNIQUE (role_id, permission_id);


--
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: targeting targeting_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.targeting
    ADD CONSTRAINT targeting_pkey PRIMARY KEY (id);


--
-- Name: user_profiles user_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_id_key UNIQUE (user_id, role_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: assets_campaign_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX assets_campaign_id ON public.assets USING btree (campaign_id);


--
-- Name: assets_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX assets_is_active ON public.assets USING btree (is_active);


--
-- Name: assets_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX assets_status ON public.assets USING btree (status);


--
-- Name: assets_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX assets_type ON public.assets USING btree (type);


--
-- Name: assets_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX assets_user_id ON public.assets USING btree (user_id);


--
-- Name: campaigns_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX campaigns_created_at ON public.campaigns USING btree (created_at);


--
-- Name: campaigns_start_date_end_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX campaigns_start_date_end_date ON public.campaigns USING btree (start_date, end_date);


--
-- Name: campaigns_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX campaigns_status ON public.campaigns USING btree (status);


--
-- Name: campaigns_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX campaigns_type ON public.campaigns USING btree (type);


--
-- Name: campaigns_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX campaigns_user_id ON public.campaigns USING btree (user_id);


--
-- Name: idx_analytics_campaign_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_analytics_campaign_date ON public."Analytics" USING btree (campaign_id, date);


--
-- Name: idx_analytics_date_period; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_analytics_date_period ON public."Analytics" USING btree (date, period);


--
-- Name: idx_analytics_processed; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_analytics_processed ON public."Analytics" USING btree (processed);


--
-- Name: idx_analytics_user_campaign_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_analytics_user_campaign_date ON public."Analytics" USING btree (user_id, campaign_id, date);


--
-- Name: idx_events_campaign_timestamp; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_events_campaign_timestamp ON public."Events" USING btree (campaign_id, "timestamp");


--
-- Name: idx_events_processed; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_events_processed ON public."Events" USING btree (processed);


--
-- Name: idx_events_session; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_events_session ON public."Events" USING btree (session_id);


--
-- Name: idx_events_type_timestamp; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_events_type_timestamp ON public."Events" USING btree (event_type, "timestamp");


--
-- Name: idx_events_user_timestamp; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_events_user_timestamp ON public."Events" USING btree (user_id, "timestamp");


--
-- Name: permissions_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX permissions_name ON public.permissions USING btree (name);


--
-- Name: permissions_resource_action; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX permissions_resource_action ON public.permissions USING btree (resource, action);


--
-- Name: roles_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX roles_name ON public.roles USING btree (name);


--
-- Name: targeting_campaign_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX targeting_campaign_id ON public.targeting USING btree (campaign_id);


--
-- Name: targeting_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX targeting_is_active ON public.targeting USING btree (is_active);


--
-- Name: Analytics Analytics_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Analytics"
    ADD CONSTRAINT "Analytics_campaign_id_fkey" FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Analytics Analytics_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Analytics"
    ADD CONSTRAINT "Analytics_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Events Events_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Events"
    ADD CONSTRAINT "Events_campaign_id_fkey" FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Events Events_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Events"
    ADD CONSTRAINT "Events_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: analyses analyses_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analyses
    ADD CONSTRAINT analyses_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: analyses analyses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analyses
    ADD CONSTRAINT analyses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: assets assets_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: assets assets_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: billing_info billing_info_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.billing_info
    ADD CONSTRAINT billing_info_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: campaigns campaigns_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT campaigns_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: files files_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: files files_parent_file_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_parent_file_id_fkey FOREIGN KEY (parent_file_id) REFERENCES public.files(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: files files_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_granted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_granted_by_fkey FOREIGN KEY (granted_by) REFERENCES public.users(id);


--
-- Name: role_permissions role_permissions_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: targeting targeting_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.targeting
    ADD CONSTRAINT targeting_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_profiles user_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_roles user_roles_assigned_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_assigned_by_fkey FOREIGN KEY (assigned_by) REFERENCES public.users(id);


--
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

