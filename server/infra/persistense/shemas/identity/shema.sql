create table if not exists users (
    id uuid not null primary key,
    name varchar(64) not null,
    password_hash varchar(255) not null,
    telegram_link varchar(255) not null
);

create table if not exists user_roles (
    id serial primary key,
    name text,
    user_id uuid references users (id)
);

create index users_id_idx on users (id);

create index users_name_idx on users (name);