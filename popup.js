const $ = (id) => document.getElementById(id);
const VERSION = chrome.runtime.getManifest().version;
const DEFAULT_MODEL = { deepseek: "deepseek-flash", xai: "grok-4.7", custom: "" };
const DEFAULT_PRICE = {
  deepseek: { input: 0.30, output: 1.20 },
  xai: { input: 2.00, output: 6.00 },
  custom: { input: 0, output: 0 }
};

const I18N = {
  ru: {
    subtitle: "выжимка + проверка фактов",
    history: "История", settings: "Настройки", back: "Назад",
    historySubtitle: "Сохранённые выжимки доступны после перезапуска Edge.", clearHistory: "Очистить",
    settingsSubtitle: "Модель, язык, фактчек и стоимость.", analysisMode: "Режим",
    modeEconomy: "Экономно", modeBalanced: "Баланс", modeDeep: "Глубоко",
    makeSummary: "Сделать выжимку", newSummary: "Новая выжимка",
    statusReady: "Откройте страницу и нажмите «Сделать выжимку».",
    statusReading: "Читаю страницу и делаю выжимку…", statusRefreshing: "Делаю новую выжимку…",
    statusDone: "Готово.", statusCached: "Готово — без нового расхода токенов.",
    statusFailed: "Не получилось выполнить анализ.",
    languageAndOutput: "Язык интерфейса и ответа", language: "Язык",
    languageHint: "Интерфейс меняется сразу. Новые ответы ИИ будут на выбранном языке; внутренний анализ может выполняться в более экономном для модели формате.",
    provider: "Провайдер", model: "Модель", apiKeyPlaceholder: "ключ хранится локально в профиле Edge",
    endpoint: "Chat Completions endpoint", testApi: "Проверить LLM API",
    factChecking: "Проверка фактов", factCheckLabel: "Проверять ключевые тезисы через веб-поиск",
    searchApiLabel: "Поисковый API — Tavily", tavilyPlaceholder: "tvly-… отдельный ключ Tavily",
    searchKeySeparation: "Это отдельный ключ веб-поиска. DeepSeek/xAI API key сюда не подходит.",
    testSearch: "Проверить веб-поиск", testingSearch: "Проверяю Tavily…", searchWorks: "Веб-поиск работает", wrongSearchKeyUi: "Похоже на LLM-ключ (sk-…). Для Tavily нужен отдельный tvly-… ключ.",
    factCheckHint: "Без поискового API расширение может оценить текст, но не может независимо подтвердить факты.",
    costAndCache: "Цена и кэш", inputPrice: "Input, $ / 1M токенов", outputPrice: "Output, $ / 1M токенов",
    tavilyPrice: "Tavily, $ / credit", cacheHours: "Быстрый кэш, часов",
    cacheHint: "Быстрый кэш экономит повторные запросы. История хранится отдельно и не исчезает после этого срока.",
    author: "Автор и контакты", save: "Сохранить", savedSettings: "Сохранено локально в профиле Edge.",
    invalidEndpoint: "Некорректный endpoint.", httpsEndpoint: "Custom endpoint должен быть HTTPS.", permissionDenied: "Edge не дал разрешение на запросы к этому API.",
    testingApi: "Сохраняю настройки и проверяю API…", apiWorks: "API работает", errorPrefix: "Ошибка",
    restoredTitle: "Сохранённая выжимка", restoredText: "Загружена из истории без запроса к API. Страница могла измениться — для актуальных данных нажмите «Новая выжимка».",
    restoredAt: "сохранено {time}", emptyHistory: "История пока пуста. Сделайте первую выжимку — она сохранится автоматически.",
    openSaved: "Открыть выжимку", delete: "Удалить", confirmClear: "Удалить всю историю выжимок?",
    cachedZero: "кэш: $0", historyZero: "история: $0", webSearch: "веб-поиск", webSearchPlural: "веб-поиска", truncated: "текст сокращён",
    kindConversation: "чат", kindListing: "список", kindJob: "вакансия", kindArticle: "статья", kindSelection: "выделение", kindPage: "страница",
    short: "Коротко", numbers: "Цифры без путаницы", numbersIntro: "Единицы и период вынесены отдельно. Месячные и почасовые ставки не смешиваются.",
    facts: "Факты и проверка", unverifiedExternally: "внешне не проверено", examples: "Примеры из материала", concerns: "Что настораживает",
    quality: "Качество материала", qualityFallback: "Оценка по внутренним признакам текста.", important: "Важно", checkLimit: "Ограничение проверки",
    missingTavily: "Tavily API key не указан, поэтому это не внешняя факт-проверка. Добавьте отдельный ключ Tavily в настройках.",
    searchFailed: "Выжимка готова, но веб-проверка не сработала: {error}",
    wrongSearchKeyReport: "В поле веб-поиска указан ключ LLM. DeepSeek/xAI ключ не даёт доступ к поиску Tavily; выжимка выполнена без внешней проверки.",
    searchEmpty: "Веб-поиск не нашёл пригодных источников для выбранных тезисов. Выжимка сохранена без внешнего подтверждения.",
    checkedLimit: "Статусы показывают, насколько тезисы подтверждаются найденными источниками. Это снижает риск ошибки, но не даёт абсолютной гарантии истины — особенно для свежих, спорных или плохо документированных тем.",
    barChartNote: "Столбики начинаются от нуля; это отдельное сравнение одной и той же величины.",
    indicator: "Показатель", periodMonth: "за месяц", periodHour: "за час", periodYear: "за год", periodDay: "за день", periodOne: "разово", periodUnknown: "период не указан",
    gross: "до налогов (gross)", net: "net", grossNetUnknown: "gross/net не указан",
    monthlyEstimate: "Ориентир: ≈ {value} при 160 ч/мес. Это пересчёт, не исходная зарплата.",
    unknownPeriodWarn: "Период оплаты на странице не распознан — с месячными/почасовыми ставками не сравниваю.", sourceOriginal: "В источнике: {value}",
    rangeCompare: "Сравнение вилок · {unit}", valueCompare: "Сравнение значений · {unit}", rangeNote: "Полоса показывает диапазон «от–до». В один график попадают только одинаковая валюта и одинаковый период.",
    sampleStructure: "Структура выборки", cards: "карточек", chartExtractedTruncated: "Диаграмма относится только к извлечённой части страницы.", chartExtracted: "Диаграмма относится к извлечённым данным страницы.",
    verdictConfirmed: "подтверждается", verdictMostly: "в основном подтверждается", verdictDisputed: "есть противоречия", verdictFalse: "опровергается", verdictUnverified: "недостаточно данных",
    severityLow: "низкий", severityMedium: "средний", severityHigh: "высокий",
    unitMonth: "месяц", unitHour: "час", unitYear: "год", unitDay: "день", unitOne: "разово", unitDefault: "ед.",
    historyLanguage: "язык: {language}", reportDate: "{date}", unknownTitle: "Без заголовка", savedBadge: "сохранено",
    noCurrentSaved: "Для этой страницы сохранённой выжимки пока нет.", apiModelFallback: "модель"
  },
  en: {
    subtitle: "summary + fact checking",
    history: "History", settings: "Settings", back: "Back",
    historySubtitle: "Saved summaries remain available after restarting Edge.", clearHistory: "Clear",
    settingsSubtitle: "Model, language, fact check and cost.", analysisMode: "Mode",
    modeEconomy: "Economy", modeBalanced: "Balanced", modeDeep: "Deep",
    makeSummary: "Make summary", newSummary: "New summary",
    statusReady: "Open a page and click “Make summary”.",
    statusReading: "Reading the page and creating a summary…", statusRefreshing: "Creating a fresh summary…",
    statusDone: "Done.", statusCached: "Done — no new token spend.", statusFailed: "Could not complete the analysis.",
    languageAndOutput: "Interface and answer language", language: "Language",
    languageHint: "The interface changes immediately. New AI answers use the selected language; internal analysis may use a more token-efficient format.",
    provider: "Provider", model: "Model", apiKeyPlaceholder: "key is stored locally in your Edge profile",
    endpoint: "Chat Completions endpoint", testApi: "Test LLM API",
    factChecking: "Fact checking", factCheckLabel: "Check key claims with web search",
    searchApiLabel: "Search API — Tavily", tavilyPlaceholder: "tvly-… separate Tavily key",
    searchKeySeparation: "This is a separate web-search key. A DeepSeek/xAI API key does not work here.",
    testSearch: "Test web search", testingSearch: "Testing Tavily…", searchWorks: "Web search works", wrongSearchKeyUi: "This looks like an LLM key (sk-…). Tavily needs its own tvly-… key.",
    factCheckHint: "Without a search API the extension can assess the text, but cannot independently verify claims.",
    costAndCache: "Cost and cache", inputPrice: "Input, $ / 1M tokens", outputPrice: "Output, $ / 1M tokens",
    tavilyPrice: "Tavily, $ / credit", cacheHours: "Fast cache, hours",
    cacheHint: "Fast cache avoids duplicate API calls. History is stored separately and does not expire with this timer.",
    author: "Author and contacts", save: "Save", savedSettings: "Saved locally in your Edge profile.",
    invalidEndpoint: "Invalid endpoint.", httpsEndpoint: "Custom endpoint must use HTTPS.", permissionDenied: "Edge did not grant access to this API.",
    testingApi: "Saving settings and testing the API…", apiWorks: "API works", errorPrefix: "Error",
    restoredTitle: "Saved summary", restoredText: "Loaded from history without calling the API. The page may have changed — click “New summary” for current data.",
    restoredAt: "saved {time}", emptyHistory: "History is empty. Your first summary will be saved automatically.",
    openSaved: "Open summary", delete: "Delete", confirmClear: "Delete all saved summaries?",
    cachedZero: "cache: $0", historyZero: "history: $0", webSearch: "web search", webSearchPlural: "web searches", truncated: "text truncated",
    kindConversation: "chat", kindListing: "listing", kindJob: "job", kindArticle: "article", kindSelection: "selection", kindPage: "page",
    short: "In short", numbers: "Numbers made clear", numbersIntro: "Units and time periods are shown separately. Monthly and hourly rates are never mixed.",
    facts: "Facts and verification", unverifiedExternally: "not externally verified", examples: "Examples from the source", concerns: "What to watch",
    quality: "Source quality", qualityFallback: "Assessment based on internal signals in the extracted text.", important: "Important", checkLimit: "Verification limits",
    missingTavily: "No Tavily API key is configured, so this is not an external fact check. Add a separate Tavily key in Settings.",
    searchFailed: "The summary is ready, but web verification failed: {error}",
    wrongSearchKeyReport: "The web-search field contains an LLM key. A DeepSeek/xAI key does not grant Tavily search access; the summary was created without external verification.",
    searchEmpty: "Web search did not return usable sources for the selected claims. The summary was kept without external confirmation.",
    checkedLimit: "Statuses show how well claims are supported by the sources found. This reduces risk but cannot guarantee absolute truth, especially for fresh, disputed or poorly documented topics.",
    barChartNote: "Bars start at zero; each chart compares only one compatible measure.",
    indicator: "Metric", periodMonth: "per month", periodHour: "per hour", periodYear: "per year", periodDay: "per day", periodOne: "one-time", periodUnknown: "period unknown",
    gross: "gross", net: "net", grossNetUnknown: "gross/net not stated",
    monthlyEstimate: "Reference: ≈ {value} at 160 h/month. This is a conversion, not the original salary.",
    unknownPeriodWarn: "The pay period could not be identified, so it is not compared with monthly/hourly rates.", sourceOriginal: "Source: {value}",
    rangeCompare: "Range comparison · {unit}", valueCompare: "Value comparison · {unit}", rangeNote: "The bar shows the min–max range. Only values with the same currency and time period are placed on one chart.",
    sampleStructure: "Sample structure", cards: "cards", chartExtractedTruncated: "The chart covers only the extracted portion of the page.", chartExtracted: "The chart covers the extracted page data.",
    verdictConfirmed: "confirmed", verdictMostly: "mostly confirmed", verdictDisputed: "conflicting evidence", verdictFalse: "refuted", verdictUnverified: "not enough data",
    severityLow: "low", severityMedium: "medium", severityHigh: "high",
    unitMonth: "month", unitHour: "hour", unitYear: "year", unitDay: "day", unitOne: "one-time", unitDefault: "units",
    historyLanguage: "language: {language}", reportDate: "{date}", unknownTitle: "Untitled", savedBadge: "saved",
    noCurrentSaved: "No saved summary for this page yet.", apiModelFallback: "model"
  },
  pl: {
    subtitle: "skrót + weryfikacja faktów",
    history: "Historia", settings: "Ustawienia", back: "Wstecz",
    historySubtitle: "Zapisane skróty są dostępne także po ponownym uruchomieniu Edge.", clearHistory: "Wyczyść",
    settingsSubtitle: "Model, język, weryfikacja i koszt.", analysisMode: "Tryb",
    modeEconomy: "Oszczędny", modeBalanced: "Zbalansowany", modeDeep: "Dokładny",
    makeSummary: "Zrób skrót", newSummary: "Nowy skrót",
    statusReady: "Otwórz stronę i kliknij „Zrób skrót”.",
    statusReading: "Czytam stronę i tworzę skrót…", statusRefreshing: "Tworzę nowy skrót…",
    statusDone: "Gotowe.", statusCached: "Gotowe — bez nowych kosztów tokenów.", statusFailed: "Nie udało się wykonać analizy.",
    languageAndOutput: "Język interfejsu i odpowiedzi", language: "Język",
    languageHint: "Interfejs zmienia się od razu. Nowe odpowiedzi AI będą w wybranym języku; analiza wewnętrzna może używać bardziej oszczędnego formatu.",
    provider: "Dostawca", model: "Model", apiKeyPlaceholder: "klucz jest przechowywany lokalnie w profilu Edge",
    endpoint: "Endpoint Chat Completions", testApi: "Sprawdź API LLM",
    factChecking: "Weryfikacja faktów", factCheckLabel: "Sprawdzaj kluczowe tezy przez wyszukiwanie w sieci",
    searchApiLabel: "API wyszukiwarki — Tavily", tavilyPlaceholder: "tvly-… osobny klucz Tavily",
    searchKeySeparation: "To osobny klucz wyszukiwarki. Klucz API DeepSeek/xAI tutaj nie zadziała.",
    testSearch: "Sprawdź wyszukiwanie", testingSearch: "Sprawdzam Tavily…", searchWorks: "Wyszukiwanie działa", wrongSearchKeyUi: "To wygląda jak klucz LLM (sk-…). Tavily wymaga osobnego klucza tvly-….",
    factCheckHint: "Bez API wyszukiwarki rozszerzenie może ocenić tekst, ale nie może niezależnie potwierdzić faktów.",
    costAndCache: "Koszt i pamięć podręczna", inputPrice: "Input, $ / 1M tokenów", outputPrice: "Output, $ / 1M tokenów",
    tavilyPrice: "Tavily, $ / credit", cacheHours: "Szybki cache, godziny",
    cacheHint: "Szybki cache oszczędza ponowne wywołania API. Historia jest przechowywana osobno i nie wygasa po tym czasie.",
    author: "Autor i kontakt", save: "Zapisz", savedSettings: "Zapisano lokalnie w profilu Edge.",
    invalidEndpoint: "Nieprawidłowy endpoint.", httpsEndpoint: "Własny endpoint musi używać HTTPS.", permissionDenied: "Edge nie przyznał dostępu do tego API.",
    testingApi: "Zapisuję ustawienia i sprawdzam API…", apiWorks: "API działa", errorPrefix: "Błąd",
    restoredTitle: "Zapisany skrót", restoredText: "Wczytano z historii bez wywołania API. Strona mogła się zmienić — kliknij „Nowy skrót”, aby pobrać aktualne dane.",
    restoredAt: "zapisano {time}", emptyHistory: "Historia jest pusta. Pierwszy skrót zostanie zapisany automatycznie.",
    openSaved: "Otwórz skrót", delete: "Usuń", confirmClear: "Usunąć całą historię skrótów?",
    cachedZero: "cache: $0", historyZero: "historia: $0", webSearch: "wyszukiwanie", webSearchPlural: "wyszukiwania", truncated: "tekst skrócony",
    kindConversation: "czat", kindListing: "lista", kindJob: "oferta pracy", kindArticle: "artykuł", kindSelection: "zaznaczenie", kindPage: "strona",
    short: "W skrócie", numbers: "Liczby bez niejasności", numbersIntro: "Jednostki i okres są pokazane osobno. Stawki miesięczne i godzinowe nie są mieszane.",
    facts: "Fakty i weryfikacja", unverifiedExternally: "bez zewnętrznej weryfikacji", examples: "Przykłady z materiału", concerns: "Na co uważać",
    quality: "Jakość materiału", qualityFallback: "Ocena na podstawie wewnętrznych cech wyodrębnionego tekstu.", important: "Ważne", checkLimit: "Ograniczenia weryfikacji",
    missingTavily: "Brak klucza Tavily API, więc nie jest to zewnętrzny fact-check. Dodaj osobny klucz Tavily w ustawieniach.",
    searchFailed: "Skrót jest gotowy, ale zewnętrzna weryfikacja nie zadziałała: {error}",
    wrongSearchKeyReport: "W polu wyszukiwarki podano klucz LLM. Klucz DeepSeek/xAI nie daje dostępu do Tavily; skrót wykonano bez zewnętrznej weryfikacji.",
    searchEmpty: "Wyszukiwarka nie zwróciła użytecznych źródeł dla wybranych tez. Skrót zapisano bez zewnętrznego potwierdzenia.",
    checkedLimit: "Statusy pokazują, w jakim stopniu tezy potwierdzają znalezione źródła. Zmniejsza to ryzyko błędu, ale nie daje absolutnej gwarancji prawdy — zwłaszcza przy świeżych lub spornych tematach.",
    barChartNote: "Słupki zaczynają się od zera; każdy wykres porównuje tylko jedną zgodną wielkość.",
    indicator: "Wskaźnik", periodMonth: "miesięcznie", periodHour: "za godzinę", periodYear: "rocznie", periodDay: "dziennie", periodOne: "jednorazowo", periodUnknown: "okres nieznany",
    gross: "brutto", net: "netto", grossNetUnknown: "brutto/netto nie podano",
    monthlyEstimate: "Orientacyjnie: ≈ {value} przy 160 h/mies. To przeliczenie, nie pierwotna pensja.",
    unknownPeriodWarn: "Nie rozpoznano okresu wynagrodzenia — nie porównuję tej wartości ze stawkami miesięcznymi/godzinowymi.", sourceOriginal: "W źródle: {value}",
    rangeCompare: "Porównanie widełek · {unit}", valueCompare: "Porównanie wartości · {unit}", rangeNote: "Pasek pokazuje zakres min–max. Na jednym wykresie są tylko wartości z tą samą walutą i okresem.",
    sampleStructure: "Struktura próbki", cards: "ofert", chartExtractedTruncated: "Wykres dotyczy tylko wyodrębnionej części strony.", chartExtracted: "Wykres dotyczy wyodrębnionych danych strony.",
    verdictConfirmed: "potwierdzone", verdictMostly: "w większości potwierdzone", verdictDisputed: "sprzeczne źródła", verdictFalse: "obalone", verdictUnverified: "za mało danych",
    severityLow: "niski", severityMedium: "średni", severityHigh: "wysoki",
    unitMonth: "miesiąc", unitHour: "godzina", unitYear: "rok", unitDay: "dzień", unitOne: "jednorazowo", unitDefault: "jedn.",
    historyLanguage: "język: {language}", reportDate: "{date}", unknownTitle: "Bez tytułu", savedBadge: "zapisano",
    noCurrentSaved: "Brak zapisanego skrótu dla tej strony.", apiModelFallback: "model"
  }
};

