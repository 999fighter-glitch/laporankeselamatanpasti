/**
 * =========================================================================
 * SISTEM LAPORAN KESELAMATAN & KESIHATAN PASTI KAWASAN KUALA LANGAT
 * Google Apps Script (Backend Bersih / Clean Backend - Tiada UI)
 * =========================================================================
 * 
 * SPESIFIKASI UTAMA:
 * 1. Backend (doPost/doGet) HANYA memproses logik perniagaan, fail bulanan pelbagai fail (Multi-File),
 *    folder tahunan (Cth: "LAPORAN KESELAMATAN PASTI 2026"), serta memulangkan respons JSON standard.
 * 2. Automasi Fail Bulanan & Folder Tahun: Cipta fail baharu di Drive mengikut bulan & tahun data 
 *    (Cth: "SISTEM LAPORAN PASTI - OKTOBER 2026") di dalam folder tahunan khusus.
 * 3. Sokongan penuh CRUD, Sesi Pengguna, Log Keluar, Padam Rekod, dan Bacaan Data Langsung.
 */

const SISTEM_CONFIG = {
  ZON_MASA: "Asia/Kuala_Lumpur",
  INDUK_FOLDER_NAMA_UTAMA: "LAPORAN KESELAMATAN PASTI"
};

// SKEMA PIAWAIAN JADUAL SISTEM
const SYSTEM_SCHEMAS = {
  USERS: {
    sheetName: "SENARAI PENGGUNA",
    headers: [
      "Tarikh & Masa Akses",
      "Nama Pengguna / Pelapor",
      "Peranan / Jenis Sesi",
      "Kod Akses Digunakan",
      "Status Sesi",
      "ID Sesi"
    ],
    bg: "#d1fae5",
    color: "#065f46"
  },
  SECURITY: {
    sheetName: "LAPORAN KESELAMATAN",
    headers: [
      "ID REKOD", "TARIKH", "MASA", "NAMA PELAPOR (SESI)", 
      "NAMA PENUH / PASTI", "MASALAH YANG DIHADAPI", 
      "KEPERLUAN YANG DIKEHENDAKI", "NO. TELEFON", 
      "STATUS", "DICIPTA PADA"
    ],
    bg: "#fef3c7",
    color: "#92400e"
  },
  HEALTH: {
    sheetName: "LAPORAN KESIHATAN",
    headers: [
      "ID REKOD", "TARIKH", "MASA", "NAMA PELAPOR (SESI)", 
      "NAMA PENUH / PASTI", "KATEGORI MASALAH", "JENIS SAKIT", 
      "JENIS SAKIT (LAIN-LAIN)", "JUMLAH PELAJAR TERLIBAT", 
      "NAMA PELAJAR TERLIBAT", "TEMPOH KUARANTIN (HARI)", 
      "TARIKH DISAHKAN", "LAPORAN TELAH DIHANTAR", 
      "MAKLUMAN KEPADA JKP", "SANITASI TELAH DILAKUKAN", 
      "GAMBAR / LAMPIRAN", "NO. TELEFON PELAPOR", 
      "NOTA / MAKLUMAT TAMBAHAN", "STATUS", "DICIPTA PADA"
    ],
    bg: "#dbeafe",
    color: "#1e40af"
  },
  ALL_REPORTS: {
    sheetName: "LAPORAN PENUH",
    headers: [
      "JENIS LAPORAN", "ID REKOD", "TARIKH", "MASA", "NAMA PELAPOR (SESI)", 
      "NAMA PENUH / PASTI", "KATEGORI / MASALAH", "BUTIRAN / MAKLUMAT", 
      "NO. TELEFON", "STATUS", "DICIPTA PADA"
    ],
    bg: "#e0e7ff",
    color: "#3730a3"
  }
};

/**
 * Dapatkan nama bulan dan tahun berdasarkan tarikh rekod atau semasa
 */
