-- #region Enrollment
create table if not exists course_enrollments (
    id uuid primary key,
    user_id uuid references users (id),
    completed_topics integer,
    course_id uuid references courses (id),
    topics_count integer
);

create table if not exists topic_enrollments (
    id uuid primary key,
    enrollment_id uuid references course_enrollments (id),
    topic_id uuid references topics (id),
    completed_questions integer,
    question_count integer
);

create table if not exists topic_attempts (
    id bigserial primary key,
    topic_enrollment_id uuid references topic_enrollments (id),
    attempted_at timestamptz,
    completed_questions integer,
    question_count integer
);

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

-- #endregion