let settings = {};
let currentReport = null;
let currentReportRestored = false;
let currentView = "main";

init().catch(showError);

async function init() {
  settings = await chrome.storage.local.get([
    "provider", "model", "deepseekKey", "xaiKey", "customKey", "customEndpoint",
    "mode", "factCheck", "tavilyKey", "cacheHours", "inputPricePerM", "outputPricePerM", "tavilyCreditPrice", "language"
  ]);
  settings.provider ||= "deepseek";
  settings.model ||= DEFAULT_MODEL[settings.provider];
  settings.mode ||= "economy";
  settings.language = ["ru", "en", "pl"].includes(settings.language) ? settings.language : "ru";
  if (typeof settings.factCheck !== "boolean") settings.factCheck = true;
  if (typeof settings.cacheHours !== "number") settings.cacheHours = 6;
  if (typeof settings.inputPricePerM !== "number") settings.inputPricePerM = DEFAULT_PRICE[settings.provider].input;
  if (typeof settings.outputPricePerM !== "number") settings.outputPricePerM = DEFAULT_PRICE[settings.provider].output;
  if (typeof settings.tavilyCreditPrice !== "number") settings.tavilyCreditPrice = 0.008;

  $("versionLabel").textContent = `v${VERSION}`;
  bindEvents();
  applyLanguage();
  fillSettingsForm();
  $("mode").value = settings.mode;
  await restoreCurrentReport();
}