function dapatkanInfoBulanDanTahun(tarikhStr, customMonth) {
  var d = new Date();
  var bulanText = "";
  var tahunText = String(d.getFullYear());

  if (customMonth && customMonth.trim() !== "") {
    bulanText = customMonth.trim().toUpperCase();
    var matchTahun = bulanText.match(/\d{4}/);
    if (matchTahun) {
      tahunText = matchTahun[0];
    }
    return { bulan: bulanText, tahun: tahunText };
  }

  if (tarikhStr) {
    try {
      var parts = tarikhStr.split(/[-/]/);
      if (parts.length === 3) {
        if (parts[0].length === 4) {
          d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        } else {
          d = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
        }
      }
    } catch(e) {}
  }

  if (isNaN(d.getTime())) {
    d = new Date();
  }

  tahunText = String(d.getFullYear());
  var pilihan = { timeZone: SISTEM_CONFIG.ZON_MASA, month: 'long', year: 'numeric' };
  bulanText = d.toLocaleDateString('ms-MY', pilihan).toUpperCase();

  return { bulan: bulanText, tahun: tahunText };
}

/**
 * Mencari atau mencipta folder tahunan (Cth: "LAPORAN KESELAMATAN PASTI 2026")
 */
function dapatkanAtauCiptaFolderTahun(tahun) {
  var namaFolderUtama = SISTEM_CONFIG.INDUK_FOLDER_NAMA_UTAMA + " " + tahun;
  var folders = DriveApp.getFoldersByName(namaFolderUtama);
  if (folders.hasNext()) {
    return folders.next();
  }
  return DriveApp.createFolder(namaFolderUtama);
}

/**
 * Fungsi Automasi Multi-File: Mencari atau mencipta fail Google Sheet bulanan di Drive
 * (Cth: "SISTEM LAPORAN PASTI - OKTOBER 2026")
 */
function pastikanFailBulananSedia(tarikhStr, customMonth) {
  var info = dapatkanInfoBulanDanTahun(tarikhStr, customMonth);
  var namaFailBulanan = "SISTEM LAPORAN PASTI - " + info.bulan;
  var folderTahun = dapatkanAtauCiptaFolderTahun(info.tahun);

  var failBaruDicipta = false;
  var failIterator = folderTahun.getFilesByName(namaFailBulanan);
  var buku = null;

  if (failIterator.hasNext()) {
    var failSedia = failIterator.next();
    buku = SpreadsheetApp.openById(failSedia.getId());
  } else {
    buku = SpreadsheetApp.create(namaFailBulanan);
    var failBaru = DriveApp.getFileById(buku.getId());
    
    // Alihkan ke dalam folder tahunan
    DriveApp.getRootFolder().removeFile(failBaru);
    folderTahun.addFile(failBaru);

    // Buang helaian lalai 'Helaian 1'
    var helaianLalai = buku.getSheetByName("Helaian 1");
    if (helaianLalai) {
      try { buku.deleteSheet(helaianLalai); } catch(e) {}
    }

    failBaruDicipta = true;
  }

  semakDanCiptaSemuaHelaianUtama(buku);

  return {
    buku: buku,
    namaFail: namaFailBulanan,
    bulan: info.bulan,
    tahun: info.tahun,
    failBaruDicipta: failBaruDicipta,
    spreadsheetId: buku.getId(),
    spreadsheetUrl: buku.getUrl()
  };
}

/**
 * Semak dan pastikan header Baris 1 sepadan tanpa merosakkan data bawah
 */
function checkAndFixSheetHeader(sheet, schema) {
  if (!sheet) return { action: "Helaian tidak wujud", headers: [] };
  
  var standardHeaders = schema.headers;
  var lastCol = 0;
  var lastRow = 0;
  
  try {
    lastCol = sheet.getLastColumn();
    lastRow = sheet.getLastRow();
  } catch(e) {}
  
  var currentHeaders = [];
  if (lastRow >= 1 && lastCol >= 1) {
    try {
      var headerValues = sheet.getRange(1, 1, 1, lastCol).getValues();
      if (headerValues && headerValues[0]) {
        currentHeaders = headerValues[0].map(function(item) {
          return (item || "").toString().trim();
        });
      }
    } catch(e) {}
  }
  
  var isMatch = true;
  if (currentHeaders.length !== standardHeaders.length) {
    isMatch = false;
  } else {
    for (var i = 0; i < standardHeaders.length; i++) {
      if ((currentHeaders[i] || "").toLowerCase() !== standardHeaders[i].toLowerCase()) {
        isMatch = false;
        break;
      }
    }
  }
  
  if (!isMatch) {
    var colsToClear = Math.max(lastCol, standardHeaders.length);
    try {
      sheet.getRange(1, 1, 1, colsToClear).clearContent();
    } catch(e) {}
    
    sheet.getRange(1, 1, 1, standardHeaders.length).setValues([standardHeaders]);
    sheet.getRange(1, 1, 1, standardHeaders.length)
      .setFontWeight("bold")
      .setBackground(schema.bg)
      .setFontColor(schema.color);
      
    try {
      sheet.setFrozenRows(1);
    } catch(e) {}
    
    return { action: "Diperbaharui/Dijana Semula", headers: standardHeaders };
  }
  
  return { action: "Sah & Sepadan", headers: currentHeaders };
}

