create table users (
    id text primary key,
    data jsonb not null
);

create unique index users_name_idx on users ((data->'_username'));

create table sessions (
    id text primary key,
    data jsonb not null
);

create index sessions_uid on sessions ((data -> '_userID'));


create table courses (
    id text primary key,
    data jsonb not null
);

create index idx_courses_uid on courses ((data->'_createdBy'));


create table topics (
    id text primary key,
    data jsonb not null
);

create index idx_topics_bycourse on topics ((data->'_byCourse'));


create table questions (
    id text primary key,
    data jsonb not null
);

create index idx_questions_bytopic on questions ((data->'_byTopic'));


create table enrollments (
    id text primary key,
    data jsonb not null
);