function t(key, vars = {}) {
  const table = I18N[settings.language] || I18N.ru;
  let value = table[key] ?? I18N.en[key] ?? key;
  for (const [name, replacement] of Object.entries(vars)) {
    value = value.replaceAll(`{${name}}`, String(replacement));
  }
  return value;
}

function applyLanguage() {
  document.documentElement.lang = settings.language;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    node.textContent = t(key);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.placeholder = t(node.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-title]").forEach((node) => {
    node.title = t(node.dataset.i18nTitle);
  });
  updateAnalyzeButton();
}

function bindEvents() {
  $("analyzeBtn").addEventListener("click", () => runAnalysis(Boolean(currentReport)));
  $("settingsBtn").addEventListener("click", showSettings);
  $("historyBtn").addEventListener("click", showHistory);
  $("backBtn").addEventListener("click", showMain);
  $("historyBackBtn").addEventListener("click", showMain);
  $("saveBtn").addEventListener("click", saveSettings);
  $("testApiBtn").addEventListener("click", testApi);
  $("testSearchBtn").addEventListener("click", testSearch);
  $("clearHistoryBtn").addEventListener("click", clearHistory);
  $("provider").addEventListener("change", onProviderChanged);
  $("language").addEventListener("change", async () => {
    settings.language = $("language").value;
    await chrome.storage.local.set({ language: settings.language });
    applyLanguage();
    if (currentReport) renderReport(currentReport, { restored: currentReportRestored });
    if (currentView === "history") await loadHistory();
  });
  $("mode").addEventListener("change", async () => {
    settings.mode = $("mode").value;
    await chrome.storage.local.set({ mode: settings.mode });
  });
  $("tavilyKey").addEventListener("input", () => {
    const key = $("tavilyKey").value.trim();
    if (/^sk-/i.test(key)) setSearchStatus(t("wrongSearchKeyUi"), true);
    else if ($("searchStatus").textContent === t("wrongSearchKeyUi")) setSearchStatus("", false);
  });
}

