-- Forum Posts
INSERT INTO Forum (title, description, forum_category, user_id, is_pinned, likes_count, timestamp)
VALUES ('Company Policy Update', 
        'Please review the new HR policies that will be effective next month. Let us know if you have any questions.', 
        'HR Announcements', 5, 0, 23, '2025-03-12 09:00:00');

INSERT INTO Forum (title, description, forum_category, user_id, is_pinned, likes_count, timestamp)
VALUES ('Office Birthday Celebrations', 
        'We are planning a celebration for employee birthdays this quarter. Share your ideas and suggestions!', 
        'HR Announcements', 12, 0, 15, '2025-03-12 10:15:00');

INSERT INTO Forum (title, description, forum_category, user_id, is_pinned, likes_count, timestamp)
VALUES ('Network Downtime Notice', 
        'Scheduled maintenance will cause a network outage this weekend. Please save your work and plan accordingly.', 
        'IT Support', 34, 1, 40, '2025-03-12 08:30:00');

INSERT INTO Forum (title, description, forum_category, user_id, is_pinned, likes_count, timestamp)
VALUES ('Software Installation Help', 
        'I need assistance installing the new productivity software on my workstation. Has anyone encountered similar issues?', 
        'IT Support', 47, 0, 8, '2025-03-12 11:00:00');

INSERT INTO Forum (title, description, forum_category, user_id, is_pinned, likes_count, timestamp)
VALUES ('Weekend Social Event', 
        'Let''s organize a social event this weekend. What kind of activities would you be interested in?', 
        'General Chat', 76, 0, 32, '2025-03-12 14:20:00');

INSERT INTO Forum (title, description, forum_category, user_id, is_pinned, likes_count, timestamp)
VALUES ('Casual Friday Ideas', 
        'Share your ideas for making Casual Fridays more engaging and fun. Your input matters!', 
        'General Chat', 89, 0, 19, '2025-03-12 13:45:00');

INSERT INTO Forum (title, description, forum_category, user_id, is_pinned, likes_count, timestamp)
VALUES ('HR Benefits Q&A', 
        'If you have any questions about the benefits package, please post them here and HR will respond shortly.', 
        'HR Announcements', 15, 1, 28, '2025-03-12 15:00:00');

INSERT INTO Forum (title, description, forum_category, user_id, is_pinned, likes_count, timestamp)
VALUES ('Printer Not Working', 
        'I''m experiencing issues with the office printer not printing correctly. Any solutions or workarounds?', 
        'IT Support', 52, 0, 12, '2025-03-12 16:30:00');

INSERT INTO Forum (title, description, forum_category, user_id, is_pinned, likes_count, timestamp)
VALUES ('Lunch Recommendations', 
        'Looking for great lunch spots near the office. What are your favorite places?', 
        'General Chat', 103, 0, 50, '2025-03-12 12:30:00');

INSERT INTO Forum (title, description, forum_category, user_id, is_pinned, likes_count, timestamp)
VALUES ('IT Security Reminder', 
        'Please update your passwords and review the new IT security guidelines to keep our network secure.', 
        'IT Support', 68, 1, 35, '2025-03-12 10:45:00');

-- New Forum Posts (10 additional posts)
INSERT INTO Forum (title, description, forum_category, user_id, is_pinned, likes_count, timestamp)
VALUES ('New Health and Wellness Program', 
        'We are excited to announce a new health and wellness initiative. Check out the details and share your feedback.', 
        'HR Announcements', 22, 0, 15, '2025-03-13 09:00:00');

INSERT INTO Forum (title, description, forum_category, user_id, is_pinned, likes_count, timestamp)
VALUES ('Email Outage Notification', 
        'Please be advised that there will be a scheduled email outage for maintenance this afternoon.', 
        'IT Support', 37, 0, 5, '2025-03-13 10:15:00');

