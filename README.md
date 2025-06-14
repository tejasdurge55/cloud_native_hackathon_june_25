CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  role TEXT NOT NULL,          
  content TEXT NOT NULL,              
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

select * from messages;

insert into messages (role,content) values ('user','Hii Good morning');

drop table messages

for ($i=0; $i -lt 100; $i++) { Invoke-WebRequest -Uri "https://dummy.flyku.com" -Method Head -UseBasicParsing | Out-Null }
