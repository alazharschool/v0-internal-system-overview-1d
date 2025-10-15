-- Insert Sample Teachers
INSERT INTO teachers (name, email, phone, subject, subjects, hourly_rate, join_date, status, bio, zoom_link) VALUES
('Dr. Mohamed Abdelrahman', 'mohamed.abdelrahman@alazhar.edu', '+20-100-111-2222', 'Quran Memorization', ARRAY['Quran Memorization', 'Tajweed', 'Tafsir'], 150.00, '2023-09-01', 'active', 'Ph.D. in Quranic Sciences from Al-Azhar University with 15 years of teaching experience', 'https://zoom.us/j/1234567890'),
('Prof. Aisha Ahmed', 'aisha.ahmed@alazhar.edu', '+20-100-222-3333', 'Arabic Language', ARRAY['Arabic Language', 'Grammar', 'Literature'], 120.00, '2023-09-15', 'active', 'Professor of Arabic Language with specialization in classical and modern literature', 'https://zoom.us/j/2345678901'),
('Dr. Ahmed Hassan', 'ahmed.hassan@alazhar.edu', '+20-100-333-4444', 'Islamic Studies', ARRAY['Islamic Studies', 'Fiqh', 'Aqeedah'], 140.00, '2023-10-01', 'active', 'Expert in Islamic jurisprudence and theology with international teaching experience', 'https://zoom.us/j/3456789012'),
('Prof. Fatima Salem', 'fatima.salem@alazhar.edu', '+20-100-444-5555', 'Hadith Studies', ARRAY['Hadith Studies', 'Hadith Sciences', 'Seerah'], 130.00, '2023-10-15', 'active', 'Specialized in Hadith authentication and prophetic biography', 'https://zoom.us/j/4567890123'),
('Sheikh Khaled Mohamed', 'khaled.mohamed@alazhar.edu', '+20-100-555-6666', 'Tajweed', ARRAY['Tajweed', 'Quranic Recitation'], 110.00, '2023-11-01', 'active', 'Certified Quran reciter with Ijazah in multiple Qira''at', 'https://zoom.us/j/5678901234');

-- Insert Sample Students
INSERT INTO students (name, email, phone, age, grade, subject, parent_name, parent_phone, parent_email, address, status, enrollment_date, notes) VALUES
('Ahmed Mohamed Ali', 'ahmed.ali@example.com', '+20-100-123-4567', 15, 'Grade 10', 'Quran Memorization', 'Mohamed Ali', '+20-100-123-4568', 'mohamed.ali@example.com', 'Cairo, Egypt (UTC+2)', 'active', '2024-01-15', 'Excellent student with strong memorization skills'),
('Fatima Abdullah', 'fatima.abdullah@example.com', '+966-555-123-4567', 14, 'Grade 9', 'Arabic Language', 'Abdullah Hassan', '+966-555-123-4568', 'abdullah.hassan@example.com', 'Riyadh, Saudi Arabia (UTC+3)', 'active', '2024-02-01', 'Very attentive and participates actively'),
('Omar Hassan', 'omar.hassan@example.com', '+971-50-123-4567', 16, 'Grade 11', 'Islamic Studies', 'Hassan Ahmed', '+971-50-123-4568', 'hassan.ahmed@example.com', 'Dubai, UAE (UTC+4)', 'active', '2024-01-20', 'Shows great interest in Islamic history'),
('Khadija Salem', 'khadija.salem@example.com', '+20-110-123-4567', 13, 'Grade 8', 'Hadith Studies', 'Salem Ibrahim', '+20-110-123-4568', 'salem.ibrahim@example.com', 'Alexandria, Egypt (UTC+2)', 'active', '2024-02-10', 'Quick learner with excellent comprehension'),
('Youssef Ibrahim', 'youssef.ibrahim@example.com', '+20-120-123-4567', 12, 'Grade 7', 'Tajweed', 'Ibrahim Mahmoud', '+20-120-123-4568', 'ibrahim.mahmoud@example.com', 'Giza, Egypt (UTC+2)', 'active', '2024-01-25', 'Needs encouragement but making good progress');

-- Insert Sample Trial Classes
INSERT INTO trial_classes (student_name, student_email, student_phone, parent_name, parent_phone, parent_email, teacher_id, subject, date, time, duration, status, outcome, notes)
SELECT 
  'Sarah Ahmed', 
  'sarah.ahmed@example.com', 
  '+20-100-777-8888', 
  'Ahmed Mohamed', 
  '+20-100-777-8889', 
  'ahmed.mohamed@example.com',
  id, 
  'Quran Memorization', 
  CURRENT_DATE + INTERVAL '1 day', 
  '16:00:00', 
  30, 
  'scheduled', 
  'pending', 
  'First trial class for new student'
FROM teachers WHERE email = 'mohamed.abdelrahman@alazhar.edu';

INSERT INTO trial_classes (student_name, student_email, student_phone, parent_name, parent_phone, parent_email, teacher_id, subject, date, time, duration, status, outcome, notes)
SELECT 
  'Ali Hassan', 
  'ali.hassan@example.com', 
  '+966-555-888-9999', 
  'Hassan Ali', 
  '+966-555-888-9998', 
  'hassan.ali@example.com',
  id, 
  'Arabic Language', 
  CURRENT_DATE + INTERVAL '2 days', 
  '17:00:00', 
  30, 
  'scheduled', 
  'pending', 
  'Interested in Arabic grammar'
