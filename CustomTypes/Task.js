class Task {
    constructor(bubbleObject) {
        if (customObjectsCache.has(bubbleObject)) {
            console.log("task fetched from cache");
            return customObjectsCache.get(bubbleObject);
        }
        this._task = bubbleObject;
        this._taskID;
        this._taskName;
        this._taskInstructions;
        this._taskInstructionAttachments;
        this._taskAttachments;
        this._taskDueDate;
        this._taskWorkerAmounts;
        this._taskCourse;
        this._taskStudent;
        customObjectsCache.set(bubbleObject, this);
    }

    get allProperties(){
        if (isEmpty(this._allProperties)) {
            this._allProperties = this._task.listProperties();
        }
        return this._allProperties;
    }

    //all untested below
    get name() {//good
        if (isEmpty(this._taskName)) {
            this._taskName = this._task.get("name_text");
        }
        return this._taskName;
    }

    get id(){//good
        if(isEmpty(this._taskID)){
            this._taskID=this._task.get("_id");
        }
        return this._taskID;
    }
    
    get instructions() {
        if (isEmpty(this._taskInstructions)) {
            this._taskInstructions = this._task.get("instructions_text");
        }
        return this._taskInstructions;
    }
    
    get instructionAttachments() {
        if (isEmpty(this._taskInstructionAttachments)) {
            let tempList = this._task.get("instruction_attachments_list_file");
            this._taskInstructionAttachments = tempList.get(0,tempList.length()).map(item=>{
                //return new Attachment(item);
            })
        }
        return this._taskInstructionAttachments;
    }
    
    get attachments() {
        if (isEmpty(this._taskAttachments)) {
            let tempList = this._task.get("attachments_list_file");
            this._taskAttachments = tempList.get(0,tempList.length()).map(item=>{
                //return new Attachment(item);
            })
        }
        return this._taskAttachments;
    }
    
    get dueDate() {
        if (isEmpty(this._taskDueDate)) {
            this._taskDueDate = this._task.get("due_date_date");
        }
        return this._taskDueDate;
    }
    
    get workerAmounts() {
        if (isEmpty(this._taskWorkerAmounts)) {
            let tempList = this._task.get("worker_amounts_list_custom_worker_amount");
            this._taskWorkerAmounts = tempList.get(0,tempList.length()).map(item=>{
                return new WorkerAmount(item);
            })
        }
        return this._taskWorkerAmounts;
    }
    
    get student() {
        if (isEmpty(this._taskStudent)) {
            this._taskStudent = new Student(this._task.get("student_custom_student"));
        }
        return this._taskStudent;
    }
    
    get course() {
        if (isEmpty(this._taskCourse)) {
            this._taskCourse = new Course(this._task.get("course1_custom_course1"));
        }
        return this._taskCourse;
    }
    
    get taskType() {
        if (isEmpty(this._taskTaskType)) {
            this._taskTaskType = new TaskType(this._task.get("task_type__option__option_task_type0"));
        }
        return this._taskTaskType;
    }
    
}