-- #region User
create view v_users_r as
select 
    u.id,
    u.name, 
    u.telegram_link,
    coalesce(
        (select array_agg(ur.name) from user_roles ur where ur.user_id = u.id),
        Array[]::text[]
    ) as roles
from users u
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
CREATE VIEW v_questions_r AS 
SELECT 
    q.*,
    COALESCE(
        (SELECT jsonb_agg(a) FROM answers a WHERE a.question_id = q.id),
        '[]'::jsonb
    ) AS answers
FROM questions q
-- #endregion


-- #region Topic
create view v_topics_r as
SELECT 
    t.*, 
    (select count(DISTINCT id) from questions where by_topic_id = t.id) as questions_count
from topics t;
-- #endregion


-- #region Enrollment
create view v_enrollments_r as
select 
    ce.*,  
    round(completed_topics::numeric / topics_count, 2) as progress,
    c.title as course_title,
    c.description as course_description
from course_enrollments ce
join courses c on ce.course_id = c.id;
-- #endregion


