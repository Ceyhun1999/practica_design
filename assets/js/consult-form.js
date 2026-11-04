(function () {
    'use strict';
    var modal = document.getElementById('consult-modal');
    var form = document.getElementById('consult-form');
    if (!modal || !form) return;

    var fields = modal.querySelector('[data-consult-fields]');
    var success = modal.querySelector('[data-consult-success]');
    var error = document.getElementById('consult-form-error');
    var phone = document.getElementById('consult-phone');
    var name = document.getElementById('consult-name');
    var time = document.getElementById('consult-time');
    var submit = form.querySelector('[type="submit"]');
    var opener;
    var previousOverflow;
    var submitting = false;

    function validatePhone() {
        var digits = phone.value.replace(/\D/g, '');
        var valid = /^[+\d\s().-]+$/.test(phone.value) && digits.length >= 10 && digits.length <= 15;
        phone.setCustomValidity(valid ? '' : 'Укажите телефон с кодом страны: от 10 до 15 цифр.');
    }
    phone.addEventListener('input', validatePhone);
    [name, time].forEach(function (input) {
        input.addEventListener('input', function () {
            input.setCustomValidity(input.value.trim() ? '' : 'Заполните это поле.');
        });
    });

    document.querySelectorAll('[data-consult-open]').forEach(function (button) {
        button.addEventListener('click', function () {
            opener = button;
            if (!submitting) {
                fields.hidden = false;
                success.hidden = true;
                error.hidden = true;
            }
            previousOverflow = document.body.style.overflow;
            modal.showModal();
            document.body.style.overflow = 'hidden';
            name.focus();
        });
    });
    modal.querySelectorAll('[data-consult-close]').forEach(function (button) {
        button.addEventListener('click', function () { modal.close(); });
    });
    modal.addEventListener('close', function () {
        document.body.style.overflow = previousOverflow;
        if (opener) opener.focus();
    });
    modal.addEventListener('click', function (event) {
        if (event.target !== modal) return;
        var rect = modal.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) modal.close();
    });

    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        if (submitting) return;
        validatePhone();
        if (!form.reportValidity()) return;
        error.hidden = true;

        // Connect a server-side receiver when Telegram delivery is configured.
        // The receiver must return JSON { "success": true } after accepting the lead.
        // Telegram bot tokens must never be included in this public script.
        var endpoint = form.dataset.endpoint;
        if (!endpoint) {
            error.hidden = false;
            return;
        }
        submitting = true;
        submit.disabled = true;
        submit.textContent = 'Отправляем…';
        var controller = new AbortController();
        var timeout = setTimeout(function () { controller.abort(); }, 15000);
        try {
            var response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                signal: controller.signal,
                body: JSON.stringify({
                    name: name.value.trim(),
                    phone: phone.value.trim(),
                    preferred_time: time.value.trim(),
                    consent: form.elements.consent.checked,
                    source: opener ? opener.dataset.consultOpen : 'consult'
                })
            });
            if (!response.ok) throw new Error('Request rejected');
            var result = await response.json();
            if (result.success !== true) throw new Error('Lead not accepted');
            fields.hidden = true;
            success.hidden = false;
            form.reset();
            if (modal.open) success.focus();
        } catch (_) {
            error.hidden = false;
        } finally {
            clearTimeout(timeout);
            submitting = false;
            submit.disabled = false;
            submit.textContent = 'Записаться на консультацию';
        }
    });
})();
