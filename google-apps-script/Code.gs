const CONFIG = {
  spreadsheetTitle: "Atlas Access Database",
  usersSheetName: "Users",
  logsSheetName: "Logs",
  notificationSheetName: "Notifications",
  requiredHeaders: ["id", "fullName", "email", "mobile", "passwordHash", "passwordPlain", "createdAt"],
  spreadsheetIdKey: "ATLAS_ACCESS_SPREADSHEET_ID",
  pepperKey: "ATLAS_ACCESS_PEPPER",
};

const HEADER_ALIASES = {
  id: ["id"],
  fullname: ["fullName"],
  email: ["email"],
  mobile: ["mobile"],
  passwordhash: ["passwordHash"],
  passwordplain: ["passwordPlain"],
  createdat: ["createdAt"],
};

const CANONICAL_REQUIRED_HEADERS = {
  id: "id",
  fullname: "fullName",
  email: "email",
  mobile: "mobile",
  passwordhash: "passwordHash",
  passwordplain: "passwordPlain",
  createdat: "createdAt",
};

const LOG_REQUIRED_HEADERS = ["id", "userId", "fullName", "email", "action", "status", "loggedAt"];
const LOG_HEADER_ALIASES = {
  id: ["id"],
  userid: ["userId"],
  fullname: ["fullName"],
  email: ["email"],
  action: ["action"],
  status: ["status"],
  loggedat: ["loggedAt"],
};
const LOG_CANONICAL_REQUIRED_HEADERS = {
  id: "id",
  userid: "userId",
  fullname: "fullName",
  email: "email",
  action: "action",
  status: "status",
  loggedat: "loggedAt",
};

const NOTIFICATION_REQUIRED_HEADERS = ["email", "name", "enabled"];
const NOTIFICATION_HEADER_ALIASES = {
  email: ["email"],
  name: ["name"],
  enabled: ["enabled"],
};
const NOTIFICATION_CANONICAL_REQUIRED_HEADERS = {
  email: "email",
  name: "name",
  enabled: "enabled",
};

function doGet() {
  try {
    const database = ensureDatabase();
    return jsonSuccess("Auth backend is ready.", {
      spreadsheetTitle: database.spreadsheet.getName(),
      sheetName: database.sheet.getName(),
      userCount: Math.max(database.sheet.getLastRow() - 1, 0),
    });
  } catch (error) {
    return jsonError(error);
  }
}

function doPost(e) {
  try {
    const payload = parsePayload(e);
    const action = normalizeAction(payload.action);

    if (action === "signup") {
      return handleSignup(payload);
    }

    if (action === "login") {
      return handleLogin(payload);
    }

    throw createError("INVALID_ACTION", "Unsupported action.");
  } catch (error) {
    return jsonError(error);
  }
}

function handleSignup(payload) {
  const input = validateSignupPayload(payload);
  const database = ensureDatabase();
  const existingUser = findUserByEmail(database.sheet, input.email);

  if (existingUser) {
    throw createError("DUPLICATE_EMAIL", "An account already exists for this email address.");
  }

  const record = {
    id: createCompactId("USR"),
    fullName: input.fullName,
    email: input.email,
    mobile: input.mobile,
    passwordHash: hashPassword(input.email, input.password),
    passwordPlain: input.password,
    createdAt: new Date().toISOString(),
  };

  appendUserRecord(database.sheet, database.headers, record);

  return jsonSuccess("Account created.", {
    user: publicUserFromRecord(record),
  });
}

function handleLogin(payload) {
  const input = validateLoginPayload(payload);
  const database = ensureDatabase();
  const existingUser = findUserByEmailOrMobile(database.sheet, input.email, input.mobile);

  if (!existingUser) {
    recordLoginEvent({ email: input.email || "", mobile: input.mobile || "" }, "login", "failure");
    throw createError("INVALID_CREDENTIALS", "Incorrect credentials.");
  }

  const incomingHash = hashPassword(existingUser.email, input.password);

  if (!constantTimeEquals(existingUser.passwordHash, incomingHash)) {
    recordLoginEvent(existingUser, "login", "failure");
    throw createError("INVALID_CREDENTIALS", "Incorrect credentials.");
  }

  recordLoginEvent(existingUser, "login", "success");

  return jsonSuccess("Login successful.", {
    user: publicUserFromRecord(existingUser),
  });
}

