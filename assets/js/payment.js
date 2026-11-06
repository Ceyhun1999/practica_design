(function () {
    'use strict';
    var modal = document.getElementById('payment-modal');
    var form = document.getElementById('payment-form');
    var tariffs = window.coursePayments;
    if (!modal || !form || !tariffs) return;

    var radios = Array.from(form.querySelectorAll('[name="payment_plan"]'));
    var submit = document.getElementById('payment-submit');
    var total = document.getElementById('payment-total');
    var schedule = document.getElementById('payment-schedule');
    var status = document.getElementById('payment-status');
    var currency = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 2 });
    var tariff;
    var opener;
    var previousOverflow;

    function validAmount(plan) {
        return plan && Number.isFinite(plan.amount) && plan.amount > 0;
    }
    function checkoutUrl(plan) {
        if (!validAmount(plan) || typeof plan.url !== 'string' || !plan.url.trim()) return null;
        try {
            var url = new URL(plan.url);
            return url.protocol === 'https:' && !url.username && !url.password ? url.href : null;
        } catch (_) { return null; }
    }
    function selectedPlan() {
        var radio = radios.find(function (input) { return input.checked && !input.disabled; });
        return tariff && radio ? tariff.plans[radio.value] : null;
    }
    function render() {
        var plan = selectedPlan();
        var hasAmount = validAmount(plan);
        total.textContent = hasAmount ? currency.format(plan.amount) : 'Уточняется';
        if (hasAmount && plan.months > 1) {
            schedule.textContent = 'Ориентировочно ' + currency.format(plan.amount / plan.months) + ' в месяц. Итоговая сумма учитывает условия рассрочки; точный график — при оформлении в банке.';
        } else if (hasAmount) {
            schedule.textContent = tariff.perPerson ? 'Полная оплата за одного сотрудника студии.' : 'Один платёж за обучение.';
        } else {
            schedule.textContent = 'Итоговую сумму и ежемесячный платёж уточняем у банка.';
        }
        var url = checkoutUrl(plan);
        submit.disabled = !url;
        status.hidden = !!url;
        status.textContent = hasAmount ? 'Онлайн-оплата этого варианта пока не подключена. Напишите нам, чтобы согласовать оплату.' : 'Условия этого варианта пока уточняются. Вы можете задать вопрос об оплате в Telegram.';
    }
    document.querySelectorAll('[data-payment-open]').forEach(function (button) {
        button.addEventListener('click', function () {
            tariff = tariffs[button.dataset.paymentOpen];
            if (!tariff) return;
            opener = button;
            document.getElementById('payment-description').textContent = 'Тариф «' + tariff.name + '»' + (tariff.perPerson ? ' · за одного сотрудника студии' : '');
            var requested = button.dataset.paymentPlan;
            if (!tariff.plans[requested]) requested = 'full';
            radios.forEach(function (radio) {
                var plan = tariff.plans[radio.value];
                radio.disabled = !plan;
                radio.closest('label').hidden = !plan;
                radio.checked = radio.value === requested;
                var detail = form.querySelector('[data-payment-option="' + radio.value + '"]');
                detail.textContent = validAmount(plan) ? currency.format(plan.amount) + (tariff.perPerson ? ' за сотрудника' : '') : 'Стоимость уточняется';
            });
            render();
            previousOverflow = document.body.style.overflow;
            modal.showModal();
            document.body.style.overflow = 'hidden';
            radios.find(function (input) { return input.checked; }).focus();
        });
    });
    form.addEventListener('change', render);
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        var url = checkoutUrl(selectedPlan());
        if (url) window.location.assign(url);
        else render();
    });
    modal.querySelector('[data-payment-close]').addEventListener('click', function () { modal.close(); });
    modal.addEventListener('close', function () {
        document.body.style.overflow = previousOverflow;
        if (opener) opener.focus();
    });
    modal.addEventListener('click', function (event) {
        if (event.target !== modal) return;
        var rect = modal.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) modal.close();
    });
})();
