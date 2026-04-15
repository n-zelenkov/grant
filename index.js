 // Тарифы в зависимости от выбранного ID встречи
        const EXPENSIVE_TARIFFS = {
            plan1: { period: '3 года', monthly: 7500, total: 270000, label: '3 года обучения' },
            plan2: { period: '2 года', monthly: 8960, total: 215000, label: '2 года обучения' }
        };
        const CHEAP_TARIFFS = {
            plan1: { period: '3 года', monthly: 6670, total: 240000, label: '3 года обучения (льготный)' },
            plan2: { period: '2 года', monthly: 7500, total: 180000, label: '2 года обучения (льготный)' }
        };
        const UNAVAILABLE_EXPENSIVE = {
            plan1: { period: '3 года', monthly: 6670, total: 240000, label: '3 года (доп. тариф)' },
            plan2: { period: '2 года', monthly: 7500, total: 180000, label: '2 года (доп. тариф)' }
        };
        const UNAVAILABLE_CHEAP = {
            plan1: { period: '3 года', monthly: 7500, total: 270000, label: '3 года (стандарт)' },
            plan2: { period: '2 года', monthly: 8960, total: 215000, label: '2 года (стандарт)' }
        };

        const parentNameInput = document.getElementById('parentName');
        const studentNameInput = document.getElementById('studentName');
        const birthDateInput = document.getElementById('birthDate');
        const cityInput = document.getElementById('city');
        const gradeSelect = document.getElementById('grade');
        const achievementsInput = document.getElementById('achievements');
        const socialSelect = document.getElementById('socialStatus');
        const benefitsSelect = document.getElementById('benefits');
        const meetingIdSelect = document.getElementById('meetingId');
        const submitBtn = document.getElementById('submitBtn');
        const resultContainer = document.getElementById('resultContent');

        let isProcessing = false;
        let stageTimeout = null;
        let currentStageIdx = 0;
        let stagesList = [];

        function escapeHtml(str) {
            if (!str) return '';
            return str.replace(/[&<>]/g, function(m) {
                if (m === '&') return '&amp;';
                if (m === '<') return '&lt;';
                if (m === '>') return '&gt;';
                return m;
            });
        }

        function getRemainingSpots() {
            return Math.floor(Math.random() * 8) + 3;
        }

        function buildPriceTable(category, remainingSpots) {
            let availableTariffs, unavailableTariffs;
            let availableTitle, unavailableTitle;
            if (category === 'expensive') {
                availableTariffs = EXPENSIVE_TARIFFS;
                unavailableTariffs = UNAVAILABLE_EXPENSIVE;
                availableTitle = 'Грант одобрен ';
                unavailableTitle = 'Грант не одобрен ';
            } else {
                availableTariffs = CHEAP_TARIFFS;
                unavailableTariffs = UNAVAILABLE_CHEAP;
                availableTitle = 'Грант одобрен';
                unavailableTitle = 'Грант не одобрен';
            }
            return `
                <div style="margin-top: 12px;">
                    <div style="font-weight: 700; margin-bottom: 10px;">${availableTitle}:</div>
                    <table class="price-table">
                        <thead><tr><th>Срок обучения</th><th>Ежемесячный платёж</th><th>Общая стоимость</th><th>Статус</th></tr></thead>
                        <tbody>
                            <tr class="grant-available">
                                <td><strong>${availableTariffs.plan1.period}</strong></td>
                                <td class="highlight">${availableTariffs.plan1.monthly.toLocaleString('ru-RU')} ₽</td>
                                <td>${availableTariffs.plan1.total.toLocaleString('ru-RU')} ₽</td>
                                <td style="color:#146b54; font-weight:700;">✓ одобрен</td>
                            </tr>
                            <tr class="grant-available">
                                <td><strong>${availableTariffs.plan2.period}</strong></td>
                                <td class="highlight">${availableTariffs.plan2.monthly.toLocaleString('ru-RU')} ₽</td>
                                <td>${availableTariffs.plan2.total.toLocaleString('ru-RU')} ₽</td>
                                <td style="color:#146b54; font-weight:700;">✓ одобрен</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="spots-badge">Осталось льготных мест: <strong>${remainingSpots}</strong> (на обе программы)</div>
                </div>
                <div style="margin-top: 20px;">
                    <div style="font-weight: 700; margin-bottom: 8px;">${unavailableTitle}:</div>
                    <table class="price-table">
                        <thead><tr><th>Срок обучения</th><th>Ежемесячный платёж</th><th>Общая стоимость</th><th>Статус</th></tr></thead>
                        <tbody>
                            <tr class="grant-unavailable">
                                <td><strong>${unavailableTariffs.plan1.period}</strong></td>
                                <td>${unavailableTariffs.plan1.monthly.toLocaleString('ru-RU')} ₽</td>
                                <td>${unavailableTariffs.plan1.total.toLocaleString('ru-RU')} ₽</td>
                                <td style="color:#b53b3b; font-weight:700;">✗ не одобрен</td>
                            </tr>
                            <tr class="grant-unavailable">
                                <td><strong>${unavailableTariffs.plan2.period}</strong></td>
                                <td>${unavailableTariffs.plan2.monthly.toLocaleString('ru-RU')} ₽</td>
                                <td>${unavailableTariffs.plan2.total.toLocaleString('ru-RU')} ₽</td>
                                <td style="color:#b53b3b; font-weight:700;">✗ не одобрен</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="spots-badge">Льготные места по данным тарифам не предусмотрены</div>
                </div>
            `;
        }

        function getApprovalHtml(studentFullName, category, remainingSpots) {
            const selectedOption = meetingIdSelect.options[meetingIdSelect.selectedIndex];
            const meetingIdText = selectedOption ? selectedOption.text.split(' —')[0] : '242145125125';
            return `
                <div class="final-approved">
                    <div style="font-weight:800; font-size:1.1rem; color:#146b54;">Решение: ГРАНТ ОДОБРЕН</div>
                    <div style="margin-top: 10px;"><strong>${escapeHtml(studentFullName)}</strong><br>Предоставляется право на льготное обучение по федеральной программе.</div>
                    ${buildPriceTable(category, remainingSpots)}
                    <div style="margin-top: 14px; font-size:0.85rem; background:#eef3f0; padding: 8px 12px; border-radius: 16px;">
                        Номер решения: ГР-${Math.floor(Math.random()*9000+1000)}-ФГ/${new Date().getFullYear()}<br>
                        Идентификатор встречи: ${meetingIdText}
                    </div>
                </div>
            `;
        }

        function renderStages(currentIdx, stagesArr, isFinal = false, finalHtml = null) {
            if (!stagesArr.length) return;
            let html = `<div class="stage-list">`;
            for (let i = 0; i < stagesArr.length; i++) {
                const s = stagesArr[i];
                let stageClass = '';
                let statusText = s.pendingText;
                let icon = s.icon;
                if (isFinal && i === stagesArr.length-1) {
                    stageClass = 'stage-completed';
                    statusText = 'Завершено';
                    icon = '✓';
                }
                else if (i < currentIdx) {
                    stageClass = 'stage-completed';
                    statusText = 'Выполнено';
                    icon = '✓';
                } 
                else if (i === currentIdx && !isFinal) {
                    stageClass = 'stage-active';
                    statusText = s.activeText || 'Обработка...';
                    icon = s.activeIcon || '⟳';
                } 
                else {
                    stageClass = '';
                    statusText = s.pendingText;
                    icon = s.icon;
                }
                html += `
                    <div class="stage-item ${stageClass}">
                        <div class="stage-icon">${icon}</div>
                        <div class="stage-name">${s.title}</div>
                        <div class="stage-status">${statusText}</div>
                    </div>
                `;
                if (i === currentIdx && !isFinal && s.detailMsg) {
                    html += `<div class="stage-detail">${s.detailMsg}</div>`;
                }
            }
            const percent = isFinal ? 100 : Math.floor((currentIdx / stagesArr.length) * 100);
            html += `<div class="progress-bar"><div class="progress-fill" id="globalProgressFill" style="width: ${percent}%;"></div></div>`;
            if (isFinal && finalHtml) {
                html += `<div style="margin-top: 18px;">${finalHtml}</div>`;
            }
            html += `</div>`;
            resultContainer.innerHTML = html;
        }

        function finishVerificationWithApproval() {
            if (stageTimeout) clearTimeout(stageTimeout);
            stageTimeout = null;
            let studentName = studentNameInput.value.trim();
            if (studentName === "") studentName = "Учащийся";
            const category = meetingIdSelect.value;
            const remainingSpots = getRemainingSpots();
            const finalHtml = getApprovalHtml(studentName, category, remainingSpots);
            renderStages(stagesList.length, stagesList, true, finalHtml);
            submitBtn.disabled = false;
            isProcessing = false;
        }

        function nextStage(stagesArr, delaysMs) {
            if (!isProcessing) return;
            if (currentStageIdx < stagesArr.length) {
                renderStages(currentStageIdx, stagesArr, false, null);
                const delay = delaysMs[currentStageIdx];
                stageTimeout = setTimeout(() => {
                    if (!isProcessing) return;
                    currentStageIdx++;
                    if (currentStageIdx >= stagesArr.length) {
                        finishVerificationWithApproval();
                    } else {
                        nextStage(stagesArr, delaysMs);
                    }
                }, delay);
            } else {
                finishVerificationWithApproval();
            }
        }

        function startGrantVerification() {
            stagesList = [
                { title: "Передача данных в систему", pendingText: "Ожидание", icon: "◌", activeIcon: "⟳", activeText: "Передача...", detailMsg: "Данные заявителя и учащегося переданы на обработку." },
                { title: "Анализ успеваемости и достижений", pendingText: "Ожидание", icon: "◌", activeIcon: "⟳", activeText: "Анализ...", detailMsg: "Проверка итоговой оценки и индивидуальных достижений." },
                { title: "Проверка социального статуса и льгот", pendingText: "Ожидание", icon: "◌", activeIcon: "⟳", activeText: "Проверка...", detailMsg: "Учёт категории льгот и социального положения." },
                { title: "Расчёт итогового балла", pendingText: "Ожидание", icon: "◌", activeIcon: "⟳", activeText: "Расчёт...", detailMsg: "Формирование рейтинга для предоставления гранта." },
                { title: "Формирование результата", pendingText: "Ожидание", icon: "◌", activeIcon: "⟳", activeText: "Завершение...", detailMsg: "Подготовка итогового решения." }
            ];
            const totalDurationMs = Math.floor(Math.random() * (180000 - 90000 + 1) + 90000);
            let remaining = totalDurationMs;
            let delays = [];
            for (let i = 0; i < stagesList.length; i++) {
                if (i === stagesList.length - 1) {
                    delays.push(remaining);
                } else {
                    let maxPart = Math.min(remaining - (stagesList.length - i - 1) * 5000, remaining * 0.6);
                    let minPart = 4000;
                    let part = Math.floor(Math.random() * (maxPart - minPart + 1) + minPart);
                    part = Math.min(part, remaining - (stagesList.length - i - 1) * 3000);
                    delays.push(part);
                    remaining -= part;
                }
            }
            let sum = delays.reduce((a,b)=>a+b,0);
            if (sum !== totalDurationMs) {
                delays[delays.length-1] += (totalDurationMs - sum);
            }
            currentStageIdx = 0;
            isProcessing = true;
            submitBtn.disabled = true;
            renderStages(0, stagesList, false, null);
            nextStage(stagesList, delays);
        }

        function validateForm() {
            const parent = parentNameInput.value.trim();
            const student = studentNameInput.value.trim();
            const birth = birthDateInput.value;
            const city = cityInput.value.trim();
            if (!parent || !student || !birth || !city) {
                resultContainer.innerHTML = `<div style="color:#b91c1c; background:#fff5f5; padding:12px; border-radius:1rem;">Ошибка: Заполните все обязательные поля (ФИО представителя, ФИО учащегося, дату рождения, город).</div>`;
                return false;
            }
            if (new Date(birth) > new Date()) {
                resultContainer.innerHTML = `<div style="color:#b91c1c;">Некорректная дата рождения.</div>`;
                return false;
            }
            return true;
        }

        function onSubmit() {
            if (isProcessing) return;
            if (!validateForm()) return;
            resultContainer.innerHTML = `
                <div style="display:flex; align-items:center; gap:12px;">
                    <div class="spinner"></div>
                    <span>Передача данных... Пожалуйста, ожидайте до 3 минут.</span>
                </div>
            `;
            submitBtn.disabled = true;
            setTimeout(() => {
                if (submitBtn.disabled === true) {
                    startGrantVerification();
                }
            }, 1500);
        }

        submitBtn.addEventListener('click', onSubmit);

        window.addEventListener('load', () => {
            if (!parentNameInput.value) parentNameInput.value = "Волкова Екатерина Алексеевна";
            if (!studentNameInput.value) studentNameInput.value = "Волков Дмитрий Андреевич";
            if (!birthDateInput.value) birthDateInput.value = "2012-05-14";
            if (!cityInput.value) cityInput.value = "Москва";
            if (!achievementsInput.value) achievementsInput.value = "Призёр городской олимпиады по информатике";
        });