function setView(name) {
  currentView = name;
  for (const id of ["mainView", "settingsView", "historyView"]) $(id).classList.add("hidden");
  $(`${name}View`).classList.remove("hidden");
}

function showSettings() {
  setView("settings");
  fillSettingsForm();
}

function showMain() {
  setView("main");
  $("mode").value = settings.mode || "economy";
}

async function showHistory() {
  setView("history");
  await loadHistory();
}

function fillSettingsForm() {
  $("provider").value = settings.provider || "deepseek";
  $("model").value = settings.model || DEFAULT_MODEL[$("provider").value];
  $("apiKey").value = keyForProvider($("provider").value);
  $("customEndpoint").value = settings.customEndpoint || "";
  $("customEndpointWrap").classList.toggle("hidden", $("provider").value !== "custom");
  $("factCheck").checked = settings.factCheck !== false;
  $("tavilyKey").value = settings.tavilyKey || "";
  if (/^sk-/i.test($("tavilyKey").value.trim())) setSearchStatus(t("wrongSearchKeyUi"), true);
  else setSearchStatus("", false);
  $("cacheHours").value = Number(settings.cacheHours ?? 6);
  $("inputPrice").value = Number(settings.inputPricePerM ?? 0);
  $("outputPrice").value = Number(settings.outputPricePerM ?? 0);
  $("tavilyPrice").value = Number(settings.tavilyCreditPrice ?? 0.008);
  $("language").value = settings.language || "ru";
}

function keyForProvider(provider) {
  if (provider === "deepseek") return settings.deepseekKey || "";
  if (provider === "xai") return settings.xaiKey || "";
  return settings.customKey || "";
}

function onProviderChanged() {
  const provider = $("provider").value;
  $("customEndpointWrap").classList.toggle("hidden", provider !== "custom");
  $("model").value = DEFAULT_MODEL[provider];
  $("apiKey").value = keyForProvider(provider);
  $("inputPrice").value = DEFAULT_PRICE[provider].input;
  $("outputPrice").value = DEFAULT_PRICE[provider].output;
}

