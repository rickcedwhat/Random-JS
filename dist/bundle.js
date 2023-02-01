(()=>{"use strict";var e={d:(t,r)=>{for(var n in r)e.o(r,n)&&!e.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:r[n]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},t={};function r(e){return r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},r(e)}function n(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,(void 0,i=function(e,t){if("object"!==r(e)||null===e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var o=n.call(e,"string");if("object"!==r(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(o.key),"symbol"===r(i)?i:String(i)),o)}var i}e.r(t),e.d(t,{addCustomToggle:()=>K,createRandomID:()=>X,elementAssembler:()=>Q,getRandomElement:()=>Y,hyphenToCamel:()=>V,isEmpty:()=>G,isInsideElement:()=>$});var o=function(){function e(t){if(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),customObjectsCache.has(t))return customObjectsCache.get(t);this._course=t,this._courseName,this._courseID,this._courseIsArchived,this._courseColor,this._courseStudent,this._courseType,this._courseAvailableWorkers,customObjectsCache.set(t,this)}var t,r;return t=e,(r=[{key:"allProperties",get:function(){return isEmpty(this._allProperties)&&(this._allProperties=this._course.listProperties()),this._allProperties}},{key:"name",get:function(){return isEmpty(this._courseName)&&(this._courseName=this._course.get("name_text")),this._courseName}},{key:"id",get:function(){return isEmpty(this._courseID)&&(this._courseID=this._course.get("_id")),this._courseID}},{key:"isArchived",get:function(){return isEmpty(this._courseIsArchived)&&(this._courseIsArchived=this._course.get("is_archived_boolean")),this._courseIsArchived}},{key:"color",get:function(){return isEmpty(this._courseColor)&&(this._courseColor=this._course.get("color_text")),this._courseColor}},{key:"student",get:function(){return isEmpty(this._courseStudent)&&(this._courseStudent=new Student(this._course.get("student_custom_student"))),this._courseStudent}},{key:"courseType",get:function(){return isEmpty(this._courseType)&&(this._courseType=new CourseType(this._course.get("course_type1_custom_course"))),this._courseType}},{key:"availableWorkers",get:function(){return isEmpty(this._courseAvailableWorkers)&&(this._courseAvailableWorkers=this.courseType.availableWorkers),this._courseAvailableWorkers}}])&&n(t.prototype,r),Object.defineProperty(t,"prototype",{writable:!1}),e}();function s(e){return s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},s(e)}function a(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,(void 0,o=function(e,t){if("object"!==s(e)||null===e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var n=r.call(e,"string");if("object"!==s(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(n.key),"symbol"===s(o)?o:String(o)),n)}var o}var u=function(){function e(t){if(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),customObjectsCache.has(t))return customObjectsCache.get(t);this._courseType=t,this._courseTypeName,this._courseTypeCode,this._courseTypeAvailableWorkers,this._courseTypeUnavailableWorkers,customObjectsCache.set(t,this)}var t,r;return t=e,(r=[{key:"allProperties",get:function(){return isEmpty(this._allProperties)&&(this._allProperties=this._courseType.listProperties()),this._allProperties}},{key:"name",get:function(){return isEmpty(this._courseTypeName)&&(this._courseTypeName=this._courseType.get("name1_text")),this._courseTypeName}},{key:"code",get:function(){return isEmpty(this._courseTypeCode)&&(this._courseTypeCode=this._courseType.get("code_text")),this._courseTypeCode}},{key:"availableWorkers",get:function(){if(isEmpty(this._courseTypeAvailableWorkers)){var e=this._courseType.get("workers_available_list_custom_worker");this._courseTypeAvailableWorkers=e.get(0,e.length()).map((function(e){return new Worker(e)}))}return this._courseTypeAvailableWorkers}},{key:"unavailableWorkers",get:function(){if(isEmpty(this._courseTypeUnavailableWorkers)){var e=this._courseType.get("workers_unavailable_list_custom_worker");this._courseTypeUnavailableWorkers=e.get(0,e.length()).map((function(e){return new Worker(e)}))}return this._courseTypeUnavailableWorkers}}])&&a(t.prototype,r),Object.defineProperty(t,"prototype",{writable:!1}),e}();function l(e){return l="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},l(e)}function c(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,(void 0,o=function(e,t){if("object"!==l(e)||null===e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var n=r.call(e,"string");if("object"!==l(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(n.key),"symbol"===l(o)?o:String(o)),n)}var o}var f=function(){function e(t){if(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),customObjectsCache.has(t))return customObjectsCache.get(t);this._student=t,this._studentUser,this._studentID,this._studentInstitution,customObjectsCache.set(t,this)}var t,r;return t=e,(r=[{key:"allProperties",get:function(){return isEmpty(this._allProperties)&&(this._allProperties=this._student.listProperties()),this._allProperties}}])&&c(t.prototype,r),Object.defineProperty(t,"prototype",{writable:!1}),e}();function p(e){return p="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},p(e)}function m(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,(void 0,o=function(e,t){if("object"!==p(e)||null===e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var n=r.call(e,"string");if("object"!==p(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(n.key),"symbol"===p(o)?o:String(o)),n)}var o}var y=function(){function e(t){if(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),customObjectsCache.has(t))return customObjectsCache.get(t);this._student=t,this._studentID,this._studentFirstName,this._studentLastName,this._studentFullName,this._studentEmail,this._studentAvatarColor,this._studentRoles,customObjectsCache.set(t,this)}var t,r;return t=e,(r=[{key:"allProperties",get:function(){return isEmpty(this._allProperties)&&(this._allProperties=this._task.listProperties()),this._allProperties}},{key:"name",get:function(){return isEmpty(this._taskName)&&(this._taskName=this._task.get("name_text")),this._taskName}},{key:"instructions",get:function(){return isEmpty(this._taskInstructions)&&(this._taskInstructions=this._task.get("instructions_rich_text")),this._taskInstructions}},{key:"instructionAttachments",get:function(){return isEmpty(this._taskInstructionAttachments)&&(this._taskInstructionAttachments=this._task.get("instruction_attachments_file")),this._taskInstructionAttachments}},{key:"attachments",get:function(){return isEmpty(this._taskAttachments)&&(this._taskAttachments=this._task.get("attachments_file")),this._taskAttachments}},{key:"dueDate",get:function(){return isEmpty(this._taskDueDate)&&(this._taskDueDate=this._task.get("due_date_datetime")),this._taskDueDate}},{key:"workerAmounts",get:function(){return isEmpty(this._taskWorkerAmounts)&&(this._taskWorkerAmounts=this._task.get("worker_amounts_repeating_group")),this._taskWorkerAmounts}},{key:"student",get:function(){return isEmpty(this._taskStudent)&&(this._taskStudent=new Student(this._task.get("student_user"))),this._taskStudent}},{key:"course",get:function(){return isEmpty(this._taskCourse)&&(this._taskCourse=new Course(this._task.get("course_custom_course"))),this._taskCourse}},{key:"taskType",get:function(){return isEmpty(this._taskTaskType)&&(this._taskTaskType=new TaskType(this._task.get("task_type_custom_task_type"))),this._taskTaskType}}])&&m(t.prototype,r),Object.defineProperty(t,"prototype",{writable:!1}),e}();function h(e){return h="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},h(e)}function d(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,(void 0,o=function(e,t){if("object"!==h(e)||null===e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var n=r.call(e,"string");if("object"!==h(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(n.key),"symbol"===h(o)?o:String(o)),n)}var o}var v=function(){function e(t){if(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),customObjectsCache.has(t))return customObjectsCache.get(t);this._user=t,this._userID,this._userFirstName,this._userLastName,this._userFullName,this._userEmail,this._userAvatarColor,this._userLoggedInAs,this._userStudent,this._userWorker,this._userRoles,customObjectsCache.set(t,this)}var t,r;return t=e,(r=[{key:"allProperties",get:function(){return isEmpty(this._allProperties)&&(this._allProperties=this._user.listProperties()),this._allProperties}},{key:"id",get:function(){return isEmpty(this._userID)&&(this._userID=this._user.get("_id")),this._userID}},{key:"firstName",get:function(){return isEmpty(this._userFirstName)&&(this._userFirstName=this._user.get("first_name1_text")),this._userFirstName}},{key:"lastName",get:function(){return isEmpty(this._userLastName)&&(this._userLastName=this._user.get("last_name1_text")),this._userLastName}},{key:"fullName",get:function(){return isEmpty(this._userFullName)&&(this._userFullName="".concat(this.firstName," ").concat(this.lastName)),this._userFullName}},{key:"email",get:function(){return isEmpty(this._userEmail)&&(this._userEmail=this._user.get("email")),this._userEmail}},{key:"avatarColor",get:function(){return isEmpty(this._userAvatarColor)&&(this._userAvatarColor=this._user.get("avatar_color_text")),this._userAvatarColor}},{key:"loggedInAs",get:function(){return isEmpty(this._userLoggedInAs)&&(this._userLoggedInAs=this._user.get("logged_in_as_text")),this._userLoggedInAs}},{key:"student",get:function(){return isEmpty(this._userStudent)&&(this._userStudent=new Student(this._user.get("student_user"))),this._userStudent}},{key:"worker",get:function(){return isEmpty(this._userWorker)&&(this._userWorker=new Worker(this._user.get("worker_user"))),this._userWorker}},{key:"roles",get:function(){return isEmpty(this._userRoles)&&(this._userRoles=this._user.get("roles_group")),this._userRoles}}])&&d(t.prototype,r),Object.defineProperty(t,"prototype",{writable:!1}),e}();function b(e){return b="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},b(e)}function k(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,w(n.key),n)}}function g(e,t,r){return t&&k(e.prototype,t),r&&k(e,r),Object.defineProperty(e,"prototype",{writable:!1}),e}function _(e,t,r){return(t=w(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function w(e){var t=function(e,t){if("object"!==b(e)||null===e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var n=r.call(e,"string");if("object"!==b(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"===b(t)?t:String(t)}var A=g((function e(t){var r=t.workerAmountID,n=t.amount,o=t.estimate,i=t.paymentStatusDisplay,s=t.requestStatusDisplay,a=t.requestedByDisplay,u=t.workerID,l=t.workerUserID,c=t.workerFullName,f=t.workerAvatarColor,p=t.workerEmail;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),_(this,"workerAmountID",void 0),_(this,"amount",void 0),_(this,"estimate",void 0),_(this,"paymentStatusDisplay",void 0),_(this,"requestStatusDisplay",void 0),_(this,"requestedByDisplay",void 0),_(this,"workerID",void 0),_(this,"workerUserID",void 0),_(this,"workerFullName",void 0),_(this,"workerAvatarColor",void 0),_(this,"workerEmail",void 0),this.workerAmountID=r,this.amount=n,this.estimate=o,this.paymentStatusDisplay=i,this.requestStatusDisplay=s,this.requestedByDisplay=a,this.workerID=u,this.workerUserID=l,this.workerFullName=c,this.workerAvatarColor=f,this.workerEmail=p}));function S(e){return S="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},S(e)}function E(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,(void 0,o=function(e,t){if("object"!==S(e)||null===e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var n=r.call(e,"string");if("object"!==S(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(n.key),"symbol"===S(o)?o:String(o)),n)}var o}function T(e,t){if(t&&("object"===S(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return j(e)}function j(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function D(e){var t="function"==typeof Map?new Map:void 0;return D=function(e){if(null===e||(r=e,-1===Function.toString.call(r).indexOf("[native code]")))return e;var r;if("function"!=typeof e)throw new TypeError("Super expression must either be null or a function");if(void 0!==t){if(t.has(e))return t.get(e);t.set(e,n)}function n(){return C(e,arguments,N(this).constructor)}return n.prototype=Object.create(e.prototype,{constructor:{value:n,enumerable:!1,writable:!0,configurable:!0}}),O(n,e)},D(e)}function C(e,t,r){return C=P()?Reflect.construct.bind():function(e,t,r){var n=[null];n.push.apply(n,t);var o=new(Function.bind.apply(e,n));return r&&O(o,r.prototype),o},C.apply(null,arguments)}function P(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}function O(e,t){return O=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e},O(e,t)}function N(e){return N=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)},N(e)}var W=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&O(e,t)}(a,e);var t,r,n,o,i,s=(t=a,r=P(),function(){var e,n=N(t);if(r){var o=N(this).constructor;e=Reflect.construct(n,arguments,o)}else e=n.apply(this,arguments);return T(this,e)});function a(){var e;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,a),(e=s.call(this)).shadow=e.attachShadow({mode:"open"}),privateData.set(j(e),{}),e}return n=a,i=[{key:"observedAttributes",get:function(){return[]}}],(o=[{key:"createAvatar",value:function(e){var t=e.avatarFullName,r=e.avatarUserID,n=e.avatarWorkerID,o=e.avatarColor,i=e.avatarEmail,s=e.avatarRole,a=e.currentUserRole,u={avatarFullName:t,avatarUserID:r,avatarWorkerID:n,avatarColor:o,avatarEmail:i,avatarRole:s},l=document.createElement("user-avatar");return l.currentUserRole=a,l.avatarUserData=JSON.stringify(u),l}},{key:"renderWorkerAmountList",value:function(e){var t,r=this,n=e.workerAmounts,o=e.isAssigned,i=e.availableWorkers,s=e.parentElement,a=e.opened;n?t="".concat(o?"Assigned":"Requests"," (").concat(n.length,")"):i&&(t="Available (".concat(i.length,")"));var u=elementAssembler({parent:s,className:"worker-amount-list-area"+(a?" opened":"")}),l=elementAssembler({parent:u,className:"worker-amount-list-header",innerHTML:t});addCustomToggle(l,{className:"opened",toggleElement:u,weakToggle:!0});var c=elementAssembler({parent:u,className:"worker-amount-list-body"});return null==n||n.forEach((function(e){var t=e.workerFullName,n=e.workerUserID,o=e.workerID,i=e.workerAvatarColor,s=e.workerEmail,a=r.createAvatar({avatarFullName:t,avatarUserID:n,avatarWorkerID:o,avatarColor:i,avatarEmail:s,avatarRole:"Worker",currentUserRole:"Admin"}),u=elementAssembler({parent:c,className:"worker-amount-area"}),l=elementAssembler({parent:u,className:"worker-amount-first-line"});a.appendTo(l),elementAssembler({parent:l,className:"worker-amount-full-name",innerHTML:t})})),null==i||i.forEach((function(e){var t=e.workerFullName,n=e.workerUserID,o=e.workerID,i=e.workerAvatarColor,s=e.workerEmail,a=r.createAvatar({avatarFullName:t,avatarUserID:n,avatarWorkerID:o,avatarColor:i,avatarEmail:s,avatarRole:"Worker",currentUserRole:"Admin"}),u=elementAssembler({parent:c,className:"worker-amount-area"}),l=elementAssembler({parent:u,className:"worker-amount-first-line"});a.appendTo(l),elementAssembler({parent:l,className:"worker-amount-full-name",innerHTML:t})})),u}},{key:"renderMainBody",value:function(e){var t=this,r=e.acceptedWorkerAmounts,n=e.pendingWorkerAmounts,o=e.message,i=r||n,s=elementAssembler({className:"worker-area-main-body"});if(o)return s.innerText=o,s;if(i){var a=elementAssembler({className:"avatar-list",parent:s});return i.forEach((function(e){var r=e.workerFullName,o=e.workerUserID,i=e.workerID,u=e.workerAvatarColor,l=e.workerEmail,c=t.createAvatar({avatarFullName:r,avatarUserID:o,avatarWorkerID:i,avatarColor:u,avatarEmail:l,avatarRole:"Worker",currentUserRole:"Admin"});if(n){var f=n.some((function(e){return"Worker"===e.requestedByDisplay}));f?s.classList.add("waiting-own-response"):s.classList.add("waiting-other-response"),c.setAttribute("square",!0)}c.appendTo(a)})),s}}},{key:"renderDropdownArea",value:function(e){var t=e.workerAmounts,r=e.availableWorkers,n=e.isAdmin,o=(e.isWorker,elementAssembler({className:"worker-area-dropdown"})),i=[],s=[],a=[],u=[];t.forEach((function(e){switch(e.requestStatusDisplay){case"Accepted":case"Confirmation Not Needed":i.push(e);break;case"Pending":s.push(e);break;case"Canceled":a.push(e);break;case"Denied":u.push(e)}}));var l=[].concat(s,u,a);return r=r.filter((function(e){return!t.some((function(t){return t.workerID===e.workerID}))})),n&&(this.renderWorkerAmountList({workerAmounts:i,isAssigned:!0,parentElement:o,opened:!0}),this.renderWorkerAmountList({workerAmounts:l,parentElement:o,opened:0===i.length}),this.renderWorkerAmountList({availableWorkers:r,parentElement:o,opened:i.length+l.length===0})),o}},{key:"render",value:function(){var e,t,r=elementAssembler({elementType:"style"}),n=elementAssembler({}),o=this.currentUserRole,i=this.workerAmounts,s=this.availableWorkers,a="Admin"===o,u=i.some((function(e){return["Accepted","Confirmation Not Needed"].includes(e.requestStatusDisplay)})),l=i.some((function(e){return"Pending"===e.requestStatusDisplay}));if(console.log({isAccepted:u,isPending:l,isAdmin:a,workerAmounts:i,availableWorkers:s}),a)if(u){var c=i.filter((function(e){return["Accepted","Confirmation Not Needed"].includes(e.requestStatusDisplay)}));e=this.renderMainBody({acceptedWorkerAmounts:c}),t=this.renderDropdownArea({workerAmounts:i,availableWorkers:s,isAdmin:a})}else if(l){var f=i.filter((function(e){return"Pending"===e.requestStatusDisplay}));e=this.renderMainBody({pendingWorkerAmounts:f}),t=this.renderDropdownArea({workerAmounts:i,availableWorkers:s,isAdmin:a})}else{var p=s.length;e=this.renderMainBody({message:p+" Available"})}e&&(t&&(addCustomToggle(e),e.append(t)),n.append(e),this.shadowRoot.innerHTML="",r.innerHTML="\n          @keyframes blink {\n              10% {\n                  filter: brightness(0.5);\n              }\n          }  \n        \n          .worker-area-main-body{\n            border:1px solid black;\n            border-radius:5px;\n            width:125px;\n            height:45px;\n            display:inline-flex;\n            flex-direction:column;\n            align-items: center;\n            justify-content: center;\n            background:green;\n            cursor:pointer;\n            position:relative;\n          }\n\n          .worker-area-main-body:hover {\n            box-shadow: 0px 2px 5px #000;\n          }\n\n          .avatar-list{\n            display:flex;\n          }\n\n          .waiting-own-response{\n            background:blue;\n            animation: blink 1s infinite;\n          }\n\n          .waiting-other-response{\n            background:grey;\n          }\n\n          .waiting-own-response.show {\n            animation: none;\n        }\n\n          .worker-amount-list-body{\n            display:none;\n          }\n\n          .opened .worker-amount-list-body{\n            display:block;\n          }\n\n          .worker-area-dropdown{\n            display:none;\n          }\n\n          .show .worker-area-dropdown{\n            display: flex;\n            flex-direction: column;\n            position: absolute;\n            top: 100%;\n            left: 0;\n            background: red;\n            width: 250px;\n          }\n\n          .worker-amount-first-line{\n            display: flex;\n            align-items: center;\n          }\n          \n        ",this.shadowRoot.append(r),this.shadowRoot.append(n),this.rendered=!0)}},{key:"currentUserRole",get:function(){return privateData.get(this).currentUserRole},set:function(e){if(!["Admin","Student","Worker"].includes(e))throw new TypeError("Role cannot be "+e);privateData.get(this).currentUserRole=e,this.render()}},{key:"availableWorkers",get:function(){return privateData.get(this).availableWorkers||[]},set:function(e){var t=JSON.parse(e);privateData.get(this).availableWorkers=t,this.render()}},{key:"workerAmounts",get:function(){return privateData.get(this).workerAmounts||[]},set:function(e){var t=JSON.parse(e);privateData.get(this).workerAmounts=t,this.render()}},{key:"appendTo",value:function(e){e.append(this)}},{key:"connectedCallback",value:function(){this.rendered||this.render()}},{key:"disconnectedCallback",value:function(){}},{key:"attributeChangedCallback",value:function(e,t,r){a.observedAttributes.includes(e)&&(this[prop]=r),this.render()}},{key:"adoptedCallback",value:function(){}}])&&E(n.prototype,o),i&&E(n,i),Object.defineProperty(n,"prototype",{writable:!1}),a}(D(HTMLElement));function I(e){return I="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},I(e)}function R(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,(void 0,o=function(e,t){if("object"!==I(e)||null===e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var n=r.call(e,"string");if("object"!==I(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(n.key),"symbol"===I(o)?o:String(o)),n)}var o}function x(e,t){if(t&&("object"===I(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return U(e)}function U(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function L(e){var t="function"==typeof Map?new Map:void 0;return L=function(e){if(null===e||(r=e,-1===Function.toString.call(r).indexOf("[native code]")))return e;var r;if("function"!=typeof e)throw new TypeError("Super expression must either be null or a function");if(void 0!==t){if(t.has(e))return t.get(e);t.set(e,n)}function n(){return M(e,arguments,B(this).constructor)}return n.prototype=Object.create(e.prototype,{constructor:{value:n,enumerable:!1,writable:!0,configurable:!0}}),q(n,e)},L(e)}function M(e,t,r){return M=F()?Reflect.construct.bind():function(e,t,r){var n=[null];n.push.apply(n,t);var o=new(Function.bind.apply(e,n));return r&&q(o,r.prototype),o},M.apply(null,arguments)}function F(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}function q(e,t){return q=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e},q(e,t)}function B(e){return B=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)},B(e)}customElements.define("worker-area",W);var H=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&q(e,t)}(a,e);var t,r,n,o,i,s=(t=a,r=F(),function(){var e,n=B(t);if(r){var o=B(this).constructor;e=Reflect.construct(n,arguments,o)}else e=n.apply(this,arguments);return x(this,e)});function a(){var e;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,a),(e=s.call(this)).shadow=e.attachShadow({mode:"open"}),privateData.set(U(e),{}),e.borderColor="white",e.bgColor="green",e}return n=a,i=[{key:"observedAttributes",get:function(){return["show-quick-glance","square"]}}],(o=[{key:"render",value:function(){var e=!1,t=this.avatarUserData,r=elementAssembler({elementType:"style"}),n=elementAssembler({});if(r.innerHTML="\n        .avatar{\n          border:2px solid ".concat(this.borderColor,";\n          border-radius:50%;\n          background:").concat((null==t?void 0:t.avatarColor)||this.bgColor,";\n          font-weight:bold;\n          width: 30px;\n          height: 30px;\n          display:flex;\n          align-items:center;\n          justify-content:center;\n          font-family: Barlow;\n          font-size: 14px;    \n          color:white;\n        }\n\n        .avatar.square{\n          border-radius:0;\n        }\n      "),null!=t&&t.avatarImgSrc);else if(null!=t&&t.avatarFullName){var o=elementAssembler({elementType:"span",innerHTML:t.avatarFullName.split(" ").map((function(e){return e[0]})).join(""),className:"avatar"+(this.square?" square":"")});n.append(o),e=!0}e&&(this.shadowRoot.innerHTML="",this.shadowRoot.append(r),this.shadowRoot.append(n),this.rendered=!0)}},{key:"appendTo",value:function(e){e.append(this)}},{key:"connectedCallback",value:function(){this.rendered||this.render()}},{key:"disconnectedCallback",value:function(){}},{key:"currentUserRole",get:function(){return privateData.get(this).currentUserRole},set:function(e){if(!["Admin","Student","Worker"].includes(e))throw new TypeError("Role cannot be "+e);privateData.get(this).currentUserRole=e,this.render()}},{key:"avatarUserData",get:function(){return privateData.get(this).avatarUserData},set:function(e){var t=JSON.parse(e);privateData.get(this).avatarUserData=t,this.render()}},{key:"attributeChangedCallback",value:function(e,t,r){if(console.log({name:e,oldValue:t,newValue:r}),a.observedAttributes.includes(e)){var n=hyphenToCamel(e);["showQuickGlance","square"].includes(n)?this[n]=!0:this[n]=r}this.render()}},{key:"adoptedCallback",value:function(){}}])&&R(n.prototype,o),i&&R(n,i),Object.defineProperty(n,"prototype",{writable:!1}),a}(L(HTMLElement));function J(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=r){var n,o,i,s,a=[],u=!0,l=!1;try{if(i=(r=r.call(e)).next,0===t){if(Object(r)!==r)return;u=!1}else for(;!(u=(n=i.call(r)).done)&&(a.push(n.value),a.length!==t);u=!0);}catch(e){l=!0,o=e}finally{try{if(!u&&null!=r.return&&(s=r.return(),Object(s)!==s))return}finally{if(l)throw o}}return a}}(e,t)||function(e,t){if(e){if("string"==typeof e)return z(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?z(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function z(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function V(e){return e.replace(/-([a-z])/g,(function(e){return e[1].toUpperCase()}))}function G(e){return null==e}function Q(e){var t=e.attributes,r=e.parent,n=e.className,o=e.elementType,i=void 0===o?"div":o,s=e.innerHTML,a=e.data,u=e.style,l=document.createElement(i);if(G(n)||(l.className=n),t&&Object.keys(t).forEach((function(e){l.setAttribute(e,t[e])})),G(s)||(l.innerHTML=s),a&&Object.keys(a).forEach((function(e){l.dataset[e]=a[e]})),r&&r.append(l),u)for(var c=0,f=Object.entries(u);c<f.length;c++){var p=J(f[c],2),m=p[0],y=p[1];l.style[m]=y}return l}function $(e,t){for(var r=t;r;){if(r===e)return!0;r=r.parentNode}return!1}function K(e,t){var r=(null==t?void 0:t.className)||"show",n=(null==t?void 0:t.toggleElement)||e,o=null==t?void 0:t.weakToggle,i=function(t){$(e,t.target)||n.customToggle()};e.addEventListener("click",(function(t){console.log({element:e,className:r,toggleElement:n,weakToggle:o}),t.stopPropagation(),o?n.classList.toggle(r):(n.classList.add(r),document.addEventListener("click",i))})),n.customToggle=function(){o?n.classList.toggle(r):(n.classList.remove(r),document.removeEventListener("click",i))}}function X(){var e="";for(i=0;i<16;i++)e+=Math.floor(9*Math.random());return e}function Y(e){var t=e.length;return e[Math.floor(Math.random()*t)]}customElements.define("user-avatar",H),Object.values(t).forEach((function(e){window[e.name]=e})),new WeakMap,new WeakMap,window.Course=o,window.CourseType=u,window.Student=f,window.Task=y,window.User=v,window.WorkerAmount=A,window.UserAvatar=H,window.WorkerArea=W})();