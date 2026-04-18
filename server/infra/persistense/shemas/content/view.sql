create view v_questions_w as 
SELECT 
    q.*, 
    COALESCE(
        jsonb_agg(a) FILTER (WHERE a.id IS NOT NULL), 
        '[]'
    ) AS answers
FROM questions q
LEFT JOIN answers a ON q.id = a.question_id
GROUP BY q.id;

create view v_questions_r as 
SELECT 
    q.*, 
    COALESCE(
        jsonb_agg(a) FILTER (WHERE a.id IS NOT NULL), 
        '[]'
    ) AS answers
FROM questions q
LEFT JOIN answers a ON q.id = a.question_id
GROUP BY q.id;

create view v_courses_w as 
SELECT * from courses;

create view v_courses_r as 
SELECT * from courses;

create view v_topics_w as
SELECT * from topics;

create view v_topics_r as
SELECT * from topics;
