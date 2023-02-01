class WorkerArea extends HTMLElement {
    constructor() {
      super();
      // create a shadow root
      this.shadow = this.attachShadow({mode: 'open'});
      privateData.set(this,{});
      // element created
    }

    createAvatar({
      avatarFullName,
      avatarUserID,
      avatarWorkerID,
      avatarColor,
      avatarEmail,
      avatarRole,
      currentUserRole
    }){
      const avatarUserData = {
        avatarFullName,
        avatarUserID,
        avatarWorkerID,
        avatarColor,
        avatarEmail,
        avatarRole
      }
      const avatarElement = document.createElement("user-avatar");
      avatarElement.currentUserRole=currentUserRole;
      avatarElement.avatarUserData=JSON.stringify(avatarUserData);
      return avatarElement
    }

    renderWorkerAmountList({workerAmounts,isAssigned,availableWorkers,parentElement,opened}){
      let listHeader;
      if(workerAmounts){
        listHeader=`${isAssigned?"Assigned":"Requests"} (${workerAmounts.length})`
      }else if(availableWorkers){
        listHeader=`Available (${availableWorkers.length})`
      }
      const workerAmountListArea = elementAssembler({
        parent:parentElement,
        className: "worker-amount-list-area"+(opened?" opened":"")
      });
      const workerAmountListHeader = elementAssembler({
        parent:workerAmountListArea,
        className: "worker-amount-list-header",
        innerHTML:listHeader
      });
      addCustomToggle(
        workerAmountListHeader,
        {
          className:"opened",
          toggleElement:workerAmountListArea,
          weakToggle:true
        })
      const workerAmountListBody = elementAssembler({
        parent:workerAmountListArea,
        className: "worker-amount-list-body",
      });
      workerAmounts?.forEach(workerAmount=>{
        const {
          workerFullName:avatarFullName,
          workerUserID:avatarUserID,
          workerID:avatarWorkerID,
          workerAvatarColor:avatarColor,
          workerEmail:avatarEmail
        }=workerAmount;
        const workerAvatar = this.createAvatar({
          avatarFullName,
          avatarUserID,
          avatarWorkerID,
          avatarColor,
          avatarEmail,
          avatarRole:"Worker",
          currentUserRole:"Admin"
        })
        const workerAmountArea = elementAssembler({
          parent:workerAmountListBody,
          className: "worker-amount-area"
        });
        const workerAmountFirstLine = elementAssembler({
          parent:workerAmountArea,
          className: "worker-amount-first-line"
        });
        workerAvatar.appendTo(workerAmountFirstLine);
        const workerAmountFullName = elementAssembler({
          parent:workerAmountFirstLine,
          className: "worker-amount-full-name",
          innerHTML:avatarFullName
        });
      })
      availableWorkers?.forEach(worker=>{
        const {
          workerFullName:avatarFullName,
          workerUserID:avatarUserID,
          workerID:avatarWorkerID,
          workerAvatarColor:avatarColor,
          workerEmail:avatarEmail
        }=worker;
        const workerAvatar = this.createAvatar({
          avatarFullName,
          avatarUserID,
          avatarWorkerID,
          avatarColor,
          avatarEmail,
          avatarRole:"Worker",
          currentUserRole:"Admin"
        })
        const workerAmountArea = elementAssembler({
          parent:workerAmountListBody,
          className: "worker-amount-area"
        });
        const workerAmountFirstLine = elementAssembler({
          parent:workerAmountArea,
          className: "worker-amount-first-line"
        });
        workerAvatar.appendTo(workerAmountFirstLine);
        const workerAmountFullName = elementAssembler({
          parent:workerAmountFirstLine,
          className: "worker-amount-full-name",
          innerHTML:avatarFullName
        });
      })
      return workerAmountListArea;
    }

    renderMainBody({acceptedWorkerAmounts,pendingWorkerAmounts,message}) {
      const workerAmounts=acceptedWorkerAmounts||pendingWorkerAmounts;
      const mainBody = elementAssembler({
        className: "worker-area-main-body"
      });
      if(message){
        mainBody.innerText=message;
        return mainBody;
      }
      if(workerAmounts){
        //definitely an admin
        const avatarList = elementAssembler({
          className: "avatar-list",
          parent:mainBody
        });
        workerAmounts.forEach(workerAmount=>{
          const {
            workerFullName:avatarFullName,
            workerUserID:avatarUserID,
            workerID:avatarWorkerID,
            workerAvatarColor:avatarColor,
            workerEmail:avatarEmail
          }=workerAmount;
          const workerAvatar = this.createAvatar({
            avatarFullName,
            avatarUserID,
            avatarWorkerID,
            avatarColor,
            avatarEmail,
            avatarRole:"Worker",
            currentUserRole:"Admin"
          })
          if(pendingWorkerAmounts){
            const waitingAdminResponse=pendingWorkerAmounts.some(workerAmount=>workerAmount.requestedByDisplay==="Worker");
            if(waitingAdminResponse){
              mainBody.classList.add("waiting-own-response");
            }else{
              mainBody.classList.add("waiting-other-response");
            }
            workerAvatar.setAttribute("square",true);
          }
          workerAvatar.appendTo(avatarList);
        });
        return mainBody;
      }
    }

    renderDropdownArea({
      workerAmounts,
      availableWorkers,
      isAdmin,
      isWorker
    }) {
      const dropdownArea = elementAssembler({
        className: "worker-area-dropdown"
      });
      const assignedWorkerAmounts=[];
      const pendingWorkerAmounts=[];
      const canceledWorkerAmounts=[];
      const deniedWorkerAmounts=[];
      workerAmounts.forEach(workerAmount=>{
        switch(workerAmount.requestStatusDisplay){
          case "Accepted":
          case "Confirmation Not Needed":
            assignedWorkerAmounts.push(workerAmount);
            break;
          case "Pending":
            pendingWorkerAmounts.push(workerAmount);
            break;
          case "Canceled":
            canceledWorkerAmounts.push(workerAmount);
            break;
          case "Denied":
            deniedWorkerAmounts.push(workerAmount);
            break;
        }
      })
      const requestedWorkerAmounts=[...pendingWorkerAmounts,...deniedWorkerAmounts,...canceledWorkerAmounts];
      
      availableWorkers=availableWorkers.filter(worker=>{
        return !workerAmounts.some(workerAmount=>workerAmount.workerID===worker.workerID)
      })

      if(isAdmin){
        //Assigned (#)
        //Requested (#)
        //Available (#)
        this.renderWorkerAmountList({
          workerAmounts:assignedWorkerAmounts,
          isAssigned:true,
          parentElement:dropdownArea,
          opened:true
        })
        this.renderWorkerAmountList({
          workerAmounts:requestedWorkerAmounts,
          parentElement:dropdownArea,
          opened:assignedWorkerAmounts.length===0
        })
        this.renderWorkerAmountList({
          availableWorkers,
          parentElement:dropdownArea,
          opened:(assignedWorkerAmounts.length+requestedWorkerAmounts.length)===0
        })
      }
      if(isWorker){

      }
      return dropdownArea;
    }

    render() {
      let mainBody;
      let dropdownArea;
      const styleInnerHTML=elementAssembler({
          elementType: "style"
      });
      const innerHTML=elementAssembler({});
      const {currentUserRole,workerAmounts,availableWorkers}=this;
      const isAdmin=currentUserRole==="Admin";
      const isWorker=currentUserRole==="Worker";
      const isStudent=currentUserRole==="Student";
      const isAccepted=workerAmounts.some(workerAmount=>["Accepted","Confirmation Not Needed"].includes(workerAmount.requestStatusDisplay));
      const isPending=workerAmounts.some(workerAmount=>workerAmount.requestStatusDisplay==="Pending");
      console.log({isAccepted,isPending,isAdmin,workerAmounts,availableWorkers});
      if(isAdmin){
        if(isAccepted){
          //list of accepted 
          const acceptedWorkerAmounts=workerAmounts.filter(workerAmount=>["Accepted","Confirmation Not Needed"].includes(workerAmount.requestStatusDisplay));
          mainBody=this.renderMainBody({acceptedWorkerAmounts})
          dropdownArea=this.renderDropdownArea({workerAmounts,availableWorkers,isAdmin})
        }else if(isPending){
          //list of pending (can be requested by admin or worker)
          const pendingWorkerAmounts=workerAmounts.filter(workerAmount=>workerAmount.requestStatusDisplay==="Pending");
          mainBody=this.renderMainBody({pendingWorkerAmounts})
          dropdownArea=this.renderDropdownArea({workerAmounts,availableWorkers,isAdmin})
        }else{
          //# Available
          const availableCount=availableWorkers.length;
          mainBody=this.renderMainBody({message:availableCount+ " Available"})
        }
      }
      if(isWorker){

      }
      if(mainBody){
        //eventually make this mainBody&&dropdownArea
        if(dropdownArea){
          addCustomToggle(mainBody);
          mainBody.append(dropdownArea);
        }
        innerHTML.append(mainBody);
        this.shadowRoot.innerHTML="";//remove any old content
        styleInnerHTML.innerHTML=`
          @keyframes blink {
              10% {
                  filter: brightness(0.5);
              }
          }  
        
          .worker-area-main-body{
            border:1px solid black;
            border-radius:5px;
            width:125px;
            height:45px;
            display:inline-flex;
            flex-direction:column;
            align-items: center;
            justify-content: center;
            background:green;
            cursor:pointer;
            position:relative;
          }

          .worker-area-main-body:hover {
            box-shadow: 0px 2px 5px #000;
          }

          .avatar-list{
            display:flex;
          }

          .waiting-own-response{
            background:blue;
            animation: blink 1s infinite;
          }

          .waiting-other-response{
            background:grey;
          }

          .waiting-own-response.show {
            animation: none;
        }

          .worker-amount-list-body{
            display:none;
          }

          .opened .worker-amount-list-body{
            display:block;
          }

          .worker-area-dropdown{
            display:none;
          }

          .show .worker-area-dropdown{
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            background: red;
            width: 250px;
          }

          .worker-amount-first-line{
            display: flex;
            align-items: center;
          }
          
        `;
        this.shadowRoot.append(styleInnerHTML);
        this.shadowRoot.append(innerHTML);
        this.rendered=true;
      }
    }

    set currentUserRole(value) {
      const acceptedValues=["Admin","Student","Worker"];
      if(acceptedValues.includes(value)){
        privateData.get(this).currentUserRole=value;
      }else{
        throw new TypeError("Role cannot be "+value);
      }
      this.render();
    }

    get currentUserRole() {
      return privateData.get(this).currentUserRole;
    }

    set availableWorkers(value) {
      //validate data
      let obj=JSON.parse(value);
      let valid=true;
      if(valid){
        privateData.get(this).availableWorkers=obj;
      }else{
        throw new TypeError("Invalid Available Workers");
      }
      this.render();
    }

    get availableWorkers() {
      return privateData.get(this).availableWorkers||[];
    }

    set workerAmounts(value) {
      //validate data
      let obj=JSON.parse(value);
      let valid=true;
      if(valid){
        privateData.get(this).workerAmounts=obj;
      }else{
        throw new TypeError("Invalid Worker Amounts");
      }
      this.render();
    }

    get workerAmounts() {
      return privateData.get(this).workerAmounts||[];
    }

    appendTo(parentElement) {
      parentElement.append(this);
    }
  
    connectedCallback() {
      // browser calls this method when the element is added to the document
      // (can be called many times if an element is repeatedly added/removed)
      if (!this.rendered) {
        this.render();
      }    
    }
  
    disconnectedCallback() {
      // browser calls this method when the element is removed from the document
      // (can be called many times if an element is repeatedly added/removed)
    }
  
    static get observedAttributes() {
      /* array of attribute names to monitor for changes */
      return []
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
        // called when one of attributes listed above is modified
        if(WorkerArea.observedAttributes.includes(name)){
          this[prop]=newValue;
        }
        this.render();
    }
  
    adoptedCallback() {
      // called when the element is moved to a new document
      // (happens in document.adoptNode, very rarely used)
    }
  
    // there can be other element methods and properties
  }

  // let the browser know that <user-avatar> is served by our new class
customElements.define("worker-area", WorkerArea);