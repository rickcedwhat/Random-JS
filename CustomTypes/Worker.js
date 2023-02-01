export default class Worker {
    constructor(bubbleObject) {
        if (customObjectsCache.has(bubbleObject)) {
            return customObjectsCache.get(bubbleObject);
        }
        this._worker=bubbleObject;
        this._workerUser;
        this._workerID;
        this._workerAssignedTasks;
        this._workerNinjaVendorID;
        customObjectsCache.set(bubbleObject, this);
    }

    get allProperties(){
        if (isEmpty(this._allProperties)) {
            this._allProperties = this._worker.listProperties();
        }
        return this._allProperties;
    }

    get user() {
        if (isEmpty(this._workerUser)) {
            this._workerUser = new User(this._worker.get("user1_user"));
        }
        return this._workerUser;
    }
    
    get id() {
        if (isEmpty(this._workerID)) {
            this._workerID = this._worker.get("_id");
        }
        return this._workerID;
    }
    
    //not tested
    get assignedTasks() {
        if (isEmpty(this._workerAssignedTasks)) {
            let tempList = this._worker.get("assigned_tasks_list_task");
            this._workerAssignedTasks = tempList.get(0,tempList.length()).map(item=>{
                return new Task(item);
            })
        }
        return this._workerAssignedTasks;
    }
    
    get ninjaVendorID() {
        if (isEmpty(this._workerNinjaVendorID)) {
            this._workerNinjaVendorID = this._worker.get("invoice_ninja_vendor_id_text");
        }
        return this._workerNinjaVendorID;
    }
    
}