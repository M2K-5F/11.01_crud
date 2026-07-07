CREATE OR REPLACE VIEW users_r AS
SELECT 
    id,
    data->'_username'->>'_value' AS username,
    data->'_telegramLink'->>'_value' AS telegramLink,
    jsonb_path_query_array(data, '$._roles[*]._value') AS roles
FROM users;



create view courses_r as
SELECT 
    id,
    c.data -> '_title' ->> '_value' AS title,
    c.data -> '_description' ->> '_value' AS description,
    c.data -> '_status' ->> '_value' AS status,
    c.data -> '_createdBy' ->> '_value' AS createdBy,
    (select data->'_username'->>'_value' from users where c.data->'_createdBy' = data->'_id') as createdByName, 
    (SELECT count(*) from topics WHERE data->'_byCourse' = c.data->'_id') as topicsCount,
    (SELECT count(*) FROM enrollments where data->'_byCourse' = c.data->'_id') as studentsCount
from courses c;



CREATE VIEW topics_r AS
SELECT 
    id,
    data->'_number'->>'_value' AS number,
    data->'_title'->>'_value' AS title,
    data->'_description'->>'_value' AS description,
    data->'_status'->>'_value' AS status,
    data->'_byCourse'->>'_value' AS courseID,
    data->'_createdBy'->>'_value' AS createdBy,
    
    jsonb_path_query_array(data, '$._prerequisites[*]._value') AS prerequisites
FROM topics;



CREATE  VIEW questions_admin_r AS
SELECT 
    id,
    data->'_text'->>'_value' AS text,
    data->'_byTopic'->>'_value' AS topicID,
    data->'_createdBy'->>'_value' AS createdBy,
    
    (
        SELECT jsonb_agg(
            jsonb_build_object(
                'id', ans.value->'_id'->>'_value',
                'text', ans.value->'_text'->>'_value',
                'isCorrect', (ans.value->'_correctness'->>'_value')::boolean
            )
        )
        FROM jsonb_each(data->'_answers') AS ans
    ) AS answers
FROM questions;

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


