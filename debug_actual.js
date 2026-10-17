

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
        const EMBEDDED_GS_CODE = `// =========================================================================\n// SISTEM LAPORAN KESELAMATAN & KESIHATAN PASTI KAWASAN KUALA LANGAT\n// Versi Kemas Kini: Papar Senarai Header Berjaya Dihasilkan & Dibaca pada Menu UI\n// =========================================================================\n\nconst SISTEM_CONFIG = {\n  NAMA_FAIL_INDUK: \"SISTEM LAPORAN KESELAMATAN & KESIHATAN\",\n  ZON_MASA: \"Asia/Kuala_Lumpur\",\n  ID_FOLDER_INDUK: \"\", // Kosongkan untuk cipta di Root Drive, atau masukkan ID Folder khusus\n  NAMA_HELAIAN_SEMUA: \"LAPORAN PENUH\", // Helaian khas gabungan keselamatan & kesihatan\n  SPREADSHEET_ID: \"1rdtScLQw-ARSKhCVUpZiKbQB5T5TTKam1zZiSmlHfpA\" // ID fail sedia ada jika standalone\n};\n\n// SKEMA PIAWAIAN JADUAL SISTEM\nconst SYSTEM_SCHEMAS = {\n  USERS: {\n    sheetName: \"SENARAI PENGGUNA\",\n    headers: [\n      \"Tarikh & Masa Akses\",\n      \"Nama Pengguna / Pelapor\",\n      \"Peranan / Jenis Sesi\",\n      \"Kod Akses Digunakan\",\n      \"Status Sesi\",\n      \"ID Sesi\"\n    ],\n    bg: \"#d1fae5\",\n    color: \"#065f46\"\n  },\n  SECURITY: {\n    sheetName: \"LAPORAN KESELAMATAN\",\n    headers: [\n      \"ID REKOD\", \"TARIKH\", \"MASA\", \"NAMA PELAPOR (SESI)\", \n      \"NAMA PENUH / PASTI\", \"MASALAH YANG DIHADAPI\", \n      \"KEPERLUAN YANG DIKEHENDAKI\", \"NO. TELEFON\", \n      \"STATUS\", \"DICIPTA PADA\"\n    ],\n    bg: \"#fef3c7\",\n    color: \"#92400e\"\n  },\n  HEALTH: {\n    sheetName: \"LAPORAN KESIHATAN\",\n    headers: [\n      \"ID REKOD\", \"TARIKH\", \"MASA\", \"NAMA PELAPOR (SESI)\", \n      \"NAMA PENUH / PASTI\", \"KATEGORI MASALAH\", \"JENIS SAKIT\", \n      \"JENIS SAKIT (LAIN-LAIN)\", \"JUMLAH PELAJAR TERLIBAT\", \n      \"NAMA PELAJAR TERLIBAT\", \"TEMPOH KUARANTIN (HARI)\", \n      \"TARIKH DISAHKAN\", \"LAPORAN TELAH DIHANTAR\", \n      \"MAKLUMAN KEPADA JKP\", \"SANITASI TELAH DILAKUKAN\", \n      \"GAMBAR / LAMPIRAN\", \"NO. TELEFON PELAPOR\", \n      \"NOTA / MAKLUMAT TAMBAHAN\", \"STATUS\", \"DICIPTA PADA\"\n    ],\n    bg: \"#dbeafe\",\n    color: \"#1e40af\"\n  },\n  ALL_REPORTS: {\n    sheetName: \"LAPORAN PENUH\",\n    headers: [\n      \"JENIS LAPORAN\", \"ID REKOD\", \"TARIKH\", \"MASA\", \"NAMA PELAPOR (SESI)\", \n      \"NAMA PENUH / PASTI\", \"KATEGORI / MASALAH\", \"BUTIRAN / MAKLUMAT\", \n      \"NO. TELEFON\", \"STATUS\", \"DICIPTA PADA\"\n    ],\n    bg: \"#e0e7ff\",\n    color: \"#3730a3\"\n  }\n};\n\n/**\n * Dapatkan nama bulan semasa berdasarkan zon masa\n */\nfunction dapatkanNamaBulanSemasa() {\n  const hari = new Date();\n  const pilihan = { timeZone: SISTEM_CONFIG.ZON_MASA, month: 'long', year: 'numeric' };\n  return hari.toLocaleDateString('ms-MY', pilihan).toUpperCase();\n}\n\n/**\n * Fungsi Pintar: Semak atau Cipta Fail Utama Google Sheet di Drive\n */\nfunction pastikanFailSedia() {\n  // 1. Semak jika skrip terikat dengan fail Google Sheet aktif (Container-bound)\n  try {\n    const bukuAktif = SpreadsheetApp.getActiveSpreadsheet();\n    if (bukuAktif) {\n      semakDanCiptaSemuaHelaianUtama(bukuAktif);\n      return bukuAktif;\n    }\n  } catch(e) {}\n\n  // 2. Semak jika SPREADSHEET_ID disediakan\n  if (SISTEM_CONFIG.SPREADSHEET_ID && SISTEM_CONFIG.SPREADSHEET_ID.trim() !== \"\") {\n    try {\n      const bukuSediaId = SpreadsheetApp.openById(SISTEM_CONFIG.SPREADSHEET_ID.trim());\n      if (bukuSediaId) {\n        semakDanCiptaSemuaHelaianUtama(bukuSediaId);\n        return bukuSediaId;\n      }\n    } catch(e) {}\n  }\n\n  // 3. Cari fail di Google Drive mengikut nama atau cipta fail baru\n  const namaFail = SISTEM_CONFIG.NAMA_FAIL_INDUK;\n  let folderSasaran = null;\n\n  if (SISTEM_CONFIG.ID_FOLDER_INDUK) {\n    try {\n      folderSasaran = DriveApp.getFolderById(SISTEM_CONFIG.ID_FOLDER_INDUK);\n    } catch {\n      folderSasaran = DriveApp.getRootFolder();\n    }\n  } else {\n    folderSasaran = DriveApp.getRootFolder();\n  }\n\n  const failIterator = folderSasaran.getFilesByName(namaFail);\n  if (failIterator.hasNext()) {\n    const failSedia = failIterator.next();\n    const buku = SpreadsheetApp.openById(failSedia.getId());\n    semakDanCiptaSemuaHelaianUtama(buku);\n    return buku;\n  }\n\n  const bukuBaru = SpreadsheetApp.create(namaFail);\n  const failBaru = DriveApp.getFileById(bukuBaru.getId());\n  \n  if (SISTEM_CONFIG.ID_FOLDER_INDUK && folderSasaran) {\n    DriveApp.getRootFolder().removeFile(failBaru);\n    folderSasaran.addFile(failBaru);\n  }\n\n  const helaianLalai = bukuBaru.getSheetByName(\"Helaian 1\");\n  if (helaianLalai) bukuBaru.deleteSheet(helaianLalai);\n\n  semakDanCiptaSemuaHelaianUtama(bukuBaru);\n  return bukuBaru;\n}\n\n/**\n * Semak dan pastikan header Baris 1 sepadan tanpa merosakkan data bawah\n */\nfunction checkAndFixSheetHeader(sheet, schema) {\n  if (!sheet) return { action: \"Helaian tidak wujud\", headers: [] };\n  \n  var standardHeaders = schema.headers;\n  var lastCol = 0;\n  var lastRow = 0;\n  \n  try {\n    lastCol = sheet.getLastColumn();\n    lastRow = sheet.getLastRow();\n  } catch(e) {}\n  \n  var currentHeaders = [];\n  if (lastRow >= 1 && lastCol >= 1) {\n    try {\n      var headerValues = sheet.getRange(1, 1, 1, lastCol).getValues();\n      if (headerValues && headerValues[0]) {\n        currentHeaders = headerValues[0].map(function(item) {\n          return (item || \"\").toString().trim();\n        });\n      }\n    } catch(e) {}\n  }\n  \n  var isMatch = true;\n  if (currentHeaders.length !== standardHeaders.length) {\n    isMatch = false;\n  } else {\n    for (var i = 0; i < standardHeaders.length; i++) {\n      if ((currentHeaders[i] || \"\").toLowerCase() !== standardHeaders[i].toLowerCase()) {\n        isMatch = false;\n        break;\n      }\n    }\n  }\n  \n  if (!isMatch) {\n    var colsToClear = Math.max(lastCol, standardHeaders.length);\n    try {\n      sheet.getRange(1, 1, 1, colsToClear).clearContent();\n    } catch(e) {}\n    \n    sheet.getRange(1, 1, 1, standardHeaders.length).setValues([standardHeaders]);\n    sheet.getRange(1, 1, 1, standardHeaders.length)\n      .setFontWeight(\"bold\")\n      .setBackground(schema.bg)\n      .setFontColor(schema.color);\n      \n    try {\n      sheet.setFrozenRows(1);\n    } catch(e) {}\n    \n    return { \n      action: \"Diperbaharui/Dijana Semula\", \n      headers: standardHeaders \n    };\n  }\n  \n  return { \n    action: \"Sah & Sepadan\", \n    headers: currentHeaders \n  };\n}\n\nfunction semakDanCiptaSemuaHelaianUtama(buku) {\n  var logs = [];\n  for (var key in SYSTEM_SCHEMAS) {\n    var schema = SYSTEM_SCHEMAS[key];\n    var sheet = buku.getSheetByName(schema.sheetName);\n    if (!sheet) {\n      sheet = buku.insertSheet(schema.sheetName);\n      logs.push(`[${schema.sheetName}] - Helaian baharu dicipta.`);\n    }\n    var result = checkAndFixSheetHeader(sheet, schema);\n    logs.push(`\u2022 ${schema.sheetName} (${result.action}):\\n   [${result.headers.join(\", \")}]`);\n  }\n  return logs;\n}\n\n/**\n * Menu UI Pintar dalam Google Sheets\n */\nfunction onOpen() {\n  try {\n    SpreadsheetApp.getUi()\n      .createMenu(\"\ud83d\udee0\ufe0f Sistem PASTI KL\")\n      .addItem(\"\u26a1 Semak & Cipta Semua Header\", \"menuCheckAndCreateAllHeaders\")\n      .addItem(\"\ud83d\udcc4 Bina / Format Helaian LAPORAN PENUH\", \"menuCiptaSheetLaporanPenuh\")\n      .addItem(\"\ud83d\udd0d Semak Status Sambungan\", \"menuCheckStatus\")\n      .addToUi();\n  } catch(e) {}\n}\n\n/**\n * Fungsi Menu UI: Semak Semua Header & Papar Laporan Terperinci Headers\n */\nfunction menuCheckAndCreateAllHeaders() {\n  var buku = pastikanFailSedia();\n  var headerLogs = semakDanCiptaSemuaHelaianUtama(buku);\n  \n  try {\n    SpreadsheetApp.getUi().alert(\n      \"\ud83d\udccb KEPUTUSAN SEMAKAN & BINA HEADER:\\n\\n\" + \n      \"Fail: \" + buku.getName() + \"\\n\\n\" + \n      headerLogs.join(\"\\n\\n\")\n    );\n  } catch(e) {}\n}\n\n/**\n * Fungsi Khas Menu UI: Mencipta atau Mengemaskini Helaian LAPORAN PENUH Sahaja\n */\nfunction menuCiptaSheetLaporanPenuh() {\n  var buku = pastikanFailSedia();\n  var schemaAll = SYSTEM_SCHEMAS.ALL_REPORTS;\n  var sheetSemua = buku.getSheetByName(schemaAll.sheetName);\n  \n  if (!sheetSemua) {\n    sheetSemua = buku.insertSheet(schemaAll.sheetName);\n  }\n  \n  var result = checkAndFixSheetHeader(sheetSemua, schemaAll);\n  \n  try {\n    SpreadsheetApp.getUi().alert(\n      `\u2705 HELAIAN \"${schemaAll.sheetName}\" DISAHKAN!\\n` +\n      `Status: ${result.action}\\n\\n` +\n      `Senarai Header Dibaca/Dihasilkan:\\n[${result.headers.join(\", \")}]`\n    );\n  } catch(e) {}\n}\n\nfunction menuCheckStatus() {\n  var ss = pastikanFailSedia();\n  try {\n    SpreadsheetApp.getUi().alert(\"Status Sambungan:\\nNama Fail: \" + ss.getName() + \"\\nID: \" + ss.getId());\n  } catch(e) {}\n}\n\n/**\n * Pemetaan Data Pintar untuk Helaian Khusus (Keselamatan / Kesihatan)\n */\nfunction mapDataToRow(headers, data) {\n  var row = [];\n  for (var i = 0; i < headers.length; i++) {\n    var h = (headers[i] || \"\").toString().toLowerCase().trim();\n    var val = \"\";\n    \n    if (h.includes(\"tarikh & masa\") || (h.includes(\"tarikh\") && h.includes(\"masa\"))) {\n      val = (data.date ? data.date + \" \" + (data.time || \"\") : data.timestamp || data.createdAt || \"\");\n    } else if (h === \"tarikh\" || h.includes(\"tarikh mula\") || h.includes(\"tarikh kejadian\")) {\n      val = data.date || \"\";\n    } else if (h === \"masa\" || h.includes(\"masa kejadian\")) {\n      val = data.time || \"\";\n    } else if (h.includes(\"status\")) {\n      if (data.type === \"akses_pengguna\" || data.action === \"logUserAccess\") {\n        val = \"AKTIF\";\n      } else {\n        val = (data.status === \"resolved\" ? \"SELESAI\" : \"MENUNGGU\");\n      }\n    } else if (h.includes(\"pasti\") || h.includes(\"lokasi\") || h.includes(\"cawangan\") || h.includes(\"nama penuh\")) {\n      val = data.fullName || data.location || \"\";\n    } else if (h.includes(\"pelapor\") || h.includes(\"pengguna\") || h.includes(\"nama guru\")) {\n      val = data.userName || data.reporter || \"\";\n    } else if (h.includes(\"jenis penyakit\") || (h.includes(\"penyakit\") && !h.includes(\"lain\"))) {\n      val = data.diseaseType === \"LAIN-LAIN\" ? (data.diseaseOther || \"LAIN-LAIN\") : (data.diseaseType || data.problem || \"\");\n    } else if (h.includes(\"penyakit lain\") || h.includes(\"lain-lain\")) {\n      val = data.diseaseOther || \"\";\n    } else if (h.includes(\"kategori\")) {\n      val = data.kategoriMasalah || data.healthCategory || (data.type || \"\").toUpperCase();\n    } else if (h.includes(\"masalah\") || h.includes(\"keterangan\")) {\n      val = data.masalah || data.problem || \"\";\n    } else if (h.includes(\"keperluan\")) {\n      val = data.keperluan || data.need || \"-\";\n    } else if (h.includes(\"telefon\") || h.includes(\"tel\") || h.includes(\"hp\")) {\n      val = data.telefon || data.phone || \"-\";\n    } else if (h.includes(\"bilangan\") || h.includes(\"jumlah pelajar\")) {\n      val = data.jumlahPelajar || data.studentCount || \"-\";\n    } else if (h.includes(\"senarai\") || h.includes(\"nama pelajar\")) {\n      val = Array.isArray(data.namaPelajar) ? data.namaPelajar.join(\", \") : (data.namaPelajar || (Array.isArray(data.studentNames) ? data.studentNames.join(\", \") : (data.studentNames || \"-\")));\n    } else if (h.includes(\"kuarantin\")) {\n      val = data.tempohKuarantin || data.quarantinePeriod || \"-\";\n    } else if (h.includes(\"sah\")) {\n      val = data.tarikhDisahkan || data.confirmedDate || \"-\";\n    } else if (h.includes(\"sanitasi\")) {\n      val = (data.sanitasiDilakukan || data.sanitationDone) ? \"YA\" : \"TIDAK\";\n    } else if (h.includes(\"pkd\") || h.includes(\"laporan telah dihantar\")) {\n      val = (data.laporanDihantar || data.reportSubmitted) ? \"YA\" : \"TIDAK\";\n    } else if (h.includes(\"jkp\")) {\n      val = (data.maklumanJKP || data.notifyJKP) ? \"YA\" : \"TIDAK\";\n    } else if (h.includes(\"gambar\") || h.includes(\"lampiran\")) {\n      const gbr = data.gambarSanitasi || data.sanitationPhoto;\n      val = gbr ? `\u2705 DILAMPIRKAN (${Math.round(gbr.length / 1024)} KB)` : \"TIADA\";\n    } else if (h.includes(\"nota\") || h.includes(\"catatan\")) {\n      val = data.notaPelajar || data.diseaseNote || \"-\";\n    } else if (h.includes(\"peranan\") || h.includes(\"sesi\")) {\n      val = data.sessionType || \"Sesi Pelapor\";\n    } else if (h.includes(\"kod\")) {\n      val = data.kodAkses || data.code || \"1010\";\n    } else if (h.includes(\"id\")) {\n      val = String(data.id || data.idPengguna || `ID-${Date.now()}`);\n    } else if (h.includes(\"dihantar\") || h.includes(\"dicipta\") || h.includes(\"created\")) {\n      val = data.createdAt || new Date().toLocaleString(\"ms-MY\");\n    }\n    \n    row.push(val);\n  }\n  return row;\n}\n\n/**\n * Pemetaan Data Khas untuk Helaian Gabungan \"LAPORAN PENUH\"\n */\nfunction mapDataToAllReportsRow(headers, data, jenisLaporanText) {\n  var row = [];\n  for (var i = 0; i < headers.length; i++) {\n    var h = (headers[i] || \"\").toString().toLowerCase().trim();\n    var val = \"\";\n\n    if (h.includes(\"jenis laporan\")) {\n      val = jenisLaporanText.toUpperCase();\n    } else if (h.includes(\"id\")) {\n      val = String(data.id || `ID-${Date.now()}`);\n    } else if (h.includes(\"tarikh\") && !h.includes(\"masa\")) {\n      val = data.date || \"\";\n    } else if (h.includes(\"masa\") && !h.includes(\"tarikh\")) {\n      val = data.time || \"\";\n    } else if (h.includes(\"pelapor\") || h.includes(\"sesi\")) {\n      val = data.userName || data.reporter || \"\";\n    } else if (h.includes(\"pasti\") || h.includes(\"lokasi\")) {\n      val = data.fullName || data.location || \"\";\n    } else if (h.includes(\"kategori\") || h.includes(\"masalah\")) {\n      val = data.masalah || data.kategoriMasalah || data.diseaseType || data.problem || \"-\";\n    } else if (h.includes(\"butiran\") || h.includes(\"maklumat\")) {\n      val = data.keperluan || data.notaPelajar || data.diseaseNote || \"-\";\n    } else if (h.includes(\"telefon\") || h.includes(\"tel\")) {\n      val = data.telefon || data.phone || \"-\";\n    } else if (h.includes(\"status\")) {\n      val = (data.status === \"resolved\" ? \"SELESAI\" : \"MENUNGGU\");\n    } else if (h.includes(\"dicipta\") || h.includes(\"created\")) {\n      val = data.createdAt || new Date().toLocaleString(\"ms-MY\");\n    }\n\n    row.push(val);\n  }\n  return row;\n}\n\n/**\n * Permintaan GET\n */\nfunction doGet(e) {\n  try {\n    var buku = pastikanFailSedia();\n    var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : \"\";\n    \n    if (action === \"checkHeaders\" || action === \"init\") {\n      var logs = semakDanCiptaSemuaHelaianUtama(buku);\n      return ContentService.createTextOutput(\n        JSON.stringify({\n          status: \"berjaya\",\n          mesej: \"Semua helaian dan header telah disemak!\",\n          sheetName: buku.getName(),\n          sheetUrl: buku.getUrl(),\n          details: logs\n        })\n      ).setMimeType(ContentService.MimeType.JSON);\n    }\n    \n    return ContentService.createTextOutput(\n      JSON.stringify({\n        status: \"berjaya\",\n        mesej: \"Sistem Laporan PASTI KL Beroperasi Sedia Menerima Data\",\n        sheetName: buku.getName(),\n        sheetUrl: buku.getUrl()\n      })\n    ).setMimeType(ContentService.MimeType.JSON);\n  } catch (err) {\n    return ContentService.createTextOutput(\n      JSON.stringify({ status: \"ralat\", mesej: err.toString() })\n    ).setMimeType(ContentService.MimeType.JSON);\n  }\n}\n\n/**\n * Permintaan POST\n */\nfunction doPost(e) {\n  var lock = LockService.getScriptLock();\n  lock.tryLock(15000);\n  \n  try {\n    var data = {};\n    if (e && e.postData && e.postData.contents) {\n      try {\n        data = JSON.parse(e.postData.contents);\n      } catch (jsonErr) {\n        data = e.parameter || {};\n      }\n    } else if (e && e.parameter) {\n      data = e.parameter;\n    }\n\n    var buku = pastikanFailSedia();\n    var action = (data.action || \"\").toString();\n\n    // 1. Tindakan Semak Header\n    if (action === \"checkHeaders\" || action === \"initHeaders\") {\n      var logs = semakDanCiptaSemuaHelaianUtama(buku);\n      return ContentService.createTextOutput(\n        JSON.stringify({ status: \"berjaya\", mesej: \"Header disahkan semula!\", details: logs, sheetUrl: buku.getUrl() })\n      ).setMimeType(ContentService.MimeType.JSON);\n    }\n\n    // 2. Tindakan Kemaskini Status (Mengemaskini pada semua helaian yang berkaitan)\n    if (action === \"updateStatus\" || data.tindakan === \"updateStatus\") {\n      var idToFind = String(data.id || \"\");\n      var allSheets = buku.getSheets();\n      for (var s = 0; s < allSheets.length; s++) {\n        var sObj = allSheets[s];\n        var lRow = 0, lCol = 0;\n        try {\n          lRow = sObj.getLastRow();\n          lCol = sObj.getLastColumn();\n        } catch(err) {}\n\n        if (lRow > 1 && lCol >= 1) {\n          try {\n            var sHeaders = sObj.getRange(1, 1, 1, lCol).getValues()[0];\n            var idCol = -1;\n            var statusCol = -1;\n            for (var c = 0; c < sHeaders.length; c++) {\n              var hName = (sHeaders[c] || \"\").toString().toLowerCase();\n              if (hName.includes(\"id\")) idCol = c + 1;\n              if (hName.includes(\"status\")) statusCol = c + 1;\n            }\n            if (idCol !== -1 && statusCol !== -1) {\n              var idValues = sObj.getRange(2, idCol, lRow - 1, 1).getValues();\n              for (var r = 0; r < idValues.length; r++) {\n                if (String(idValues[r][0]) === idToFind) {\n                  sObj.getRange(r + 2, statusCol).setValue(data.status === \"resolved\" ? \"SELESAI\" : \"MENUNGGU\");\n                }\n              }\n            }\n          } catch(err) {}\n        }\n      }\n      return ContentService.createTextOutput(\n        JSON.stringify({ status: \"berjaya\", mesej: \"Status laporan dikemaskini berjaya di semua helaian\" })\n      ).setMimeType(ContentService.MimeType.JSON);\n    }\n\n    // 3. Pendaftaran Pengguna / Log Akses\n    var type = (data.jenisLaporan || data.type || \"keselamatan\").toLowerCase();\n    if (data.tindakan === \"daftar_pengguna\" || action === \"logUserAccess\" || type === \"akses_pengguna\") {\n      var schemaUser = SYSTEM_SCHEMAS.USERS;\n      var sheetUser = buku.getSheetByName(schemaUser.sheetName);\n      if (!sheetUser) sheetUser = buku.insertSheet(schemaUser.sheetName);\n      checkAndFixSheetHeader(sheetUser, schemaUser);\n\n      var headersUser = sheetUser.getRange(1, 1, 1, sheetUser.getLastColumn()).getValues()[0];\n      var rowUser = mapDataToRow(headersUser, data);\n      sheetUser.appendRow(rowUser);\n\n      return ContentService.createTextOutput(\n        JSON.stringify({ status: \"berjaya\", mesej: \"Pengguna berjaya didaftarkan\", sheetUrl: buku.getUrl() })\n      ).setMimeType(ContentService.MimeType.JSON);\n    }\n\n    // 4. Simpan Laporan (Keselamatan / Kesihatan)\n    var schema = SYSTEM_SCHEMAS.SECURITY;\n    var jenisLaporanText = \"KESELAMATAN\";\n\n    if (type.includes(\"kesihatan\")) {\n      schema = SYSTEM_SCHEMAS.HEALTH;\n      jenisLaporanText = \"KESIHATAN\";\n    }\n\n    var namaBulan = dapatkanNamaBulanSemasa();\n    var namaHelaianInduk = schema.sheetName;\n    var namaHelaianBulanan = `${schema.sheetName} \u2014 ${namaBulan}`;\n    var namaHelaianSemua = SISTEM_CONFIG.NAMA_HELAIAN_SEMUA;\n\n    // A. Simpan ke Helaian Induk Khusus\n    var sheetInduk = buku.getSheetByName(namaHelaianInduk);\n    if (!sheetInduk) sheetInduk = buku.insertSheet(namaHelaianInduk);\n    checkAndFixSheetHeader(sheetInduk, schema);\n    var headersInduk = sheetInduk.getRange(1, 1, 1, sheetInduk.getLastColumn()).getValues()[0];\n    sheetInduk.appendRow(mapDataToRow(headersInduk, data));\n\n    // B. Simpan ke Helaian Bulanan Khusus\n    var sheetBulanan = buku.getSheetByName(namaHelaianBulanan);\n    if (!sheetBulanan) sheetBulanan = buku.insertSheet(namaHelaianBulanan);\n    checkAndFixSheetHeader(sheetBulanan, schema);\n    var headersBulanan = sheetBulanan.getRange(1, 1, 1, sheetBulanan.getLastColumn()).getValues()[0];\n    sheetBulanan.appendRow(mapDataToRow(headersBulanan, data));\n\n    // C. Simpan ke Helaian Gabungan (\"LAPORAN PENUH\")\n    var schemaAll = SYSTEM_SCHEMAS.ALL_REPORTS;\n    var sheetSemua = buku.getSheetByName(namaHelaianSemua);\n    if (!sheetSemua) sheetSemua = buku.insertSheet(namaHelaianSemua);\n    checkAndFixSheetHeader(sheetSemua, schemaAll);\n    var headersSemua = sheetSemua.getRange(1, 1, 1, sheetSemua.getLastColumn()).getValues()[0];\n    sheetSemua.appendRow(mapDataToAllReportsRow(headersSemua, data, jenisLaporanText));\n\n    return ContentService.createTextOutput(\n      JSON.stringify({ \n        status: \"berjaya\", \n        mesej: `\u2705 Rekod berjaya disimpan ke helaian khusus, helaian bulanan (${namaBulan}), dan helaian \"LAPORAN PENUH\"!`, \n        sheetUrl: buku.getUrl() \n      })\n    ).setMimeType(ContentService.MimeType.JSON);\n\n  } catch (err) {\n    return ContentService.createTextOutput(\n      JSON.stringify({ status: \"ralat\", mesej: err.toString() })\n    ).setMimeType(ContentService.MimeType.JSON);\n  } finally {\n    try { lock.releaseLock(); } catch(err) {}\n  }\n}\n`;
        function openAppsScriptModal() {
            const modal = document.getElementById('modalAppsScript');
            if (!modal) return;
            modal.style.display = 'flex';
            document.getElementById('dispAppsScriptUrl').textContent = getAppsScriptUrl();
            document.getElementById('inputCustomUrl').value = getAppsScriptUrl();
            document.getElementById('appScriptCodeBox').value = EMBEDDED_GS_CODE;
        }

        function closeAppsScriptModal() {
            const modal = document.getElementById('modalAppsScript');
            if (modal) modal.style.display = 'none';
        }

        function saveCustomAppsScriptUrl() {
            const newUrl = document.getElementById('inputCustomUrl').value.trim();
            if (!newUrl || !newUrl.startsWith('https://script.google.com')) {
                alert('Sila masukkan URL Google Apps Script yang sah (bermula dengan https://script.google.com/macros/s/...)');
                return;
            }
            localStorage.setItem('pasti_appscript_url', newUrl);
            APPSCRIPT_URL = newUrl;
            document.getElementById('dispAppsScriptUrl').textContent = newUrl;
            showToast('✅ Disimpan!', 'URL Google Apps Script telah dikemaskini.');
            testAppsScriptConnection();
        }

        function resetAppsScriptUrl() {
            localStorage.removeItem('pasti_appscript_url');
            APPSCRIPT_URL = DEFAULT_APPSCRIPT_URL;
            document.getElementById('inputCustomUrl').value = DEFAULT_APPSCRIPT_URL;
            document.getElementById('dispAppsScriptUrl').textContent = DEFAULT_APPSCRIPT_URL;
            showToast('🔄 Dipulihkan', 'URL kembali ke tetapan asal.');
            testAppsScriptConnection();
        }

        function copyAppsScriptCode() {
            const box = document.getElementById('appScriptCodeBox');
            box.select();
            navigator.clipboard.writeText(box.value).then(() => {
                const btn = document.getElementById('btnCopyCode');
                const origText = btn.textContent;
                btn.textContent = '✅ Disalin!';
                setTimeout(() => btn.textContent = origText, 2500);
                showToast('📋 Kod Disalin!', 'Tampal kod ini ke dalam editor Google Apps Script anda.');
            });
        }

        
        function triggerCheckHeaders() {
            const url = getAppsScriptUrl();
            const resDiv = document.getElementById('testConnResult');
            const btn = document.getElementById('btnCheckHeaders');
            
            resDiv.style.display = 'block';
            resDiv.style.background = '#f0fdf4';
            resDiv.style.color = '#166534';
            resDiv.style.border = '1px solid #bbf7d0';
            resDiv.innerHTML = '⏳ Sedang memeriksa dan menjana header mengikut jadual sistem...';
            if (btn) btn.disabled = true;

            fetch(url + (url.includes('?') ? '&' : '?') + 'action=checkHeaders')
            .then(res => res.json())
            .then(data => {
                if (btn) btn.disabled = false;
                if (data.status === 'berjaya') {
                    resDiv.style.background = '#ecfdf5';
                    resDiv.style.color = '#065f46';
                    resDiv.style.border = '1px solid #a7f3d0';
                    let detailsHtml = '';
                    if (data.details && Array.isArray(data.details)) {
                        detailsHtml = '<ul style="margin:6px 0 0 16px; padding:0; font-size:0.75rem;">' + 
                            data.details.map(d => `<li>${d}</li>`).join('') + '</ul>';
                    }
                    resDiv.innerHTML = `<strong>🟢 Header Berjaya Disahkan & Dijana!</strong><br>${data.mesej}${detailsHtml}<br><small><a href="${data.sheetUrl || 'https://sheets.google.com'}" target="_blank" style="color:#0f766e; font-weight:bold; text-decoration:underline;">Buka Google Sheet</a></small>`;
                    showToast('✅ Header Dijana!', 'Semua helaian telah diselaraskan mengikut sistem.');
                } else {
                    resDiv.style.background = '#fef2f2';
                    resDiv.style.color = '#991b1b';
                    resDiv.style.border = '1px solid #fecaca';
                    resDiv.innerHTML = `<strong>⚠️ Status:</strong> ${data.mesej || 'Ralat'}`;
                }
            })
            .catch(err => {
                fetch(url, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                    body: JSON.stringify({ action: 'checkHeaders' })
                })
                .then(() => {
                    if (btn) btn.disabled = false;
                    resDiv.style.background = '#ecfdf5';
                    resDiv.style.color = '#065f46';
                    resDiv.style.border = '1px solid #a7f3d0';
                    resDiv.innerHTML = `<strong>🟢 Arahan Dihantar:</strong> Arahan semakan dan pembinaan header telah dihantar ke Google Sheet.<br>Sila periksa fail Google Sheet anda untuk melihat helaian dan header terkini.`;
                    showToast('✅ Arahan Dihantar!', 'Header Google Sheet sedang dikemas kini.');
                })
                .catch(postErr => {
                    if (btn) btn.disabled = false;
                    resDiv.style.background = '#fef2f2';
                    resDiv.style.color = '#991b1b';
                    resDiv.style.border = '1px solid #fecaca';
                    resDiv.innerHTML = `<strong>❌ Ralat Sambungan:</strong> Tidak dapat menghubungi Google Apps Script (${postErr.message}).`;
                });
            });
        }

        function testAppsScriptConnection() {
            const url = getAppsScriptUrl();
            const resDiv = document.getElementById('testConnResult');
            const btn = document.getElementById('btnTestConn');
            
            resDiv.style.display = 'block';
            resDiv.style.background = '#f1f5f9';
            resDiv.style.color = '#334155';
            resDiv.innerHTML = '⏳ Sedang menguji sambungan ke Google Apps Script...';
            btn.disabled = true;

            fetch(url)
            .then(res => res.text())
            .then(text => {
                btn.disabled = false;
                let parsed = null;
                try { parsed = JSON.parse(text); } catch(e){}

                if (text.includes('Cannot read properties of null') || (parsed && parsed.status === 'ralat' && parsed.mesej.includes('getId'))) {
                    resDiv.style.background = '#fef2f2';
                    resDiv.style.color = '#991b1b';
                    resDiv.style.border = '1px solid #fecaca';
                    resDiv.innerHTML = `<strong>⚠️ Sambungan Ditemui Tetapi Ada Ralat Pada Google Apps Script:</strong><br>
                    Ralat: <code>Cannot read properties of null (reading 'getId')</code><br>
                    <em>Punca:</em> Skrip Apps Script dibuat di luar Google Sheet atau belum dihubungkan ke fail Google Sheet tertentu.<br>
                    <em>Penyelesaian:</em> Buka Google Sheet anda, klik <strong>Extensions &gt; Apps Script</strong>, tampal kod di bawah, dan klik <strong>Deploy &gt; New deployment</strong>.`;
                } else if (text.includes('SISTEM LAPORAN') || (parsed && parsed.status === 'berjaya')) {
                    resDiv.style.background = '#ecfdf5';
                    resDiv.style.color = '#065f46';
                    resDiv.style.border = '1px solid #a7f3d0';
                    resDiv.innerHTML = `<strong>🟢 Sambungan Berjaya!</strong><br>
                    Google Apps Script aktif dan sedia menerima data laporan ke Google Sheets.`;
                } else {
                    resDiv.style.background = '#fffbeb';
                    resDiv.style.color = '#92400e';
                    resDiv.style.border = '1px solid #fde68a';
                    resDiv.innerHTML = `<strong>ℹ️ Respons Diterima:</strong><br><pre style="white-space:pre-wrap; font-size:0.75rem;">${text.substring(0, 200)}</pre>`;
                }
            })
            .catch(err => {
                btn.disabled = false;
                resDiv.style.background = '#fef2f2';
                resDiv.style.color = '#991b1b';
                resDiv.style.border = '1px solid #fecaca';
                resDiv.innerHTML = `<strong>❌ Ralat Sambungan:</strong> Gagal menghubungi URL Apps Script (${err.message}). Pastikan akses tetapan deployment adalah <em>'Who has access: Anyone'</em>.`;
            });
        }


