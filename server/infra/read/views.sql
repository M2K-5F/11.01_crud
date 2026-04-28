-- #region User
create VIEW v_users_r as
select u.name, u.telegram_link, u.id, coalesce(array_agg(ur.name) filter (where ur.name is not null), Array[]::text[]) as roles 
from users u
left join user_roles ur 
on u.id = ur.user_id
group by u.id;
-- #endregion


-- #region Course
create view v_courses_r as
SELECT 
    c.*, 
    (select name from users where id = c.created_by_id) as created_by, 
    (SELECT count(DISTINCT id) from topics WHERE by_course_id = c.id) as topics_count,
    (SELECT count(DISTINCT id) FROM course_enrollments where course_id = c.id) as students_count
from courses c
-- #endregion


-- #region Question
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
-- #endregion


-- #region Topic
create view v_topics_r as
SELECT * from topics;
-- #endregion


-- #region Enrollment
create view v_enrollments_r as
select * from course_enrollments;
-- #endregion