async function saveSettings() {
  const provider = $("provider").value;
  const apiKey = $("apiKey").value.trim();
  const customEndpoint = $("customEndpoint").value.trim();
  const patch = {
    provider,
    model: $("model").value.trim(),
    customEndpoint,
    factCheck: $("factCheck").checked,
    tavilyKey: $("tavilyKey").value.trim(),
    cacheHours: Number($("cacheHours").value || 0),
    inputPricePerM: Number($("inputPrice").value || 0),
    outputPricePerM: Number($("outputPrice").value || 0),
    tavilyCreditPrice: Number($("tavilyPrice").value || 0),
    mode: settings.mode || "economy",
    language: $("language").value || "ru"
  };
  if (provider === "deepseek") patch.deepseekKey = apiKey;
  else if (provider === "xai") patch.xaiKey = apiKey;
  else patch.customKey = apiKey;

  if (provider === "custom") {
    let url;
    try { url = new URL(customEndpoint); } catch { setSaveStatus(t("invalidEndpoint"), true); return false; }
    if (url.protocol !== "https:") { setSaveStatus(t("httpsEndpoint"), true); return false; }
    const originPattern = `${url.origin}/*`;
    const allowed = await chrome.permissions.contains({ origins: [originPattern] });
    if (!allowed) {
      const granted = await chrome.permissions.request({ origins: [originPattern] });
      if (!granted) { setSaveStatus(t("permissionDenied"), true); return false; }
    }
  }

  await chrome.storage.local.set(patch);
  settings = { ...settings, ...patch };
  applyLanguage();
  setSaveStatus(t("savedSettings"), false);
  return true;
}

function setSaveStatus(text, isError) {
  $("saveStatus").textContent = text;
  $("saveStatus").classList.toggle("warning", Boolean(isError));
  $("saveStatus").classList.toggle("success", !isError && Boolean(text));
}

async function testApi() {
  const btn = $("testApiBtn");
  btn.disabled = true;
  setSaveStatus(t("testingApi"), false);
  try {
    const saved = await saveSettings();
    if (!saved) return;
    const response = await chrome.runtime.sendMessage({ type: "testApi" });
    if (!response?.ok) throw new Error(response?.error || t("statusFailed"));
    const r = response.result || {};
    setSaveStatus(`✓ ${r.provider || "LLM"} / ${r.model || t("apiModelFallback")}: ${t("apiWorks")}`, false);
  } catch (error) {
    setSaveStatus(`${t("errorPrefix")}: ${error?.message || String(error)}`, true);
  } finally {
    btn.disabled = false;
  }
}

function setSearchStatus(text, isError) {
  const node = $("searchStatus");
  node.textContent = text || "";
  node.classList.toggle("warning", Boolean(isError));
  node.classList.toggle("success", !isError && Boolean(text));
}

async function testSearch() {
  const btn = $("testSearchBtn");
  btn.disabled = true;
  setSearchStatus(t("testingSearch"), false);
  try {
    const key = $("tavilyKey").value.trim();
    if (/^sk-/i.test(key)) throw new Error(t("wrongSearchKeyUi"));
    const saved = await saveSettings();
    if (!saved) return;
    const response = await chrome.runtime.sendMessage({ type: "testSearch" });
    if (!response?.ok) throw new Error(response?.error || t("statusFailed"));
    setSearchStatus(`✓ Tavily: ${t("searchWorks")}`, false);
  } catch (error) {
    setSearchStatus(`${t("errorPrefix")}: ${error?.message || String(error)}`, true);
  } finally {
    btn.disabled = false;
  }
}

async function restoreCurrentReport() {
  try {
    const response = await chrome.runtime.sendMessage({ type: "restoreCurrent" });
    if (!response?.ok || !response.result?.report) {
      $("status").textContent = t("statusReady");
      return;
    }
    currentReport = response.result.report;
    currentReportRestored = true;
    renderReport(currentReport, { restored: true, savedAt: response.result.savedAt });
  } catch {
    $("status").textContent = t("statusReady");
  }
}

async function runAnalysis(force) {
  clearError();
  setBusy(true, force ? t("statusRefreshing") : t("statusReading"));
  try {
    const response = await chrome.runtime.sendMessage({ type: "analyze", force });
    if (!response?.ok) throw new Error(response?.error || t("statusFailed"));
    currentReport = response.result;
    currentReportRestored = false;
    renderReport(currentReport, { restored: false });
  } catch (error) {
    showError(error);
  } finally {
    setBusy(false);
  }
}

function setBusy(busy, text = "") {
  $("analyzeBtn").disabled = busy;
  $("mode").disabled = busy;
  if (busy) $("status").textContent = text;
}

function updateAnalyzeButton() {
  $("analyzeBtnText").textContent = currentReport ? t("newSummary") : t("makeSummary");
}

function showError(error) {
  const message = error?.message || String(error || t("statusFailed"));
  $("error").textContent = message;
  $("error").classList.remove("hidden");
  $("status").textContent = t("statusFailed");
}

function clearError() {
  $("error").classList.add("hidden");
  $("error").textContent = "";
}