INSERT INTO Forum (title, description, forum_category, user_id, is_pinned, likes_count, timestamp)
VALUES ('Coffee Machine Upgrade Discussion', 
        'The office coffee machine is being upgraded. Let us know your thoughts on the new model and any features you prefer.', 
        'General Chat', 58, 0, 20, '2025-03-13 11:30:00');

INSERT INTO Forum (title, description, forum_category, user_id, is_pinned, likes_count, timestamp)
VALUES ('Team Lunch Feedback and Ideas', 
        'We had a team lunch last week. Please share your feedback and suggestions for the next event.', 
        'General Chat', 66, 0, 12, '2025-03-13 12:45:00');

INSERT INTO Forum (title, description, forum_category, user_id, is_pinned, likes_count, timestamp)
VALUES ('VPN Connection Issues on Remote Days', 
        'Some employees have reported VPN connectivity problems on remote workdays. Let us know if you experience any issues.', 
        'IT Support', 77, 0, 8, '2025-03-13 13:00:00');

INSERT INTO Forum (title, description, forum_category, user_id, is_pinned, likes_count, timestamp)
VALUES ('New Casual Dress Code Announced', 
        'HR has updated the casual dress code policy. Please review the new guidelines and share your thoughts.', 
        'HR Announcements', 81, 0, 25, '2025-03-13 14:30:00');

INSERT INTO Forum (title, description, forum_category, user_id, is_pinned, likes_count, timestamp)
VALUES ('Discussion: Favorite Weekend Activities', 
        'Let''s talk about our favorite weekend activities. What do you like to do when you''re off work?', 
        'General Chat', 93, 0, 18, '2025-03-13 15:15:00');

INSERT INTO Forum (title, description, forum_category, user_id, is_pinned, likes_count, timestamp)
VALUES ('IT: Server Maintenance Scheduled', 
        'The IT department has scheduled server maintenance for tomorrow. Expect intermittent downtime during the maintenance window.', 
        'IT Support', 104, 0, 10, '2025-03-13 16:00:00');

INSERT INTO Forum (title, description, forum_category, user_id, is_pinned, likes_count, timestamp)
VALUES ('Suggestion Box: New Office Amenities', 
        'We are looking to improve our office space. Share your suggestions for new amenities or improvements in the suggestion box.', 
        'HR Announcements', 115, 0, 14, '2025-03-13 16:45:00');

INSERT INTO Forum (title, description, forum_category, user_id, is_pinned, likes_count, timestamp)
VALUES ('General Q&A: Company Future Plans', 
        'Join the discussion about the future direction of our company. Ask questions and share your ideas about upcoming projects and goals.', 
        'General Chat', 126, 0, 30, '2025-03-13 17:30:00');


-- Forum Comments

-- Comments for forum_id 1 (Company Policy Update)
INSERT INTO ForumComments (forum_id, user_id, comment, timestamp)
VALUES (1, 27, 'Thanks for the update. I will review the policy changes as soon as possible.', '2025-03-12 09:15:00');
INSERT INTO ForumComments (forum_id, user_id, comment, timestamp)
VALUES (1, 44, 'Are there any major changes that we should be aware of?', '2025-03-12 09:20:00');

-- Comments for forum_id 2 (Office Birthday Celebrations)
INSERT INTO ForumComments (forum_id, user_id, comment, timestamp)
VALUES (2, 33, 'This sounds exciting! I have a few ideas for the celebration.', '2025-03-12 10:30:00');

-- Comments for forum_id 3 (Network Downtime Notice)
INSERT INTO ForumComments (forum_id, user_id, comment, timestamp)
VALUES (3, 51, 'Thanks for the heads up about the outage. I will make sure to save my work.', '2025-03-12 08:45:00');
INSERT INTO ForumComments (forum_id, user_id, comment, timestamp)
VALUES (3, 77, 'I will finish my work early today to avoid any data loss.', '2025-03-12 08:50:00');

