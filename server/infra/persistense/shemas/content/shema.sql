create table if not exists courses (
    id uuid not null primary key,
    title varchar(64) not null,
    description varchar(128) not null,
    status archive_status,
    created_by uuid references users (id)
);

create table if not exists topics (
    id uuid not null primary key,
    title varchar(64) not null,
    description varchar(128) NOT null,
    status archive_status,
    created_by uuid references users (id),
    by_course uuid references courses (id)
);

create table if not exists questions (
    id uuid not null primary key,
    text text not null,
    by_topic uuid references topics (id),
    created_by uuid references users (id)
);


create table if not exists answers (
    id uuid not null primary key,
    text varchar(255) not null,
    is_correct boolean not null,
    question_id uuid references questions (id)
);

CREATE VIEW if not exists questions_with_answers AS
SELECT 
    q.*, 
    COALESCE(
        jsonb_agg(a ORDER BY a.id) FILTER (WHERE a.id IS NOT NULL), 
        '[]'
    ) AS answers
FROM questions q
LEFT JOIN answers a ON q.id = a.question_id
GROUP BY q.id;
