class Student {
    constructor(bubbleObject) {
        if (customObjectsCache.has(bubbleObject)) {
            return customObjectsCache.get(bubbleObject);
        }
        this._student=bubbleObject;
        this._studentUser;
        this._studentID;
        this._studentInstitution;
        customObjectsCache.set(bubbleObject, this);
    }

    get allProperties(){
        if (isEmpty(this._allProperties)) {
            this._allProperties = this._student.listProperties();
        }
        return this._allProperties;
    }

}