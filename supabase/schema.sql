-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('doctor', 'patient');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  role user_role NOT NULL,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clinics table
CREATE TABLE clinics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Doctors table
CREATE TABLE doctors (
  id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  clinic_id UUID REFERENCES clinics(id) ON DELETE SET NULL,
  license_number TEXT,
  specialty TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Patients table
CREATE TABLE patients (
  id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  date_of_birth DATE,
  insurance_provider TEXT,
  insurance_policy_number TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  medical_notes TEXT,
  dental_history TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Doctor-Patient relationships
CREATE TABLE doctor_patient_links (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('pending', 'active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(doctor_id, patient_id)
);

-- Appointments table
CREATE TABLE appointments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  appointment_date TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status appointment_status DEFAULT 'scheduled',
  reason TEXT,
  notes TEXT,
  doctor_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- X-rays table
CREATE TABLE x_rays (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  description TEXT,
  taken_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Intake forms table
CREATE TABLE intake_forms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  form_data JSONB NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referring doctors table
CREATE TABLE referring_doctors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  specialty TEXT,
  clinic_name TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  subject TEXT,
  body TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  parent_message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security Policies

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Clinics
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doctors can view their clinic"
  ON clinics FOR SELECT
  USING (
    id IN (
      SELECT clinic_id FROM doctors WHERE id = auth.uid()
    )
  );

CREATE POLICY "Doctors can update their clinic"
  ON clinics FOR UPDATE
  USING (
    id IN (
      SELECT clinic_id FROM doctors WHERE id = auth.uid()
    )
  );

-- Doctors
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doctors can view own record"
  ON doctors FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Patients can view their doctors"
  ON doctors FOR SELECT
  USING (
    id IN (
      SELECT doctor_id FROM doctor_patient_links 
      WHERE patient_id = auth.uid() AND status = 'active'
    )
  );

-- Patients
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can view own record"
  ON patients FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Patients can update own record"
  ON patients FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Doctors can view their patients"
  ON patients FOR SELECT
  USING (
    id IN (
      SELECT patient_id FROM doctor_patient_links 
      WHERE doctor_id = auth.uid() AND status = 'active'
    )
  );

-- Doctor-Patient links
ALTER TABLE doctor_patient_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doctors can view their patient links"
  ON doctor_patient_links FOR SELECT
  USING (doctor_id = auth.uid());

CREATE POLICY "Patients can view their doctor links"
  ON doctor_patient_links FOR SELECT
  USING (patient_id = auth.uid());

CREATE POLICY "Patients can create doctor links"
  ON doctor_patient_links FOR INSERT
  WITH CHECK (patient_id = auth.uid());

-- Appointments
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doctors can view their appointments"
  ON appointments FOR SELECT
  USING (doctor_id = auth.uid());

CREATE POLICY "Patients can view their appointments"
  ON appointments FOR SELECT
  USING (patient_id = auth.uid());

CREATE POLICY "Doctors can manage their appointments"
  ON appointments FOR ALL
  USING (doctor_id = auth.uid());

-- X-rays
ALTER TABLE x_rays ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doctors can view x-rays of their patients"
  ON x_rays FOR SELECT
  USING (
    doctor_id = auth.uid() OR
    patient_id IN (
      SELECT patient_id FROM doctor_patient_links 
      WHERE doctor_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Patients can view their x-rays"
  ON x_rays FOR SELECT
  USING (patient_id = auth.uid());

CREATE POLICY "Doctors can manage x-rays"
  ON x_rays FOR ALL
  USING (doctor_id = auth.uid());

-- Intake forms
ALTER TABLE intake_forms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can view own intake forms"
  ON intake_forms FOR SELECT
  USING (patient_id = auth.uid());

CREATE POLICY "Patients can create intake forms"
  ON intake_forms FOR INSERT
  WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Doctors can view patient intake forms"
  ON intake_forms FOR SELECT
  USING (
    doctor_id = auth.uid() OR
    patient_id IN (
      SELECT patient_id FROM doctor_patient_links 
      WHERE doctor_id = auth.uid() AND status = 'active'
    )
  );

-- Referring doctors
ALTER TABLE referring_doctors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doctors can manage their referring doctors"
  ON referring_doctors FOR ALL
  USING (doctor_id = auth.uid());

-- Messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their messages"
  ON messages FOR SELECT
  USING (
    sender_id = auth.uid() OR 
    recipient_id = auth.uid()
  );

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Recipients can update message read status"
  ON messages FOR UPDATE
  USING (recipient_id = auth.uid());

-- Indexes for better performance
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_doctor_patient_links_doctor ON doctor_patient_links(doctor_id);
CREATE INDEX idx_doctor_patient_links_patient ON doctor_patient_links(patient_id);

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_clinics_updated_at
  BEFORE UPDATE ON clinics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
