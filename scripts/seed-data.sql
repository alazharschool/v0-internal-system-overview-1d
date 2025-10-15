-- Insert sample teachers
INSERT INTO teachers (name, email, phone, subjects, hourly_rate, experience_years, qualifications, availability, status) VALUES
('سارة جونسون', 'sarah.johnson@email.com', '+1 555 123 4567', ARRAY['حفظ القرآن', 'التجويد'], 35.00, 8, 'ماجستير في الدراسات الإسلامية، إجازة في القرآن', 'دوام كامل', 'active'),
('مايكل براون', 'michael.brown@email.com', '+44 20 7946 0958', ARRAY['اللغة العربية', 'الدراسات الإسلامية'], 45.00, 12, 'دكتوراه في الأدب العربي', 'دوام جزئي', 'active'),
('إيميلي ديفيس', 'emily.davis@email.com', '+61 2 9374 4000', ARRAY['حفظ القرآن', 'اللغة العربية'], 30.00, 5, 'بكالوريوس في الدراسات الإسلامية', 'مرن', 'active'),
('أحمد حسن', 'ahmed.hassan.teacher@email.com', '+971 50 777 8888', ARRAY['التجويد', 'القراءات'], 40.00, 10, 'إجازة في القراءات العشر', 'دوام كامل', 'active'),
('مريم عبدالله', 'mariam.abdullah@email.com', '+966 55 666 7777', ARRAY['اللغة العربية', 'النحو والصرف'], 38.00, 7, 'ماجستير في اللغة العربية', 'دوام جزئي', 'active'),
('د. سارة أحمد محمد', 'dr.sara.ahmed@example.com', '01234567910', ARRAY['الرياضيات'], 150.00, 10, 'دكتوراه في الرياضيات التطبيقية', 'دوام كامل', 'active'),
('أ. محمد عبدالله حسن', 'mohamed.abdullah@example.com', '01234567911', ARRAY['الفيزياء'], 120.00, 8, 'ماجستير في الفيزياء النووية', 'دوام جزئي', 'active'),
('د. نورا حسام الدين', 'dr.nora.hossam@example.com', '01234567912', ARRAY['الكيمياء'], 160.00, 12, 'دكتوراه في الكيمياء العضوية', 'دوام كامل', 'active'),
('أ. أحمد محمود علي', 'ahmed.mahmoud@example.com', '01234567913', ARRAY['الأحياء'], 110.00, 6, 'ماجستير في علوم الحياة', 'دوام جزئي', 'active'),
('د. فاطمة عبدالرحمن', 'dr.fatima.abdelrahman@example.com', '01234567914', ARRAY['الرياضيات'], 170.00, 15, 'دكتوراه في الرياضيات البحتة', 'دوام كامل', 'active'),
('أ. حسام محمد نور', 'hossam.mohamed@example.com', '01234567915', ARRAY['الفيزياء'], 100.00, 5, 'بكالوريوس فيزياء مع مرتبة الشرف', 'دوام جزئي', 'active'),
('د. مريم صلاح أحمد', 'dr.mariam.salah@example.com', '01234567916', ARRAY['الكيمياء'], 140.00, 9, 'دكتوراه في الكيمياء الفيزيائية', 'دوام كامل', 'active'),
('أ. يوسف علي حسن', 'youssef.ali@example.com', '01234567917', ARRAY['الأحياء'], 115.00, 7, 'ماجستير في البيولوجيا الجزيئية', 'دوام جزئي', 'active');