-- Comments for forum_id 4 (Software Installation Help)
INSERT INTO ForumComments (forum_id, user_id, comment, timestamp)
VALUES (4, 64, 'I had the same issue last week. Reinstalling the software solved it for me.', '2025-03-12 11:15:00');

-- Comments for forum_id 5 (Weekend Social Event)
INSERT INTO ForumComments (forum_id, user_id, comment, timestamp)
VALUES (5, 85, 'A picnic in the park would be a great idea!', '2025-03-12 14:35:00');

-- Comments for forum_id 6 (Casual Friday Ideas)
INSERT INTO ForumComments (forum_id, user_id, comment, timestamp)
VALUES (6, 91, 'Casual Fridays always make the week more enjoyable. Count me in!', '2025-03-12 13:50:00');

-- Comments for forum_id 7 (HR Benefits Q&A)
INSERT INTO ForumComments (forum_id, user_id, comment, timestamp)
VALUES (7, 29, 'I have a few questions regarding the new benefits. Will HR be hosting a Q&A session?', '2025-03-12 15:10:00');

-- Comments for forum_id 8 (Printer Not Working)
INSERT INTO ForumComments (forum_id, user_id, comment, timestamp)
VALUES (8, 55, 'I encountered the same issue. Hopefully, IT will resolve it soon.', '2025-03-12 16:45:00');

-- Comments for forum_id 9 (Lunch Recommendations)
INSERT INTO ForumComments (forum_id, user_id, comment, timestamp)
VALUES (9, 112, 'I recommend trying the new cafe downtown. Their sandwiches are excellent!', '2025-03-12 12:45:00');

-- Comments for forum_id 10 (IT Security Reminder)
INSERT INTO ForumComments (forum_id, user_id, comment, timestamp)
VALUES (10, 79, 'Thanks for the reminder. I will update my password today.', '2025-03-12 11:00:00');

-- Forum Posts (10 posts)

-- Post 21: Team Update: Project Milestones
INSERT INTO Forum (title, description, forum_category, user_id, is_pinned, likes_count, timestamp)
VALUES ('Team Update: Project Milestones', 
        'Our team has achieved several key milestones this quarter. Let''s celebrate our progress and plan ahead.', 
        'HR Announcements', 45, 0, 22, '2025-03-11 09:00:00');


INSERT INTO ForumComments (forum_id, user_id, comment, timestamp)
VALUES (21, 78, 'Great news! Proud of the progress so far.', '2025-03-11 09:30:00');
INSERT INTO ForumComments (forum_id, user_id, comment, timestamp)
VALUES (21, 56, 'Let''s keep the momentum going!', '2025-03-11 10:00:00');


-- 22
INSERT INTO Forum (title, description, forum_category, user_id, is_pinned, likes_count, timestamp)
VALUES ('Server Upgrade Notice', 
        'IT will upgrade our servers this weekend. Expect brief downtime during the upgrade window.', 
        'IT Support', 62, 0, 15, '2025-03-12 14:15:00');

INSERT INTO ForumComments (forum_id, user_id, comment, timestamp)
VALUES (22, 89, 'Noted. I will plan my work accordingly.', '2025-03-12 14:30:00');
INSERT INTO ForumComments (forum_id, user_id, comment, timestamp)
VALUES (22, 34, 'Will the upgrade affect VPN services?', '2025-03-12 14:45:00');


-- Post 23: New Break Room Renovation
INSERT INTO Forum (title, description, forum_category, user_id, is_pinned, likes_count, timestamp)
VALUES ('New Break Room Renovation', 
        'HR announces that the break room will be renovated next month. Suggestions for new features are welcome.', 
        'HR Announcements', 15, 0, 40, '2025-03-13 08:00:00');

-- Comments for Post 3
INSERT INTO ForumComments (forum_id, user_id, comment, timestamp)
VALUES (23, 101, 'Looking forward to a modern break room!', '2025-03-13 08:20:00');
INSERT INTO ForumComments (forum_id, user_id, comment, timestamp)
VALUES (23, 57, 'I hope they add a coffee machine upgrade as well.', '2025-03-13 08:35:00');


