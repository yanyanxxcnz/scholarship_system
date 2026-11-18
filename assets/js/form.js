/**
 * assets/js/form.js - behaviour of form.html (Add AND Edit)
 * - form.html            -> Add mode
 * - form.html?id=5       -> Edit mode (loads record 5 from api/get.php)
 * Saving sends the data to api/save.php.
 */
document.addEventListener('DOMContentLoaded', function () {

  var form = document.getElementById('appForm');
  var errorsBox = document.getElementById('errors');
  var saveBtn = document.getElementById('saveBtn');
  var id = parseInt(new URLSearchParams(window.location.search).get('id'), 10) || 0;
  var FIELDS = ['student_name', 'email', 'course', 'year_level', 'gpa', 'scholarship_id', 'status'];

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function showErrors(list) {
    errorsBox.innerHTML = '<div class="alert alert-danger"><ul class="mb-0">' +
      list.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul></div>';
  }

  /** Save a message, then go back to the list, where index.js shows it. */
  function goToList(message, type) {
    try { sessionStorage.setItem('flash', JSON.stringify({ msg: message, type: type })); } catch (err) { /* ignore */ }
    window.location.href = 'index.html';
  }

  /** Fill the scholarship dropdown (api/scholarships.php). */
  function loadScholarships() {
    return fetch('api/scholarships.php')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (!data.success) { throw new Error('failed'); }
        document.getElementById('scholarship_id').innerHTML = data.scholarships.map(function (s) {
          return '<option value="' + esc(s.scholarship_id) + '">' + esc(s.name) + ' (' + esc(s.sponsor) + ')</option>';
        }).join('');
      });
  }

  /** Edit mode: pre-fill the form with the existing record (api/get.php). */
  function loadRecord() {
    return fetch('api/get.php?id=' + id)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (!data.success) { goToList('Application not found.', 'danger'); return; }
        FIELDS.forEach(function (f) { document.getElementById(f).value = data.application[f]; });
        document.getElementById('id').value = id;
        document.getElementById('formTitle').textContent = 'Edit Application #' + id;
        saveBtn.textContent = 'Update Application';
      });
  }

  loadScholarships()
    .then(function () { if (id > 0) { return loadRecord(); } })
    .catch(function () {
      showErrors(['Could not load data. Is MySQL running and is the database imported?']);
    });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    form.classList.add('was-validated');
    if (!form.checkValidity()) { return; }

    var payload = { id: id };
    FIELDS.forEach(function (f) { payload[f] = document.getElementById(f).value; });

    saveBtn.disabled = true;
    fetch('api/save.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          goToList(data.message, 'success');
        } else {
          showErrors(data.errors);
          saveBtn.disabled = false;
        }
      })
      .catch(function () {
        showErrors(['Could not save. Please try again.']);
        saveBtn.disabled = false;
      });
  });
});