FROM teachers WHERE email = 'aisha.ahmed@alazhar.edu';

-- Insert Sample Classes
INSERT INTO classes (student_id, teacher_id, subject, class_date, start_time, end_time, duration, status, notes)
SELECT 
  s.id,
  t.id,
  'Quran Memorization',
  CURRENT_DATE,
  '09:00:00',
  '10:00:00',
  60,
  'scheduled',
  'Review Surah Al-Baqarah'
FROM students s, teachers t 
WHERE s.email = 'ahmed.ali@example.com' AND t.email = 'mohamed.abdelrahman@alazhar.edu';

INSERT INTO classes (student_id, teacher_id, subject, class_date, start_time, end_time, duration, status, notes)
SELECT 
  s.id,
  t.id,
  'Arabic Language',
  CURRENT_DATE,
  '10:30:00',
  '11:30:00',
  60,
  'scheduled',
  'Grammar lesson on verb conjugation'
FROM students s, teachers t 
WHERE s.email = 'fatima.abdullah@example.com' AND t.email = 'aisha.ahmed@alazhar.edu';

INSERT INTO classes (student_id, teacher_id, subject, class_date, start_time, end_time, duration, status, notes)
SELECT 
  s.id,
  t.id,
  'Islamic Studies',
  CURRENT_DATE,
  '14:00:00',
  '15:00:00',
  60,
  'scheduled',
  'Introduction to Fiqh principles'
FROM students s, teachers t 
WHERE s.email = 'omar.hassan@example.com' AND t.email = 'ahmed.hassan@alazhar.edu';

-- Insert Sample Courses
INSERT INTO courses (student_id, teacher_id, subject, start_date, end_date, total_classes, completed_classes, remaining_classes, progress_percentage, monthly_fee, status)
SELECT 
  s.id,
  t.id,
  'Quran Memorization',
  '2024-01-15',
  '2024-12-15',
  48,
  12,
  36,
  25.00,
  300.00,
  'active'
FROM students s, teachers t 
WHERE s.email = 'ahmed.ali@example.com' AND t.email = 'mohamed.abdelrahman@alazhar.edu';

INSERT INTO courses (student_id, teacher_id, subject, start_date, end_date, total_classes, completed_classes, remaining_classes, progress_percentage, monthly_fee, status)
SELECT 
  s.id,
  t.id,
  'Arabic Language',
  '2024-02-01',
  '2024-11-30',
  40,
  8,
  32,
  20.00,
  250.00,
  'active'
FROM students s, teachers t 
WHERE s.email = 'fatima.abdullah@example.com' AND t.email = 'aisha.ahmed@alazhar.edu';

-- Insert Sample Payments
INSERT INTO payments (student_id, amount, currency, payment_date, payment_method, status, notes)
SELECT 
  id,
  300.00,
  'USD',
  CURRENT_DATE - INTERVAL '5 days',
  'Credit Card',
  'paid',
  'Monthly tuition payment for January'
FROM students WHERE email = 'ahmed.ali@example.com';

INSERT INTO payments (student_id, amount, currency, payment_date, payment_method, status, notes)
SELECT 
  id,
  250.00,
  'USD',
  CURRENT_DATE - INTERVAL '3 days',
  'Bank Transfer',
  'paid',
  'Monthly tuition payment for February'
FROM students WHERE email = 'fatima.abdullah@example.com';

-- Insert Sample Activities
INSERT INTO activities (action_type, description, metadata) VALUES
('student_added', 'New student Ahmed Mohamed Ali was added to the system', '{"student_id": "1", "student_name": "Ahmed Mohamed Ali"}'::jsonb),
('class_scheduled', 'Class scheduled for Fatima Abdullah with Prof. Aisha Ahmed', '{"class_id": "1", "student_name": "Fatima Abdullah", "teacher_name": "Prof. Aisha Ahmed"}'::jsonb),
('payment_received', 'Payment received from Omar Hassan for monthly tuition', '{"payment_id": "1", "student_name": "Omar Hassan", "amount": 300}'::jsonb),
('teacher_added', 'New teacher Dr. Mohamed Abdelrahman joined the school', '{"teacher_id": "1", "teacher_name": "Dr. Mohamed Abdelrahman"}'::jsonb),
('trial_class_scheduled', 'Trial class scheduled for new student Sarah Ahmed', '{"trial_class_id": "1", "student_name": "Sarah Ahmed"}'::jsonb);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Sample data has been inserted successfully';
  RAISE NOTICE 'Teachers: 5 records';
  RAISE NOTICE 'Students: 5 records';
  RAISE NOTICE 'Trial Classes: 2 records';
  RAISE NOTICE 'Classes: 3 records';
  RAISE NOTICE 'Courses: 2 records';
  RAISE NOTICE 'Payments: 2 records';
  RAISE NOTICE 'Activities: 5 records';
END $$;
