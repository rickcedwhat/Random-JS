export default class User {
    constructor(bubbleObject) {
        if (customObjectsCache.has(bubbleObject)) {
            return customObjectsCache.get(bubbleObject);
        }
        this._user=bubbleObject;
        this._userID;
        this._userFirstName;
        this._userLastName;
        this._userFullName;
        this._userEmail;
        this._userAvatarColor;
        this._userLoggedInAs;
        this._userStudent;
        this._userWorker;
        this._userRoles;
        customObjectsCache.set(bubbleObject, this);
    }

    get allProperties(){
        if (isEmpty(this._allProperties)) {
            this._allProperties = this._user.listProperties();
        }
        return this._allProperties;
    }

    //getters made by chat gpt
    get id() {
        if (isEmpty(this._userID)) {
          this._userID = this._user.get("_id");
        }
        return this._userID;
      }
      
      get firstName() {
        if (isEmpty(this._userFirstName)) {
          this._userFirstName = this._user.get("first_name1_text");
        }
        return this._userFirstName;
      }
      
      get lastName() {
        if (isEmpty(this._userLastName)) {
          this._userLastName = this._user.get("last_name1_text");
        }
        return this._userLastName;
      }
      
      get fullName() {
        if (isEmpty(this._userFullName)) {
          this._userFullName = `${this.firstName} ${this.lastName}`;
        }
        return this._userFullName;
      }
      
      get email() {
        if (isEmpty(this._userEmail)) {
          this._userEmail = this._user.get("email");
        }
        return this._userEmail;
      }
      
      get avatarColor() {
        if (isEmpty(this._userAvatarColor)) {
          this._userAvatarColor = this._user.get("avatar_color_text");
        }
        return this._userAvatarColor;
      }
      
      get loggedInAs() {
        if (isEmpty(this._userLoggedInAs)) {
          this._userLoggedInAs = this._user.get("logged_in_as_text");
          //this should be a Role
        }
        return this._userLoggedInAs;
      }
      
      get student() {
        if (isEmpty(this._userStudent)) {
          this._userStudent = new Student(this._user.get("student_user"));
        }
        return this._userStudent;
      }
      
      get worker() {
        if (isEmpty(this._userWorker)) {
          this._userWorker = new Worker(this._user.get("worker_user"));
        }
        return this._userWorker;
      }
      
      get roles() {
        if (isEmpty(this._userRoles)) {
          this._userRoles = this._user.get("roles_group");
        }
        return this._userRoles;
      }
      
}