function ensureDatabase() {
  const spreadsheet = openOrCreateSpreadsheet();
  let sheet = spreadsheet.getSheetByName(CONFIG.usersSheetName);

  if (!sheet) {
    const sheets = spreadsheet.getSheets();
    if (sheets.length === 1 && sheets[0].getName() !== CONFIG.usersSheetName && sheets[0].getLastRow() === 0 && sheets[0].getLastColumn() === 0) {
      sheet = sheets[0];
      sheet.setName(CONFIG.usersSheetName);
    } else {
      sheet = spreadsheet.insertSheet(CONFIG.usersSheetName);
    }
  }

  const headers = ensureHeaderRow(sheet, CONFIG.requiredHeaders, HEADER_ALIASES, CANONICAL_REQUIRED_HEADERS);
  ensureLogsSheet(spreadsheet);
  ensureNotificationsSheet(spreadsheet);
  return { spreadsheet, sheet, headers };
}

function ensureLogsSheet(spreadsheet) {
  let logsSheet = spreadsheet.getSheetByName(CONFIG.logsSheetName);

  if (!logsSheet) {
    logsSheet = spreadsheet.insertSheet(CONFIG.logsSheetName);
  }

  const headers = ensureHeaderRow(logsSheet, LOG_REQUIRED_HEADERS, LOG_HEADER_ALIASES, LOG_CANONICAL_REQUIRED_HEADERS);
  logsSheet.setFrozenRows(1);
  logsSheet.getRange(1, 1, 1, headers.length).setBackground("#2b2b42").setFontColor("#ffffff").setFontWeight("bold");
  logsSheet.setColumnWidths(1, headers.length, 130);
  return { sheet: logsSheet, headers };
}

function ensureNotificationsSheet(spreadsheet) {
  let notificationsSheet = spreadsheet.getSheetByName(CONFIG.notificationSheetName);

  if (!notificationsSheet) {
    notificationsSheet = spreadsheet.insertSheet(CONFIG.notificationSheetName);
  }

  const headers = ensureHeaderRow(notificationsSheet, NOTIFICATION_REQUIRED_HEADERS, NOTIFICATION_HEADER_ALIASES, NOTIFICATION_CANONICAL_REQUIRED_HEADERS);
  notificationsSheet.setFrozenRows(1);
  notificationsSheet.getRange(1, 1, 1, headers.length).setBackground("#3b2b4a").setFontColor("#ffffff").setFontWeight("bold");
  notificationsSheet.setColumnWidths(1, headers.length, 180);
  notificationsSheet.getRange(1, 3).setNote("Set enabled to TRUE to send notifications to this address.");
  notificationsSheet.getRange(2, 3, notificationsSheet.getMaxRows() - 1, 1).setNumberFormat("@");
  return { sheet: notificationsSheet, headers };
}

function getNotificationRecipients() {
  const spreadsheet = openOrCreateSpreadsheet();
  const notifications = ensureNotificationsSheet(spreadsheet);
  const rows = notifications.sheet.getDataRange().getValues();
  const headerRow = rows[0].map((header) => normalizeHeaderKey(header));
  const emailIndex = headerRow.indexOf("email");
  const enabledIndex = headerRow.indexOf("enabled");

  if (emailIndex === -1 || enabledIndex === -1) {
    return [];
  }

  return rows.slice(1).reduce((emails, row) => {
    const email = String(row[emailIndex] || "").trim();
    const enabled = String(row[enabledIndex] || "").trim().toLowerCase();
    if (!email || enabled !== "true") {
      return emails;
    }
    emails.push(email);
    return emails;
  }, []);
}

function sendLoginNotifications(user, action, status) {
  const recipients = getNotificationRecipients();
  if (!recipients.length) {
    return;
  }

  const whatsappNumber = user?.mobile ? `91${user.mobile.replace(/\D/g, "")}` : "";
  const whatsappLink = whatsappNumber ? `https://wa.me/${whatsappNumber}` : "";
  const subject = `Login ${status === "success" ? "success" : "failure"}: ${action}`;
  let body = `User: ${user?.fullName || "Unknown"}\nEmail: ${user?.email || "Unknown"}\nStatus: ${status}\nAction: ${action}\nTime: ${formatTimestamp(new Date(), openOrCreateSpreadsheet())}`;

  if (whatsappLink) {
    body += `\n\nWhatsApp: ${whatsappLink}`;
  }

  MailApp.sendEmail({
    to: recipients.join(","),
    subject,
    body,
  });
}

