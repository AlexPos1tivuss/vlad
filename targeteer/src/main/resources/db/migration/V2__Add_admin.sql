-- Вставка администратора
insert into _user
(first_name, last_name, login, email, position, password, role, manager_id, salary)
values
    ('Admin', 'Super', 'admin', 'admin@example.com', 'Administrator', '$2a$10$xhdIj30YqfwhYHzKtBa19uJ9UkeAwirF0/KMfnv5I7/O6r8KdLqSK', 'ADMIN', NULL, null);
