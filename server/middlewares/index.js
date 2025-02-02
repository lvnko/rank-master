const passParentParamsForward = (req, res, next) => {

    if (Object.keys(req.params).length > 0) {
        req.parentParams = {
            ...req.params
        };
    }
    next();

}

function logUpdateDateTime(next) {
    this.set({ updatedAt: Date.now() });
    next();
}

function logSaveDateTime(next) {
    if (this.isModified()) {
        this.updatedAt = Date.now();
    }
    next();
}

module.exports = {
    passParentParamsForward,
    logUpdateDateTime,
    logSaveDateTime
};