function semakDanCiptaSemuaHelaianUtama(buku) {
  var logs = [];
  for (var key in SYSTEM_SCHEMAS) {
    var schema = SYSTEM_SCHEMAS[key];
    var sheet = buku.getSheetByName(schema.sheetName);
    if (!sheet) {
      sheet = buku.insertSheet(schema.sheetName);
      logs.push("[" + schema.sheetName + "] - Helaian baharu dicipta.");
    }
    var result = checkAndFixSheetHeader(sheet, schema);
    logs.push("• " + schema.sheetName + " (" + result.action + ")");
  }
  return logs;
}

/**
 * Pemetaan Data Pintar
 */
function mapDataToRow(headers, data) {
  var row = [];
  for (var i = 0; i < headers.length; i++) {
    var h = (headers[i] || "").toString().toLowerCase().trim();
    var val = "";
    
    if (h.includes("tarikh & masa") || (h.includes("tarikh") && h.includes("masa"))) {
      val = (data.date ? data.date + " " + (data.time || "") : data.timestamp || data.createdAt || "");
    } else if (h === "tarikh" || h.includes("tarikh mula") || h.includes("tarikh kejadian")) {
      val = data.date || "";
    } else if (h === "masa" || h.includes("masa kejadian")) {
      val = data.time || "";
    } else if (h.includes("status")) {
      if (data.type === "akses_pengguna" || data.action === "logUserAccess") {
        val = data.status || "AKTIF";
      } else {
        val = (data.status === "resolved" ? "SELESAI" : "MENUNGGU");
      }
    } else if (h.includes("pasti") || h.includes("lokasi") || h.includes("cawangan") || h.includes("nama penuh")) {
      val = data.fullName || data.location || "";
    } else if (h.includes("pelapor") || h.includes("pengguna") || h.includes("nama guru")) {
      val = data.userName || data.reporter || "";
    } else if (h.includes("jenis penyakit") || (h.includes("penyakit") && !h.includes("lain"))) {
      val = data.diseaseType === "LAIN-LAIN" ? (data.diseaseOther || "LAIN-LAIN") : (data.diseaseType || data.problem || "");
    } else if (h.includes("penyakit lain") || h.includes("lain-lain")) {
      val = data.diseaseOther || "";
    } else if (h.includes("kategori")) {
      val = data.kategoriMasalah || data.healthCategory || (data.type || "").toUpperCase();
    } else if (h.includes("masalah") || h.includes("keterangan")) {
      val = data.masalah || data.problem || "";
    } else if (h.includes("keperluan")) {
      val = data.keperluan || data.need || "-";
    } else if (h.includes("telefon") || h.includes("tel") || h.includes("hp")) {
      val = data.telefon || data.phone || "-";
    } else if (h.includes("bilangan") || h.includes("jumlah pelajar")) {
      val = data.jumlahPelajar || data.studentCount || "-";
    } else if (h.includes("senarai") || h.includes("nama pelajar")) {
      val = Array.isArray(data.namaPelajar) ? data.namaPelajar.join(", ") : (data.namaPelajar || (Array.isArray(data.studentNames) ? data.studentNames.join(", ") : (data.studentNames || "-")));
    } else if (h.includes("kuarantin")) {
      val = data.tempohKuarantin || data.quarantinePeriod || "-";
    } else if (h.includes("sah")) {
      val = data.tarikhDisahkan || data.confirmedDate || "-";
    } else if (h.includes("sanitasi")) {
      val = (data.sanitasiDilakukan || data.sanitationDone) ? "YA" : "TIDAK";
    } else if (h.includes("pkd") || h.includes("laporan telah dihantar")) {
      val = (data.laporanDihantar || data.reportSubmitted) ? "YA" : "TIDAK";
    } else if (h.includes("jkp")) {
      val = (data.maklumanJKP || data.notifyJKP) ? "YA" : "TIDAK";
    } else if (h.includes("gambar") || h.includes("lampiran")) {
      const gbr = data.gambarSanitasi || data.sanitationPhoto;
      val = gbr ? ("✅ DILAMPIRKAN (" + Math.round(gbr.length / 1024) + " KB)") : "TIADA";
    } else if (h.includes("nota") || h.includes("catatan")) {
      val = data.notaPelajar || data.diseaseNote || "-";
    } else if (h.includes("peranan") || h.includes("sesi")) {
      val = data.sessionType || "Sesi Pelapor";
    } else if (h.includes("kod")) {
      val = data.kodAkses || data.code || "1010";
    } else if (h.includes("id")) {
      val = String(data.id || data.idPengguna || ("ID-" + Date.now()));
    } else if (h.includes("dihantar") || h.includes("dicipta") || h.includes("created")) {
      val = data.createdAt || new Date().toLocaleString("ms-MY");
    }
    
    row.push(val);
  }
  return row;
}