-- Post 24: Weekly Q&A Session
INSERT INTO Forum (title, description, forum_category, user_id, is_pinned, likes_count, timestamp)
VALUES ('Weekly Q&A Session', 
        'Join us for the weekly Q&A session this Friday where management will answer your questions live.', 
        'General Chat', 92, 0, 28, '2025-03-14 16:45:00');

-- Comments for Post 4
INSERT INTO ForumComments (forum_id, user_id, comment, timestamp)
VALUES (24, 33, 'Will there be an option to submit questions anonymously?', '2025-03-14 17:00:00');
INSERT INTO ForumComments (forum_id, user_id, comment, timestamp)
VALUES (24, 118, 'Excited for the session!', '2025-03-14 17:10:00');


-- Post 25: IT Security Update
INSERT INTO Forum (title, description, forum_category, user_id, is_pinned, likes_count, timestamp)
VALUES ('IT Security Update', 
        'Please update your passwords and review the new IT security guidelines to ensure data safety.', 
        'IT Support', 80, 0, 35, '2025-03-15 11:30:00');

-- Comments for Post 5
INSERT INTO ForumComments (forum_id, user_id, comment, timestamp)
VALUES (25, 22, 'I already changed mine last week, thanks for the reminder.', '2025-03-15 11:45:00');


-- Post 26: Casual Friday: Dress Code Clarification
INSERT INTO Forum (title, description, forum_category, user_id, is_pinned, likes_count, timestamp)
VALUES ('Casual Friday: Dress Code Clarification', 
        'HR clarifies the dress code for Casual Fridays. No more formal attire is required!', 
        'HR Announcements', 105, 0, 20, '2025-03-16 10:00:00');

-- Comments for Post 6
INSERT INTO ForumComments (forum_id, user_id, comment, timestamp)
VALUES (26, 87, 'Great! Casual Fridays are always welcome.', '2025-03-16 10:15:00');
INSERT INTO ForumComments (forum_id, user_id, comment, timestamp)
VALUES (26, 64, 'Looking forward to a relaxed day.', '2025-03-16 10:20:00');


-- Post 27: Office Wi-Fi Outage
INSERT INTO Forum (title, description, forum_category, user_id, is_pinned, likes_count, timestamp)
VALUES ('Office Wi-Fi Outage', 
        'We are experiencing intermittent Wi-Fi outages today. IT is investigating the issue.', 
        'IT Support', 70, 0, 12, '2025-03-17 09:45:00');

-- Comments for Post 7
INSERT INTO ForumComments (forum_id, user_id, comment, timestamp)
VALUES (27, 41, 'Happening to me too, hope it gets fixed soon.', '2025-03-17 10:00:00');


-- Post 28: Weekend Plans Discussion
INSERT INTO Forum (title, description, forum_category, user_id, is_pinned, likes_count, timestamp)
VALUES ('Weekend Plans Discussion', 
        'What are everyone''s plans for the upcoming weekend? Share your ideas and let''s get some inspiration!', 
        'General Chat', 110, 0, 50, '2025-03-18 17:30:00');

-- Comments for Post 8
INSERT INTO ForumComments (forum_id, user_id, comment, timestamp)
VALUES (28, 95, 'I''m planning a hiking trip with my family.', '2025-03-18 17:45:00');
INSERT INTO ForumComments (forum_id, user_id, comment, timestamp)
VALUES (28, 72, 'Thinking of a movie marathon at home.', '2025-03-18 18:00:00');


-- Post 29: Open Enrollment for Benefits
INSERT INTO Forum (title, description, forum_category, user_id, is_pinned, likes_count, timestamp)
VALUES ('Open Enrollment for Benefits', 
        'Open enrollment for employee benefits starts next week. Please review the options and prepare your selections.', 
        'HR Announcements', 50, 0, 42, '2025-03-20 08:30:00');

