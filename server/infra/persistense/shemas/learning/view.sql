create view v_enrollments_w as 
select 
    ce.*,
    (
        select coalesce(
            jsonb_agg(
                jsonb_build_object(
                    'topic', to_jsonb(te),
                    'attempts', (
                        select coalesce(
                            jsonb_agg(to_jsonb(ta)),
                            '[]'
                        )
                        from topic_attempts ta
                        where ta.topic_enrollment_id = te.id
                    )
                )
            ), 
            '[]'
        )
        from topic_enrollments te
        where te.enrollment_id = ce.id
    ) as topics
from course_enrollments ce;

create view v_enrollments_r as
select * from course_enrollments;

