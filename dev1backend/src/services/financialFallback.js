const getInsuranceSuggestion = (description = '') => {
    const descLower = String(description).toLowerCase();
    if (
        descLower.includes('phone') ||
        descLower.includes('laptop') ||
        descLower.includes('tv') ||
        descLower.includes('fridge') ||
        descLower.includes('electrical')
    ) {
        return 'Gadget Insurance';
    }
    if (descLower.includes('bike') || descLower.includes('car')) {
        return 'Motor Cover';
    }
    if (descLower.includes('private jet')) {
        return 'Aviation Cover';
    }
    return 'No special insurance needed';
};

const processFallbackFinancialEffects = async (pool, transactionData, cashbackInfo) => {
    const insuranceSuggestion = getInsuranceSuggestion(transactionData.description);
    const spendAmount = Number(transactionData.amount || 0);
    const microInvestHint = Number((spendAmount * 0.01).toFixed(2));

    await pool.query(
        'INSERT INTO consent_logs (user_id, action, reason) VALUES ($1, $2, $3)',
        [transactionData.user_id, 'TRANSACTION_SYNC', 'Core app functionality']
    );

    console.log(
        `⚙️ [Fallback Engine] user=${transactionData.user_id} spent=${spendAmount.toFixed(2)} cashback=${cashbackInfo.cashback_amount} xp=+10 insurance="${insuranceSuggestion}"`
    );

    return {
        spend_amount: spendAmount,
        cashback_amount: cashbackInfo.cashback_amount,
        xp_awarded: 10,
        insurance_suggestion: insuranceSuggestion,
        micro_invest_hint: microInvestHint,
    };
};

module.exports = {
    processFallbackFinancialEffects,
    getInsuranceSuggestion,
};