-- Insert sample students
INSERT INTO students (name, email, phone, age, grade, parent_name, parent_phone, parent_email, status, enrollment_date, notes) VALUES
('أحمد حسان', 'ahmed.hassan@email.com', '+971 50 123 4567', 16, 'الصف العاشر', 'حسان علي', '+971 50 123 4568', 'hassan.ali@email.com', 'active', '2023-09-15', 'طالب ممتاز مع تفاني قوي في التعلم.'),
('سارة أحمد', 'sara.ahmed@email.com', '+966 55 987 6543', 14, 'الصف الثامن', 'أحمد محمود', '+966 55 987 6544', 'ahmed.mahmoud@email.com', 'active', '2023-10-01', 'تظهر تحسناً كبيراً في النطق العربي.'),
('عمر يوسف', 'omar.youssef@email.com', '+20 10 555 7890', 18, 'الصف الثاني عشر', 'يوسف إبراهيم', '+20 10 555 7891', 'youssef.ibrahim@email.com', 'active', '2023-08-20', 'طالب متقدم يستعد للجامعة.'),
('فاطمة محمد', 'fatima.mohammed@email.com', '+971 55 444 3333', 13, 'الصف السابع', 'محمد علي', '+971 55 444 3334', 'mohammed.ali@email.com', 'active', '2023-11-10', 'طالبة نشيطة ومتحمسة للتعلم.'),
('خالد أحمد', 'khalid.ahmed@email.com', '+966 50 222 1111', 17, 'الصف الحادي عشر', 'أحمد خالد', '+966 50 222 1112', 'ahmed.khalid@email.com', 'active', '2023-09-05', 'يحتاج إلى تركيز إضافي في التجويد.'),
('أحمد محمد علي', 'ahmed.mohamed@example.com', '01234567890', NULL, 'الصف الثالث الثانوي', 'محمد علي أحمد', '01234567891', NULL, 'active', NULL, 'طالب متميز في الرياضيات'),
('فاطمة حسن محمود', 'fatima.hassan@example.com', '01234567892', NULL, 'الصف الثاني الثانوي', 'حسن محمود فاطمة', '01234567893', NULL, 'active', NULL, 'تحتاج متابعة إضافية في الفيزياء'),
('محمد أحمد حسن', 'mohamed.ahmed@example.com', '01234567894', NULL, 'الصف الأول الثانوي', 'أحمد حسن محمد', '01234567895', NULL, 'active', NULL, 'طالب نشيط ومتفاعل'),
('سارة علي محمد', 'sara.ali@example.com', '01234567896', NULL, 'الصف الثالث الثانوي', 'علي محمد سارة', '01234567897', NULL, 'active', NULL, 'متفوقة في العلوم'),
('يوسف محمود أحمد', 'youssef.mahmoud@example.com', '01234567898', NULL, 'الصف الثاني الثانوي', 'محمود أحمد يوسف', '01234567899', NULL, 'active', NULL, 'يحتاج تقوية في الجبر'),
('نور الدين حسام', 'nour.hossam@example.com', '01234567900', NULL, 'الصف الأول الثانوي', 'حسام الدين نور', '01234567901', NULL, 'active', NULL, 'طالب مجتهد'),
('مريم عبدالله', 'mariam.abdullah@example.com', '01234567902', NULL, 'الصف الثالث الثانوي', 'عبدالله مريم', '01234567903', NULL, 'active', NULL, 'تحب التجارب العملية'),
('عمر صلاح الدين', 'omar.salah@example.com', '01234567904', NULL, 'الصف الثاني الثانوي', 'صلاح الدين عمر', '01234567905', NULL, 'active', NULL, 'مهتم بالطب');

-- Insert sample classes (using the first teacher and student IDs)
INSERT INTO classes (student_id, teacher_id, subject, class_date, start_time, end_time, duration_minutes, status, class_type, meeting_link, notes) 
SELECT 
    s.id as student_id,
    t.id as teacher_id,
    'حفظ القرآن' as subject,
    CURRENT_DATE + INTERVAL '1 day' as class_date,
    '10:00'::time as start_time,
    '11:00'::time as end_time,
    60 as duration_minutes,
    'scheduled' as status,
    'regular' as class_type,
    'https://meet.example.com/abc123' as meeting_link,
    'مراجعة سورة البقرة' as notes