/**
 * Pemetaan Data Khas untuk Helaian Gabungan "LAPORAN PENUH"
 */
function mapDataToAllReportsRow(headers, data, jenisLaporanText) {
  var row = [];
  for (var i = 0; i < headers.length; i++) {
    var h = (headers[i] || "").toString().toLowerCase().trim();
    var val = "";

    if (h.includes("jenis laporan")) {
      val = jenisLaporanText.toUpperCase();
    } else if (h.includes("id")) {
      val = String(data.id || ("ID-" + Date.now()));
    } else if (h.includes("tarikh") && !h.includes("masa")) {
      val = data.date || "";
    } else if (h.includes("masa") && !h.includes("tarikh")) {
      val = data.time || "";
    } else if (h.includes("pelapor") || h.includes("sesi")) {
      val = data.userName || data.reporter || "";
    } else if (h.includes("pasti") || h.includes("lokasi")) {
      val = data.fullName || data.location || "";
    } else if (h.includes("kategori") || h.includes("masalah")) {
      val = data.masalah || data.kategoriMasalah || data.diseaseType || data.problem || "-";
    } else if (h.includes("butiran") || h.includes("maklumat")) {
      val = data.keperluan || data.notaPelajar || data.diseaseNote || "-";
    } else if (h.includes("telefon") || h.includes("tel")) {
      val = data.telefon || data.phone || "-";
    } else if (h.includes("status")) {
      val = (data.status === "resolved" ? "SELESAI" : "MENUNGGU");
    } else if (h.includes("dicipta") || h.includes("created")) {
      val = data.createdAt || new Date().toLocaleString("ms-MY");
    }

    row.push(val);
  }
  return row;
}

/**
 * Permintaan GET (Backend Bersih)
 */
