CREATE DATABASE todoist;
USE todoist;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255)
);
CREATE TABLE task (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    completed BOOLEAN DEFAULT false,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE shared_task (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT,
    user_id INT,
    shared_with_id INT,
    FOREIGN KEY (task_id) REFERENCES task(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (shared_with_id) REFERENCES users(id)
);
INSERT INTO users (name, email, password)
VALUES ('Alan', 'user1@example.com', "password1");
INSERT INTO users (name, email, password)
VALUES ('Javier', 'user2@example.com', 'password2');
INSERT INTO task (title, user_id)
VALUES ('Realizar el ejercicio del día', 1),
    ('Comprar comida para la cena', 1),
    ('Aprender más sobre HTML y CSS', 1),
    ('Realizar el informe del proyecto', 1),
    ('Reunión con el equipo de desarrollo', 1),
    ('Aprender a usar PHP', 1),
    (
        'Investigar sobre las mejoras en la seguridad del sistema',
        1
    ),
    ('Conseguir la documentación necesaria', 1),
    (
        'Probar el sistema para identificar posibles fallos',
        1
    );
INSERT INTO shared_task (task_id, user_id, shared_with_id)
VALUES (1, 1, 2);
SELECT task.*,
    shared_task.shared_with_id
FROM task
    LEFT JOIN shared_task ON task.id = shared_task.task_id
WHERE task.user_id = [user_id]
    OR shared_task.shared_with_id = [user_id];
SELECT id,
    task_id
FROM shared_task
ORDER BY user_id;
DELETE t1
FROM shared_task t1
    INNER JOIN shared_task t2
WHERE t1.id > t2.id
    AND t1.task_id = t2.task_id;