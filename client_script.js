
        // === TETAPAN SISTEM ===
        const USER_CODE = '1010';
        const ADMIN_CODE = 'admin100';
        const ADMIN_PASSWORD = 'admin100';
        const DEFAULT_APPSCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxgMhzr8-5iUTbd9A9fKFtkptu03Tb1R4FOkJZFHQvD915jP2RpAzGeVsZR9_alxy18/exec';
        function getAppsScriptUrl() {
            const saved = localStorage.getItem('pasti_appscript_url');
            if (!saved || saved.includes('AKfycbzcBgg4shS4gOr6g-25y6PJrXZnChW1QGD-IM-l30cw-d4ITF8cWV8V29oH18FalpwN')) {
                localStorage.setItem('pasti_appscript_url', DEFAULT_APPSCRIPT_URL);
                return DEFAULT_APPSCRIPT_URL;
            }
            return saved;
        }
        let APPSCRIPT_URL = getAppsScriptUrl();
        const STORAGE_KEY = 'laporan_klg_data';
        const ADMIN_SESSION = 'laporan_admin_login';
        
        let reporterName = '';
        let studentRowCount = 0;

        // === FUNGSI ASAS ===
        function convertToUppercase(el) {
            const s = el.selectionStart, e = el.selectionEnd;
            el.value = el.value.toUpperCase();
            el.setSelectionRange(s, e);
        }

        function showToast(msg, sub='') {
            const t = document.getElementById('toast');
            document.getElementById('toastMessage').textContent = msg;
            document.getElementById('toastSubtext').textContent = sub;
            t.classList.add('show');
            setTimeout(() => t.classList.remove('show'), 4000);
        }

        function showPanel(id) {
            document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
            document.getElementById(id).classList.add('active');
        }

        function endSession() {
            localStorage.removeItem(STORAGE_KEY + '_user');
            sessionStorage.removeItem(ADMIN_SESSION);
            reporterName = '';
            showPanel('panelCode');
        }

        // === SEMAK KOD AKSES ===
        function verifyCode() {
            const c = document.getElementById('accessCode').value.trim();
            document.getElementById('codeError').style.display = 'none';
            document.getElementById('adminRedirect').style.display = 'none';

            if (c === ADMIN_CODE) {
                document.getElementById('adminRedirect').style.display = 'block';
                setTimeout(() => {
                    if (sessionStorage.getItem(ADMIN_SESSION) === 'true') {
                        loadAdminDashboard();
                    } else {
                        showPanel('panelAdminLogin');
                    }
                }, 1200);
                return;
            }

            if (c === USER_CODE) {
                const savedUser = localStorage.getItem(STORAGE_KEY + '_user');
                if (savedUser) {
                    reporterName = savedUser;
                    document.getElementById('dispName').textContent = reporterName;
                    document.getElementById('welcomeName').textContent = reporterName;
                    showPanel('panelCategory');
                } else {
                    showPanel('panelReporterName');
                }
                return;
            }

            document.getElementById('codeError').style.display = 'block';
        }

        // === LOG MASUK ADMIN ===
        function doAdminLogin() {
            const pass = document.getElementById('adminPass').value.trim();
            if (pass === ADMIN_PASSWORD) {
                sessionStorage.setItem(ADMIN_SESSION, 'true');
                document.getElementById('adminLoginError').style.display = 'none';
                logUserAccess('Pentadbir Sistem (Admin)', 'Sesi Pentadbir (Admin)', 'admin100');
                loadAdminDashboard();
            } else {
                document.getElementById('adminLoginError').style.display = 'block';
            }
        }

        function adminLogout() {
            sessionStorage.removeItem(ADMIN_SESSION);
            showPanel('panelCode');
            document.getElementById('accessCode').value = '';
            document.getElementById('adminPass').value = '';
        }

        function loadAdminDashboard() {
            showPanel('panelAdminDashboard');
            renderAdminData();
        }

        // === SIMPAN NAMA PELAPOR ===
        function saveReporterName() {
            const n = document.getElementById('reporterName').value.trim();
            if (!n) { alert('Sila masukkan nama anda!'); return; }
            reporterName = n;
            localStorage.setItem(STORAGE_KEY + '_user', n);
            document.getElementById('dispName').textContent = n;
            document.getElementById('welcomeName').textContent = n;
            logUserAccess(n, 'Sesi Pelapor (PASTI)', '1010');
            showPanel('panelCategory');
        }

        // === PILIH JENIS LAPORAN ===
        function selectType(type) {
            if (type === 'keselamatan') {
                document.getElementById('secUserName').textContent = reporterName;
                const now = new Date();
                document.getElementById('secDate').value = now.toISOString().split('T')[0];
                document.getElementById('secTime').value = now.toTimeString().slice(0,5);
                showPanel('panelSecurityForm');
            } else {
                document.getElementById('hUserName').textContent = reporterName;
                const now = new Date();
                document.getElementById('hDate').value = now.toISOString().split('T')[0];
                document.getElementById('hTime').value = now.toTimeString().slice(0,5);
                showPanel('panelHealthForm');
            }
        }

        function backToCat() {
            showPanel('panelCategory');
        }

        // === FUNGSI BORANG KESIHATAN ===
        function toggleDiseaseList() {
            const cat = document.getElementById('hCategory').value;
            document.getElementById('diseaseSection').classList.toggle('hidden', cat !== 'PENYAKIT BERJANGKIT');
        }

        function toggleOtherDisease() {
            const isOther = document.getElementById('diseaseType').value === 'LAIN-LAIN';
            document.getElementById('otherDiseaseInput').classList.toggle('hidden', !isOther);
        }

        function addStudentRow() {
            const container = document.getElementById('studentNamesContainer');
            const row = document.createElement('div');
            row.className = 'student-row';
            row.innerHTML = `
                <input type="text" placeholder="NAMA PELAJAR (Pilihan)" class="student-name-input" oninput="convertToUppercase(this)">
                <button type="button" class="remove-btn btn-small" onclick="this.parentElement.remove()">✕</button>
            `;
            container.appendChild(row);
        }

        function updateStudentRows() {
            const count = parseInt(document.getElementById('studentCount').value) || 0;
            const container = document.getElementById('studentNamesContainer');
            container.innerHTML = '';
            for (let i = 0; i < count; i++) addStudentRow();
        }

        function previewImage(input) {
            const preview = document.getElementById('photoPreview');
            if (input.files && input.files[0]) {
                const r = new FileReader();
                r.onload = e => { preview.src = e.target.result; preview.style.display = 'block'; };
                r.readAsDataURL(input.files[0]);
            } else preview.style.display = 'none';
        }

        // === SIMPAN REKOD ===
        function sendToGoogleAppsScript(data) {
            const url = getAppsScriptUrl();
            if (!url) return;
            const enriched = Object.assign({}, data, {
                fullName: data.location || data.fullName || '',
                location: data.location || data.fullName || '',
                userName: data.reporter || data.userName || reporterName || '',
                reporter: data.reporter || data.userName || reporterName || '',
                masalah: data.problem || data.masalah || '',
                problem: data.problem || data.masalah || '',
                keperluan: data.need || data.keperluan || '',
                need: data.need || data.keperluan || '',
                telefon: data.phone || data.telefon || '',
                phone: data.phone || data.telefon || '',
                kategoriMasalah: data.healthCategory || data.kategoriMasalah || '',
                healthCategory: data.healthCategory || data.kategoriMasalah || '',
                jumlahPelajar: data.studentCount || data.jumlahPelajar || '',
                studentCount: data.studentCount || data.jumlahPelajar || '',
                namaPelajar: data.studentNames || data.namaPelajar || [],
                studentNames: data.studentNames || data.namaPelajar || [],
                tempohKuarantin: data.quarantinePeriod || data.tempohKuarantin || '',
                quarantinePeriod: data.quarantinePeriod || data.tempohKuarantin || '',
                tarikhDisahkan: data.confirmedDate || data.tarikhDisahkan || '',
                confirmedDate: data.confirmedDate || data.tarikhDisahkan || '',
                notaPelajar: data.diseaseNote || data.notaPelajar || '',
                diseaseNote: data.diseaseNote || data.notaPelajar || '',
                laporanDihantar: (data.reportSubmitted || data.laporanDihantar) ? true : false,
                reportSubmitted: (data.reportSubmitted || data.laporanDihantar) ? true : false,
                maklumanJKP: (data.notifyJKP || data.maklumanJKP) ? true : false,
                notifyJKP: (data.notifyJKP || data.maklumanJKP) ? true : false,
                sanitasiDilakukan: (data.sanitationDone || data.sanitasiDilakukan) ? true : false,
                sanitationDone: (data.sanitationDone || data.sanitasiDilakukan) ? true : false,
                gambarSanitasi: data.sanitationPhoto || data.gambarSanitasi || '',
                sanitationPhoto: data.sanitationPhoto || data.gambarSanitasi || ''
            });
            showToast('⏳ Menghantar...', 'Menghubungkan ke Google Sheets');
            fetch(url, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8'
                },
                body: JSON.stringify(enriched)
            })
            .then(() => {
                console.log('Data dihantar ke Google Apps Script:', data);
                showToast('✅ Berjaya Dihantar!', 'Data disimpan ke Google Sheets & peranti.');
            })
            .catch(err => {
                console.warn('Ralat sambungan Apps Script:', err);
                showToast('💾 Simpan Tempatan', 'Laporan disimpan dalam peranti (mod luar talian).');
            });
        }

        function saveRecord(data) {
            if (!data.status) data.status = 'pending';
            const records = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            records.unshift(data);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
            sendToGoogleAppsScript(data);
        }

        // === HANTAR BORANG KESELAMATAN ===
        document.getElementById('secForm').addEventListener('submit', e => {
            e.preventDefault();
            saveRecord({
                id: Date.now(),
                type: 'keselamatan',
                reporter: reporterName,
                location: document.getElementById('secLocation').value.trim(),
                date: document.getElementById('secDate').value,
                time: document.getElementById('secTime').value,
                problem: document.getElementById('secProblem').value.trim(),
                need: document.getElementById('secNeed').value.trim(),
                phone: document.getElementById('secPhone').value.trim(),
                createdAt: new Date().toLocaleString('ms-MY')
            });
            showToast('✅ LAPORAN DIHANTAR!', 'Terima kasih, ' + reporterName);
            e.target.reset();
            backToCat();
        });

        // === HANTAR BORANG KESIHATAN ===
        document.getElementById('healthForm').addEventListener('submit', e => {
            e.preventDefault();
            const names = [];
            document.querySelectorAll('.student-name-input').forEach(inp => {
                if (inp.value.trim()) names.push(inp.value.trim());
            });
            const photoEl = document.getElementById('photoPreview');
            const photoData = photoEl.style.display === 'block' ? photoEl.src : '';

            saveRecord({
                id: Date.now(),
                type: 'kesihatan',
                reporter: reporterName,
                location: document.getElementById('hLocation').value.trim(),
                date: document.getElementById('hDate').value,
                time: document.getElementById('hTime').value,
                healthCategory: document.getElementById('hCategory').value,
                diseaseType: document.getElementById('diseaseType').value,
                diseaseOther: document.getElementById('diseaseOther').value.trim(),
                studentCount: document.getElementById('studentCount').value || '0',
                studentNames: names,
                quarantinePeriod: document.getElementById('quarantinePeriod').value.trim(),
                confirmedDate: document.getElementById('confirmedDate').value,
                diseaseNote: document.getElementById('diseaseNote').value.trim(),
                reportSubmitted: document.getElementById('reportSubmitted').checked,
                notifyJKP: document.getElementById('notifyJKP').checked,
                sanitationDone: document.getElementById('sanitationDone').checked,
                sanitationPhoto: photoData,
                phone: document.getElementById('hPhone').value.trim(),
                createdAt: new Date().toLocaleString('ms-MY')
            });
            showToast('✅ LAPORAN KESIHATAN DIHANTAR!', 'Terima kasih, ' + reporterName);
            e.target.reset();
            document.getElementById('photoPreview').style.display = 'none';
            document.getElementById('studentNamesContainer').innerHTML = '';
            backToCat();
        });

        // === SEJARAH PENGGUNA ===
        function showHistory() {
            showPanel('panelHistory');
            renderHistory();
        }

        function toggleRecordStatus(id, newStatus) {
            let records = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            let updatedRecord = null;
            records = records.map(r => {
                if (String(r.id) === String(id)) {
                    updatedRecord = { ...r, status: newStatus };
                    return updatedRecord;
                }
                return r;
            });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
            showToast(
                newStatus === 'resolved' ? '✅ Selesai!' : 'ℹ️ Status Dikemaskini',
                newStatus === 'resolved' ? 'Laporan berjaya ditandakan sebagai Selesai.' : 'Status dikembalikan kepada Menunggu.'
            );
            renderHistory();
            if (typeof renderAdminData === 'function') renderAdminData();
            if (updatedRecord) {
                sendToGoogleAppsScript({
                    ...updatedRecord,
                    action: 'updateStatus',
                    updatedAt: new Date().toLocaleString('ms-MY')
                });
            }
        }

        function renderHistory() {
            let records = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            records = records.filter(r => r.reporter === reporterName);
            const search = (document.getElementById('histSearch')?.value || '').toLowerCase();
            const typeFilter = document.getElementById('histType')?.value || '';
            const statusFilter = document.getElementById('histStatus')?.value || '';
            records = records.filter(r => {
                const mSearch = !search || (r.location || '').toLowerCase().includes(search);
                const mType = !typeFilter || r.type === typeFilter;
                const mStatus = !statusFilter || (r.status || 'pending') === statusFilter;
                return mSearch && mType && mStatus;
            });
            if (!records.length) {
                document.getElementById('histContainer').innerHTML = '<p class="empty">BELUM ADA LAPORAN DIHANTAR.</p>';
                return;
            }
            let html = `<table><thead><tr>
                <th>Tarikh</th>
                <th>Jenis</th>
                <th>Status</th>
                <th>Nama Pasti / Lokasi</th>
                <th>Butiran</th>
                <th>Telefon</th>
                <th style="text-align:center;">Tindakan</th>
            </tr></thead><tbody>`;
            records.forEach(r => {
                let details = '';
                if (r.type === 'keselamatan') details = (r.problem || '').substring(0,45);
                else {
                    details = r.healthCategory || r.type;
                    if (r.diseaseType) details += ` — ${r.diseaseType === 'LAIN-LAIN' ? r.diseaseOther : r.diseaseType}`;
                    if (r.sanitationDone) details += ' ✅ SANITASI DILAKUKAN';
                }
                const isResolved = r.status === 'resolved';
                const statusBadge = isResolved
                    ? '<span class="tag" style="background:#10b981; color:#fff; padding:4px 8px; border-radius:12px; font-weight:700; font-size:0.75rem; white-space:nowrap;">🟢 SELESAI</span>'
                    : '<span class="tag" style="background:#f59e0b; color:#fff; padding:4px 8px; border-radius:12px; font-weight:700; font-size:0.75rem; white-space:nowrap;">🟡 MENUNGGU</span>';

                const actionBtn = isResolved
                    ? '<button class="btn-small" style="background:#f3f4f6; color:#4b5563; border:1px solid #d1d5db; padding:4px 8px; border-radius:6px; cursor:pointer; font-size:0.7rem;" onclick="toggleRecordStatus(\'' + r.id + '\', \'pending\')">Buka Semula</button>'
                    : '<button class="btn-small" style="background:#10b981; color:#fff; border:none; padding:5px 10px; border-radius:6px; cursor:pointer; font-weight:700; font-size:0.75rem;" onclick="toggleRecordStatus(\'' + r.id + '\', \'resolved\')">✔️ Tanda Selesai</button>';

                html += `<tr>
                    <td>${r.date || '-'}<br><small>${r.time || '-'}</small></td>
                    <td><span class="tag ${r.type}">${r.type.toUpperCase()}</span></td>
                    <td>${statusBadge}</td>
                    <td class="name-cell">${r.location || '-'}</td>
                    <td style="max-width:260px;">${details}</td>
                    <td>${r.phone || '-'}</td>
                    <td style="text-align:center; white-space:nowrap;">${actionBtn}</td>
                </tr>`;
            });
            html += '</tbody></table>';
            document.getElementById('histContainer').innerHTML = html;
        }

        // === PAPAN KAWALAN ADMIN — DIKEMAS KINI ===
        
        // === LOG & SENARAI AKSES PENGGUNA ===
        function logUserAccess(userName, sessionType, code) {
            const now = new Date();
            const timestamp = now.toLocaleString('ms-MY');
            const logEntry = {
                id: 'SESI-' + Date.now(),
                idPengguna: 'SESI-' + Date.now(),
                type: 'akses_pengguna',
                jenisLaporan: 'akses_pengguna',
                action: 'logUserAccess',
                tindakan: 'daftar_pengguna',
                userName: userName,
                reporter: userName,
                sessionType: sessionType || 'Sesi Pelapor',
                code: code || '1010',
                kodAkses: code || '1010',
                timestamp: timestamp,
                date: now.toLocaleDateString('ms-MY'),
                time: now.toLocaleTimeString('ms-MY'),
                createdAt: timestamp
            };

            // Simpan ke rekod tempatan
            let logs = JSON.parse(localStorage.getItem('pasti_user_access_logs') || '[]');
            logs.unshift(logEntry);
            // Simpan maksimum 150 sesi terkini
            if (logs.length > 150) logs = logs.slice(0, 150);
            localStorage.setItem('pasti_user_access_logs', JSON.stringify(logs));

            // Hantar ke Google Apps Script (Helaian 'Log Akses Pengguna')
            sendToGoogleAppsScript(logEntry);
        }

        let currentAdminTab = 'reports';
        function switchAdminTab(tab) {
            currentAdminTab = tab;
            const btnReports = document.getElementById('tabBtnReports');
            const btnUsers = document.getElementById('tabBtnUsers');
            const reportsSection = document.getElementById('adminReportsSection');
            const usersSection = document.getElementById('adminUsersSection');

            if (tab === 'reports') {
                btnReports.style.background = '#1e3a8a';
                btnReports.style.color = '#fff';
                btnUsers.style.background = '#f1f5f9';
                btnUsers.style.color = '#475569';
                if (reportsSection) reportsSection.style.display = 'block';
                if (usersSection) usersSection.style.display = 'none';
                renderAdminData();
            } else {
                btnUsers.style.background = '#1e3a8a';
                btnUsers.style.color = '#fff';
                btnReports.style.background = '#f1f5f9';
                btnReports.style.color = '#475569';
                if (reportsSection) reportsSection.style.display = 'none';
                if (usersSection) usersSection.style.display = 'block';
                renderUserLogs();
            }
        }

        function renderUserLogs() {
            const logs = JSON.parse(localStorage.getItem('pasti_user_access_logs') || '[]');
            const badge = document.getElementById('totalUserLogsBadge');
            if (badge) badge.textContent = logs.length;

            const search = (document.getElementById('userSearchInput')?.value || '').toLowerCase();
            const filtered = logs.filter(l => 
                !search || 
                (l.userName || '').toLowerCase().includes(search) ||
                (l.sessionType || '').toLowerCase().includes(search)
            );

            const container = document.getElementById('userLogsContainer');
            if (!container) return;

            if (!filtered.length) {
                container.innerHTML = '<p class="empty">BELUM ADA REKOD LOG AKSES PENGGUNA.</p>';
                return;
            }

            let html = `<table><thead><tr>
                <th>Tarikh & Masa Akses</th>
                <th>Nama Pengguna / Pelapor</th>
                <th>Peranan / Sesi</th>
                <th>Kod Digunakan</th>
                <th style="text-align:center;">Status</th>
            </tr></thead><tbody>`;

            filtered.forEach(l => {
                const isAdmin = (l.sessionType || '').includes('Admin') || (l.sessionType || '').includes('Pentadbir');
                const badge = isAdmin 
                    ? '<span class="tag" style="background:#4338ca; color:white; padding:4px 8px; border-radius:12px; font-weight:700; font-size:0.75rem;">🛡️ PENTADBIR</span>'
                    : '<span class="tag" style="background:#059669; color:white; padding:4px 8px; border-radius:12px; font-weight:700; font-size:0.75rem;">👤 PELAPOR</span>';

                html += `<tr>
                    <td><strong>${l.timestamp || (l.date + ' ' + l.time)}</strong></td>
                    <td class="name-cell">${l.userName || '-'}</td>
                    <td>${badge} <small style="display:block; color:#6b7280; font-size:0.7rem;">${l.sessionType || ''}</small></td>
                    <td><code>${l.code || '1010'}</code></td>
                    <td style="text-align:center;"><span style="color:#10b981; font-weight:bold; font-size:0.75rem;">🟢 Log Masuk Berjaya</span></td>
                </tr>`;
            });

            html += '</tbody></table>';
            container.innerHTML = html;
        }

        function exportUserLogsCSV() {
            const logs = JSON.parse(localStorage.getItem('pasti_user_access_logs') || '[]');
            if (!logs.length) { alert('Tiada rekod log pengguna untuk dieksport!'); return; }
            let csv = 'TarikhMasa,NamaPengguna,JenisSesi,KodDigunakan,Status\n';
            logs.forEach(l => {
                const esc = s => `"${(s||'').toString().replace(/"/g,'""')}"`;
                csv += `${esc(l.timestamp)},${esc(l.userName)},${esc(l.sessionType)},${esc(l.code)},${esc('Log Masuk Berjaya')}\n`;
            });
            const blob = new Blob([csv], {type:'text/csv;charset=utf-8'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `log_akses_pengguna_kualalangat_${new Date().toISOString().slice(0,10)}.csv`;
            a.click();
            URL.revokeObjectURL(url);
            showToast('✅ Dieksport!', 'Log pengguna dimuat turun.');
        }

        function clearUserLogs() {
            if (confirm('Pasti padam SEMUA log akses pengguna?')) {
                localStorage.removeItem('pasti_user_access_logs');
                renderUserLogs();
                showToast('✅ Dipadam', 'Log akses pengguna telah dikosongkan.');
            }
        }

        function renderAdminData() {
            let records = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            document.getElementById('totalCount').textContent = records.length;
            const repBadge = document.getElementById('totalCountBadge'); if (repBadge) repBadge.textContent = records.length;
            const usrBadge = document.getElementById('totalUserLogsBadge'); if (usrBadge) usrBadge.textContent = (JSON.parse(localStorage.getItem('pasti_user_access_logs') || '[]')).length;
            
            const search = (document.getElementById('adminSearch')?.value || '').toLowerCase();
            const catFilter = document.getElementById('adminCatFilter')?.value || '';
            const sortBy = document.getElementById('adminSort')?.value || 'date-desc';

            // Penapis
            records = records.filter(r => {
                const mSearch = !search || 
                    (r.reporter || '').toLowerCase().includes(search) ||
                    (r.location || '').toLowerCase().includes(search) ||
                    (r.phone || '').includes(search);
                const mCat = !catFilter || r.type === catFilter;
                return mSearch && mCat;
            });

            // Susun mengikut pilihan
            if (sortBy === 'name-asc') {
                records.sort((a, b) => (a.location || '').localeCompare(b.location || ''));
            } else if (sortBy === 'name-desc') {
                records.sort((a, b) => (b.location || '').localeCompare(a.location || ''));
            } else if (sortBy === 'reporter-asc') {
                records.sort((a, b) => (a.reporter || '').localeCompare(b.reporter || ''));
            } else if (sortBy === 'reporter-desc') {
                records.sort((a, b) => (b.reporter || '').localeCompare(a.reporter || ''));
            }
            // 'date-desc' = kekal susunan asal (terkini di atas)

            if (!records.length) {
                document.getElementById('adminContainer').innerHTML = '<p class="empty">TIADA REKOD DITEMUI.</p>';
                return;
            }

            // Jadual lengkap dengan Nama Pasti/Lokasi
            let html = `<table><thead><tr>
                <th>Tarikh</th>
                <th>Jenis</th>
                <th>Nama Pasti / Lokasi</th>
                <th>Pelapor</th>
                <th>Butiran</th>
                <th>Telefon</th>
            </tr></thead><tbody>`;
            
            records.forEach(r => {
                let details = '';
                if (r.type === 'keselamatan') {
                    details = (r.problem || '').substring(0,40);
                } else {
                    details = r.healthCategory || r.type;
                    if (r.diseaseType) {
                        details += ` — ${r.diseaseType === 'LAIN-LAIN' ? r.diseaseOther : r.diseaseType}`;
                    }
                    if (r.studentCount && r.studentCount !== '0') {
                        details += `<br>👥 ${r.studentCount} pelajar`;
                        if (r.studentNames?.length) {
                            details += `: ${r.studentNames.join(', ').substring(0,40)}`;
                        }
                    }
                    if (r.quarantinePeriod) details += `<br>⏱ Kuarantin: ${r.quarantinePeriod}`;
                    if (r.sanitationDone) details += '<br>✅ SANITASI DILAKUKAN';
                }
                
                html += `<tr>
                    <td>${r.date || '-'}<br><small>${r.time || '-'}</small></td>
                    <td><span class="tag ${r.type}">${r.type.toUpperCase()}</span></td>
                    <td class="name-cell">${r.location || '-'}</td>
                    <td>${r.reporter || '-'}</td>
                    <td style="max-width:300px; font-size:0.8rem;">${details}</td>
                    <td>${r.phone || '-'}</td>
                </tr>`;
            });
            html += '</tbody></table>';
            document.getElementById('adminContainer').innerHTML = html;
        }

        // === EKSPORT DATA ===
        function exportData() {
            const records = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            if (!records.length) { alert('Tiada data untuk dieksport!'); return; }
            let csv = 'Tarikh,Jenis,Status,NamaPastiLokasi,Pelapor,Kategori,Penyakit,JumlahPelajar,Telefon\n';
            records.forEach(r => {
                const esc = s => `"${(s||'').toString().replace(/"/g,'""')}"`;
                csv += `${esc(r.date + ' ' + r.time)},${esc(r.type)},${esc(r.status === 'resolved' ? 'SELESAI' : 'MENUNGGU')},${esc(r.location)},${esc(r.reporter)},${esc(r.healthCategory)},${esc(r.diseaseType)},${esc(r.studentCount)},${esc(r.phone)}\n`;
            });
            const blob = new Blob([csv], {type:'text/csv;charset=utf-8'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `laporan_kualalangat_${new Date().toISOString().slice(0,10)}.csv`;
            a.click();
            URL.revokeObjectURL(url);
            showToast('✅ Dieksport!', 'Fail CSV dimuat turun');
        }

        function clearAllData() {
            if (confirm('Pasti padam SEMUA rekod? Tindakan ini tidak boleh dibatalkan!')) {
                localStorage.removeItem(STORAGE_KEY);
                renderAdminData();
                showToast('✅ Dipadam', 'Semua rekod telah dikosongkan');
            }
        }

        function newUserSession() {
            localStorage.removeItem(STORAGE_KEY + '_user');
            reporterName = '';
            showPanel('panelCode');
        }

        // Pengendali penapis masa nyata
        document.getElementById('histSearch')?.addEventListener('input', renderHistory);
        document.getElementById('histType')?.addEventListener('change', renderHistory);
        document.getElementById('histStatus')?.addEventListener('change', renderHistory);
        document.getElementById('adminSearch')?.addEventListener('input', renderAdminData);
        document.getElementById('adminCatFilter')?.addEventListener('change', renderAdminData);
        document.getElementById('adminSort')?.addEventListener('change', renderAdminData);

        // Pulihkan sesi semasa buka halaman
        window.addEventListener('load', () => {
            if (sessionStorage.getItem(ADMIN_SESSION) === 'true') {
                loadAdminDashboard();
                return;
            }
            const savedUser = localStorage.getItem(STORAGE_KEY + '_user');
            if (savedUser) {
                reporterName = savedUser;
                document.getElementById('dispName').textContent = reporterName;
                document.getElementById('welcomeName').textContent = reporterName;
                showPanel('panelCategory');
            }
        });
    
        // === MODAL TETAPAN GOOGLE APPS SCRIPT ===
        