FROM students s, teachers t
WHERE s.name = 'أحمد حسان' AND t.name = 'سارة جونسون'
LIMIT 1;

INSERT INTO classes (student_id, teacher_id, subject, class_date, start_time, end_time, duration_minutes, status, class_type, meeting_link, notes)
SELECT
    s.id as student_id,
    t.id as teacher_id,
    'اللغة العربية' as subject,
    CURRENT_DATE + INTERVAL '2 days' as class_date,
    '14:00'::time as start_time,
    '15:30'::time as end_time,
    90 as duration_minutes,
    'scheduled' as status,
    'regular' as class_type,
    'https://meet.example.com/def456' as meeting_link,
    'درس في النحو والإعراب' as notes
FROM students s, teachers t
WHERE s.name = 'سارة أحمد' AND t.name = 'مايكل براون'
LIMIT 1;

INSERT INTO classes (student_id, teacher_id, subject, class_date, start_time, end_time, duration_minutes, status, class_type, meeting_link, notes)
SELECT
    s.id as student_id,
    t.id as teacher_id,
    'التجويد' as subject,
    CURRENT_DATE + INTERVAL '3 days' as class_date,
    '16:00'::time as start_time,
    '17:00'::time as end_time,
    60 as duration_minutes,
    'scheduled' as status,
    'regular' as class_type,
    'https://meet.example.com/ghi789' as meeting_link,
    'تطبيق أحكام التجويد' as notes
FROM students s, teachers t
WHERE s.name = 'عمر يوسف' AND t.name = 'إيميلي ديفيس'
LIMIT 1;

INSERT INTO classes (student_id, teacher_id, subject, class_date, start_time, end_time, duration_minutes, status, class_type, meeting_link, notes)
SELECT
    s.id as student_id,
    t.id as teacher_id,
    'اللغة العربية' as subject,
    CURRENT_DATE + INTERVAL '4 days' as class_date,
    '15:00'::time as start_time,
    '16:00'::time as end_time,
    60 as duration_minutes,
    'scheduled' as status,
    'regular' as class_type,
    'https://meet.example.com/jkl012' as meeting_link,
    'قراءة وفهم النصوص' as notes
FROM students s, teachers t
WHERE s.name = 'أحمد حسان' AND t.name = 'مايكل براون'
LIMIT 1;

INSERT INTO classes (student_id, teacher_id, subject, class_date, start_time, end_time, duration_minutes, status, class_type, meeting_link, notes)
SELECT
    s.id as student_id,
    t.id as teacher_id,
    'حفظ القرآن' as subject,
    CURRENT_DATE + INTERVAL '5 days' as class_date,
    '11:00'::time as start_time,
    '12:00'::time as end_time,
    60 as duration_minutes,
    'scheduled' as status,
    'regular' as class_type,
    'https://meet.example.com/mno345' as meeting_link,
    'حفظ سورة آل عمران' as notes
FROM students s, teachers t
WHERE s.name = 'سارة أحمد' AND t.name = 'سارة جونسون'
LIMIT 1;

-- Insert sample trial classes
INSERT INTO trial_classes (student_name, student_email, student_phone, student_age, parent_name, parent_phone, parent_email, teacher_id, subject, class_date, start_time, duration_minutes, status, outcome, notes)
SELECT
    'فاطمة محمد' as student_name,
    'fatima.mohammed@email.com' as student_email,
    '+971 55 444 3333' as student_phone,
    13 as student_age,
    'محمد علي' as parent_name,
    '+971 55 444 3334' as parent_phone,
    'mohammed.ali@email.com' as parent_email,
    t.id as teacher_id,
    'التجويد' as subject,
    CURRENT_DATE + INTERVAL '4 days' as class_date,
    '16:00'::time as start_time,
    30 as duration_minutes,
    'scheduled' as status,
    'pending' as outcome,
    'حصة تجريبية أولى لحفظ القرآن' as notes
