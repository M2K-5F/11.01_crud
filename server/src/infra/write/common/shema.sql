create table users (
    id uuid primary key,
    data jsonb not null
);

create unique index users_name_idx on users ((data->'_username'));


create table courses (
    id uuid primary key,
    data jsonb not null
);

create index idx_courses_uid on courses ((data->'_createdBy'));


create table topics (
    id uuid primary key,
    data jsonb not null
);

create index idx_topics_bycourse on topics ((data->'_byCourse'));


create table questions (
    id uuid primary key,
    data jsonb not null
);

create index idx_questions_bytopic on questions ((data->'_byTopic'));


create table enrollments (
    id uuid primary key,
    data jsonb not null
);