function doGet(e) {
  try {
    var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "";
    var targetDate = (e && e.parameter && e.parameter.date) ? e.parameter.date : "";
    var targetMonth = (e && e.parameter && e.parameter.month) ? e.parameter.month : "";
    
    var infoBulan = pastikanFailBulananSedia(targetDate, targetMonth);
    var nowTimestamp = new Date().toLocaleString("ms-MY", { timeZone: SISTEM_CONFIG.ZON_MASA });
    
    if (action === "readData" || action === "getSheetData") {
      var requestedSheet = (e && e.parameter && e.parameter.sheet) ? e.parameter.sheet : SYSTEM_SCHEMAS.ALL_REPORTS.sheetName;
      var targetSheetObj = infoBulan.buku.getSheetByName(requestedSheet);
      if (!targetSheetObj) targetSheetObj = infoBulan.buku.getSheetByName(SYSTEM_SCHEMAS.ALL_REPORTS.sheetName);
      
      var rowsData = [];
      var headersList = [];
      if (targetSheetObj && targetSheetObj.getLastRow() >= 1 && targetSheetObj.getLastColumn() >= 1) {
        var allValues = targetSheetObj.getDataRange().getValues();
        if (allValues.length > 0) {
          headersList = allValues[0];
          rowsData = allValues.slice(1);
        }
      }
      var allSheetNamesList = infoBulan.buku.getSheets().map(function(s) { return s.getName(); });

      return ContentService.createTextOutput(
        JSON.stringify({
          status: "berjaya",
          sheetName: targetSheetObj ? targetSheetObj.getName() : requestedSheet,
          headers: headersList,
          rows: rowsData,
          totalRows: rowsData.length,
          fileName: infoBulan.namaFail,
          failBaruDicipta: infoBulan.failBaruDicipta,
          sheetUrl: infoBulan.spreadsheetUrl,
          availableSheets: allSheetNamesList,
          syncTimestamp: nowTimestamp
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(
      JSON.stringify({
        status: "berjaya",
        mesej: "Backend Google Apps Script Beroperasi Sepenuhnya",
        currentFile: infoBulan.namaFail,
        failBaruDicipta: infoBulan.failBaruDicipta,
        sheetUrl: infoBulan.spreadsheetUrl,
        syncTimestamp: nowTimestamp
      })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "ralat", mesej: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Permintaan POST (Backend Bersih - Menguruskan Multi-File, CRUD, dan Status)
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(15000);
  
  try {
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var action = (data.action || "").toString();
    var targetDate = data.date || data.tarikh || "";
    var targetMonth = data.customMonth || data.bulanTersuai || "";
    
    // Automasi Fail Bulanan mengikut tarikh rekod atau bulan semasa
    var infoBulan = pastikanFailBulananSedia(targetDate, targetMonth);
    var buku = infoBulan.buku;
    var nowTimestamp = new Date().toLocaleString("ms-MY", { timeZone: SISTEM_CONFIG.ZON_MASA });

    // 1. Semak Status / Header
    if (action === "checkHeaders" || action === "initHeaders" || action === "checkStatus") {
      var logs = semakDanCiptaSemuaHelaianUtama(buku);
      var sheetsInfo = [];
      for (var key in SYSTEM_SCHEMAS) {
        var sc = SYSTEM_SCHEMAS[key];
        var sh = buku.getSheetByName(sc.sheetName);
        if (sh) {
          sheetsInfo.push({ sheetName: sc.sheetName, rowCount: sh.getLastRow(), colCount: sh.getLastColumn() });
        }
      }
      return ContentService.createTextOutput(
        JSON.stringify({ 
          status: "berjaya", 
          mesej: "Fail bulanan [" + infoBulan.namaFail + "] disahkan!", 
          failBaruDicipta: infoBulan.failBaruDicipta,
          details: logs, 
          sheets: sheetsInfo,
          sheetUrl: infoBulan.spreadsheetUrl,
          syncTimestamp: nowTimestamp
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // 2. Baca Data Langsung (Read Data)
    if (action === "readData" || action === "getSheetData") {
      var targetSheetName = data.sheet || SYSTEM_SCHEMAS.ALL_REPORTS.sheetName;
      var sObj = buku.getSheetByName(targetSheetName);
      if (!sObj) sObj = buku.getSheetByName(SYSTEM_SCHEMAS.ALL_REPORTS.sheetName);
      
      var hList = [];
      var rList = [];
      if (sObj && sObj.getLastRow() >= 1 && sObj.getLastColumn() >= 1) {
        var vals = sObj.getDataRange().getValues();
        if (vals.length > 0) {
          hList = vals[0];
          rList = vals.slice(1);
        }
      }
      var sheetNames = buku.getSheets().map(function(s) { return s.getName(); });

      return ContentService.createTextOutput(
        JSON.stringify({
          status: "berjaya",
          sheetName: sObj ? sObj.getName() : targetSheetName,
          headers: hList,
          rows: rList,
          totalRows: rList.length,
          fileName: infoBulan.namaFail,
          failBaruDicipta: infoBulan.failBaruDicipta,
          sheetUrl: infoBulan.spreadsheetUrl,
          availableSheets: sheetNames,
          syncTimestamp: nowTimestamp
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // 3. Kemas Kini Status (Update Status)
    if (action === "updateStatus" || data.tindakan === "updateStatus") {
      var idToFind = String(data.id || "");
      var targetStatus = data.status === "resolved" ? "SELESAI" : "MENUNGGU";
      var updatedSheets = [];
      var allSheets = buku.getSheets();

      for (var s = 0; s < allSheets.length; s++) {
        var sObj = allSheets[s];
        var lRow = 0, lCol = 0;
        try {
          lRow = sObj.getLastRow();
          lCol = sObj.getLastColumn();
        } catch(err) {}

        if (lRow > 1 && lCol >= 1) {
          try {
            var sHeaders = sObj.getRange(1, 1, 1, lCol).getValues()[0];
            var idCol = -1, statusCol = -1;
            for (var c = 0; c < sHeaders.length; c++) {
              var hName = (sHeaders[c] || "").toString().toLowerCase();
              if (hName.includes("id")) idCol = c + 1;
              if (hName.includes("status")) statusCol = c + 1;
            }
            if (idCol !== -1 && statusCol !== -1) {
              var idValues = sObj.getRange(2, idCol, lRow - 1, 1).getValues();
              for (var r = 0; r < idValues.length; r++) {
                if (String(idValues[r][0]) === idToFind) {
                  sObj.getRange(r + 2, statusCol).setValue(targetStatus);
                  updatedSheets.push(sObj.getName());
                }
              }
            }
          } catch(err) {}
        }
      }
      return ContentService.createTextOutput(
        JSON.stringify({ 
          status: "berjaya", 
          mesej: "Status ID " + idToFind + " ditukar kepada \"" + targetStatus + "\" dalam fail [" + infoBulan.namaFail + "]", 
          updatedSheets: updatedSheets,
          failBaruDicipta: infoBulan.failBaruDicipta,
          syncTimestamp: nowTimestamp
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // 4. Padam Rekod (Delete Record)
    if (action === "deleteRecord" || data.tindakan === "padam_rekod") {
      var delId = String(data.id || "");
      var deletedFrom = [];
      var sheetsForDel = buku.getSheets();

      for (var sIdx = 0; sIdx < sheetsForDel.length; sIdx++) {
        var sheetObj = sheetsForDel[sIdx];
        var lastR = 0, lastC = 0;
        try {
          lastR = sheetObj.getLastRow();
          lastC = sheetObj.getLastColumn();
        } catch(err) {}

        if (lastR > 1 && lastC >= 1) {
          try {
            var hdrs = sheetObj.getRange(1, 1, 1, lastC).getValues()[0];
            var colId = -1;
            for (var cIdx = 0; cIdx < hdrs.length; cIdx++) {
              if ((hdrs[cIdx] || "").toString().toLowerCase().includes("id")) {
                colId = cIdx + 1;
                break;
              }
            }
            if (colId !== -1) {
              var idList = sheetObj.getRange(2, colId, lastR - 1, 1).getValues();
              for (var rIdx = idList.length - 1; rIdx >= 0; rIdx--) {
                if (String(idList[rIdx][0]) === delId) {
                  sheetObj.deleteRow(rIdx + 2);
                  deletedFrom.push(sheetObj.getName());
                }
              }
            }
          } catch(err) {}
        }
      }

      return ContentService.createTextOutput(
        JSON.stringify({
          status: "berjaya",
          mesej: "Rekod ID " + delId + " dipadam dari fail [" + infoBulan.namaFail + "]",
          deletedId: delId,
          deletedFrom: deletedFrom,
          failBaruDicipta: infoBulan.failBaruDicipta,
          syncTimestamp: nowTimestamp
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // 5. Log Keluar Pengguna (Logout User)
    if (action === "logoutUser" || data.tindakan === "log_keluar") {
      var sessId = String(data.id || data.idSesi || "");
      var uName = String(data.userName || data.reporter || "").trim();
      var logoutTimeText = data.logoutTime || new Date().toLocaleTimeString("ms-MY");
      var statusLogout = String(data.status || ("LOG KELUAR (" + logoutTimeText + ")"));
      
      var schemaUser = SYSTEM_SCHEMAS.USERS;
      var sheetUser = buku.getSheetByName(schemaUser.sheetName);
      var updated = false;

      if (sheetUser && sheetUser.getLastRow() > 1 && sheetUser.getLastColumn() >= 1) {
        var lastR = sheetUser.getLastRow();
        var lastC = sheetUser.getLastColumn();
        var uHeaders = sheetUser.getRange(1, 1, 1, lastC).getValues()[0];
        var colId = -1, colStatus = -1, colName = -1;

        for (var c = 0; c < uHeaders.length; c++) {
          var hLower = (uHeaders[c] || "").toString().toLowerCase();
          if (hLower.includes("id")) colId = c + 1;
          if (hLower.includes("status")) colStatus = c + 1;
          if (hLower.includes("nama") || hLower.includes("pelapor") || hLower.includes("pengguna")) colName = c + 1;
        }

        if (colStatus !== -1) {
          var allRows = sheetUser.getRange(2, 1, lastR - 1, lastC).getValues();
          for (var r = allRows.length - 1; r >= 0; r--) {
            var rowId = colId !== -1 ? String(allRows[r][colId - 1] || "") : "";
            var rowName = colName !== -1 ? String(allRows[r][colName - 1] || "").trim() : "";
            var currentStatus = String(allRows[r][colStatus - 1] || "");

            if ((sessId && rowId === sessId) || (!sessId && uName && rowName.toLowerCase() === uName.toLowerCase() && currentStatus.includes("AKTIF"))) {
              sheetUser.getRange(r + 2, colStatus).setValue(statusLogout);
              updated = true;
              break;
            }
          }
        }
      }

      return ContentService.createTextOutput(
        JSON.stringify({
          status: "berjaya",
          mesej: updated ? ("Sesi [" + (uName || sessId) + "] ditamatkan (" + statusLogout + ")") : "Sesi ditamatkan",
          failBaruDicipta: infoBulan.failBaruDicipta,
          syncTimestamp: nowTimestamp
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // 6. Pendaftaran Pengguna / Log Akses
    var type = (data.jenisLaporan || data.type || "keselamatan").toLowerCase();
    if (data.tindakan === "daftar_pengguna" || action === "logUserAccess" || type === "akses_pengguna") {
      var schemaUser = SYSTEM_SCHEMAS.USERS;
      var sheetUser = buku.getSheetByName(schemaUser.sheetName);
      if (!sheetUser) sheetUser = buku.insertSheet(schemaUser.sheetName);
      checkAndFixSheetHeader(sheetUser, schemaUser);

      var headersUser = sheetUser.getRange(1, 1, 1, sheetUser.getLastColumn()).getValues()[0];
      sheetUser.appendRow(mapDataToRow(headersUser, data));

      return ContentService.createTextOutput(
        JSON.stringify({ 
          status: "berjaya", 
          mesej: "Log akses direkodkan ke fail [" + infoBulan.namaFail + "]", 
          failBaruDicipta: infoBulan.failBaruDicipta,
          sheetUrl: infoBulan.spreadsheetUrl,
          syncTimestamp: nowTimestamp
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // 7. Simpan Laporan Keselamatan / Kesihatan
    var schema = SYSTEM_SCHEMAS.SECURITY;
    var jenisLaporanText = "KESELAMATAN";

    if (type.includes("kesihatan")) {
      schema = SYSTEM_SCHEMAS.HEALTH;
      jenisLaporanText = "KESIHATAN";
    }

    var namaHelaianInduk = schema.sheetName;
    var namaHelaianSemua = SYSTEM_SCHEMAS.ALL_REPORTS.sheetName;

    // A. Simpan ke Helaian Khusus dalam Fail Bulanan
    var sheetInduk = buku.getSheetByName(namaHelaianInduk);
    if (!sheetInduk) sheetInduk = buku.insertSheet(namaHelaianInduk);
    checkAndFixSheetHeader(sheetInduk, schema);
    var headersInduk = sheetInduk.getRange(1, 1, 1, sheetInduk.getLastColumn()).getValues()[0];
    sheetInduk.appendRow(mapDataToRow(headersInduk, data));

    // B. Simpan ke Helaian Gabungan ("LAPORAN PENUH")
    var schemaAll = SYSTEM_SCHEMAS.ALL_REPORTS;
    var sheetSemua = buku.getSheetByName(namaHelaianSemua);
    if (!sheetSemua) sheetSemua = buku.insertSheet(namaHelaianSemua);
    checkAndFixSheetHeader(sheetSemua, schemaAll);
    var headersSemua = sheetSemua.getRange(1, 1, 1, sheetSemua.getLastColumn()).getValues()[0];
    sheetSemua.appendRow(mapDataToAllReportsRow(headersSemua, data, jenisLaporanText));

    var mesejKejayaan = "✅ Laporan berjaya dihantar dan direkodkan ke fail bulanan [" + infoBulan.namaFail + "]";
    if (infoBulan.failBaruDicipta) {
      mesejKejayaan = "📅 Notifikasi Sistem: Fail bulanan baharu [" + infoBulan.namaFail + "] telah berjaya dicipta, dan laporan berjaya direkodkan!";
    }

    return ContentService.createTextOutput(
      JSON.stringify({ 
        status: "berjaya", 
        mesej: mesejKejayaan, 
        fileName: infoBulan.namaFail,
        failBaruDicipta: infoBulan.failBaruDicipta,
        sheetUrl: infoBulan.spreadsheetUrl,
        syncTimestamp: nowTimestamp
      })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "ralat", mesej: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  } finally {
    try { lock.releaseLock(); } catch(err) {}
  }
}