function renderReport(report, options = {}) {
  const restored = Boolean(options.restored);
  const container = $("report");
  container.replaceChildren();
  container.classList.remove("hidden");
  clearError();

  currentReport = report;
  currentReportRestored = restored;
  updateAnalyzeButton();

  const notice = $("restoreNotice");
  if (restored) {
    notice.replaceChildren();
    const text = document.createElement("div");
    const when = formatRelativeTime(options.savedAt || report.historySavedAt || report.generatedAt);
    text.innerHTML = `<strong>${escapeHtml(t("restoredTitle"))}</strong><br>${escapeHtml(t("restoredText"))}<br><span class="muted">${escapeHtml(t("restoredAt", { time: when }))}</span>`;
    notice.append(text);
    notice.classList.remove("hidden");
  } else {
    notice.classList.add("hidden");
    notice.replaceChildren();
  }

  const a = report.analysis || {};
  const intro = card();
  intro.append(el("div", "one-liner", a.one_liner || t("statusDone")));
  const meta = el("div", "meta");
  if (restored) meta.append(pill(t("historyZero")));
  else meta.append(pill(report.cached ? t("cachedZero") : `≈ $${formatMoney(report.estimatedCostUsd)}`));
  const kind = report.page?.kind || "page";
  meta.append(pill(kindLabel(kind)));
  if (report.language) meta.append(pill(languageName(report.language)));
  meta.append(pill(`${report.usage?.promptTokens || 0} in / ${report.usage?.completionTokens || 0} out`));
  if (report.usage?.searchCalls) {
    const n = Number(report.usage.searchCalls);
    meta.append(pill(`${n} ${n === 1 ? t("webSearch") : t("webSearchPlural")}`));
  }
  if (report.page?.truncated) meta.append(pill(t("truncated")));
  intro.append(meta);
  container.append(intro);

  if (Array.isArray(a.summary) && a.summary.length) {
    const c = card(t("short"));
    const ul = document.createElement("ul");
    a.summary.forEach((item) => ul.append(el("li", "", item)));
    c.append(ul);
    if (a.what_it_means) c.append(el("p", "fact-note", a.what_it_means));
    container.append(c);
  }

  renderNumericInsights(container, a.numeric_insights, report.page);

  const verificationMap = new Map((report.verification || []).map((v) => [v.claim_index, v]));
  if (Array.isArray(a.key_facts) && a.key_facts.length) {
    const c = card(t("facts"));
    a.key_facts.forEach((fact, index) => {
      const row = el("div", "fact");
      row.append(el("div", "fact-claim", fact.claim));
      if (fact.why_it_matters) row.append(el("div", "fact-note", fact.why_it_matters));
      const v = verificationMap.get(index);
      if (v) {
        row.append(el("span", `verdict v-${v.verdict}`, verdictLabel(v.verdict, v.confidence)));
        if (v.explanation) row.append(el("div", "fact-note", v.explanation));
        const links = sourcesForVerification(report.sources || [], v);
        if (links.length) {
          const sourceList = el("div", "source-list");
          links.forEach((s) => {
            const link = document.createElement("a");
            link.href = s.url;
            link.target = "_blank";
            link.rel = "noreferrer";
            link.textContent = s.title || safeHostname(s.url);
            sourceList.append(link);
          });
          row.append(sourceList);
        }
      } else {
        row.append(el("span", "verdict v-unverified", t("unverifiedExternally")));
      }
      c.append(row);
    });
    container.append(c);
  }

  if (Array.isArray(a.examples) && a.examples.length) {
    const c = card(t("examples"));
    const ul = document.createElement("ul");
    a.examples.forEach((x) => ul.append(el("li", "", `${x.title ? x.title + ": " : ""}${x.description}`)));
    c.append(ul);
    container.append(c);
  }

  if (Array.isArray(a.problems) && a.problems.length) {
    const c = card(t("concerns"));
    const ul = document.createElement("ul");
    a.problems.forEach((x) => ul.append(el("li", "", `[${severityLabel(x.severity)}] ${x.issue}`)));
    c.append(ul);
    container.append(c);
  }

  if (a.article_quality && a.article_quality.score != null) {
    const c = card(t("quality"));
    const wrap = el("div", "quality");
    wrap.append(el("div", "score", String(Math.round(a.article_quality.score))));
    wrap.append(el("div", "fact-note", a.article_quality.reason || t("qualityFallback")));
    c.append(wrap);
    container.append(c);
  }

  if (report.factCheckStatus === "missing_search_key") {
    const c = card(t("important"));
    c.append(el("div", "fact-note warning", t("missingTavily")));
    container.append(c);
  } else if (report.factCheckStatus === "wrong_search_key") {
    const c = card(t("important"));
    c.append(el("div", "fact-note warning", t("wrongSearchKeyReport")));
    container.append(c);
  } else if (report.factCheckStatus === "search_error") {
    const c = card(t("important"));
    c.append(el("div", "fact-note warning", t("searchFailed", { error: report.factCheckError || t("statusFailed") })));
    container.append(c);
  } else if (report.factCheckStatus === "search_empty") {
    const c = card(t("important"));
    c.append(el("div", "fact-note warning", t("searchEmpty")));
    container.append(c);
  } else if (report.factCheckStatus === "checked") {
    const c = card(t("checkLimit"));
    c.append(el("div", "fact-note", t("checkedLimit")));
    container.append(c);
  }

  $("status").textContent = restored ? t("statusCached") : (report.cached ? t("statusCached") : t("statusDone"));
}

function renderNumericInsights(container, numeric, page) {
  const metrics = Array.isArray(numeric?.metrics) ? numeric.metrics : [];
  const breakdowns = Array.isArray(numeric?.breakdowns) ? numeric.breakdowns : [];
  if (!metrics.length && !breakdowns.length) return;

  if (metrics.length) {
    const c = card(t("numbers"));
    c.append(el("div", "fact-note numeric-intro", t("numbersIntro")));
    const list = el("div", "numeric-list");
    metrics.slice(0, 16).forEach((m) => list.append(renderMetric(m)));
    c.append(list);
    container.append(c);
  }

  // Each compatible numeric group gets its own chart. Ranges and scalar values are rendered differently.
  const groups = chartableMetricGroups(metrics);
  for (const group of groups.slice(0, 4)) {
    container.append(group.kind === "range" ? renderRangeChart(group) : renderScalarMetricChart(group));
  }

  // Do not collapse job analytics into one pie. Each dimension is intentionally shown separately.
  const seenTitles = new Set();
  for (const breakdown of breakdowns.slice(0, 10)) {
    if (!isUsefulBreakdown(breakdown)) continue;
    const titleKey = String(breakdown.title || "").toLowerCase();
    if (seenTitles.has(titleKey)) continue;
    seenTitles.add(titleKey);
    const chartType = breakdown.chart_type === "donut" && breakdown.items.length <= 7 ? "donut" : "bar";
    container.append(chartType === "donut" ? renderDonutChart(breakdown, page) : renderBarBreakdown(breakdown, page));
  }
}

function renderMetric(metric) {
  const row = el("div", "numeric-item");
  row.append(el("div", "numeric-label", metric.label || t("indicator")));
  const valueLine = el("div", "numeric-value");
  valueLine.append(document.createTextNode(formatMetricRange(metric)));
  const period = humanPeriod(metric.period);
  if (period) valueLine.append(el("span", "numeric-period", period));
  row.append(valueLine);

  const notes = [];
  if (metric.context) notes.push(metric.context);
  if (metric.tax_basis === "gross") notes.push(t("gross"));
  else if (metric.tax_basis === "net") notes.push(t("net"));
  else if (metric.currency && metric.period !== "unknown") notes.push(t("grossNetUnknown"));
  if (notes.length) row.append(el("div", "numeric-context", notes.join(" · ")));

  if (metric.period === "hour" && metric.currency && metric.min != null && metric.max != null) {
    const estimate = `${formatNumber(metric.min * 160)}–${formatNumber(metric.max * 160)} ${metric.currency} / ${t("unitMonth")}`;
    row.append(el("div", "numeric-estimate", t("monthlyEstimate", { value: estimate })));
  }

  if (metric.period === "unknown" && metric.currency) row.append(el("div", "numeric-warning", t("unknownPeriodWarn")));
  if (metric.original) row.append(el("div", "numeric-original", t("sourceOriginal", { value: metric.original })));
  return row;
}

