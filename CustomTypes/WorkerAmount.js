export default class WorkerAmount {
    /**
     * @type {string}
     */
    workerAmountID;
    /**
     * @type {number | null}
     */
    amount;
    /**
     * @type {number | null}
     */
    estimate;
    /**
     * @type {string}
     */
    paymentStatusDisplay;
    /**
     * @type {string}
     */
    requestStatusDisplay;
    /**
     * @type {string}
     */
    requestedByDisplay;
    /**
     * @type {string}
     */
    workerID;
    /**
     * @type {string}
     */
    workerUserID;
    /**
     * @type {string}
     */
    workerFullName;
    /**
     * @type {string}
     */
    workerAvatarColor;
    /**
     * @type {string}
     */
    workerEmail;

    constructor({workerAmountID, amount, estimate, paymentStatusDisplay, requestStatusDisplay, requestedByDisplay, workerID, workerUserID, workerFullName, workerAvatarColor, workerEmail}) {
        this.workerAmountID = workerAmountID;
        this.amount = amount;
        this.estimate = estimate;
        this.paymentStatusDisplay = paymentStatusDisplay;
        this.requestStatusDisplay = requestStatusDisplay;
        this.requestedByDisplay = requestedByDisplay;
        this.workerID = workerID;
        this.workerUserID = workerUserID;
        this.workerFullName = workerFullName;
        this.workerAvatarColor = workerAvatarColor;
        this.workerEmail = workerEmail;
    }
}
