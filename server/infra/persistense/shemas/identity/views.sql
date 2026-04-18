create VIEW v_users_w as
select u.*, coalesce(array_agg(ur.name) filter (where ur.name is not null), Array[]::text[]) as roles 
from users u
left join user_roles ur 
on u.id = ur.user_id
group by u.id;

create VIEW v_users_r as
select u.name, u.telegram_link, u.id, coalesce(array_agg(ur.name) filter (where ur.name is not null), Array[]::text[]) as roles 
from users u
left join user_roles ur 
on u.id = ur.user_id
group by u.id;