/* =========================================================
   Tests — page behavior (program-development/tests.html)
   All rows and cards are static HTML. New ones are cloned
   from the <template> elements at the end of the page.
   ========================================================= */
(function ($) {
  'use strict';

  var numberFormat = App.numberFormat;
  var BANKS_PAGE_SIZE = 10;
  var LIVE_INTERVAL = 5000;

  var nextId = 1;
  $('[data-form][data-id]').each(function () { nextId = Math.max(nextId, Number($(this).attr('data-id')) + 1); });

  /* ---------- Helpers ---------- */
  function setFields($el, values) {
    $.each(values, function (key, value) {
      $el.find('[data-field="' + key + '"]').addBack('[data-field="' + key + '"]').text(value);
    });
  }

  function formCard(id) {
    return $('#formsGrid [data-form][data-id="' + id + '"]');
  }

  function formName(id) {
    return id ? formCard(id).find('[data-field="name"]').text() : 'غير محدد';
  }

  /* Adds or renames a form <option> in every form select on the page. */
  function syncFormOption(id, name) {
    $('#assignForm, #assignFormInput, #attemptsForm, #violForm, #violFormInput').each(function () {
      var $option = $(this).find('option[value="' + id + '"]');
      if (!$option.length) {
        $option = $(new Option(name, id));
        $(this).children('option').first().after($option);
      }
      $option.text(name).attr('data-label', name);
    });
    updateAssignCounts();
  }

  /* Modal form: runs onSubmit, closes, and resets itself when the modal closes. */
  function bindModalForm(formSelector, modalSelector, onSubmit) {
    var $form = $(formSelector);
    var modal = bootstrap.Modal.getOrCreateInstance(document.querySelector(modalSelector));

    $form.on('submit', function (e) {
      e.preventDefault();
      onSubmit();
      modal.hide();
    });

    $(modalSelector).on('hidden.bs.modal', function () {
      $form[0].reset();
    });

    return modal;
  }

  /* ======================= Question banks ======================= */
  var bankState = { query: '', program: '', page: 1 };

  function bankRows() {
    return $('#banksBody tr[data-bank]');
  }

  function renderBankKpis() {
    var $rows = bankRows();
    var questions = 0;
    $rows.each(function () { questions += Number($(this).attr('data-questions')); });
    $('#kpiBanks, #kpiBanksTotal').text($rows.length);
    $('#kpiQuestions').text(numberFormat.format(questions));
    $('#kpiLinked').text($rows.not('[data-program=""]').length);
  }

  function renderBanks() {
    var $rows = bankRows();
    var $visible = $rows.filter(function () {
      var $row = $(this);
      var program = $row.attr('data-program');
      var programOk = !bankState.program ||
        (bankState.program === '__none' ? program === '' : program === bankState.program);
      return programOk && App.matches($row, bankState.query);
    });

    $rows.addClass('d-none');
    var info = App.paginate($visible, bankState.page, BANKS_PAGE_SIZE);
    bankState.page = info.page;

    $('#banksBody [data-empty]').toggleClass('d-none', info.total > 0);
    $('#banksCount').text(info.total ? 'عرض ' + info.from + '–' + info.to + ' من ' + info.total + ' بنك' : '');
    $('#banksPagination').appPagination({
      page: info.page,
      pages: info.pages,
      onChange: function (page) { bankState.page = page; renderBanks(); }
    });
  }

  function bindBanks() {
    var debounce;
    $('#bankSearch').on('input', function () {
      var value = $.trim($(this).val());
      clearTimeout(debounce);
      debounce = setTimeout(function () {
        bankState.query = value;
        bankState.page = 1;
        renderBanks();
      }, 200);
    });

    $('#bankProgram').on('change', function () {
      bankState.program = $(this).val();
      bankState.page = 1;
      renderBanks();
    });

    bindModalForm('#bankForm', '#bankModal', function () {
      var name = $.trim($('#bankName').val());
      var code = $.trim($('#bankCode').val()).toUpperCase();
      var program = $('#bankProgramInput').val();

      var $row = App.fromTemplate('bankRowTemplate')
        .addClass('app-row-new')
        .attr({ 'data-code': code, 'data-program': program, 'data-questions': 0 });
      setFields($row, { name: name, code: code, program: program });
      if (!program) {
        $row.find('[data-field="program"]').empty().append(App.fromTemplate('unlinkedBadgeTemplate'));
        $row.find('.icon-tile').removeClass('icon-tile--navy').addClass('icon-tile--warning');
      }
      $('#banksBody').prepend($row);

      bankState = { query: '', program: '', page: 1 };
      $('#bankSearch').val('');
      $('#bankProgram').val('');
      renderBankKpis();
      renderBanks();
    });
  }

  /* ======================= Test forms ======================= */
  var formsState = { status: '' };

  function formCards() {
    return $('#formsGrid [data-form]');
  }

  function renderForms() {
    var $cards = formCards();
    $('#formsStatus [data-status]').each(function () {
      var key = $(this).attr('data-status');
      $(this).toggleClass('active', key === formsState.status)
        .find('[data-count]').text(key ? $cards.filter('[data-status="' + key + '"]').length : $cards.length);
    });

    var shown = 0;
    $cards.each(function () {
      var show = !formsState.status || $(this).attr('data-status') === formsState.status;
      $(this).toggleClass('d-none', !show);
      if (show) { shown += 1; }
    });
    $('#formsGrid [data-empty]').toggleClass('d-none', shown > 0);
  }

  function readForm($card) {
    return {
      name: $card.find('[data-field="name"]').text(),
      program: $card.attr('data-program'),
      type: $card.attr('data-type'),
      status: $card.attr('data-status'),
      questions: Number($card.attr('data-questions')),
      duration: Number($card.attr('data-duration')),
      attempts: Number($card.attr('data-attempts')),
      passMark: Number($card.attr('data-pass')),
      randomOrder: $card.attr('data-random') === 'true'
    };
  }

  function writeForm($card, f) {
    $card.attr({
      'data-status': f.status,
      'data-program': f.program,
      'data-type': f.type,
      'data-questions': f.questions,
      'data-duration': f.duration,
      'data-attempts': f.attempts,
      'data-pass': f.passMark,
      'data-random': f.randomOrder
    });
    setFields($card, {
      name: f.name,
      program: f.program,
      type: f.type,
      questions: f.questions,
      duration: f.duration,
      attempts: f.attempts,
      pass: f.passMark,
      order: f.randomOrder ? 'عشوائي' : 'ثابت'
    });
    $card.find('[data-status-badge]').replaceWith(App.fromTemplate('formStatus-' + f.status));
  }

  /* A new form also gets a tracking row, a performance item and select options. */
  function addForm(values) {
    var id = nextId++;
    var $card = App.fromTemplate('formCardTemplate').attr('data-id', id);
    writeForm($card, values);
    $('#formsGrid').prepend($card);

    var $track = App.fromTemplate('trackingRowTemplate').attr('data-form-id', id);
    setFields($track, { name: values.name, type: values.type, program: values.program });
    $('#trackingBody').prepend($track);

    var $perf = App.fromTemplate('perfItemTemplate').attr('data-perf-form', id);
    setFields($perf, { name: values.name });
    $('#formPerfList').prepend($perf);

    syncFormOption(id, values.name);
    $('#kpiTrackForms').text(formCards().length);
    renderForms();
  }

  function updateFormEverywhere(id, values) {
    writeForm(formCard(id), values);
    var $track = $('#trackingBody [data-form-id="' + id + '"]');
    setFields($track, { name: values.name, type: values.type, program: values.program });
    setFields($('#formPerfList [data-perf-form="' + id + '"]'), { name: values.name });
    $('#attemptsBody tr[data-form-id="' + id + '"]').find('td').eq(1).text(values.name);
    syncFormOption(id, values.name);
    renderForms();
  }

  function bindForms() {
    var formModal = bindModalForm('#testForm', '#formModal', function () {
      var id = Number($('#formId').val());
      var values = {
        name: $.trim($('#formName').val()),
        program: $('#formProgram').val(),
        type: $('#formType').val(),
        status: $('#formStatusInput').val(),
        questions: Number($('#formQuestions').val()),
        duration: Number($('#formDuration').val()),
        attempts: Number($('#formAttempts').val()),
        passMark: Number($('#formPass').val()),
        randomOrder: $('#formRandom').is(':checked')
      };

      if (id) {
        updateFormEverywhere(id, values);
      } else {
        addForm(values);
      }
    });

    $('#btnNewForm').on('click', function () {
      $('#formId').val('');
      $('#formModalLabel').text('نموذج اختبار جديد');
      $('#formSubmit').text('إنشاء النموذج');
      $('#formType').val('بعدي');
      $('#formStatusInput').val('draft');
      formModal.show();
    });

    $('#formsStatus').on('click', '[data-status]', function () {
      formsState.status = $(this).attr('data-status');
      renderForms();
    });

    $('#formsGrid').on('click', '[data-form-action]', function () {
      var $card = $(this).closest('[data-form]');
      var id = Number($card.attr('data-id'));
      var form = readForm($card);
      var action = $(this).attr('data-form-action');

      if (action === 'edit') {
        formModal.show();
        $('#formId').val(id);
        $('#formModalLabel').text('تعديل النموذج');
        $('#formSubmit').text('حفظ التعديلات');
        $('#formName').val(form.name);
        $('#formProgram').val(form.program);
        $('#formType').val(form.type);
        $('#formStatusInput').val(form.status);
        $('#formQuestions').val(form.questions);
        $('#formDuration').val(form.duration);
        $('#formAttempts').val(form.attempts);
        $('#formPass').val(form.passMark);
        $('#formRandom').prop('checked', form.randomOrder);
      } else if (action === 'copy') {
        addForm($.extend(form, { name: form.name + ' (نسخة)', status: 'draft' }));
      } else if (action === 'attempts') {
        showTab('monitoring');
        $('#attemptsForm').val(id).trigger('change');
        setTimeout(function () {
          document.getElementById('attemptsCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
      }
    });
  }

  /* ======================= Trainees (assignments) ======================= */
  var assignState = { query: '', formId: '' };

  function assignRows() {
    return $('#assignBody tr[data-assign]');
  }

  function updateAssignCounts() {
    $('#assignForm option[value!=""]').each(function () {
      var count = assignRows().filter('[data-form-id="' + this.value + '"]').length;
      $(this).text($(this).attr('data-label') + ' (' + count + ')');
    });
  }

  function renderAssignments() {
    var $rows = assignRows();
    var shown = 0;
    $rows.each(function () {
      var $row = $(this);
      var show = (!assignState.formId || $row.attr('data-form-id') === assignState.formId) && App.matches($row, assignState.query);
      $row.toggleClass('d-none', !show);
      if (show) { shown += 1; }
    });
    $('#assignBody [data-empty]').toggleClass('d-none', shown > 0);

    var forms = {};
    $rows.each(function () { forms[$(this).attr('data-form-id')] = true; });
    $('#kpiAssign').text($rows.length);
    $('#kpiAssignForms').text(Object.keys(forms).length);
    $('#kpiAssignSelected').text(assignState.formId ? $rows.filter('[data-form-id="' + assignState.formId + '"]').length : '—');
    updateAssignCounts();
  }

  function bindAssignments() {
    var debounce;
    $('#assignSearch').on('input', function () {
      var value = $.trim($(this).val());
      clearTimeout(debounce);
      debounce = setTimeout(function () { assignState.query = value; renderAssignments(); }, 200);
    });

    $('#assignForm').on('change', function () {
      assignState.formId = $(this).val();
      renderAssignments();
    });

    var assignModal = bindModalForm('#assignFormEl', '#assignModal', function () {
      var formId = $('#assignFormInput').val();
      var $row = App.fromTemplate('assignRowTemplate').attr({ 'data-assign': '', 'data-form-id': formId });
      setFields($row, {
        name: $.trim($('#assignName').val()),
        nationalId: $.trim($('#assignId').val()),
        mobile: $.trim($('#assignMobile').val()) || '—',
        form: formName(Number(formId)),
        date: $('#assignDate').val(),
        time: $('#assignStart').val() + '–' + $('#assignEnd').val(),
        assignedOn: App.todayIso()
      });
      $('#assignBody').prepend($row);
      renderAssignments();
    });

    $('#btnNewAssign').on('click', function () {
      if (assignState.formId) { $('#assignFormInput').val(assignState.formId); }
      assignModal.show();
    });

    $('#assignBody').on('click', '[data-cancel-assign]', function () {
      $(this).closest('tr').remove();
      renderAssignments();
    });
  }

  /* ======================= Monitoring ======================= */
  var livePaused = false;
  var attemptsFormId = '';

  function renderLive() {
    var $rows = $('#liveBody tr[data-live]');
    $('#kpiLiveNow').text($rows.length);
    $('#kpiLiveForms').text(formCards().filter('[data-status="active"]').length);
    $('#liveBody [data-empty]').toggleClass('d-none', $rows.length > 0);
    $('#liveUpdated').text(new Date().toLocaleTimeString('en-GB'));
  }

  function liveTick() {
    if (livePaused || document.hidden || !$('#pane-monitoring').hasClass('active')) { return; }
    renderLive();
  }

  function setLivePaused(paused) {
    livePaused = paused;
    $('#btnLiveToggle').attr('aria-pressed', paused)
      .find('i').toggleClass('ph-pause', !paused).toggleClass('ph-play', paused);
    $('#btnLiveToggle [data-label]').text(paused ? 'استئناف' : 'إيقاف مؤقت');
    $('#liveStatus').text(paused ? 'التحديث متوقف' : 'تحديث مباشر كل 5 ثوانٍ');
    $('#liveDot').toggleClass('is-live', !paused);
    if (!paused) { renderLive(); }
  }

  function renderAttempts() {
    var shown = 0;
    $('#attemptsBody tr[data-form-id]').each(function () {
      var show = !attemptsFormId || $(this).attr('data-form-id') === String(attemptsFormId);
      $(this).toggleClass('d-none', !show);
      if (show) { shown += 1; }
    });
    $('#attemptsBody [data-empty]').toggleClass('d-none', shown > 0);
    $('#formPerfList [data-perf-form]').each(function () {
      $(this).toggleClass('active', $(this).attr('data-perf-form') === String(attemptsFormId));
    });
  }

  function bindMonitoring() {
    var entries = $('#attemptsBody tr[data-date]').map(function () {
      return { date: $(this).attr('data-date'), passed: $(this).attr('data-passed') === 'true' };
    }).get();
    $('#chartActivity').activityBars({ endDate: $('#chartActivity').attr('data-end-date'), days: 30, entries: entries });

    $('#btnLiveToggle').on('click', function () { setLivePaused(!livePaused); });

    $('#formPerfList').on('click', '[data-perf-form]', function () {
      var id = $(this).attr('data-perf-form');
      attemptsFormId = attemptsFormId === id ? '' : id;
      $('#attemptsForm').val(attemptsFormId);
      renderAttempts();
    });

    $('#attemptsForm').on('change', function () {
      attemptsFormId = $(this).val();
      renderAttempts();
    });

    renderLive();
    setInterval(liveTick, LIVE_INTERVAL);
  }

  /* ======================= Violations ======================= */
  var violState = { formId: '', status: '' };

  function violationRows() {
    return $('#violBody tr[data-status]');
  }

  function renderViolations() {
    var $rows = violationRows();
    var pending = $rows.filter('[data-status="pending"]').length;
    $('#kpiViolTotal').text($rows.length);
    $('#kpiViolPending, #kpiPendingViolations').text(pending);
    $('#kpiViolAuto').text($rows.filter('[data-source="auto"]').length);

    var shown = 0;
    $rows.each(function () {
      var $row = $(this);
      var show = (!violState.formId || $row.attr('data-form-id') === violState.formId) &&
        (!violState.status || $row.attr('data-status') === violState.status);
      $row.toggleClass('d-none', !show);
      if (show) { shown += 1; }
    });
    $('#violBody [data-empty]').toggleClass('d-none', shown > 0);
  }

  function setViolationStatus($row, status) {
    $row.attr('data-status', status);
    $row.find('[data-status-badge]').replaceWith(App.fromTemplate('violStatus-' + status));
    $row.find('[data-field="review"] > div').toggleClass('d-none', status !== 'pending');
  }

  function bindViolations() {
    $('#violForm').on('change', function () { violState.formId = $(this).val(); renderViolations(); });
    $('#violStatus').on('change', function () { violState.status = $(this).val(); renderViolations(); });

    var violationModal = bindModalForm('#violationForm', '#violationModal', function () {
      var formId = $('#violFormInput').val();
      var $row = App.fromTemplate('violationRowTemplate').attr('data-form-id', formId);
      setFields($row, {
        trainee: $.trim($('#violName').val()),
        date: App.todayIso(),
        form: formName(Number(formId)),
        type: $('#violType').val(),
        details: $.trim($('#violDetails').val()) || '—',
        action: $.trim($('#violAction').val()) || '—'
      });
      $('#violBody').prepend($row);
      renderViolations();
    });

    $('#btnNewViolation').on('click', function () { violationModal.show(); });

    $('#violBody').on('click', '[data-review]', function () {
      setViolationStatus($(this).closest('tr'), $(this).attr('data-review'));
      renderViolations();
    });
  }

  /* ======================= Tabs, uploads, search ======================= */
  function showTab(key) {
    var btn = document.getElementById('tab-' + key);
    if (btn) { bootstrap.Tab.getOrCreateInstance(btn).show(); }
  }

  function bindPage() {
    var hash = (location.hash || '').replace('#', '');
    if (hash && document.getElementById('tab-' + hash)) { showTab(hash); }

    $('#testsTabs').on('shown.bs.tab', '[data-bs-toggle="tab"]', function () {
      var key = this.id.replace('tab-', '');
      try { history.replaceState(null, '', '#' + key); } catch (e) {}
      if (key === 'monitoring' && !livePaused) { renderLive(); }
    });

    $(document).on('click', '[data-open-tab]', function (e) {
      e.preventDefault();
      showTab($(this).attr('data-open-tab'));
    });

    /* Header search: filters trainees when that tab is open, banks otherwise. */
    $(document).on('app:search', function (_, query) {
      if ($('#pane-trainees').hasClass('active')) {
        $('#assignSearch').val(query).trigger('input');
        return;
      }
      showTab('banks');
      $('#bankSearch').val(query).trigger('input');
    });
  }

  $(function () {
    renderBankKpis();
    renderBanks();
    bindBanks();

    renderForms();
    bindForms();

    renderAssignments();
    bindAssignments();

    bindMonitoring();
    renderAttempts();

    renderViolations();
    bindViolations();

    bindPage();
  });
})(jQuery);