FROM teachers t
WHERE t.name = 'سارة جونسون'
LIMIT 1;

INSERT INTO trial_classes (student_name, student_email, student_phone, student_age, parent_name, parent_phone, parent_email, teacher_id, subject, class_date, start_time, duration_minutes, status, outcome, notes)
SELECT
    'يوسف علي' as student_name,
    'yusuf.ali@email.com' as student_email,
    '+966 55 777 6666' as student_phone,
    12 as student_age,
    'علي إبراهيم' as parent_name,
    '+966 55 777 6667' as parent_phone,
    'ali.ibrahim@email.com' as parent_email,
    t.id as teacher_id,
    'اللغة العربية' as subject,
    CURRENT_DATE + INTERVAL '5 days' as class_date,
    '15:00'::time as start_time,
    45 as duration_minutes,
    'scheduled' as status,
    'pending' as outcome,
    'تجربة اللغة العربية للمستوى المبتدئ' as notes
FROM teachers t
WHERE t.name = 'مايكل براون'
LIMIT 1;

INSERT INTO trial_classes (student_name, student_email, student_phone, student_age, parent_name, parent_phone, parent_email, teacher_id, subject, class_date, start_time, duration_minutes, status, outcome, notes)
SELECT
    'نور محمد' as student_name,
    'noor.mohammed@email.com' as student_email,
    '+20 11 888 9999' as student_phone,
    16 as student_age,
    'محمد أحمد' as parent_name,
    '+20 11 888 9998' as parent_phone,
    'mohammed.ahmed@email.com' as parent_email,
    t.id as teacher_id,
    'التجويد' as subject,
    CURRENT_DATE + INTERVAL '6 days' as class_date,
    '17:00'::time as start_time,
    30 as duration_minutes,
    'scheduled' as status,
    'pending' as outcome,
    'تقييم مستوى التجويد' as notes
FROM teachers t
WHERE t.name = 'إيميلي ديفيس'
LIMIT 1;

-- Insert new sample trial classes
INSERT INTO trial_classes (student_name, student_email, student_phone, parent_name, parent_phone, teacher_id, subject, class_date, start_time, end_time, duration_minutes, status, notes)
SELECT
  'يوسف محمد حسن',
  'youssef.mohamed.hassan@example.com',
  '01234567920',
  'محمد حسن يوسف',
  '01234567921',
  t.id,
  'الرياضيات',
  CURRENT_DATE + INTERVAL '1 day',
  '17:00:00',
  '18:00:00',
  60,
  'scheduled',
  'حصة تجريبية لتقييم مستوى الطالب في الرياضيات'
FROM teachers t
WHERE t.name = 'د. سارة أحمد محمد'

UNION ALL

SELECT
  'مريم أحمد علي',
  'mariam.ahmed.ali@example.com',
  '01234567922',
  'أحمد علي مريم',
  '01234567923',
  t.id,
  'الفيزياء',
  CURRENT_DATE + INTERVAL '2 days',
  '10:00:00',
  '11:00:00',
  60,
  'scheduled',
  'طالبة جديدة تحتاج تقييم في الفيزياء'
FROM teachers t
WHERE t.name = 'أ. محمد عبدالله حسن'

UNION ALL

SELECT
  'حسام نور الدين',
  'hossam.nour@example.com',
  '01234567924',
  'نور الدين حسام',
  '01234567925',
  t.id,
  'الكيمياء',
  CURRENT_DATE + INTERVAL '3 days',
  '18:30:00',
  '19:30:00',
  60,
  'scheduled',
  'تقييم أولي للطالب في الكيمياء'
FROM teachers t
WHERE t.name = 'د. نورا حسام الدين'

UNION ALL

