-- Seed exercise library with comprehensive exercises
INSERT INTO exercise_library (name, category, muscle_groups, equipment, difficulty, instructions, tips, video_url) VALUES

-- Chest Exercises
('Barbell Bench Press', 'Chest', ARRAY['Chest', 'Triceps', 'Shoulders'], 'Barbell', 'Intermediate', 'Lie on bench, grip bar slightly wider than shoulders, lower to chest, press up', 'Keep feet flat on ground, arch lower back slightly', 'https://example.com/bench-press'),
('Dumbbell Flyes', 'Chest', ARRAY['Chest'], 'Dumbbells', 'Beginner', 'Lie on bench with dumbbells, arms extended, lower in arc motion, squeeze chest at top', 'Keep slight bend in elbows throughout', 'https://example.com/db-flyes'),
('Push-ups', 'Chest', ARRAY['Chest', 'Triceps', 'Core'], 'Bodyweight', 'Beginner', 'Start in plank, lower body until chest near floor, push back up', 'Keep core tight, body in straight line', 'https://example.com/pushups'),
('Incline Dumbbell Press', 'Chest', ARRAY['Upper Chest', 'Shoulders'], 'Dumbbells', 'Intermediate', 'Set bench to 30-45 degrees, press dumbbells up from chest level', 'Focus on upper chest contraction', 'https://example.com/incline-press'),

-- Back Exercises
('Deadlift', 'Back', ARRAY['Lower Back', 'Glutes', 'Hamstrings'], 'Barbell', 'Advanced', 'Stand with bar over mid-foot, grip bar, keep back straight, lift by extending hips and knees', 'Keep bar close to body, neutral spine', 'https://example.com/deadlift'),
('Pull-ups', 'Back', ARRAY['Lats', 'Biceps'], 'Pull-up Bar', 'Intermediate', 'Hang from bar, pull body up until chin over bar, lower with control', 'Engage lats, avoid swinging', 'https://example.com/pullups'),
('Barbell Rows', 'Back', ARRAY['Lats', 'Rhomboids', 'Traps'], 'Barbell', 'Intermediate', 'Bend at hips, pull bar to lower chest, squeeze shoulder blades', 'Keep core tight, slight knee bend', 'https://example.com/barbell-rows'),
('Lat Pulldowns', 'Back', ARRAY['Lats', 'Biceps'], 'Cable Machine', 'Beginner', 'Grip bar wider than shoulders, pull down to upper chest, control up', 'Lean back slightly, focus on lat engagement', 'https://example.com/lat-pulldown'),

-- Leg Exercises
('Barbell Squats', 'Legs', ARRAY['Quads', 'Glutes', 'Hamstrings'], 'Barbell', 'Intermediate', 'Bar on upper back, squat down until thighs parallel, drive through heels', 'Keep chest up, knees track over toes', 'https://example.com/squats'),
('Romanian Deadlift', 'Legs', ARRAY['Hamstrings', 'Glutes', 'Lower Back'], 'Barbell', 'Intermediate', 'Hold bar at hip level, push hips back, lower bar along legs, return to start', 'Keep slight knee bend, feel hamstring stretch', 'https://example.com/rdl'),
('Leg Press', 'Legs', ARRAY['Quads', 'Glutes'], 'Machine', 'Beginner', 'Sit in machine, feet shoulder-width, press weight up, control down', 'Don''t lock knees at top', 'https://example.com/leg-press'),
('Walking Lunges', 'Legs', ARRAY['Quads', 'Glutes', 'Hamstrings'], 'Dumbbells', 'Beginner', 'Step forward into lunge, rear knee near floor, push through front heel', 'Keep torso upright, front knee over ankle', 'https://example.com/lunges'),

-- Shoulder Exercises
('Overhead Press', 'Shoulders', ARRAY['Shoulders', 'Triceps'], 'Barbell', 'Intermediate', 'Bar at shoulder level, press overhead, lock out at top, lower with control', 'Keep core tight, don''t arch back excessively', 'https://example.com/ohp'),
('Lateral Raises', 'Shoulders', ARRAY['Lateral Deltoids'], 'Dumbbells', 'Beginner', 'Hold dumbbells at sides, raise arms out to sides to shoulder height', 'Slight bend in elbows, control the movement', 'https://example.com/lateral-raises'),
('Face Pulls', 'Shoulders', ARRAY['Rear Deltoids', 'Upper Back'], 'Cable Machine', 'Beginner', 'Pull rope to face level, separate hands at end, squeeze shoulder blades', 'Focus on rear delts, high elbow position', 'https://example.com/face-pulls'),

