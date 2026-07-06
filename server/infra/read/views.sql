
create view users_r as
select 
    data->'_username'->>'_value' as username,
    data->'_telegramLink'->>'_value' as telegramLink,
    data->'_roles'->>'_value'
from users


-- #region Course
create view v_courses_r as
SELECT 
    id,
    c.data -> '_title' ->> '_value' AS title,
    c.data -> '_description' ->> '_value' AS description,
    c.data -> '_status' ->> '_value' AS status,
    (c.data -> '_createdBy' ->> '_value')::uuid AS createdBy,
    (select data->'_username'->>'_value' from users where id = c.data->'_createdBy'->>'_value') as createdByName, 
    (SELECT count(*) from topics WHERE data->'' = c.id) as topics_count,
    (SELECT count(*) FROM course_enrollments where course_id = c.id) as students_count
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