SELECT
  'نادية محمود صلاح',
  'nadia.mahmoud@example.com',
  '01234567926',
  'محمود صلاح نادية',
  '01234567927',
  t.id,
  'الأحياء',
  CURRENT_DATE + INTERVAL '4 days',
  '15:30:00',
  '16:30:00',
  60,
  'scheduled',
  'حصة تجريبية في الأحياء للثانوية العامة'
FROM teachers t
WHERE t.name = 'أ. أحمد محمود علي'

UNION ALL

SELECT
  'كريم عبدالله محمد',
  'karim.abdullah@example.com',
  '01234567928',
  'عبدالله محمد كريم',
  '01234567929',
  t.id,
  'الرياضيات',
  CURRENT_DATE + INTERVAL '5 days',
  '19:30:00',
  '20:30:00',
  60,
  'scheduled',
  'تقييم في الجبر والهندسة'
FROM teachers t
WHERE t.name = 'د. فاطمة عبدالرحمن'

UNION ALL

SELECT
  'دينا حسن أحمد',
  'dina.hassan@example.com',
  '01234567930',
  'حسن أحمد دينا',
  '01234567931',
  t.id,
  'الفيزياء',
  CURRENT_DATE + INTERVAL '6 days',
  '11:00:00',
  '12:00:00',
  60,
  'scheduled',
  'حصة تجريبية للمبتدئين في الفيزياء'
FROM teachers t
WHERE t.name = 'أ. حسام محمد نور';

-- Insert some completed classes for statistics
INSERT INTO classes (student_id, teacher_id, subject, class_date, start_time, end_time, duration_minutes, status, notes)
SELECT
  s.id,
  t.id,
  t.subject,
  CURRENT_DATE - INTERVAL '1 day',
  '16:00:00',
  '17:00:00',
  60,
  'completed',
  'حصة ممتازة، الطالب متفاعل'
FROM students s, teachers t
WHERE s.name = 'أحمد محمد علي' AND t.name = 'د. سارة أحمد محمد'

UNION ALL

SELECT
  s.id,
  t.id,
  t.subject,
  CURRENT_DATE - INTERVAL '2 days',
  '18:00:00',
  '19:30:00',
  90,
  'completed',
  'تحسن ملحوظ في الفهم'
FROM students s, teachers t
WHERE s.name = 'فاطمة حسن محمود' AND t.name = 'أ. محمد عبدالله حسن'

UNION ALL

SELECT
  s.id,
  t.id,
  t.subject,
  CURRENT_DATE - INTERVAL '3 days',
  '15:00:00',
  '16:30:00',
  75,
  'completed',
  'أداء جيد في التجارب العملية'
FROM students s, teachers t
WHERE s.name = 'محمد أحمد حسن' AND t.name = 'د. نورا حسام الدين';

-- Insert some completed trial classes
INSERT INTO trial_classes (student_name, student_email, student_phone, parent_name, parent_phone, subject, grade, preferred_time, date, time, teacher_id, status, notes)
SELECT
  'لينا محمد أحمد',
  'lina.mohamed@example.com',
  '01234567932',
  'محمد أحمد لينا',
  '01234567933',
  t.id,
  'الرياضيات',
  'الصف الثالث الثانوي',
  CURRENT_DATE - INTERVAL '1 day',
  '17:00:00',
  '18:00:00',
  60,
  'completed',
  'حصة تجريبية ناجحة، الطالبة مستعدة للانضمام'
FROM teachers t
WHERE t.name = 'د. سارة أحمد محمد'

UNION ALL

SELECT
  'طارق عبدالرحمن',
  'tarek.abdelrahman@example.com',
  '01234567934',
  'عبدالرحمن طارق',
  '01234567935',
  t.id,
  'الفيزياء',
  'الصف الثاني الثانوي',
  CURRENT_DATE - INTERVAL '2 days',
  '10:00:00',
  '11:00:00',
  60,
  'converted',
  'تم تحويل الطالب إلى حصص منتظمة'
FROM teachers t
WHERE t.name = 'أ. محمد عبدالله حسن';
