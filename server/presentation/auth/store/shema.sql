create table sessions (
    id uuid primary key,
    user_id uuid references users (id),
    device jsonb not null,
    current_token text not null,
    last_activity timestamptz not null
);