/**
 * assets/js/index.js - behaviour of index.html
 * 1) Loads the applications from api/list.php and builds the table
 * 2) Live search + status filter
 * 3) Delete with a confirmation modal (api/delete.php)
 */
document.addEventListener('DOMContentLoaded', function () {

  var body = document.getElementById('appBody');
  var searchBox = document.getElementById('searchBox');
  var statusFilter = document.getElementById('statusFilter');
  var noResults = document.getElementById('noResults');
  var flash = document.getElementById('flash');
  var deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
  var pendingDeleteId = null;

  var BADGES = { Pending: 'warning text-dark', Approved: 'success', Rejected: 'danger' };

  /** Escape text so user input can never inject HTML/JS (XSS protection). */
  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function showAlert(message, type) {
    flash.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible fade show" role="alert">' +
      esc(message) + '<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
  }

  /** Show a message that was saved before a page redirect (see form.js). */
  function showStoredFlash() {
    try {
      var stored = sessionStorage.getItem('flash');
      if (stored) {
        var f = JSON.parse(stored);
        showAlert(f.msg, f.type);
        sessionStorage.removeItem('flash');
      }
    } catch (err) { /* ignore */ }
  }

  /** Build the table rows from the data sent by PHP. */
  function render(data) {
    ['Pending', 'Approved', 'Rejected'].forEach(function (s) {
      document.getElementById('count-' + s).textContent = data.counts[s];
    });

    body.innerHTML = data.applications.map(function (a) {
      return '<tr data-status="' + esc(a.status) + '">' +
        '<td>' + esc(a.application_id) + '</td>' +
        '<td>' + esc(a.student_name) + '<br><small class="text-muted">' + esc(a.email) + '</small></td>' +
        '<td>' + esc(a.course) + ' - ' + esc(a.year_level) + '</td>' +
        '<td>' + esc(a.gpa) + '</td>' +
        '<td>' + esc(a.scholarship_name) + '</td>' +
        '<td><span class="badge bg-' + BADGES[a.status] + '">' + esc(a.status) + '</span></td>' +
        '<td class="text-nowrap">' +
          '<a href="form.html?id=' + encodeURIComponent(a.application_id) + '" class="btn btn-sm btn-warning">Edit</a> ' +
          '<button type="button" class="btn btn-sm btn-danger btn-delete" data-id="' + esc(a.application_id) +
          '" data-name="' + esc(a.student_name) + '">Delete</button>' +
        '</td></tr>';
    }).join('');

    applyFilters();
  }

  /** Hide rows that do not match the search text or the selected status. */
  function applyFilters() {
    var text = searchBox.value.toLowerCase();
    var status = statusFilter.value;
    var visible = 0;
    body.querySelectorAll('tr').forEach(function (row) {
      var show = row.textContent.toLowerCase().indexOf(text) !== -1 &&
                 (status === '' || row.dataset.status === status);
      row.classList.toggle('d-none', !show);
      if (show) visible++;
    });
    noResults.classList.toggle('d-none', visible !== 0);
  }

  /** Ask PHP for the data (api/list.php). */
  function loadApplications() {
    fetch('api/list.php')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (!data.success) { throw new Error('failed'); }
        render(data);
      })
      .catch(function () {
        body.innerHTML = '';
        showAlert('Could not load applications. Is MySQL running and is the database imported?', 'danger');
      });
  }

  searchBox.addEventListener('input', applyFilters);
  statusFilter.addEventListener('change', applyFilters);

  // Delete button clicked: open the confirmation modal
  body.addEventListener('click', function (event) {
    var btn = event.target.closest('.btn-delete');
    if (!btn) { return; }
    pendingDeleteId = btn.dataset.id;
    document.getElementById('deleteName').textContent = btn.dataset.name;
    deleteModal.show();
  });

  // "Delete" confirmed: tell PHP to delete the record (api/delete.php)
  document.getElementById('confirmDelete').addEventListener('click', function () {
    fetch('api/delete.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: pendingDeleteId })
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        deleteModal.hide();
        showAlert(data.success ? data.message : data.errors.join(' '), data.success ? 'warning' : 'danger');
        loadApplications();
      })
      .catch(function () {
        deleteModal.hide();
        showAlert('Delete failed. Please try again.', 'danger');
      });
  });

  showStoredFlash();
  loadApplications();
});
