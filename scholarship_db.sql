-- Scholarship Application Management System
-- HOW TO IMPORT: first create an EMPTY database in phpMyAdmin, select it, then Import this file.
-- (No CREATE DATABASE / USE lines, so it works on XAMPP and InfinityFree.)

CREATE TABLE scholarships (
  scholarship_id INT AUTO_INCREMENT PRIMARY KEY,
  name           VARCHAR(100) NOT NULL,
  sponsor        VARCHAR(100) NOT NULL,
  slots          INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE applications (
  application_id INT AUTO_INCREMENT PRIMARY KEY,
  scholarship_id INT NOT NULL,
  student_name   VARCHAR(100) NOT NULL,
  email          VARCHAR(100) NOT NULL,
  course         VARCHAR(100) NOT NULL,
  year_level     TINYINT NOT NULL,
  gpa            DECIMAL(3,2) NOT NULL,
  status         ENUM('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending',
  date_applied   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_app_scholarship FOREIGN KEY (scholarship_id)
    REFERENCES scholarships(scholarship_id)
) ENGINE=InnoDB;

INSERT INTO scholarships (name, sponsor, slots) VALUES
('Academic Excellence Grant', 'University', 10),
('CHED Scholarship', 'CHED', 20),
('Barangay Educational Aid', 'LGU', 15);

INSERT INTO applications (scholarship_id, student_name, email, course, year_level, gpa, status) VALUES
(1, 'Juan Dela Cruz', 'juan@example.com', 'BSIT', 2, 1.50, 'Pending'),
(2, 'Maria Santos', 'maria@example.com', 'BSED', 3, 1.75, 'Approved'),
(3, 'Pedro Reyes', 'pedro@example.com', 'BSBA', 1, 2.25, 'Rejected');
