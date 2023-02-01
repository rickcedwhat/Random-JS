class CourseType {
    constructor(bubbleObject) {
        if (customObjectsCache.has(bubbleObject)) {
            return customObjectsCache.get(bubbleObject);
        }
        this._courseType=bubbleObject;
        this._courseTypeName;
        this._courseTypeCode;
        this._courseTypeAvailableWorkers;
        this._courseTypeUnavailableWorkers;
        customObjectsCache.set(bubbleObject, this);
    }
    get allProperties(){
        if (isEmpty(this._allProperties)) {
            this._allProperties = this._courseType.listProperties();
        }
        return this._allProperties;
    }

    get name() {
        if (isEmpty(this._courseTypeName)) {
            this._courseTypeName = this._courseType.get("name1_text");
        }
        return this._courseTypeName;
    }
    
    get code() {
        if (isEmpty(this._courseTypeCode)) {
            this._courseTypeCode = this._courseType.get("code_text");
        }
        return this._courseTypeCode;
    }
    
    get availableWorkers() {
        if (isEmpty(this._courseTypeAvailableWorkers)) {
            let tempList = this._courseType.get("workers_available_list_custom_worker");
            this._courseTypeAvailableWorkers = tempList.get(0,tempList.length()).map(item=>{
                return new Worker(item);
            })
        }
        return this._courseTypeAvailableWorkers;
    }

    //not tested
    get unavailableWorkers() {
        if (isEmpty(this._courseTypeUnavailableWorkers)) {
            let tempList = this._courseType.get("workers_unavailable_list_custom_worker");
            this._courseTypeUnavailableWorkers = tempList.get(0,tempList.length()).map(item=>{
                return new Worker(item);
            })
        }
        return this._courseTypeUnavailableWorkers;
    }
}