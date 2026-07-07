create table sessions (
    id uuid primary key,
    data jsonb not null
);

create index idx_sessions_userid on sessions ((data->'userID'));