-- Arm Exercises
('Barbell Curls', 'Arms', ARRAY['Biceps'], 'Barbell', 'Beginner', 'Hold bar at hip level, curl up to shoulders, squeeze biceps, lower with control', 'Keep elbows stationary, no swinging', 'https://example.com/barbell-curls'),
('Tricep Dips', 'Arms', ARRAY['Triceps', 'Chest'], 'Parallel Bars', 'Intermediate', 'Support body on bars, lower until upper arms parallel to ground, push back up', 'Lean forward for chest, upright for triceps', 'https://example.com/dips'),
('Hammer Curls', 'Arms', ARRAY['Biceps', 'Forearms'], 'Dumbbells', 'Beginner', 'Hold dumbbells with neutral grip, curl up, lower with control', 'Targets brachialis and brachioradialis', 'https://example.com/hammer-curls'),
('Skull Crushers', 'Arms', ARRAY['Triceps'], 'Barbell', 'Intermediate', 'Lie on bench, bar overhead, lower to forehead by bending elbows, extend back up', 'Keep upper arms stationary', 'https://example.com/skull-crushers'),

-- Core Exercises
('Plank', 'Core', ARRAY['Abs', 'Core'], 'Bodyweight', 'Beginner', 'Hold push-up position on forearms, keep body straight, engage core', 'Don''t let hips sag or rise', 'https://example.com/plank'),
('Russian Twists', 'Core', ARRAY['Obliques', 'Abs'], 'Medicine Ball', 'Beginner', 'Sit with feet elevated, rotate torso side to side, touching weight to floor', 'Keep core engaged throughout', 'https://example.com/russian-twists'),
('Hanging Leg Raises', 'Core', ARRAY['Lower Abs'], 'Pull-up Bar', 'Advanced', 'Hang from bar, raise legs to 90 degrees, lower with control', 'Avoid swinging, control the movement', 'https://example.com/leg-raises'),
('Cable Crunches', 'Core', ARRAY['Abs'], 'Cable Machine', 'Intermediate', 'Kneel facing cable, hold rope behind head, crunch down, squeeze abs', 'Focus on ab contraction, not arm pull', 'https://example.com/cable-crunches'),

-- Cardio Exercises
('Running', 'Cardio', ARRAY['Full Body'], 'Treadmill', 'Beginner', 'Maintain steady pace, focus on breathing, proper running form', 'Start slow, gradually increase duration', 'https://example.com/running'),
('Rowing Machine', 'Cardio', ARRAY['Back', 'Legs', 'Core'], 'Rowing Machine', 'Intermediate', 'Push with legs, pull handle to chest, reverse the motion', 'Legs, then back, then arms in sequence', 'https://example.com/rowing'),
('Battle Ropes', 'Cardio', ARRAY['Arms', 'Shoulders', 'Core'], 'Battle Ropes', 'Intermediate', 'Create waves with ropes using alternating or simultaneous arm movements', 'High intensity, short intervals', 'https://example.com/battle-ropes'),
('Jump Rope', 'Cardio', ARRAY['Calves', 'Full Body'], 'Jump Rope', 'Beginner', 'Jump over rope as it passes under feet, maintain rhythm', 'Stay on balls of feet, slight knee bend', 'https://example.com/jump-rope'),
('Burpees', 'Cardio', ARRAY['Full Body'], 'Bodyweight', 'Intermediate', 'Squat, place hands on floor, jump feet back to plank, do push-up, jump feet forward, jump up', 'Full body exercise, great for conditioning', 'https://example.com/burpees'),
('Mountain Climbers', 'Cardio', ARRAY['Core', 'Full Body'], 'Bodyweight', 'Beginner', 'Start in plank, alternate bringing knees to chest quickly', 'Keep hips level, maintain fast pace', 'https://example.com/mountain-climbers'),
('Box Jumps', 'Cardio', ARRAY['Legs', 'Glutes'], 'Plyo Box', 'Intermediate', 'Jump onto box, land softly with knees bent, step down', 'Explosive movement, land with control', 'https://example.com/box-jumps'),
('Cycling', 'Cardio', ARRAY['Legs'], 'Stationary Bike', 'Beginner', 'Maintain steady cadence, adjust resistance as needed', 'Focus on breathing and leg endurance', 'https://example.com/cycling');
