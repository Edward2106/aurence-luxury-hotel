ALTER USER 'root' @'localhost' IDENTIFIED WITH caching_sha2_password BY '';
CREATE USER IF NOT EXISTS 'root' @'127.0.0.1' IDENTIFIED WITH caching_sha2_password BY '';
GRANT ALL PRIVILEGES ON *.* TO 'root' @'localhost';
GRANT ALL PRIVILEGES ON *.* TO 'root' @'127.0.0.1';
FLUSH PRIVILEGES;