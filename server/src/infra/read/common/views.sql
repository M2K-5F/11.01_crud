CREATE OR REPLACE FUNCTION hashmap_each(hashmap_data jsonb)
RETURNS TABLE(key jsonb, value jsonb) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (ans.key)::jsonb AS key,
        ans.value AS value
    FROM jsonb_each(hashmap_data->'_value') AS ans;
END;
$$ LANGUAGE plpgsql IMMUTABLE STRICT;


CREATE OR REPLACE FUNCTION val(vo_data jsonb)
RETURNS text AS $$
BEGIN
    RETURN vo_data->>'_value';
END;
$$ LANGUAGE plpgsql IMMUTABLE STRICT;



CREATE OR REPLACE FUNCTION valj(vo_data jsonb)
RETURNS jsonb AS $$
BEGIN
    RETURN vo_data->>'_value';
END;
$$ LANGUAGE plpgsql IMMUTABLE STRICT;


CREATE OR REPLACE VIEW users_r AS
SELECT 
    id,
    data->'_username'->>'_value' AS username,
    data->'_telegramLink'->>'_value' AS "telegramLink",
    jsonb_path_query_array(data, '$._roles[*]._value') AS roles
FROM users;



create view courses_r as
SELECT 
    id,
    c.data -> '_title' ->> '_value' AS title,
    c.data -> '_description' ->> '_value' AS description,
    c.data -> '_status' ->> '_value' AS status,
    c.data -> '_createdBy' ->> '_value' AS "createdBy",
    (select data->'_username'->>'_value' from users where c.data->'_createdBy' = data->'_id') as "createdByName", 
    (SELECT count(*) from topics WHERE data->'_byCourse' = c.data->'_id') as "topicsCount",
    (SELECT count(*) FROM enrollments where data->'_byCourse' = c.data->'_id') as "studentsCount"
from courses c;



CREATE VIEW topics_r AS
SELECT 
    id,
    data->'_number'->>'_value' AS number,
    data->'_title'->>'_value' AS title,
    data->'_description'->>'_value' AS description,
    data->'_status'->>'_value' AS status,
    data->'_byCourse'->>'_value' AS "courseID",
    data->'_createdBy'->>'_value' AS "createdBy",
    
    jsonb_path_query_array(data, '$._prerequisites[*]._value') AS prerequisites
FROM topics;



CREATE  VIEW questions_admin_r AS
SELECT 
    id,
    val(data->'_text') AS text,
    val(data->'_byTopic') AS "topicID",
    val(data->'_createdBy') AS "createdBy",
    
    (
        SELECT jsonb_agg(
            jsonb_build_object(
                'id', val(ans.value->'_id'),
                'text', val(ans.value->'_text'),
                'isCorrect', val(ans.value->'_correctness')::boolean
            )
        )
        FROM hashmap_each(data->'_answers') AS ans
    ) AS answers
FROM questions;



CREATE OR REPLACE VIEW course_enrollments_rs AS 
SELECT 
    id,
    val(data->'_userID') AS "userID",
    val(data->'_courseID') AS "courseID",
    val(data->'_progress')::int AS "progress",
    (
        SELECT jsonb_agg(
            jsonb_build_object(
                'id', val(value->'_id'),
                'topicID', val(value->'_topicID'),
                'completedQuestions', (valj(value->'_progress')->>'completed')::int,
                'questionCount', (valj(value->'_progress')->>'total')::int
            )
        )
        FROM hashmap_each(data->'_topicEnrollments')
    ) AS "topicEnrollments"
FROM enrollments;





