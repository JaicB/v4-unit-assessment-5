INSERT INTO helo_users (id, username, password, profile_pic)
VALUES ($1, $2, $3, $4)
returning *;