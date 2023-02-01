class WorkerAmount {
    constructor(bubbleObject) {
        if (customObjectsCache.has(bubbleObject)) {
            return customObjectsCache.get(bubbleObject);
        }
        this._workerAmount=bubbleObject;
        this._workerAmountID;
        this._amount;
        this._estimate;
        this._paymentStatusDisplay;
        this._requestStatusDisplay;
        this._worker;
        customObjectsCache.set(bubbleObject, this);
    }

    get allProperties(){
        if (isEmpty(this._allProperties)) {
            this._allProperties = this._workerAmount.listProperties();
        }
        return this._allProperties;
    }
    
    get id() {
        if (isEmpty(this._workerAmountID)) {
            this._workerAmountID = this._workerAmount.get("_id");
        }
        return this._workerAmountID;
    }

    //not tested
    get amount() {
        if (isEmpty(this._amount)) {
            this._amount = this._workerAmount.get("amount_number");
        }
        return this._amount;
    }

    //not tested
    get estimate() {
        if (isEmpty(this._estimate)) {
            this._estimate = this._workerAmount.get("estimate_number");
        }
        return this._estimate;
    }

    //not tested
    get paymentStatusDisplay() {
        if (isEmpty(this._paymentStatusDisplay)) {
            let status = this._workerAmount.get("payment_status_option");
            this._paymentStatusDisplay = status.get("display");
        }
        return this._paymentStatusDisplay;
    }

    //not tested
    get requestStatusDisplay() {
        if (isEmpty(this._requestStatusDisplay)) {
            let status = this._workerAmount.get("request_status_option");
            this._requestStatusDisplay = status.get("display");
        }
        return this._requestStatusDisplay;
    }

    //not tested
    get worker() {
        if (isEmpty(this._worker)) {
            this._worker = this._workerAmount.get("worker_custom_worker");
        }
        return this._worker;
    }

}