function chartableMetricGroups(metrics) {
  const map = new Map();
  for (const m of metrics) {
    if (!m?.chartable || !m.comparison_group || m.min == null || m.max == null) continue;
    const unitKey = [m.comparison_group, m.currency || m.unit || "", m.period || "unknown"].join("|");
    if (!map.has(unitKey)) map.set(unitKey, []);
    map.get(unitKey).push(m);
  }
  return [...map.entries()]
    .filter(([, items]) => items.length >= 2)
    .map(([key, items]) => {
      const hasRealRange = items.some((x) => Number(x.max) > Number(x.min));
      const isSalary = String(items[0]?.comparison_group || "").startsWith("salary:");
      return {
        key,
        kind: hasRealRange || isSalary ? "range" : "scalar",
        items: items.sort((a, b) => Number(b.max || 0) - Number(a.max || 0)).slice(0, 12),
        currency: items[0].currency || "",
        unit: items[0].unit || "",
        period: items[0].period || "unknown",
        label: String(items[0]?.comparison_group || "").replace(/^salary:/, "")
      };
    });
}

function renderRangeChart(group) {
  const c = card(t("rangeCompare", { unit: humanUnit(group) }));
  c.classList.add("chart-card");
  const max = Math.max(...group.items.map((x) => Number(x.max || x.min || 0)), 1);
  const chart = el("div", "range-chart");
  for (const item of group.items) {
    const row = el("div", "range-row");
    row.append(el("div", "range-name", item.label));
    const line = el("div", "range-line");
    const track = el("div", "range-track");
    const fill = el("div", "range-fill");
    const min = Math.max(0, Number(item.min ?? item.max ?? 0));
    const itemMax = Math.max(min, Number(item.max ?? item.min ?? 0));
    if (itemMax === min) {
      // Exact values are ordinary bars from zero; the old code placed a tiny dot at 100% and clipped it.
      fill.style.left = "0%";
      fill.style.width = `${Math.max(0, Math.min(100, (itemMax / max) * 100))}%`;
      fill.classList.add("range-fill-fixed");
    } else {
      const left = Math.min(100, (min / max) * 100);
      const width = Math.max(2.5, Math.min(100 - left, ((itemMax - min) / max) * 100));
      fill.style.left = `${left}%`;
      fill.style.width = `${width}%`;
    }
    track.append(fill);
    line.append(track, el("div", "range-value", formatMetricRange(item)));
    row.append(line);
    chart.append(row);
  }
  const scale = el("div", "range-scale");
  scale.append(el("span", "", "0"), el("span", "", `${formatNumber(max)} ${group.currency || group.unit || ""}`.trim()));
  chart.append(scale);
  c.append(chart);
  c.append(el("div", "chart-note", t("rangeNote")));
  return c;
}

function renderScalarMetricChart(group) {
  const titleUnit = humanUnit(group);
  const c = card(t("valueCompare", { unit: titleUnit }));
  c.classList.add("chart-card");
  const max = Math.max(...group.items.map((x) => Number(x.max ?? x.value ?? 0)), 1);
  const list = el("div", "bar-chart");
  for (const item of group.items) {
    const value = Math.max(0, Number(item.max ?? item.value ?? 0));
    const row = el("div", "bar-row");
    const top = el("div", "bar-top");
    top.append(el("span", "bar-label", item.label), el("span", "bar-number", `${formatNumber(value)}${titleUnit ? ` ${titleUnit}` : ""}`));
    const track = el("div", "bar-track");
    const fill = el("div", "bar-fill");
    fill.style.width = `${Math.max(0, Math.min(100, value / max * 100))}%`;
    track.append(fill);
    row.append(top, track);
    list.append(row);
  }
  c.append(list, el("div", "chart-note", t("barChartNote")));
  return c;
}

function isUsefulBreakdown(breakdown) {
  const items = Array.isArray(breakdown?.items) ? breakdown.items.filter((x) => Number(x.value) > 0) : [];
  if (!breakdown?.title || items.length > 14) return false;
  return breakdown.chart_type === "donut" ? items.length >= 2 : items.length >= 1;
}

function renderBarBreakdown(breakdown, page) {
  const c = card(breakdown.title || t("sampleStructure"));
  c.classList.add("chart-card");
  const items = breakdown.items.filter((x) => Number(x.value) > 0).slice(0, 14);
  const max = Math.max(...items.map((x) => Number(x.value || 0)), 1);
  const list = el("div", "bar-chart");
  for (const item of items) {
    const value = Number(item.value || 0);
    const row = el("div", "bar-row");
    const top = el("div", "bar-top");
    top.append(el("span", "bar-label", item.label), el("span", "bar-number", formatNumber(value)));
    const track = el("div", "bar-track");
    const fill = el("div", "bar-fill");
    fill.style.width = `${Math.max(0, Math.min(100, value / max * 100))}%`;
    track.append(fill);
    row.append(top, track);
    list.append(row);
  }
  c.append(list);
  const note = breakdown.note || (page?.truncated ? t("chartExtractedTruncated") : t("chartExtracted"));
  c.append(el("div", "chart-note", note));
  return c;
}

function renderDonutChart(breakdown, page) {
  const c = card(breakdown.title || t("sampleStructure"));
  c.classList.add("chart-card");
  const wrap = el("div", "donut-wrap");
  const size = 118;
  const stroke = 17;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
  svg.setAttribute("class", "donut-svg");
  const bg = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  bg.setAttribute("cx", size / 2); bg.setAttribute("cy", size / 2); bg.setAttribute("r", r);
  bg.setAttribute("class", "donut-bg"); svg.append(bg);

  const items = breakdown.items.filter((x) => Number(x.value) > 0).slice(0, 7);
  const total = items.reduce((acc, x) => acc + Number(x.value), 0);
  let offset = 0;
  items.forEach((item, index) => {
    const fraction = Number(item.value) / total;
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", size / 2); circle.setAttribute("cy", size / 2); circle.setAttribute("r", r);
    circle.setAttribute("class", `donut-segment donut-color-${index % 7}`);
    circle.setAttribute("stroke-dasharray", `${fraction * circumference} ${circumference}`);
    circle.setAttribute("stroke-dashoffset", String(-offset * circumference));
    svg.append(circle);
    offset += fraction;
  });
  const center = el("div", "donut-center");
  center.append(el("strong", "", formatNumber(total)), el("span", "", t("cards")));
  const visual = el("div", "donut-visual");
  visual.append(svg, center);

  const legend = el("div", "donut-legend");
  items.forEach((item, index) => {
    const row = el("div", "donut-legend-row");
    row.append(el("span", `donut-dot donut-color-bg-${index % 7}`));
    row.append(el("span", "donut-legend-label", item.label));
    const pct = Math.round(Number(item.value) / total * 100);
    row.append(el("span", "donut-legend-value", `${formatNumber(item.value)} · ${pct}%`));
    legend.append(row);
  });
  wrap.append(visual, legend);
  c.append(wrap);
  const note = breakdown.note || (page?.truncated ? t("chartExtractedTruncated") : t("chartExtracted"));
  c.append(el("div", "chart-note", note));
  return c;
}

