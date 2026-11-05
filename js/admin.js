/* ==========================================================================
   مُنطلق (Prompt) — Admin Dashboard
   ========================================================================== */
(function () {
  'use strict';

  const Core = window.MontalaqCore;
  if (!Core) {
    console.error('MontalaqCore is not available. Ensure js/app.js is loaded before js/admin.js.');
    return;
  }

  const {
    CATEGORIES,
    CATEGORY_MAP,
    MODELS,
    DIFFICULTIES,
    KEYS,
    icon,
    escapeHTML,
    uid,
    formatNumber,
    formatDate,
    normalizeSearch,
    debounce,
    normalizePrompt,
    loadPrompts,
    savePrompts,
    resetPrompts,
    getSuggestions,
    saveSuggestions,
    copyText,
    toast
  } = Core;

  const ADMIN_PASSWORD_KEY = 'montalaq_admin_password_v1';
  const ADMIN_SESSION_KEY = 'montalaq_admin_session_v1';
  const DEFAULT_ADMIN_PASSWORD = '11111';
  const PASSWORD_MIN_LENGTH = 5;
  const PASSWORD_MAX_LENGTH = 64;

  const state = {
    prompts: [],
    suggestions: [],
    panel: 'overview',
    editingId: null,
    pendingSuggestionId: null,
    confirmAction: null,
    promptQuery: '',
    categoryFilter: 'all',
    difficultyFilter: 'all'
  };

  const elements = {};
  let initialized = false;
  let initializing = false;
  let authBusy = false;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
  } else {
    bootstrap();
  }

  function bootstrap() {
    cacheAuthElements();
    bindAuthEvents();
    setAuthYear();

    if (hasAdminSession()) {
      activateAdmin({ persistSession: false });
    } else {
      showAuthGate();
    }
  }

  /* ------------------------------------------------------------------------
     Admin authentication
     ------------------------------------------------------------------------ */
  function cacheAuthElements() {
    elements.authGate = document.getElementById('adminAuthGate');
    elements.authForm = document.getElementById('adminLoginForm');
    elements.authPassword = document.getElementById('adminLoginPassword');
    elements.authToggle = document.getElementById('adminLoginToggle');
    elements.authError = document.getElementById('adminLoginError');
    elements.authSubmit = document.getElementById('adminLoginSubmit');
    elements.authYear = document.getElementById('authYear');
    elements.logoutBtn = document.getElementById('adminLogoutBtn');
    elements.logoutSettingsBtn = document.getElementById('adminLogoutSettingsBtn');
    elements.passwordForm = document.getElementById('adminPasswordForm');
    elements.currentPassword = document.getElementById('currentAdminPassword');
    elements.newPassword = document.getElementById('newAdminPassword');
    elements.confirmPassword = document.getElementById('confirmAdminPassword');
    elements.changePasswordBtn = document.getElementById('changeAdminPasswordBtn');
    elements.passwordMessage = document.getElementById('passwordChangeMessage');
    elements.defaultPasswordHint = document.getElementById('defaultPasswordHint');
  }

  function bindAuthEvents() {
    elements.authForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (authBusy) return;

      const password = elements.authPassword?.value || '';
      clearAuthError();

      if (!password) {
        showAuthError('أدخل كلمة المرور أولًا.');
        elements.authPassword?.focus();
        return;
      }

      authBusy = true;
      if (elements.authSubmit) elements.authSubmit.disabled = true;

      try {
        const valid = await verifyAdminPassword(password);
        if (!valid) {
          showAuthError('كلمة المرور غير صحيحة. تحقّق منها وحاول مرة أخرى.');
          if (elements.authPassword) {
            elements.authPassword.value = '';
            elements.authPassword.focus();
          }
          return;
        }
        await activateAdmin({ persistSession: true });
        toast('مرحبًا بك في لوحة التحكم.');
      } catch (error) {
        showAuthError('تعذّر التحقق من كلمة المرور في هذا المتصفح. أعد المحاولة.');
      } finally {
        authBusy = false;
        if (elements.authSubmit) elements.authSubmit.disabled = false;
      }
    });

    elements.authPassword?.addEventListener('input', clearAuthError);

    elements.authToggle?.addEventListener('click', () => {
      if (!elements.authPassword) return;
      const show = elements.authPassword.type === 'password';
      elements.authPassword.type = show ? 'text' : 'password';
      elements.authToggle.setAttribute('aria-pressed', String(show));
      elements.authToggle.setAttribute('aria-label', show ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور');
      const eyeShow = elements.authToggle.querySelector('[data-eye="show"]');
      const eyeHide = elements.authToggle.querySelector('[data-eye="hide"]');
      if (eyeShow) eyeShow.hidden = show;
      if (eyeHide) eyeHide.hidden = !show;
      elements.authPassword.focus();
    });

    elements.logoutBtn?.addEventListener('click', logoutAdmin);
    elements.logoutSettingsBtn?.addEventListener('click', logoutAdmin);
    elements.passwordForm?.addEventListener('submit', handlePasswordChange);
    elements.currentPassword?.addEventListener('input', () => setPasswordMessage(''));
    elements.newPassword?.addEventListener('input', () => setPasswordMessage(''));
    elements.confirmPassword?.addEventListener('input', () => setPasswordMessage(''));
  }

  function showAuthGate() {
    document.body.classList.add('auth-locked');
    if (elements.authGate) {
      elements.authGate.hidden = false;
      elements.authGate.removeAttribute('aria-hidden');
    }
    elements.authForm?.reset();
    if (elements.authPassword) elements.authPassword.type = 'password';
    resetAuthToggle();
    clearAuthError();
    updateDefaultPasswordHint();
    setTimeout(() => elements.authPassword?.focus(), 80);
  }

  async function activateAdmin(options = {}) {
    if (options.persistSession) setAdminSession(true);

    document.body.classList.remove('auth-locked');
    if (elements.authGate) {
      elements.authGate.hidden = true;
      elements.authGate.setAttribute('aria-hidden', 'true');
    }
    elements.authForm?.reset();
    if (elements.authPassword) elements.authPassword.type = 'password';
    resetAuthToggle();
    clearAuthError();

    if (!initialized) {
      try {
        await init();
      } catch (error) {
        toast('تعذّر تهيئة لوحة التحكم. أعد تحميل الصفحة.', 'error');
      }
    }
  }

  function resetAuthToggle() {
    if (!elements.authToggle) return;
    elements.authToggle.setAttribute('aria-pressed', 'false');
    elements.authToggle.setAttribute('aria-label', 'إظهار كلمة المرور');
    const eyeShow = elements.authToggle.querySelector('[data-eye="show"]');
    const eyeHide = elements.authToggle.querySelector('[data-eye="hide"]');
    if (eyeShow) eyeShow.hidden = false;
    if (eyeHide) eyeHide.hidden = true;
  }

  function showAuthError(message) {
    if (!elements.authError) return;
    elements.authError.textContent = message;
    elements.authError.hidden = false;
  }

  function clearAuthError() {
    if (!elements.authError) return;
    elements.authError.textContent = '';
    elements.authError.hidden = true;
  }

  function hasAdminSession() {
    try {
      return window.sessionStorage.getItem(ADMIN_SESSION_KEY) === 'active';
    } catch (error) {
      return false;
    }
  }

  function setAdminSession(active) {
    try {
      if (active) window.sessionStorage.setItem(ADMIN_SESSION_KEY, 'active');
      else window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
    } catch (error) {
      /* Session storage can be unavailable in restricted browser contexts. */
    }
  }

  function passwordMaterial(password) {
    return `montalaq.admin.v1::${password}`;
  }

  function getStoredPasswordHash() {
    try {
      const stored = window.localStorage.getItem(ADMIN_PASSWORD_KEY);
      return stored && stored.includes(':') ? stored : null;
    } catch (error) {
      return null;
    }
  }

  function canUseSubtleCrypto() {
    return typeof window.crypto !== 'undefined'
      && Boolean(window.crypto.subtle)
      && typeof window.TextEncoder === 'function';
  }

  async function sha256Hex(value) {
    const bytes = new TextEncoder().encode(value);
    const digest = await window.crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  function fnv1aHex(value) {
    let hash = 0x811c9dc5;
    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 0x01000193);
    }
    return (hash >>> 0).toString(16).padStart(8, '0');
  }

  async function createPasswordHash(password) {
    if (canUseSubtleCrypto()) {
      return `sha256:${await sha256Hex(passwordMaterial(password))}`;
    }
    return `fnv1a:${fnv1aHex(passwordMaterial(password))}`;
  }

  async function verifyAdminPassword(password) {
    const stored = getStoredPasswordHash();
    if (!stored) return password === DEFAULT_ADMIN_PASSWORD;

    const separator = stored.indexOf(':');
    const algorithm = stored.slice(0, separator);
    const expected = stored.slice(separator + 1);

    if (algorithm === 'sha256') {
      if (!canUseSubtleCrypto()) return false;
      return await sha256Hex(passwordMaterial(password)) === expected;
    }
    if (algorithm === 'fnv1a') {
      return fnv1aHex(passwordMaterial(password)) === expected;
    }
    return false;
  }

  async function handlePasswordChange(event) {
    event.preventDefault();
    if (!elements.passwordForm) return;

    const current = elements.currentPassword?.value || '';
    const next = elements.newPassword?.value || '';
    const confirmation = elements.confirmPassword?.value || '';
    setPasswordMessage('');

    if (!current || !next || !confirmation) {
      setPasswordMessage('أكمل الحقول الثلاثة أولًا.', 'error');
      return;
    }
    if (next.length < PASSWORD_MIN_LENGTH) {
      setPasswordMessage(`كلمة المرور الجديدة يجب ألا تقل عن ${PASSWORD_MIN_LENGTH} أحرف أو أرقام.`, 'error');
      elements.newPassword?.focus();
      return;
    }
    if (next.length > PASSWORD_MAX_LENGTH) {
      setPasswordMessage(`كلمة المرور الجديدة طويلة جدًا. الحد الأقصى ${PASSWORD_MAX_LENGTH} حرفًا.`, 'error');
      elements.newPassword?.focus();
      return;
    }
    if (next !== confirmation) {
      setPasswordMessage('كلمتا المرور الجديدتان غير متطابقتين.', 'error');
      elements.confirmPassword?.focus();
      return;
    }

    if (elements.changePasswordBtn) elements.changePasswordBtn.disabled = true;

    try {
      const currentIsValid = await verifyAdminPassword(current);
      if (!currentIsValid) {
        setPasswordMessage('كلمة المرور الحالية غير صحيحة.', 'error');
        elements.currentPassword?.focus();
        elements.currentPassword?.select();
        return;
      }

      const hash = await createPasswordHash(next);
      try {
        window.localStorage.setItem(ADMIN_PASSWORD_KEY, hash);
      } catch (error) {
        setPasswordMessage('تعذّر حفظ كلمة المرور في هذا المتصفح. تحقّق من إعدادات التخزين.', 'error');
        return;
      }

      elements.passwordForm.reset();
      updateDefaultPasswordHint();
      setPasswordMessage('تم تحديث كلمة المرور بنجاح. استخدم الكلمة الجديدة عند الدخول في المرة القادمة.', 'success');
      toast('تم تحديث كلمة مرور لوحة التحكم.');
    } catch (error) {
      setPasswordMessage('تعذّر تحديث كلمة المرور. أعد المحاولة.', 'error');
    } finally {
      if (elements.changePasswordBtn) elements.changePasswordBtn.disabled = false;
    }
  }

  function setPasswordMessage(message, type = 'success') {
    if (!elements.passwordMessage) return;
    if (!message) {
      elements.passwordMessage.hidden = true;
      elements.passwordMessage.textContent = '';
      return;
    }
    elements.passwordMessage.className = `password-status is-${type}`;
    elements.passwordMessage.textContent = message;
    elements.passwordMessage.hidden = false;
  }

  function updateDefaultPasswordHint() {
    if (!elements.defaultPasswordHint) return;
    elements.defaultPasswordHint.hidden = Boolean(getStoredPasswordHash());
  }

  function logoutAdmin() {
    setAdminSession(false);
    window.location.reload();
  }

  function setAuthYear() {
    if (elements.authYear) elements.authYear.textContent = String(new Date().getFullYear());
  }

  async function init() {
    if (initialized || initializing) return;
    initializing = true;
    try {
      await initDashboard();
      initialized = true;
    } finally {
      initializing = false;
    }
  }

  async function initDashboard() {
    cacheElements();
    populateStaticSelects();
    bindNavigation();
    bindSidebar();
    bindSearch();
    bindPromptsPanel();
    bindEditor();
    bindConfirmDialog();
    bindSettings();
    bindDelegatedActions();
    bindKeyboardShortcuts();
    bindCrossTabUpdates();
    setToday();
    setFooterYear();
    updateDefaultPasswordHint();

    try {
      const loaded = await loadPrompts();
      state.prompts = loaded.map(normalizePrompt);
      state.suggestions = getSuggestions().map(normalizeSuggestion).filter(Boolean);
    } catch (error) {
      state.prompts = [];
      state.suggestions = [];
      toast('تعذّر تحميل بيانات المكتبة. أعد تحميل الصفحة أو استورد ملف JSON.', 'error');
    }

    renderAll();
    const initialPanel = getPanelFromHash();
    switchPanel(initialPanel, { skipRender: true, skipHistory: true });
    Core.setupAutoDirInputs(document);
  }

  function cacheElements() {
    elements.sidebar = document.getElementById('adminSidebar');
    elements.sidebarOverlay = document.getElementById('sidebarOverlay');
    elements.sidebarToggle = document.getElementById('sidebarToggle');
    elements.panels = Array.from(document.querySelectorAll('[data-panel-view]'));
    elements.panelButtons = Array.from(document.querySelectorAll('[data-panel]'));
    elements.breadcrumbCurrent = document.getElementById('breadcrumbCurrent');

    elements.totalPrompts = document.getElementById('adminTotalPrompts');
    elements.activeCategories = document.getElementById('adminActiveCategories');
    elements.suggestionsCount = document.getElementById('adminSuggestionsCount');
    elements.suggestionsMeta = document.getElementById('adminSuggestionsMeta');
    elements.totalLikes = document.getElementById('adminTotalLikes');

    elements.recentPromptsBody = document.getElementById('recentPromptsBody');
    elements.categoryDistribution = document.getElementById('categoryDistribution');
    elements.topPromptsList = document.getElementById('topPromptsList');

    elements.promptSearch = document.getElementById('adminPromptSearch');
    elements.categoryFilter = document.getElementById('adminCategoryFilter');
    elements.difficultyFilter = document.getElementById('adminDifficultyFilter');
    elements.clearPromptFilters = document.getElementById('adminClearPromptFilters');
    elements.promptsTableBody = document.getElementById('promptsTableBody');
    elements.promptsEmpty = document.getElementById('promptsEmpty');
    elements.promptsCount = document.getElementById('adminPromptsCount');

    elements.suggestionsList = document.getElementById('suggestionsList');
    elements.suggestionsEmpty = document.getElementById('suggestionsEmpty');
    elements.suggestionsCountText = document.getElementById('suggestionsCountText');
    elements.clearSuggestionsBtn = document.getElementById('clearSuggestionsBtn');
    elements.sidebarSuggestionBadge = document.getElementById('sidebarSuggestionBadge');
    elements.sidebarPromptCount = document.getElementById('sidebarPromptCount');

    elements.globalSearch = document.getElementById('adminGlobalSearch');
    elements.sidebarStorageBar = document.getElementById('sidebarStorageBar');
    elements.sidebarStorageText = document.getElementById('sidebarStorageText');
    elements.storagePromptsCount = document.getElementById('storagePromptsCount');
    elements.storageSuggestionsCount = document.getElementById('storageSuggestionsCount');
    elements.storageSizeText = document.getElementById('storageSizeText');
    elements.storageBar = document.getElementById('storageBar');

    elements.editorDialog = document.getElementById('promptEditorDialog');
    elements.promptForm = document.getElementById('promptForm');
    elements.editorTitle = document.getElementById('editorTitle');
    elements.editorSaveBtn = document.getElementById('editorSaveBtn');
    elements.fieldId = document.getElementById('fieldId');
    elements.fieldTitle = document.getElementById('fieldTitle');
    elements.fieldCategory = document.getElementById('fieldCategory');
    elements.fieldModel = document.getElementById('fieldModel');
    elements.fieldDifficulty = document.getElementById('fieldDifficulty');
    elements.fieldLikes = document.getElementById('fieldLikes');
    elements.fieldDescription = document.getElementById('fieldDescription');
    elements.fieldPromptText = document.getElementById('fieldPromptText');
    elements.fieldExplanation = document.getElementById('fieldExplanation');
    elements.fieldExampleResult = document.getElementById('fieldExampleResult');
    elements.fieldExampleType = document.getElementById('fieldExampleType');
    elements.fieldTags = document.getElementById('fieldTags');

    elements.confirmDialog = document.getElementById('confirmDialog');
    elements.confirmTitle = document.getElementById('confirmTitle');
    elements.confirmMessage = document.getElementById('confirmMessage');
    elements.confirmActionBtn = document.getElementById('confirmActionBtn');
    elements.confirmCancelBtn = document.getElementById('confirmCancelBtn');

    elements.importFileInput = document.getElementById('importFileInput');
    elements.importJsonBtn = document.getElementById('importJsonBtn');
    elements.copyJsonBtn = document.getElementById('copyJsonBtn');
    elements.resetDataBtn = document.getElementById('resetDataBtn');
    elements.clearSuggestionsSettingsBtn = document.getElementById('clearSuggestionsSettingsBtn');
    elements.topAddPromptBtn = document.getElementById('topAddPromptBtn');
  }

  /* ------------------------------------------------------------------------
     Setup
     ------------------------------------------------------------------------ */
  function populateStaticSelects() {
    const categoryOptions = CATEGORIES
      .map((category) => `<option value="${category.id}">${escapeHTML(category.label)}</option>`)
      .join('');

    if (elements.categoryFilter) {
      elements.categoryFilter.innerHTML = `<option value="all">كل التصنيفات</option>${categoryOptions}`;
      elements.categoryFilter.value = 'all';
    }
    if (elements.fieldCategory) {
      elements.fieldCategory.innerHTML = categoryOptions;
    }
  }

  function setToday() {
    const element = document.getElementById('todayDate');
    if (!element) return;
    try {
      element.textContent = new Intl.DateTimeFormat('ar-EG', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(new Date());
    } catch (error) {
      element.textContent = new Date().toLocaleDateString('ar-EG');
    }
  }

  function setFooterYear() {
    const year = document.getElementById('adminFooterYear');
    if (year) year.textContent = String(new Date().getFullYear());
  }

  function normalizeSuggestion(suggestion) {
    if (!suggestion || typeof suggestion !== 'object') return null;
    const title = String(suggestion.title || '').trim();
    const promptText = String(suggestion.prompt_text || '').trim();
    if (!title || !promptText) return null;
    return {
      id: String(suggestion.id || uid('s')),
      title,
      category: CATEGORY_MAP[suggestion.category] ? suggestion.category : 'writing',
      author: String(suggestion.author || ''),
      model: String(suggestion.model || 'ChatGPT'),
      prompt_text: promptText,
      explanation: String(suggestion.explanation || ''),
      example_result: String(suggestion.example_result || ''),
      status: String(suggestion.status || 'pending'),
      created_at: String(suggestion.created_at || new Date().toISOString())
    };
  }

  function getPanelFromHash() {
    const hash = window.location.hash.replace('#', '').trim();
    return ['overview', 'prompts', 'suggestions', 'settings'].includes(hash) ? hash : 'overview';
  }

  /* ------------------------------------------------------------------------
     Navigation
     ------------------------------------------------------------------------ */
  function bindNavigation() {
    elements.panelButtons.forEach((button) => {
      button.addEventListener('click', () => {
        switchPanel(button.dataset.panel);
      });
    });

    document.querySelectorAll('[data-go-prompts]').forEach((button) => {
      button.addEventListener('click', () => switchPanel('prompts'));
    });
  }

  function switchPanel(panel, options = {}) {
    if (!['overview', 'prompts', 'suggestions', 'settings'].includes(panel)) return;
    state.panel = panel;

    elements.panelButtons.forEach((button) => {
      const isActive = button.dataset.panel === panel;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-current', isActive ? 'page' : 'false');
    });

    elements.panels.forEach((view) => {
      view.classList.toggle('hidden', view.dataset.panelView !== panel);
    });

    const labels = {
      overview: 'نظرة عامة',
      prompts: 'إدارة المُنطلقات',
      suggestions: 'الاقتراحات',
      settings: 'الإعدادات والنسخ'
    };
    if (elements.breadcrumbCurrent) elements.breadcrumbCurrent.textContent = labels[panel];

    if (!options.skipHistory) {
      try {
        history.replaceState(null, '', `#${panel}`);
      } catch (error) {
        /* ignore sandboxed history */
      }
    }

    closeSidebar();
    if (!options.skipScroll) window.scrollTo({ top: 0, behavior: 'smooth' });

    if (panel === 'suggestions' && !options.skipRender) renderSuggestions();
    if (panel === 'settings' && !options.skipRender) updateStorageInfo();
  }

  function closeSidebar() {
    if (!elements.sidebar || !elements.sidebarOverlay) return;
    elements.sidebar.classList.remove('is-open');
    elements.sidebarOverlay.classList.remove('is-open');
    if (elements.sidebarToggle) elements.sidebarToggle.setAttribute('aria-expanded', 'false');
  }

  function bindSidebar() {
    if (!elements.sidebarToggle) return;
    elements.sidebarToggle.addEventListener('click', () => {
      const willOpen = !elements.sidebar.classList.contains('is-open');
      elements.sidebar.classList.toggle('is-open', willOpen);
      elements.sidebarOverlay.classList.toggle('is-open', willOpen);
      elements.sidebarToggle.setAttribute('aria-expanded', String(willOpen));
    });
    elements.sidebarOverlay?.addEventListener('click', closeSidebar);
  }

  /* ------------------------------------------------------------------------
     Search & filters
     ------------------------------------------------------------------------ */
  function bindSearch() {
    if (elements.globalSearch) {
      const globalSearch = debounce(() => {
        const query = elements.globalSearch.value.trim();
        state.promptQuery = query;
        if (elements.promptSearch) elements.promptSearch.value = query;
        if (query) switchPanel('prompts', { skipScroll: true });
        renderPromptsTable();
      }, 150);
      elements.globalSearch.addEventListener('input', globalSearch);
    }
  }

  function bindPromptsPanel() {
    if (elements.promptSearch) {
      const localSearch = debounce(() => {
        state.promptQuery = elements.promptSearch.value.trim();
        if (elements.globalSearch) elements.globalSearch.value = state.promptQuery;
        renderPromptsTable();
      }, 130);
      elements.promptSearch.addEventListener('input', localSearch);
    }

    elements.categoryFilter?.addEventListener('change', () => {
      state.categoryFilter = elements.categoryFilter.value;
      renderPromptsTable();
    });

    elements.difficultyFilter?.addEventListener('change', () => {
      state.difficultyFilter = elements.difficultyFilter.value;
      renderPromptsTable();
    });

    elements.clearPromptFilters?.addEventListener('click', () => {
      state.promptQuery = '';
      state.categoryFilter = 'all';
      state.difficultyFilter = 'all';
      if (elements.promptSearch) elements.promptSearch.value = '';
      if (elements.globalSearch) elements.globalSearch.value = '';
      if (elements.categoryFilter) elements.categoryFilter.value = 'all';
      if (elements.difficultyFilter) elements.difficultyFilter.value = 'all';
      renderPromptsTable();
    });
  }

  /* ------------------------------------------------------------------------
     Rendering
     ------------------------------------------------------------------------ */
  function renderAll() {
    renderStats();
    renderRecentPrompts();
    renderCategoryDistribution();
    renderTopPrompts();
    renderPromptsTable();
    renderSuggestions();
    updateStorageInfo();
    updateSidebarCounts();
  }

  function renderStats() {
    const total = state.prompts.length;
    const activeCategories = new Set(state.prompts.map((prompt) => prompt.category)).size;
    const suggestionsCount = state.suggestions.length;
    const likes = state.prompts.reduce((sum, prompt) => sum + (Number(prompt.likes) || 0), 0);

    setText(elements.totalPrompts, formatNumber(total));
    setText(elements.activeCategories, formatNumber(activeCategories));
    setText(elements.suggestionsCount, formatNumber(suggestionsCount));
    setText(elements.totalLikes, formatNumber(likes));

    setText(elements.suggestionsMeta, suggestionsCount ? 'بانتظار المراجعة والاعتماد' : 'لا اقتراحات جديدة');
    setText(elements.suggestionsCountText, `${formatNumber(suggestionsCount)} اقتراح`);
    setText(elements.storagePromptsCount, formatNumber(total));
    setText(elements.storageSuggestionsCount, formatNumber(suggestionsCount));

    if (elements.sidebarSuggestionBadge) {
      elements.sidebarSuggestionBadge.textContent = formatNumber(suggestionsCount);
      elements.sidebarSuggestionBadge.classList.toggle('hidden', suggestionsCount === 0);
    }
  }

  function updateSidebarCounts() {
    setText(elements.sidebarPromptCount, formatNumber(state.prompts.length));
  }

  function setText(element, value) {
    if (element) element.textContent = value;
  }

  function categoryBadge(categoryId) {
    const category = CATEGORY_MAP[categoryId] || CATEGORIES[0];
    return `<span class="cat-badge" style="--cat-color:${category.color};--cat-tint:${category.tint}">${icon(category.icon, 10, 1.8)}${escapeHTML(category.label)}</span>`;
  }

  function renderRecentPrompts() {
    if (!elements.recentPromptsBody) return;
    const recent = state.prompts.slice(0, 5);

    if (!recent.length) {
      elements.recentPromptsBody.innerHTML = `<tr><td colspan="5" class="text-center py-8 text-[10px] text-[var(--ink-faint)]">لا توجد مُنطلقات بعد. ابدأ بإضافة أول مُنطلق.</td></tr>`;
      return;
    }

    elements.recentPromptsBody.innerHTML = recent.map((prompt) => `
      <tr>
        <td>
          <div class="table-title">${escapeHTML(prompt.title)}</div>
          <div class="table-sub">${escapeHTML(prompt.description || 'بدون وصف مختصر')}</div>
        </td>
        <td>${categoryBadge(prompt.category)}</td>
        <td><span class="text-[10px] font-medium">${escapeHTML(prompt.model)}</span></td>
        <td><span class="text-[10px] font-bold">${formatNumber(prompt.likes)}</span></td>
        <td>
          <div class="action-group">
            <button class="mini-action" type="button" data-edit-id="${escapeHTML(prompt.id)}" aria-label="تعديل ${escapeHTML(prompt.title)}" title="تعديل">
              ${icon('edit', 13, 1.8)}
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  function renderCategoryDistribution() {
    if (!elements.categoryDistribution) return;
    const counts = CATEGORIES.map((category) => ({
      category,
      count: state.prompts.filter((prompt) => prompt.category === category.id).length
    }));
    const max = Math.max(1, ...counts.map((item) => item.count));

    elements.categoryDistribution.innerHTML = counts.map(({ category, count }) => `
      <div class="cat-dist-row">
        <span class="cat-dist-icon" style="color:${category.color};background:${category.tint}">${icon(category.icon, 13)}</span>
        <span class="text-[9.5px] font-medium w-[74px] shrink-0">${escapeHTML(category.label)}</span>
        <div class="cat-dist-bar"><div class="cat-dist-fill" style="width:${count ? Math.max(7, (count / max) * 100) : 0}%;background:${category.color}"></div></div>
        <span class="text-[9px] font-bold text-[var(--ink-faint)] w-4 text-left">${formatNumber(count)}</span>
      </div>
    `).join('');
  }

  function renderTopPrompts() {
    if (!elements.topPromptsList) return;
    const top = state.prompts.slice().sort((a, b) => Number(b.likes) - Number(a.likes)).slice(0, 4);

    if (!top.length) {
      elements.topPromptsList.innerHTML = `<p class="text-[10px] text-[var(--ink-faint)] py-4 text-center">لا توجد بيانات تفاعل بعد.</p>`;
      return;
    }

    elements.topPromptsList.innerHTML = top.map((prompt, index) => {
      const category = CATEGORY_MAP[prompt.category] || CATEGORIES[0];
      return `
        <button class="top-prompt-row w-full text-right" type="button" data-edit-id="${escapeHTML(prompt.id)}">
          <span class="w-5 h-5 rounded-md grid place-items-center text-[8.5px] font-black shrink-0" style="color:${category.color};background:${category.tint}">${index + 1}</span>
          <span class="flex-1 min-w-0">
            <span class="block text-[10px] font-bold truncate">${escapeHTML(prompt.title)}</span>
            <span class="block text-[8.5px] text-[var(--ink-faint)] mt-0.5">${escapeHTML(prompt.model)} · ${escapeHTML(prompt.difficulty)}</span>
          </span>
          <span class="text-[9px] font-bold text-[var(--coral)] flex items-center gap-1 shrink-0">${icon('heart', 10, 1.8)} ${formatNumber(prompt.likes)}</span>
        </button>
      `;
    }).join('');
  }

  function filteredPrompts() {
    const query = normalizeSearch(state.promptQuery);
    return state.prompts.filter((prompt) => {
      if (state.categoryFilter !== 'all' && prompt.category !== state.categoryFilter) return false;
      if (state.difficultyFilter !== 'all' && prompt.difficulty !== state.difficultyFilter) return false;
      if (!query) return true;
      const haystack = normalizeSearch([
        prompt.title,
        prompt.description,
        prompt.prompt_text,
        prompt.explanation,
        prompt.example_result,
        prompt.example_type,
        prompt.model,
        prompt.difficulty,
        prompt.tags.join(' '),
        CATEGORY_MAP[prompt.category]?.label || ''
      ].join(' '));
      return query.split(' ').every((word) => haystack.includes(word));
    });
  }

  function renderPromptsTable() {
    if (!elements.promptsTableBody) return;
    const prompts = filteredPrompts();
    setText(elements.promptsCount, formatNumber(prompts.length));
    elements.promptsEmpty?.classList.toggle('is-visible', prompts.length === 0);

    if (!prompts.length) {
      elements.promptsTableBody.innerHTML = '';
      return;
    }

    elements.promptsTableBody.innerHTML = prompts.map((prompt) => `
      <tr>
        <td>
          <div class="table-title">${escapeHTML(prompt.title)}</div>
          <div class="table-sub">${escapeHTML(prompt.description || 'بدون وصف مختصر')}</div>
        </td>
        <td>${categoryBadge(prompt.category)}</td>
        <td><span class="text-[10px] font-medium">${escapeHTML(prompt.model)}</span></td>
        <td><span class="difficulty-badge difficulty-${escapeHTML(prompt.difficulty)}">${escapeHTML(prompt.difficulty)}</span></td>
        <td><span class="text-[10px] font-bold">${formatNumber(prompt.likes)}</span></td>
        <td>
          <div class="action-group">
            <button class="mini-action" type="button" data-edit-id="${escapeHTML(prompt.id)}" aria-label="تعديل ${escapeHTML(prompt.title)}" title="تعديل">
              ${icon('edit', 13, 1.8)}
            </button>
            <button class="mini-action danger" type="button" data-delete-id="${escapeHTML(prompt.id)}" aria-label="حذف ${escapeHTML(prompt.title)}" title="حذف">
              ${icon('trash', 13, 1.8)}
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  function renderSuggestions() {
    if (!elements.suggestionsList) return;
    const suggestions = state.suggestions;
    elements.suggestionsEmpty?.classList.toggle('is-visible', suggestions.length === 0);
    setText(elements.suggestionsCountText, `${formatNumber(suggestions.length)} اقتراح`);

    if (!suggestions.length) {
      elements.suggestionsList.innerHTML = '';
      return;
    }

    elements.suggestionsList.innerHTML = suggestions.map((suggestion) => {
      const category = CATEGORY_MAP[suggestion.category] || CATEGORIES[0];
      const promptDir = Core.detectDirection(suggestion.prompt_text);
      const explanationDir = Core.detectDirection(suggestion.explanation);
      const exampleDir = Core.detectDirection(suggestion.example_result);
      return `
        <article class="suggestion-card" data-suggestion-id="${escapeHTML(suggestion.id)}">
          <div class="flex items-start justify-between gap-3">
            <span class="cat-badge" style="--cat-color:${category.color};--cat-tint:${category.tint}">
              ${icon(category.icon, 10, 1.8)}
              ${escapeHTML(category.label)}
            </span>
            <span class="inline-flex items-center gap-1 text-[8.5px] text-[var(--ink-faint)]">
              ${icon('clock', 10, 1.8)}
              ${escapeHTML(formatDate(suggestion.created_at))}
            </span>
          </div>
          <h3 class="text-[13.5px] font-black mt-2.5">${escapeHTML(suggestion.title)}</h3>
          <div class="flex flex-wrap items-center gap-2 mt-1.5 text-[8.5px] text-[var(--ink-faint)]">
            <span class="flex items-center gap-1">${icon('users', 10, 1.8)} ${escapeHTML(suggestion.author || 'زائر مجهول')}</span>
            <span class="w-1 h-1 rounded-full bg-[var(--line-strong)]"></span>
            <span>${escapeHTML(suggestion.model)}</span>
          </div>

          <div class="mt-3">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-[9px] font-bold text-[var(--ink-faint)]">نص المُنطلق المقترح</span>
              <span class="dir-badge" data-state="${promptDir}">${promptDir.toUpperCase()} · تلقائي</span>
            </div>
            <div class="prompt-content suggestion-quote suggestion-prompt" dir="auto" style="unicode-bidi:plaintext;text-align:start;">${escapeHTML(suggestion.prompt_text)}</div>
          </div>

          ${suggestion.explanation || suggestion.example_result ? `
            <details class="mt-2.5 rounded-lg border border-[var(--line)] bg-[#fffdf8] overflow-hidden">
              <summary class="px-2.5 py-2 text-[9px] font-bold text-[var(--ink-soft)] cursor-pointer list-none flex items-center justify-between">
                عرض الشرح ومثال النتيجة
                <span class="text-[var(--ink-faint)]">${icon('chevron', 11, 2)}</span>
              </summary>
              <div class="px-2.5 pb-2.5 space-y-2.5 border-t border-[#f0e9dd] pt-2.5">
                ${suggestion.explanation ? `
                  <div>
                    <div class="flex items-center justify-between mb-1"><span class="text-[8.5px] font-bold text-[var(--ink-faint)]">الشرح</span><span class="dir-badge" data-state="${explanationDir}">${explanationDir.toUpperCase()}</span></div>
                    <div class="prompt-content suggestion-quote suggestion-explanation" dir="auto" style="unicode-bidi:plaintext;text-align:start;">${escapeHTML(suggestion.explanation)}</div>
                  </div>
                ` : ''}
                ${suggestion.example_result ? `
                  <div>
                    <div class="flex items-center justify-between mb-1"><span class="text-[8.5px] font-bold text-[var(--ink-faint)]">مثال النتيجة</span><span class="dir-badge" data-state="${exampleDir}">${exampleDir.toUpperCase()}</span></div>
                    <div class="prompt-content suggestion-quote suggestion-example" dir="auto" style="unicode-bidi:plaintext;text-align:start;">${escapeHTML(suggestion.example_result)}</div>
                  </div>
                ` : ''}
              </div>
            </details>
          ` : ''}

          <div class="flex items-center justify-end gap-2 mt-3 pt-2.5 border-t border-[#f0e9dd]">
            <button class="mini-action danger !w-auto !px-2 !text-[9px] gap-1" type="button" data-delete-suggestion="${escapeHTML(suggestion.id)}">
              ${icon('trash', 11, 1.8)} حذف
            </button>
            <button class="btn btn-primary !py-2 !px-3 !text-[9.5px]" type="button" data-review-suggestion="${escapeHTML(suggestion.id)}">
              ${icon('edit', 11, 1.9)} مراجعة وتحويل
            </button>
          </div>
        </article>
      `;
    }).join('');

    elements.suggestionsList.querySelectorAll('.suggestion-prompt, .suggestion-explanation, .suggestion-example').forEach((element) => {
      Core.applyAutoDirection(element, element.textContent);
    });
  }

  function updateStorageInfo() {
    const promptsRaw = Core.readJSON(KEYS.prompts, null);
    const suggestionsRaw = Core.readJSON(KEYS.suggestions, []);
    let bytes = 0;
    try {
      const payload = JSON.stringify({
        prompts: promptsRaw || state.prompts,
        suggestions: Array.isArray(suggestionsRaw) ? suggestionsRaw : state.suggestions,
        favorites: Core.readJSON(KEYS.favorites, []),
        liked: Core.readJSON(KEYS.liked, [])
      });
      bytes = new Blob([payload]).size;
    } catch (error) {
      bytes = 0;
    }

    const approximateLimit = 5 * 1024 * 1024;
    const percent = Math.min(100, Math.max(2, (bytes / approximateLimit) * 100));
    const sizeLabel = bytes < 1024
      ? `${formatNumber(bytes)} بايت`
      : `${(bytes / 1024).toFixed(1)} KB`;

    setText(elements.storageSizeText, sizeLabel);
    if (elements.sidebarStorageBar) elements.sidebarStorageBar.style.width = `${percent}%`;
    if (elements.storageBar) elements.storageBar.style.width = `${percent}%`;
    setText(elements.sidebarStorageText, `${sizeLabel} من أصل ~5 MB تقديريًا`);
  }

  /* ------------------------------------------------------------------------
     Editor
     ------------------------------------------------------------------------ */
  function bindEditor() {
    if (!elements.promptForm) return;

    elements.promptForm.addEventListener('submit', (event) => {
      event.preventDefault();
      saveEditor();
    });

    elements.editorDialog?.querySelectorAll('[data-close-editor]').forEach((button) => {
      button.addEventListener('click', closeEditor);
    });

    elements.fieldTitle?.addEventListener('input', () => {
      if (!elements.editorTitle) return;
      if (state.editingId) {
        elements.editorTitle.textContent = 'تعديل المُنطلق';
      }
    });

    elements.editorDialog?.addEventListener('close', () => {
      document.body.style.overflow = '';
      state.editingId = null;
      state.pendingSuggestionId = null;
    });
  }

  function openEditor(promptId = null, prefill = null) {
    if (!elements.editorDialog || !elements.promptForm) return;

    elements.promptForm.reset();
    state.editingId = null;
    state.pendingSuggestionId = null;

    if (promptId) {
      const prompt = state.prompts.find((item) => String(item.id) === String(promptId));
      if (!prompt) {
        toast('لم يُعثر على هذا المُنطلق.', 'error');
        return;
      }
      state.editingId = prompt.id;
      setText(elements.editorTitle, 'تعديل المُنطلق');
      elements.fieldId.value = prompt.id;
      elements.fieldTitle.value = prompt.title;
      elements.fieldCategory.value = prompt.category;
      elements.fieldModel.value = prompt.model;
      elements.fieldDifficulty.value = prompt.difficulty;
      elements.fieldLikes.value = String(prompt.likes);
      elements.fieldDescription.value = prompt.description;
      elements.fieldPromptText.value = prompt.prompt_text;
      elements.fieldExplanation.value = prompt.explanation;
      elements.fieldExampleResult.value = prompt.example_result;
      elements.fieldExampleType.value = prompt.example_type;
      elements.fieldTags.value = prompt.tags.join('، ');
      elements.editorSaveBtn.innerHTML = `${icon('check', 14, 2)} حفظ التعديلات`;
    } else if (prefill) {
      const suggestion = prefill;
      const category = CATEGORY_MAP[suggestion.category] || CATEGORIES[0];
      state.pendingSuggestionId = suggestion.id;
      setText(elements.editorTitle, 'تحويل اقتراح إلى مُنطلق');
      elements.fieldTitle.value = suggestion.title || '';
      elements.fieldCategory.value = suggestion.category || 'writing';
      elements.fieldModel.value = suggestion.model || 'ChatGPT';
      elements.fieldDifficulty.value = 'متوسط';
      elements.fieldLikes.value = '0';
      elements.fieldDescription.value = suggestion.explanation
        ? suggestion.explanation.slice(0, 150)
        : `مُنطلق مقترح في تصنيف ${category.label}.`;
      elements.fieldPromptText.value = suggestion.prompt_text || '';
      elements.fieldExplanation.value = suggestion.explanation || '';
      elements.fieldExampleResult.value = suggestion.example_result || '';
      elements.fieldExampleType.value = 'نص';
      elements.fieldTags.value = ['مقترح', category.short].join('، ');
      elements.editorSaveBtn.innerHTML = `${icon('check', 14, 2)} اعتماد ونشر`;
    } else {
      setText(elements.editorTitle, 'إضافة مُنطلق جديد');
      elements.fieldCategory.value = 'writing';
      elements.fieldModel.value = 'ChatGPT';
      elements.fieldDifficulty.value = 'متوسط';
      elements.fieldLikes.value = '0';
      elements.fieldExampleType.value = 'نص';
      elements.editorSaveBtn.innerHTML = `${icon('check', 14, 2)} حفظ المُنطلق`;
    }

    elements.fieldCategory.value = CATEGORY_MAP[elements.fieldCategory.value] ? elements.fieldCategory.value : 'writing';
    elements.fieldDifficulty.value = DIFFICULTIES.includes(elements.fieldDifficulty.value)
      ? elements.fieldDifficulty.value
      : 'متوسط';
    elements.fieldExampleType.value = elements.fieldExampleType.value || 'نص';

    document.querySelectorAll('#promptForm textarea[data-auto-dir]').forEach(Core.syncTextareaDirection);

    if (typeof elements.editorDialog.showModal === 'function') {
      if (!elements.editorDialog.open) elements.editorDialog.showModal();
    } else {
      elements.editorDialog.setAttribute('open', '');
    }
    document.body.style.overflow = 'hidden';
    setTimeout(() => elements.fieldTitle?.focus(), 80);
  }

  function closeEditor() {
    if (!elements.editorDialog) return;
    if (typeof elements.editorDialog.close === 'function') {
      if (elements.editorDialog.open) elements.editorDialog.close();
    } else {
      elements.editorDialog.removeAttribute('open');
    }
    document.body.style.overflow = '';
  }

  function saveEditor() {
    const title = elements.fieldTitle.value.trim();
    const category = elements.fieldCategory.value;
    const model = elements.fieldModel.value.trim() || 'ChatGPT';
    const difficulty = elements.fieldDifficulty.value;
    const likes = Math.max(0, parseInt(elements.fieldLikes.value, 10) || 0);
    const description = elements.fieldDescription.value.trim();
    const promptText = elements.fieldPromptText.value.trim();
    const explanation = elements.fieldExplanation.value.trim();
    const exampleResult = elements.fieldExampleResult.value.trim();
    const exampleType = elements.fieldExampleType.value.trim() || 'نص';
    const tags = elements.fieldTags.value
      .split(/[,،]/)
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (!title || !promptText || !explanation || !exampleResult) {
      toast('أكمل العنوان ونص المُنطلق والشرح ومثال النتيجة.', 'error');
      if (!title) elements.fieldTitle.focus();
      else if (!promptText) elements.fieldPromptText.focus();
      else if (!explanation) elements.fieldExplanation.focus();
      else elements.fieldExampleResult.focus();
      return;
    }

    const pendingSuggestionId = state.pendingSuggestionId;
    const wasEditing = Boolean(state.editingId);

    const basePrompt = {
      id: state.editingId || uid('p'),
      title,
      category: CATEGORY_MAP[category] ? category : 'writing',
      description: description || `${explanation.slice(0, 140)}${explanation.length > 140 ? '…' : ''}`,
      prompt_text: promptText,
      explanation,
      example_result: exampleResult,
      example_type: exampleType,
      model,
      difficulty: DIFFICULTIES.includes(difficulty) ? difficulty : 'متوسط',
      tags,
      likes
    };

    const normalized = normalizePrompt(basePrompt, state.prompts.length);

    if (state.editingId) {
      const index = state.prompts.findIndex((prompt) => String(prompt.id) === String(state.editingId));
      if (index === -1) {
        toast('تعذّر العثور على المُنطلق المطلوب تعديله.', 'error');
        return;
      }
      state.prompts[index] = { ...normalized, id: state.prompts[index].id };
    } else {
      state.prompts.unshift(normalized);
    }

    if (!savePrompts(state.prompts)) {
      toast('تعذّر حفظ البيانات. تحقّق من مساحة التخزين.', 'error');
      return;
    }

    if (pendingSuggestionId) {
      state.suggestions = state.suggestions.filter((suggestion) => String(suggestion.id) !== String(pendingSuggestionId));
      saveSuggestions(state.suggestions);
    }

    state.editingId = null;
    state.pendingSuggestionId = null;
    closeEditor();
    renderAll();
    switchPanel('prompts', { skipScroll: false });

    if (pendingSuggestionId) {
      toast('تم اعتماد الاقتراح وإضافته إلى المكتبة.');
    } else {
      toast(wasEditing ? 'تم تحديث المُنطلق بنجاح.' : 'تمت إضافة المُنطلق إلى المكتبة.');
    }
  }

  /* ------------------------------------------------------------------------
     Confirm dialog
     ------------------------------------------------------------------------ */
  function bindConfirmDialog() {
    elements.confirmCancelBtn?.addEventListener('click', closeConfirm);
    elements.confirmActionBtn?.addEventListener('click', async () => {
      const action = state.confirmAction;
      closeConfirm();
      if (typeof action === 'function') {
        try {
          await action();
        } catch (error) {
          toast('حدث خطأ أثناء تنفيذ العملية.', 'error');
        }
      }
    });
    elements.confirmDialog?.addEventListener('click', (event) => {
      if (event.target === elements.confirmDialog) closeConfirm();
    });
    elements.confirmDialog?.addEventListener('close', () => {
      state.confirmAction = null;
      if (!elements.editorDialog?.open) document.body.style.overflow = '';
    });
  }

  function openConfirm(options = {}) {
    if (!elements.confirmDialog) return;
    state.confirmAction = options.action || null;
    setText(elements.confirmTitle, options.title || 'تأكيد العملية');
    setText(elements.confirmMessage, options.message || 'هل أنت متأكد من تنفيذ هذه العملية؟');
    if (elements.confirmActionBtn) {
      elements.confirmActionBtn.textContent = options.confirmLabel || 'تأكيد';
    }
    if (typeof elements.confirmDialog.showModal === 'function') {
      if (!elements.confirmDialog.open) elements.confirmDialog.showModal();
    } else {
      elements.confirmDialog.setAttribute('open', '');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeConfirm() {
    if (!elements.confirmDialog) return;
    if (typeof elements.confirmDialog.close === 'function') {
      if (elements.confirmDialog.open) elements.confirmDialog.close();
    } else {
      elements.confirmDialog.removeAttribute('open');
    }
    state.confirmAction = null;
    if (!elements.editorDialog?.open) document.body.style.overflow = '';
  }

  /* ------------------------------------------------------------------------
     Actions
     ------------------------------------------------------------------------ */
  function bindDelegatedActions() {
    document.addEventListener('click', (event) => {
      const addButton = event.target.closest('[data-add-prompt]');
      if (addButton) {
        event.preventDefault();
        openEditor();
        return;
      }

      const openSuggestions = event.target.closest('[data-open-suggestions]');
      if (openSuggestions) {
        switchPanel('suggestions');
        return;
      }

      const goPrompts = event.target.closest('[data-go-prompts]');
      if (goPrompts) {
        switchPanel('prompts');
        return;
      }

      const exportButton = event.target.closest('[data-export-json]');
      if (exportButton) {
        exportJson();
        return;
      }

      const editButton = event.target.closest('[data-edit-id]');
      if (editButton) {
        openEditor(editButton.dataset.editId);
        return;
      }

      const deleteButton = event.target.closest('[data-delete-id]');
      if (deleteButton) {
        confirmDeletePrompt(deleteButton.dataset.deleteId);
        return;
      }

      const reviewSuggestion = event.target.closest('[data-review-suggestion]');
      if (reviewSuggestion) {
        const suggestion = state.suggestions.find((item) => String(item.id) === String(reviewSuggestion.dataset.reviewSuggestion));
        if (suggestion) openEditor(null, suggestion);
        return;
      }

      const deleteSuggestion = event.target.closest('[data-delete-suggestion]');
      if (deleteSuggestion) {
        confirmDeleteSuggestion(deleteSuggestion.dataset.deleteSuggestion);
      }
    });

    elements.topAddPromptBtn?.addEventListener('click', () => openEditor());
  }

  function confirmDeletePrompt(id) {
    const prompt = state.prompts.find((item) => String(item.id) === String(id));
    if (!prompt) return;
    openConfirm({
      title: 'حذف المُنطلق',
      message: `سيتم حذف «${prompt.title}» نهائيًا من المكتبة المحلية. لا يمكن التراجع بعد التأكيد.`,
      confirmLabel: 'حذف نهائي',
      action: () => {
        state.prompts = state.prompts.filter((item) => String(item.id) !== String(id));
        const saved = savePrompts(state.prompts);
        renderAll();
        if (saved) toast('تم حذف المُنطلق.');
        else toast('حُذف من الواجهة، لكن تعذّر حفظ التغيير في المتصفح.', 'error');
      }
    });
  }

  function confirmDeleteSuggestion(id) {
    const suggestion = state.suggestions.find((item) => String(item.id) === String(id));
    if (!suggestion) return;
    openConfirm({
      title: 'حذف الاقتراح',
      message: `سيتم حذف اقتراح «${suggestion.title}» من قائمة الوارد. لن يُحذف أي مُنطلق منشور.`,
      confirmLabel: 'حذف الاقتراح',
      action: () => {
        state.suggestions = state.suggestions.filter((item) => String(item.id) !== String(id));
        saveSuggestions(state.suggestions);
        renderAll();
        toast('تم حذف الاقتراح.', 'info');
      }
    });
  }

  function clearAllSuggestions() {
    if (!state.suggestions.length) {
      toast('لا توجد اقتراحات لحذفها.', 'info');
      return;
    }
    openConfirm({
      title: 'حذف كل الاقتراحات',
      message: `سيتم حذف ${formatNumber(state.suggestions.length)} اقتراحًا من الوارد نهائيًا. لن تتأثر المُنطلقات المنشورة.`,
      confirmLabel: 'حذف الكل',
      action: () => {
        state.suggestions = [];
        saveSuggestions([]);
        renderAll();
        toast('تم حذف كل الاقتراحات.');
      }
    });
  }

  /* ------------------------------------------------------------------------
     Settings: export, import, reset
     ------------------------------------------------------------------------ */
  function bindSettings() {
    elements.clearSuggestionsBtn?.addEventListener('click', clearAllSuggestions);
    elements.clearSuggestionsSettingsBtn?.addEventListener('click', clearAllSuggestions);

    elements.importJsonBtn?.addEventListener('click', () => elements.importFileInput?.click());
    elements.importFileInput?.addEventListener('change', handleImportFile);

    elements.copyJsonBtn?.addEventListener('click', async () => {
      const succeeded = await copyText(JSON.stringify(state.prompts, null, 2));
      if (succeeded) toast('تم نسخ بيانات المُنطلقات إلى الحافظة.');
      else toast('تعذّر النسخ إلى الحافظة.', 'error');
    });

    elements.resetDataBtn?.addEventListener('click', () => {
      openConfirm({
        title: 'استعادة البيانات الافتراضية',
        message: 'سيتم حذف كل التعديلات المحلية وإعادة تحميل المُنطلقات الأساسية من ملف البيانات. هل صدّرت نسخة احتياطية أولًا؟',
        confirmLabel: 'نعم، استعد الافتراضي',
        action: async () => {
          try {
            const prompts = await resetPrompts();
            state.prompts = prompts.map(normalizePrompt);
            renderAll();
            switchPanel('overview');
            toast('تمت استعادة البيانات الافتراضية للمكتبة.');
          } catch (error) {
            toast('تعذّر تحميل البيانات الافتراضية.', 'error');
          }
        }
      });
    });
  }

  function exportJson() {
    try {
      const payload = JSON.stringify(state.prompts, null, 2);
      const blob = new Blob([payload], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const stamp = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.download = `montalaq-prompts-${stamp}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast('تم تصدير نسخة احتياطية بصيغة JSON.');
    } catch (error) {
      toast('تعذّر إنشاء ملف النسخة الاحتياطية.', 'error');
    }
  }

  async function handleImportFile(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const rawPrompts = Array.isArray(parsed) ? parsed : parsed && Array.isArray(parsed.prompts) ? parsed.prompts : null;
      if (!rawPrompts || !rawPrompts.length) {
        toast('الملف لا يحتوي على مصفوفة مُنطلقات صالحة.', 'error');
        event.target.value = '';
        return;
      }

      const seen = new Set();
      const imported = rawPrompts.map((prompt, index) => {
        const normalized = normalizePrompt(prompt, index);
        if (!normalized.id || seen.has(normalized.id)) {
          normalized.id = uid('p');
        }
        seen.add(normalized.id);
        return normalized;
      });

      openConfirm({
        title: 'استيراد مكتبة جديدة',
        message: `سيتم استبدال ${formatNumber(state.prompts.length)} مُنطلقًا حاليًا بـ ${formatNumber(imported.length)} مُنطلقًا من الملف. صدّر نسخة احتياطية أولًا إن كنت غير متأكد.`,
        confirmLabel: 'استيراد واستبدال',
        action: () => {
          state.prompts = imported;
          if (!savePrompts(state.prompts)) {
            toast('تعذّر حفظ البيانات المستوردة في المتصفح.', 'error');
            return;
          }
          renderAll();
          switchPanel('prompts');
          toast(`تم استيراد ${formatNumber(imported.length)} مُنطلقًا بنجاح.`);
        }
      });
    } catch (error) {
      toast('تعذّر قراءة الملف. تأكد من أنه JSON صالح.', 'error');
    } finally {
      event.target.value = '';
    }
  }

  /* ------------------------------------------------------------------------
     Keyboard + cross-tab
     ------------------------------------------------------------------------ */
  function bindKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        switchPanel('prompts', { skipScroll: true });
        elements.globalSearch?.focus();
      }
    });
  }

  function bindCrossTabUpdates() {
    window.addEventListener('storage', (event) => {
      if (event.key === KEYS.prompts && event.newValue) {
        try {
          const next = JSON.parse(event.newValue);
          if (Array.isArray(next)) {
            state.prompts = next.map(normalizePrompt);
            renderAll();
          }
        } catch (error) {
          /* ignore malformed cross-tab data */
        }
      }
      if (event.key === KEYS.suggestions && event.newValue) {
        try {
          const next = JSON.parse(event.newValue);
          if (Array.isArray(next)) {
            state.suggestions = next.map(normalizeSuggestion).filter(Boolean);
            renderAll();
          }
        } catch (error) {
          /* ignore */
        }
      }
    });
  }
})();
