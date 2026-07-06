create table sessions () inherits (table);

create index idx_sessions_userid on sessions ((data->>"userID"))