-- Comments for Post 9
INSERT INTO ForumComments (forum_id, user_id, comment, timestamp)
VALUES (29, 66, 'I have some questions about the new health plan.', '2025-03-20 08:45:00');
INSERT INTO ForumComments (forum_id, user_id, comment, timestamp)
VALUES (29, 39, 'Looking forward to the changes!', '2025-03-20 09:00:00');


-- Post 30 Favorite Local Restaurants
INSERT INTO Forum (title, description, forum_category, user_id, is_pinned, likes_count, timestamp)
VALUES ('Favorite Local Restaurants', 
        'Let''s share our favorite local restaurants around the office. Recommendations are welcome!', 
        'General Chat', 133, 0, 60, '2025-03-25 12:00:00');

-- Comments for Post 30
INSERT INTO ForumComments (forum_id, user_id, comment, timestamp)
VALUES (30, 101, 'I love the Italian place on 5th street. Great pasta and ambiance.', '2025-03-25 12:15:00');
INSERT INTO ForumComments (forum_id, user_id, comment, timestamp)
VALUES (30, 58, 'The new sushi bar downtown is a must-try.', '2025-03-25 12:20:00');

-- 31
INSERT INTO Forum (title, description, forum_category, user_id, is_pinned, likes_count, timestamp)
VALUES ('Password Woes: My Birth Year is My Password',
        'How can I change my password? My current password is my birth year and I want to change it before everyone finds out my age!',
        'IT Support', 101, 0, 12, '2025-03-03 10:00:00');
INSERT INTO ForumComments (forum_id, user_id, comment, timestamp)
VALUES (31, 105, 'I totally get it! My age is a secret too.', '2025-03-03 10:15:00'),
       (31, 87, 'Maybe try using a random string next time!', '2025-03-03 10:20:00');

-- 32
INSERT INTO Forum (title, description, forum_category, user_id, is_pinned, likes_count, timestamp)
VALUES ('123456: The Password Everyone Knows',
        'I thought using "123456" was a clever idea until I realized it was a universal joke. Help me upgrade my password!',
        'IT Support', 78, 0, 7, '2025-03-06 09:15:00');
INSERT INTO ForumComments (forum_id, user_id, comment, timestamp)
VALUES (32, 82, 'Time to change that, seriously!', '2025-03-06 09:30:00');

-- 33
INSERT INTO Forum (title, description, forum_category, user_id, is_pinned, likes_count, timestamp)
VALUES ('Reset Password or Reset My Life?',
        'I''ve been bombarded with reset password emails. Can someone please tell me why my inbox is on fire?',
        'IT Support', 33, 0, 5, '2025-03-08 14:45:00');

-- 34
INSERT INTO Forum (title, description, forum_category, user_id, is_pinned, likes_count, timestamp)
VALUES ('Coffee is My Only Colleague',
        'Today, I realized that at Opossum Dynamics, the coffee machine is the only coworker who never complains. It even makes my day!',
        'General Chat', 12, 0, 18, '2025-03-03 08:15:00');
-- 35
INSERT INTO Forum (title, description, forum_category, user_id, is_pinned, likes_count, timestamp)
VALUES ('Meeting Marathon Mayhem',
        'I spent the entire day in meetings. I now know what my coworkers sound like even if I can''t see them. Can someone please hit pause?',
        'General Chat', 34, 0, 22, '2025-03-05 10:00:00');

-- 36
INSERT INTO Forum (title, description, forum_category, user_id, is_pinned, likes_count, timestamp)
VALUES ('The Mysterious Disappearance of Snacks',
        'Every day at Opossum Dynamics, the break room snacks vanish mysteriously. I suspect a secret midnight snack society!',
        'General Chat', 67, 0, 17, '2025-03-16 15:45:00');

