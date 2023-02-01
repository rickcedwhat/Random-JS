class Course {
    constructor(bubbleObject) {
        if (customObjectsCache.has(bubbleObject)) {
            console.log("task fetched from cache");
            return customObjectsCache.get(bubbleObject);
        }
        this._course=bubbleObject;
        this._courseName;
        this._courseID;
        this._courseIsArchived;
        this._courseColor;
        this._courseStudent;// Student
        this._courseType;//Course Type
        this._courseAvailableWorkers;//Workers
        customObjectsCache.set(bubbleObject, this);
    }

    get allProperties(){
        if (isEmpty(this._allProperties)) {
            this._allProperties = this._course.listProperties();
        }
        return this._allProperties;
    }

    get name(){
        if(isEmpty(this._courseName)){
            this._courseName=this._course.get("name_text");
        }
        return this._courseName;
    }

    get id(){
        if(isEmpty(this._courseID)){
            this._courseID=this._course.get("_id");
        }
        return this._courseID;
    }

    get isArchived(){
        if(isEmpty(this._courseIsArchived)){
            this._courseIsArchived=this._course.get("is_archived_boolean");
        }
        return this._courseIsArchived;
    }

    get color(){
        if(isEmpty(this._courseColor)){
            this._courseColor=this._course.get("color_text");
        }
        return this._courseColor;
    }

    get student(){
        if(isEmpty(this._courseStudent)){
            this._courseStudent= new Student(this._course.get("student_custom_student"));
        }
        return this._courseStudent;
    }

    get courseType(){
        if(isEmpty(this._courseType)){
            this._courseType=new CourseType(this._course.get("course_type1_custom_course"));
        }
        return this._courseType;
    }

    get availableWorkers(){
        if(isEmpty(this._courseAvailableWorkers)){
            this._courseAvailableWorkers=this.courseType.availableWorkers;
        }
        return this._courseAvailableWorkers;
    }



    
}

