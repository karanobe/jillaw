// src/scripts/creditCardUtils.js

export function getCreditCardType(cardNumber) {
    if (/^5[1-5]/.test(cardNumber)) {
        return 'master';
    } else if (/^4/.test(cardNumber)) {
        return 'visa';
    } else if (/^3[47]/.test(cardNumber)) {
        return 'amex';
    } else if (/^6(?:011|5[0-9]{2})[0-9]{3,}$/.test(cardNumber)) {
        return 'discover';
    } else if (/^35(?:2[89]|[3-8]\d)\d{12}$/.test(cardNumber)) {
        return 'jcb';
    } else {
        return 'unknown';
    }
}

export function addCreditCardIcon(type) {
    const iconElement = document.querySelector('.payment-form__field--credit-card-icon');
    iconElement.classList.remove('payment-form__field--unknown-credit-card', 'payment-form__field--discover-credit-card', 'payment-form__field--mastercard-credit-card', 'payment-form__field--visa-credit-card', 'payment-form__field--amex-credit-card');

    switch (type) {
        case 'master':
            iconElement.classList.add('payment-form__field--mastercard-credit-card');
            break;
        case 'visa':
            iconElement.classList.add('payment-form__field--visa-credit-card');
            break;
        case 'amex':
            iconElement.classList.add('payment-form__field--amex-credit-card');
            break;
        case 'discover':
            iconElement.classList.add('payment-form__field--discover-credit-card');
            break;
        default:
            iconElement.classList.add('payment-form__field--unknown-credit-card');
            break;
    }
}
