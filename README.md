CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  role TEXT NOT NULL,          -- 'user' or 'model'
  content TEXT NOT NULL,              -- message text
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

select * from messages;

insert into messages (role,content) values ('user','Hii Good morning');

drop table messages
