/* Seven checkout variants. Use bank-confirmed TOTAL amounts in rubles.
 * A checkout URL must charge exactly the configured amount and selected term.
 * Never put payment credentials here. null means not yet configured.
 * team.full is currently priced per employee, as displayed on the course page.
 */
window.coursePayments = {
    basic: {
        name: 'Базовый',
        perPerson: false,
        plans: {
            full: { months: 1, amount: 80000, url: '' },
            months3: { months: 3, amount: null, url: '' },
            months5: { months: 5, amount: null, url: '' }
        }
    },
    advanced: {
        name: 'Продвинутый',
        perPerson: false,
        plans: {
            full: { months: 1, amount: 120000, url: '' },
            months3: { months: 3, amount: null, url: '' },
            months5: { months: 5, amount: null, url: '' }
        }
    },
    team: {
        name: 'Вместе с командой',
        perPerson: true,
        plans: {
            full: { months: 1, amount: 135000, url: '' }
        }
    }
};
