# Scholarship Application Management System

A web-based CRUD application for managing student scholarship applications.
Built with HTML, CSS, JavaScript, Bootstrap 5, PHP and MySQL.

## How it is organized
| Layer | Files | Job |
|---|---|---|
| HTML (view) | `index.html`, `form.html` | Page layout, Bootstrap components |
| JavaScript (controller) | `assets/js/index.js`, `assets/js/form.js` | Fetches data, builds the table, search/filter, validation |
| PHP (server) | `api/*.php`, `db_connect.php` | Talks to MySQL and returns JSON |
| MySQL | `scholarship_db.sql` | Tables `scholarships` and `applications` (foreign key) |

## Features
- Create, view, update and delete applications (CRUD)
- Dashboard with Pending / Approved / Rejected counts
- Live search and status filter (no page reload)
- Client-side and server-side validation, prepared statements, XSS-safe output
- Delete confirmation modal, responsive layout

## Local setup (XAMPP)
1. Copy this folder to `C:\xampp\htdocs\scholarship_system`
2. Start Apache and MySQL in XAMPP
3. In phpMyAdmin create an empty database `scholarship_db`, select it, and Import `scholarship_db.sql`
4. Open http://localhost/scholarship_system/ (do not open the .html file by double-clicking)

## Deployment
Hosted on InfinityFree. Update the 4 credentials in `db_connect.php`.

## Author
Nygel John S. Coniza - 3-SD - Web Systems Technologies