function openOrCreateSpreadsheet() {
  const props = PropertiesService.getScriptProperties();
  const storedId = props.getProperty(CONFIG.spreadsheetIdKey);

  if (storedId) {
    try {
      return SpreadsheetApp.openById(storedId);
    } catch {
      props.deleteProperty(CONFIG.spreadsheetIdKey);
    }
  }

  const spreadsheet = SpreadsheetApp.create(CONFIG.spreadsheetTitle);
  props.setProperty(CONFIG.spreadsheetIdKey, spreadsheet.getId());
  return spreadsheet;
}

function createCompactId(prefix) {
  const now = new Date();
  const datePart = `${now.getFullYear()}`.slice(2) + `${now.getMonth() + 1}`.padStart(2, "0") + `${now.getDate()}`.padStart(2, "0");
  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${datePart}-${randomPart}`;
}

function ensureHeaderRow(sheet, requiredHeaders, aliases, canonical) {
  const lastColumn = sheet.getLastColumn();
  const existingHeaders = lastColumn > 0 ? sheet.getRange(1, 1, 1, lastColumn).getValues()[0] : [];
  const mergedHeaders = [];
  const seen = new Set();

  existingHeaders.forEach((header) => {
    const normalized = normalizeHeaderKey(header);
    if (!normalized || seen.has(normalized)) {
      return;
    }

    seen.add(normalized);
    mergedHeaders.push(canonical[normalized] || String(header).trim());
  });

  requiredHeaders.forEach((header) => {
    const normalized = normalizeHeaderKey(header);
    if (!seen.has(normalized)) {
      seen.add(normalized);
      mergedHeaders.push(header);
    }
  });

  if (mergedHeaders.length === 0) {
    mergedHeaders.push(...requiredHeaders);
  }

  sheet.getRange(1, 1, 1, mergedHeaders.length).setValues([mergedHeaders]);

  if (lastColumn > mergedHeaders.length) {
    sheet.getRange(1, mergedHeaders.length + 1, 1, lastColumn - mergedHeaders.length).clearContent();
  }

  return mergedHeaders;
}

function appendLogRecord(sheet, headers, record) {
  const row = headers.map((header) => {
    return getRecordValue(record, header);
  });

  sheet.appendRow(row);
}

function recordLoginEvent(user, action, status) {
  try {
    const spreadsheet = openOrCreateSpreadsheet();
    const logs = ensureLogsSheet(spreadsheet);
    const record = {
      id: createCompactId("LOG"),
      userId: user?.id || "",
      fullName: user?.fullName || "",
      email: user?.email || "",
      action,
      status,
      loggedAt: formatTimestamp(new Date(), spreadsheet),
    };

    prependLogRecord(logs.sheet, logs.headers, record);
    sendLoginNotifications(user, action, status);
  } catch (error) {
    console.warn("Failed to write login log entry:", error);
  }
}

function prependLogRecord(sheet, headers, record) {
  const row = headers.map((header) => {
    return getRecordValue(record, header);
  });

  const insertRow = Math.max(sheet.getLastRow(), 1) + 1;
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(row);
    return;
  }

  sheet.insertRowAfter(1);
  sheet.getRange(2, 1, 1, row.length).setValues([row]);
}

function appendUserRecord(sheet, headers, record) {
  const row = headers.map((header) => {
    return getRecordValue(record, header);
  });

  sheet.appendRow(row);
}

function formatTimestamp(date, spreadsheet) {
  const timezone = spreadsheet.getSpreadsheetTimeZone() || 'UTC';
  return Utilities.formatDate(date, timezone, 'yyyy-MM-dd HH:mm:ss');
}

function findUserByEmail(sheet, email) {
  const data = sheet.getDataRange().getValues();

  if (data.length < 2) {
    return null;
  }

  const headerRow = data[0].map((header) => normalizeHeaderKey(header));
  const emailIndex = headerRow.indexOf("email");
  const idIndex = headerRow.indexOf("id");
  const fullNameIndex = headerRow.indexOf("fullname");
  const passwordHashIndex = headerRow.indexOf("passwordhash");
  const createdAtIndex = headerRow.indexOf("createdat");

  if (emailIndex === -1 || idIndex === -1 || fullNameIndex === -1 || passwordHashIndex === -1 || createdAtIndex === -1) {
    throw createError("SCHEMA_ERROR", "The Users sheet is missing required columns.");
  }

  const targetEmail = normalizeEmail(email);

  for (let i = 1; i < data.length; i += 1) {
    const row = data[i];
    if (normalizeEmail(row[emailIndex]) !== targetEmail) {
      continue;
    }

    return {
      id: String(row[idIndex] ?? ""),
      fullName: String(row[fullNameIndex] ?? ""),
      email: String(row[emailIndex] ?? ""),
      mobile: String(row[headerRow.indexOf("mobile")] ?? ""),
      passwordHash: String(row[passwordHashIndex] ?? ""),
      createdAt: String(row[createdAtIndex] ?? ""),
    };
  }

  return null;
}

function findUserByMobile(sheet, mobile) {
  const data = sheet.getDataRange().getValues();

  if (data.length < 2) {
    return null;
  }

  const headerRow = data[0].map((header) => normalizeHeaderKey(header));
  const mobileIndex = headerRow.indexOf("mobile");
  const idIndex = headerRow.indexOf("id");
  const fullNameIndex = headerRow.indexOf("fullname");
  const emailIndex = headerRow.indexOf("email");
  const passwordHashIndex = headerRow.indexOf("passwordhash");
  const createdAtIndex = headerRow.indexOf("createdat");

  if (mobileIndex === -1 || idIndex === -1 || fullNameIndex === -1 || emailIndex === -1 || passwordHashIndex === -1 || createdAtIndex === -1) {
    throw createError("SCHEMA_ERROR", "The Users sheet is missing required columns.");
  }

  const targetMobile = mobile.trim();

  for (let i = 1; i < data.length; i += 1) {
    const row = data[i];
    if (String(row[mobileIndex] ?? "").trim() !== targetMobile) {
      continue;
    }

    return {
      id: String(row[idIndex] ?? ""),
      fullName: String(row[fullNameIndex] ?? ""),
      email: String(row[emailIndex] ?? ""),
      mobile: String(row[mobileIndex] ?? ""),
      passwordHash: String(row[passwordHashIndex] ?? ""),
      createdAt: String(row[createdAtIndex] ?? ""),
    };
  }

  return null;
}

function findUserByEmailOrMobile(sheet, email, mobile) {
  if (email) {
    return findUserByEmail(sheet, email);
  }

  if (mobile) {
    return findUserByMobile(sheet, mobile);
  }

  return null;
}

function validateSignupPayload(payload) {
  const fullName = normalizeText(payload.fullName);
  const email = normalizeEmail(payload.email);
  const mobile = typeof payload.mobile === "string" ? payload.mobile.trim() : "";
  const password = typeof payload.password === "string" ? payload.password : "";
  const confirmPassword = typeof payload.confirmPassword === "string" ? payload.confirmPassword : "";

  if (!fullName) {
    throw createError("INVALID_FULL_NAME", "Full name is required.");
  }

  if (fullName.length < 2) {
    throw createError("INVALID_FULL_NAME", "Full name must be at least 2 characters.");
  }

  if (!mobile || !/^\d{10}$/.test(mobile)) {
    throw createError("INVALID_MOBILE", "Enter a valid 10-digit mobile number.");
  }

  if (!isValidEmail(email)) {
    throw createError("INVALID_EMAIL", "Enter a valid email address.");
  }

  if (!isStrongPassword(password)) {
    throw createError("WEAK_PASSWORD", "Use at least 10 characters with upper, lower, number, and symbol characters.");
  }

  if (password !== confirmPassword) {
    throw createError("PASSWORD_MISMATCH", "Passwords do not match.");
  }

  return { fullName, email, mobile, password };
}

function validateLoginPayload(payload) {
  const email = typeof payload.email === "string" ? normalizeEmail(payload.email) : "";
  const mobile = typeof payload.mobile === "string" ? payload.mobile.trim() : "";
  const password = typeof payload.password === "string" ? payload.password : "";

  if (!email && !mobile) {
    throw createError("INVALID_LOGIN", "Email or mobile number is required.");
  }

  if (email && !isValidEmail(email)) {
    throw createError("INVALID_EMAIL", "Enter a valid email address.");
  }

  if (mobile && !/^\d{10}$/.test(mobile)) {
    throw createError("INVALID_MOBILE", "Enter a valid 10-digit mobile number.");
  }

  if (!password) {
    throw createError("INVALID_PASSWORD", "Password is required.");
  }

  return { email, mobile, password };
}

function parsePayload(e) {
  if (!e || !e.postData) {
    throw createError("INVALID_REQUEST", "Missing request body.");
  }

  const contents = typeof e.postData.contents === "string" ? e.postData.contents.trim() : "";

  if (!contents) {
    throw createError("INVALID_REQUEST", "Request body cannot be empty.");
  }

  try {
    const parsed = JSON.parse(contents);
    if (!parsed || typeof parsed !== "object") {
      throw new Error("Invalid payload");
    }

    return parsed;
  } catch {
    throw createError("INVALID_JSON", "Request body must be valid JSON.");
  }
}

function normalizeAction(action) {
  return normalizeText(action).toLowerCase();
}

function normalizeEmail(value) {
  return normalizeText(value).toLowerCase();
}

function normalizeText(value) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

function normalizeHeaderKey(value) {
  return normalizeText(value).toLowerCase();
}

function getRecordValue(record, header) {
  const key = normalizeHeaderKey(header);
  const aliases = HEADER_ALIASES[key] || [header, key];

  for (let index = 0; index < aliases.length; index += 1) {
    const alias = aliases[index];
    if (Object.prototype.hasOwnProperty.call(record, alias)) {
      return record[alias];
    }
  }

  return "";
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim().toLowerCase());
}

function isStrongPassword(value) {
  return (
    typeof value === "string" &&
    value.length >= 10 &&
    /[a-z]/.test(value) &&
    /[A-Z]/.test(value) &&
    /\d/.test(value) &&
    /[^A-Za-z0-9]/.test(value)
  );
}

function getPepper() {
  const props = PropertiesService.getScriptProperties();
  let pepper = props.getProperty(CONFIG.pepperKey);

  if (!pepper) {
    pepper = `${Utilities.getUuid().replace(/-/g, "")}${Utilities.getUuid().replace(/-/g, "")}`;
    props.setProperty(CONFIG.pepperKey, pepper);
  }

  return pepper;
}

function hashPassword(email, password) {
  const input = [getPepper(), normalizeEmail(email), password].join("|");
  const bytes = Utilities.newBlob(input).getBytes();
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, bytes);
  return bytesToHex(digest);
}

function bytesToHex(bytes) {
  return bytes
    .map((byte) => {
      const hex = ((byte + 256) % 256).toString(16);
      return hex.length === 1 ? `0${hex}` : hex;
    })
    .join("");
}

function constantTimeEquals(left, right) {
  if (typeof left !== "string" || typeof right !== "string") {
    return false;
  }

  const maxLength = Math.max(left.length, right.length);
  let mismatch = left.length === right.length ? 0 : 1;

  for (let index = 0; index < maxLength; index += 1) {
    const leftCode = index < left.length ? left.charCodeAt(index) : 0;
    const rightCode = index < right.length ? right.charCodeAt(index) : 0;
    mismatch |= leftCode ^ rightCode;
  }

  return mismatch === 0;
}

function publicUserFromRecord(record) {
  return {
    id: record.id,
    fullName: record.fullName,
    email: record.email,
    createdAt: record.createdAt,
    mobile: record.mobile,
  };
}

function createError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

function jsonSuccess(message, extra) {
  const payload = Object.assign(
    {
      status: "success",
      message,
    },
    extra || {},
  );

  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}

function jsonError(error) {
  const code = error && error.code ? error.code : "SERVER_ERROR";
  const message = error && error.message ? error.message : "Unexpected server error.";

  return ContentService.createTextOutput(
    JSON.stringify({
      status: "error",
      code,
      message,
    }),
  ).setMimeType(ContentService.MimeType.JSON);
}