async function loadHistory() {
  const list = $("historyList");
  list.replaceChildren();
  const response = await chrome.runtime.sendMessage({ type: "getHistory" });
  const entries = response?.ok && Array.isArray(response.result) ? response.result : [];
  if (!entries.length) {
    list.append(el("div", "history-empty", t("emptyHistory")));
    return;
  }

  for (const item of entries) {
    const row = el("article", "history-item");
    const top = el("div", "history-top");
    const titleWrap = document.createElement("div");
    titleWrap.style.minWidth = "0";
    titleWrap.append(el("div", "history-title", item.title || t("unknownTitle")));
    titleWrap.append(el("div", "history-host", item.host || safeHostname(item.url)));
    top.append(titleWrap);
    top.append(pill(kindLabel(item.kind || "page")));
    row.append(top);
    if (item.oneLiner) row.append(el("div", "history-summary", item.oneLiner));

    const meta = el("div", "history-meta");
    meta.append(pill(formatDateTime(item.savedAt)));
    meta.append(pill(languageName(item.language || "ru")));
    meta.append(pill(`≈ $${formatMoney(item.estimatedCostUsd)}`));
    row.append(meta);

    const actions = el("div", "history-actions");
    const openBtn = el("button", "secondary history-open", t("openSaved"));
    openBtn.addEventListener("click", () => openHistoryEntry(item.id));
    const delBtn = document.createElement("button");
    delBtn.className = "ghost history-delete";
    delBtn.title = t("delete");
    delBtn.setAttribute("aria-label", t("delete"));
    delBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5M14 11v5"/></svg>';
    delBtn.addEventListener("click", async () => {
      await chrome.runtime.sendMessage({ type: "deleteHistoryEntry", id: item.id });
      await loadHistory();
    });
    actions.append(openBtn, delBtn);
    row.append(actions);
    list.append(row);
  }
}

async function openHistoryEntry(id) {
  const response = await chrome.runtime.sendMessage({ type: "getHistoryEntry", id });
  if (!response?.ok || !response.result?.report) return;
  showMain();
  currentReport = response.result.report;
  currentReportRestored = true;
  renderReport(currentReport, { restored: true, savedAt: response.result.savedAt });
}

async function clearHistory() {
  if (!confirm(t("confirmClear"))) return;
  await chrome.runtime.sendMessage({ type: "clearHistory" });
  await loadHistory();
}

function formatMetricRange(metric) {
  const currency = metric.currency || "";
  const unit = !currency && metric.unit ? ` ${metric.unit}` : "";
  if (metric.min != null && metric.max != null) {
    if (Number(metric.min) === Number(metric.max)) return `${formatNumber(metric.min)} ${currency}${unit}`.trim();
    return `${formatNumber(metric.min)}–${formatNumber(metric.max)} ${currency}${unit}`.trim();
  }
  if (metric.value != null) return `${formatNumber(metric.value)} ${currency}${unit}`.trim();
  return "—";
}

function humanPeriod(period) {
  const labels = { month: "periodMonth", hour: "periodHour", year: "periodYear", day: "periodDay", one_time: "periodOne", unknown: "periodUnknown" };
  return labels[period] ? t(labels[period]) : "";
}

function humanUnit(group) {
  const cur = group.currency || group.unit || t("unitDefault");
  const periods = { month: "unitMonth", hour: "unitHour", year: "unitYear", day: "unitDay", one_time: "unitOne" };
  return periods[group.period] ? `${cur} / ${t(periods[group.period])}` : cur;
}

function kindLabel(kind) {
  const map = { conversation: "kindConversation", listing: "kindListing", job: "kindJob", article: "kindArticle", selection: "kindSelection", page: "kindPage" };
  return t(map[kind] || "kindPage");
}

function severityLabel(value) {
  return t({ low: "severityLow", medium: "severityMedium", high: "severityHigh" }[value] || "severityLow");
}

function languageName(code) {
  return ({ ru: "Русский", en: "English", pl: "Polski" })[code] || code || "—";
}

function formatNumber(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat(localeCode(), { maximumFractionDigits: 2 }).format(n);
}

function formatDateTime(value) {
  const d = new Date(value || 0);
  if (!Number.isFinite(d.getTime())) return "—";
  return new Intl.DateTimeFormat(localeCode(), { dateStyle: "medium", timeStyle: "short" }).format(d);
}

function formatRelativeTime(value) {
  const d = new Date(value || 0);
  if (!Number.isFinite(d.getTime())) return "—";
  const diff = d.getTime() - Date.now();
  const abs = Math.abs(diff);
  let amount; let unit;
  if (abs < 60_000) { amount = Math.round(diff / 1000); unit = "second"; }
  else if (abs < 3_600_000) { amount = Math.round(diff / 60_000); unit = "minute"; }
  else if (abs < 86_400_000) { amount = Math.round(diff / 3_600_000); unit = "hour"; }
  else if (abs < 2_592_000_000) { amount = Math.round(diff / 86_400_000); unit = "day"; }
  else return formatDateTime(d);
  return new Intl.RelativeTimeFormat(localeCode(), { numeric: "auto" }).format(amount, unit);
}

function localeCode() {
  return ({ ru: "ru-RU", en: "en-US", pl: "pl-PL" })[settings.language] || "en-US";
}

function sourcesForVerification(sources, verification) {
  const ids = new Set(verification.source_ids || []);
  return sources.filter((s) => ids.has(s.id)).slice(0, 4);
}

function verdictLabel(verdict, confidence) {
  const labels = {
    confirmed: "verdictConfirmed",
    mostly_confirmed: "verdictMostly",
    disputed: "verdictDisputed",
    false: "verdictFalse",
    unverified: "verdictUnverified"
  };
  return `${t(labels[verdict] || "verdictUnverified")} · ${Math.round(confidence || 0)}%`;
}

function card(title) {
  const c = el("section", "card");
  if (title) c.append(el("h3", "", title));
  return c;
}

function pill(text) { return el("span", "pill", text); }

function el(tag, className = "", text = "") {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== "") node.textContent = text;
  return node;
}

function formatMoney(value) {
  const n = Number(value || 0);
  if (n === 0) return "0";
  if (n < 0.001) return n.toFixed(6);
  if (n < 0.01) return n.toFixed(4);
  return n.toFixed(3);
}

function safeHostname(url) {
  try { return new URL(url).hostname; } catch { return ""; }
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[ch]);
}
