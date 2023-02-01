let fun = function(instance, properties, context) {
	let baseURL = "https://app.viphomework.com/";
	if (window.location.href.includes("version-test")) {
		baseURL += "version-test/";
	}
 

	//helper functions and objects
	function removeAllChildNodes(parent) {
		while (parent.firstChild) {
			parent.removeChild(parent.firstChild);
		}
	}
    
    function isInsideElement(parent, child){
        let node = child;
        while (node) {
            if (node === parent) {
                return true;
            }

            // Traverse up to the parent
            node = node.parentNode;
        }

        // Go up until the root but couldn't find the `parent`
        return false;
    };
    
    function addCustomToggle(element,options){
        const className=options?.className||"show";
        const handleClick = (e) => {
            if(!isInsideElement(element,e.target)){
                element.customToggle();
            }
        };
        element.addEventListener('click',()=>{
            element.classList.add(className);
            document.addEventListener('click',handleClick);
        }) 

        element.customToggle = function(){
            element.classList.remove(className);
            document.removeEventListener('click',handleClick);
        }
    }
    
    function getSheet(){
        let style = document.querySelector("style.course-viewer-style");
        if(!style){
        	style = document.createElement("style");
            style.className = "course-viewer-style";

            // Add a media (and/or media query) here if you'd like!
            // style.setAttribute("media", "screen")
            // style.setAttribute("media", "only screen and (max-width : 1024px)")

            // Add the <style> element to the page
            document.head.appendChild(style);
        }
        return style.sheet;
    }
    
    const imageZoomOverlay = document.querySelector(".image-zoom-overlay")||elementAssembler({
        parent: document.body,
        className: "image-zoom-overlay"
    });
    const attachmentPreviewOverlay = instance.data.attachmentPreviewOverlay||elementAssembler({
        parent: document.body,
        className: "attachment-preview-overlay"
    });
    instance.data.imageZoomOverlay=imageZoomOverlay;
    instance.data.attachmentPreviewOverlay=attachmentPreviewOverlay;

	const addLogOnClick = (element, data) => {
		element.addEventListener("click", (e) => console.log({ e, data }));
	};
    
    function runAPIWorkFlow({workFlow,data}){
        const settings = {
            "url": baseURL+"api/1.1/wf/"+workFlow+"/",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify(data),
        };
        console.log({settings});
        $.ajax(settings).done(function (response) {
            console.log(response);
        });
    }

    function renderAvatar({renderRole,userRole,avatarData,style="round",showQuickGlanceOnClick=true,parentElement}){
    	//userRole: role of currentUser
        //renderRole: role of person in avatar
        const {avatarUser,avatarFullName,avatarID,avatarColor,avatarEmail}=avatarData;
        const className="avatar-element-"+style+"-"+avatarID;
        //eventually use users gmail avatar
        const avatarElement = elementAssembler({
            elementType:"span",
            parent:parentElement,
            className,
            innerHTML:avatarFullName.split(" ").map(nameString=>nameString[0]).join(""),
            title:avatarFullName
        });

        addLogOnClick(avatarElement,{avatarData});

        const sheet=getSheet();
        
        sheet.insertRule(
            `[class^="avatar-element"]{
            	border: 2px solid black;
                width: 30px;
                height: 30px;
				display:flex;
				align-items:center;
				justify-content:center;
			}`
        )

        sheet.insertRule(
            `[class^="avatar-element-round"]{
            	border-radius:50%;
        	}`
        )
        
        sheet.insertRule(
            `.${className}{
            	
        	}`
        )
        
    }
    
    function renderWorkerArea({userRole,availableWorkers,workerAmounts,parentElement}){
        console.log({userRole,availableWorkers,workerAmounts,parentElement});
        const sheet=getSheet();
        function renderSecondaryElement({userRole,parentElement}){
        	const workerAreaSecondaryContainer = elementAssembler({
                parent:parentElement,
                className: "worker-area-secondary-container"
            });
            const taskID=getTaskData("taskID");
            if(userRole==="Worker"){
                const thisWorker=context.currentUser.get("worker_custom_worker");
            	const thisWorkerID=thisWorker.get("_id");
                const thisWorkerAmount=workerAmounts.find(workerAmount=>workerAmount.workerID===thisWorkerID);
                if(thisWorkerAmount){
                	//request exists
                    const {requestedByDisplay,requestStatusDisplay,estimate,amount,paymentNumber,workerAmountID}=thisWorkerAmount;
                    const requestContainer = elementAssembler({
                        parent:workerAreaSecondaryContainer,
                        className: "request-container"
                    });
                    const requestTitle = elementAssembler({
                        parent:requestContainer,
                        className: "request-title",
                        innerHTML:"Request "+requestStatusDisplay
                    });
                    const requestEstimateContainer = elementAssembler({
                        parent:requestContainer,
                        className: "request-estimate-container"
                    });
                    const requestEstimateLabel = elementAssembler({
                        elementType:"span",
                        parent:requestEstimateContainer,
                        className: "request-estimate-label",
                        innerHTML:"Estimate:"
                    });
                    if(requestStatusDisplay==="Pending"&&requestedByDisplay==="Worker"){
                    	const requestEstimateInput = elementAssembler({
                            elementType:"input",
                            parent:requestEstimateContainer,
                            className: "request-estimate-input",
                            attributes:{
                                value:estimate,
                                type:"number"
                            }
                        });
                        const editRequestButton = elementAssembler({
                            elementType:"button",
                            parent:requestContainer,
                            className: "edit-request-button",
                            innerHTML:"Edit Request"
                        });
                        const cancelRequestButton = elementAssembler({
                            elementType:"button",
                            parent:requestContainer,
                            className: "cancel-request-button",
                            innerHTML:"Cancel Request"
                        });
                        editRequestButton.addEventListener('click',(e)=>{
                            const estimate=requestEstimateInput.value;
                            runAPIWorkFlow({workFlow:"edit_worker_amount",data:{
                                workerAmount:workerAmountID,
                                estimate,
                                cancel:false
                            }});
                            e.stopPropagation();
                            workerAreaContainer.customToggle();
                        });
                        cancelRequestButton.addEventListener('click',(e)=>{
                            runAPIWorkFlow({workFlow:"edit_worker_amount",data:{
                                workerAmount:workerAmountID,
                                estimate,
                                cancel:true
                            }});
                            e.stopPropagation();
                            workerAreaContainer.customToggle();
                        });
                    }else{
                    	const requestEstimateValue = elementAssembler({
                            elementType:"span",
                            parent:requestEstimateContainer,
                            className: "request-estimate-value",
                            innerHTML:estimate
                        });
                        if(requestStatusDisplay==="Canceled"&&requestedByDisplay==="Worker"){
                        	const resubmitRequestButton = elementAssembler({
                                elementType:"button",
                                parent:requestContainer,
                                className: "cancel-request-button",
                                innerHTML:"Resubmit Request"
                            });
                            resubmitRequestButton.addEventListener('click',(e)=>{
                                runAPIWorkFlow({workFlow:"edit_worker_amount",data:{
                                    workerAmount:workerAmountID,
                                    estimate,
                                    cancel:false
                                }});
                                e.stopPropagation();
                                workerAreaContainer.customToggle();
                            });
                        }
                    }
                    if(requestStatusDisplay==="Accepted"){
                    	const paymentContainer = elementAssembler({
                            parent:requestContainer,
                            className: "payment-container"
                        });
                        const paymentLabel = elementAssembler({
                            elementType:"span",
                            parent:paymentContainer,
                            className: "payment-label",
                            innerHTML:"Payment:"
                        });
                        const paymentAmount = elementAssembler({
                            parent:paymentContainer,
                            className: "payment-amount",
                            innerHTML:amount
                        });
                        const paymentNumberContainer = elementAssembler({
                            parent:requestContainer,
                            className: "payment-number-container"
                        });
                        const paymentNumberLabel = elementAssembler({
                            elementType:"span",
                            parent:paymentContainer,
                            className: "payment-number-label",
                            innerHTML:"Payment"
                        });
                        const paymentNumberValue = elementAssembler({
                            parent:paymentContainer,
                            className: "payment-number-value",
                            innerHTML:"#"+paymentNumber
                        });
                    }
                    
                    
                }else{
                	//create request
                    const requestContainer = elementAssembler({
                        parent:workerAreaSecondaryContainer,
                        className: "request-container"
                    });
                    const requestTitle = elementAssembler({
                        parent:requestContainer,
                        className: "request-title",
                        innerHTML:"New Request"
                    });
                    const requestEstimateContainer = elementAssembler({
                        parent:requestContainer,
                        className: "request-estimate-container"
                    });
                    const requestEstimateLabel = elementAssembler({
                        elementType:"span",
                        parent:requestEstimateContainer,
                        className: "request-estimate-label",
                        innerHTML:"Estimate:"
                    });
                    const requestEstimateInput = elementAssembler({
                        elementType:"input",
                        parent:requestEstimateContainer,
                        className: "request-estimate-input",
                        attributes:{
                            value:getTaskData("taskBudget"),
                            type:"number"
                        }
                    });
                    const submitRequestButton = elementAssembler({
                        elementType:"button",
                        parent:requestContainer,
                        className: "submit-request-button",
                        innerHTML:"Submit Request"
                    });
                    submitRequestButton.addEventListener('click',()=>{
                    	const estimate=requestEstimateInput.value;
                        const taskID=getTaskData("taskID");
                        console.log({estimate,taskID,thisWorkerID});
                        runAPIWorkFlow({workFlow:"create_worker_amount",data:{estimate,task:taskID,worker:thisWorkerID,requestedBy:"Worker"}});
                    });
                }
                
                
            }else if(userRole==="Admin"){
                const workerAmountsAssigned=[];
                const workerAmountsRequested=[];
                const workersToFilter=[];
                workerAmounts.forEach(workerAmount=>{
                	if(["Accepted","Confirmation Not Needed"].includes(workerAmount.requestStatusDisplay)){
                    	workerAmountsAssigned.push(workerAmount);
                    }else{
                    	workerAmountsRequested.push(workerAmount);
                    }
                    workersToFilter.push(workerAmount.workerID)
                })
                const workersAvailable=availableWorkers.filter(worker=>!workersToFilter.includes(worker.workerID));
                const assignedWorkersContainer = elementAssembler({
                    parent:workerAreaSecondaryContainer,
                    className: "assigned-workers-container"
                });
                const assignedWorkersHeader = elementAssembler({
                    parent:assignedWorkersContainer,
                    className: "assigned-workers-header",
                    innerHTML:`Assigned (${workerAmountsAssigned.length})`
                });
                const assignedWorkersBody = elementAssembler({
                    parent:assignedWorkersContainer,
                    className: "assigned-workers-body"
                });
                workerAmountsAssigned.forEach(workerAmount=>{
                	const {
                        workerUser,
                        workerFullName,
                        workerUserID,
                        workerAvatarColor,
                        workerEmail
                    }=workerAmount;
                    const assignedWorkerContainer = elementAssembler({
                        parent:assignedWorkersBody,
                        className: "assigned-worker-container"
                    });
                    const avatarData={
                        avatarUser:workerUser,
                        avatarFullName:workerFullName,
                        avatarID:workerUserID,
                        avatarColor:workerAvatarColor,
                        avatarEmail:workerEmail
                    }
                    renderAvatar({
                        avatarData,
                        userRole,
                        renderRole:"worker",
                        parentElement:assignedWorkerContainer
                    })
                    const assignedWorkerFullName = elementAssembler({
                        parent:assignedWorkerContainer,
                        className: "assigned-worker-full-name",
                        innerHTML:workerFullName
                    });
                });
                const requestedWorkersContainer = elementAssembler({
                    parent:workerAreaSecondaryContainer,
                    className: "requested-workers-container"
                });
                const requestedWorkersHeader = elementAssembler({
                    parent:requestedWorkersContainer,
                    className: "requested-workers-header",
                    innerHTML:`Requested (${workerAmountsRequested.length})`
                });
                const requestedWorkersBody = elementAssembler({
                    parent:requestedWorkersContainer,
                    className: "requested-workers-body"
                });
                workerAmountsRequested.forEach(workerAmount=>{
                	const {
                        workerUser,
                        workerFullName,
                        workerUserID,
                        workerAvatarColor,
                        workerEmail,
                        requestStatusDisplay,
                        requestByDisplay
                    }=workerAmount;
                    const requestedWorkerContainer = elementAssembler({
                        parent:requestedWorkersBody,
                        className: "requested-worker-container"
                    });
                    const requestedWorkerFirstLine = elementAssembler({
                        parent:requestedWorkerContainer,
                        className: "requested-worker-first-line"
                    });
                    const avatarData={
                        avatarUser:workerUser,
                        avatarFullName:workerFullName,
                        avatarID:workerUserID,
                        avatarColor:workerAvatarColor,
                        avatarEmail:workerEmail
                    }
                    renderAvatar({
                        avatarData,
                        userRole,
                        renderRole:"worker",
                        parentElement:requestedWorkerFirstLine,
                    })
                    const requestedWorkerFullName = elementAssembler({
                        parent:requestedWorkerFirstLine,
                        className: "requested-worker-full-name",
                        innerHTML:workerFullName
                    });
                    const requestedWorkerRespondToggle = elementAssembler({
                        elementType:"span",
                        parent:requestedWorkerFirstLine,
                        className: "requested-worker-respond-toggle",
                        innerHTML:"menu"
                    });
                    const requestedWorkerSecondLine = elementAssembler({
                        parent:requestedWorkerContainer,
                        className: "requested-worker-second-line"
                    });
                });
                
                sheet.insertRule(`
                    .requested-worker-container{
                        display: flex;
                        align-items: center;
                    }
                `)
                
                
                
                
                
                /*
                
                +Assigned
                	Worker1 Avatar FullName
                    	Amount
                        Estimate (Apply)
                        Budget (Apply)
                        Payment Status / Payment #
                        Remove Worker
                +Requests
                	Worker 2 Estimate Status
                    	Action (Cancel/Deny, Accept (Accept and Cancel/Deny Others), Message)
					Worker 3 Estimate Status
                    	Action (Cancel/Deny, Accept (Accept and Cancel/Deny Others), Message)  
				+Available
                	Worker 4
                    Worker 5
                
                Assigned Tab will show only assigned workers
                Will show Amount and an Input/Span depending if the payment has been created or not
                Estimate and Budget will only have an apply button in payment has not been created
                Remove Worker only if payment not applied
                
                Requests Tab will show all none accepted requests
                	Actions include Cancel or Deny, Accept (with the option to auto cancel/deny all other requests), Message Worker
                    If request is currently canceled/denied, will give the option to reactivate (set to pending)
                
                Available Tab will show all other workers who are available
				Will include option to add a worker with or without confirmation
                */
            }
            
            sheet.insertRule(`
                .worker-area-secondary-container{
					display:none;
                }
            `)
            
            sheet.insertRule(`
                .show .worker-area-secondary-container{
					display: block;
                    position: absolute;
                    z-index: 1;
                    background: white;
                    border: 1px solid black;
                    border-radius: 5px;
                    left: 0px;
                    width: max-content;
					min-width:100px;
					cursor:auto;
                }
            `)
            
            sheet.insertRule(`
                .request-container{
					display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 5px;
					margin: 10px;
					width:200px;
                }
            `)
            
            sheet.insertRule(`
                .request-estimate-container{
					display: flex;
                    justify-content:center;	
					gap:5px;
                }
            `)
            
            sheet.insertRule(`
                .request-estimate-input{
					width:100px;
                }
            `)
            
            sheet.insertRule(`
                .submit-request-button{
					margin-top:50px;
                }
            `)
            
            
            
        }

        const workerAreaContainer = elementAssembler({
            elementType:"span",
            parent:parentElement,
            className: "worker-area-container"
        });
        const isAdmin=userRole==="Admin";
        const isWorker=userRole==="Worker";
        const isStudent=userRole==="Student";
		const isAccepted=workerAmounts.some(workerAmount=>["Accepted","Confirmation Not Needed"].includes(workerAmount.requestStatusDisplay));
        const isPending=workerAmounts.some(workerAmount=>["Pending"].includes(workerAmount.requestStatusDisplay));
		let shouldRenderSecondary=true;
        let textToDisplay="";
        if(isAdmin){
            if(isAccepted||isPending){
                //render primary element
            	const avatarListContainer = elementAssembler({
                    elementType:"span",
                    parent:workerAreaContainer,
                    className: "avatar-list-container"
                }); 
                workerAmounts.forEach(workerAmount=>{
                    console.log({workerAmount});
                    const {
                        requestStatusDisplay,
                        workerUser,
                        workerFullName,
                        workerUserID,
                        workerAvatarColor,
                        workerEmail
                    }=workerAmount;
                    const avatarData={
                        avatarUser:workerUser,
                        avatarFullName:workerFullName,
                        avatarID:workerUserID,
                        avatarColor:workerAvatarColor,
                        avatarEmail:workerEmail
                    }
                    if(isPending){
                        //render square avatar
                        console.log("render square ",workerUser);
                        renderAvatar({
                            avatarData,
                            userRole,
                            renderRole:"worker",
                            parentElement:avatarListContainer,
                            style:"square"
                        })
                    }else if(isAccepted){
                        //render round avatar
                        taskIsAssigned=true;
                        console.log("render round ",workerUser);
                        renderAvatar({
                            avatarData,
                            userRole,
                            renderRole:"worker",
                            parentElement:avatarListContainer
                        })
                    }
                })
                //render secondary element
            }else{
                console.log(availableWorkers.length+" Available");
                textToDisplay=availableWorkers.length+" Available";
            }
        }
        if(isWorker){
            const thisWorker=context.currentUser.get("worker_custom_worker");
            const thisWorkerID=thisWorker.get("_id");
            const thisWorkerAmount=workerAmounts.find(workerAmount=>workerAmount.workerID===thisWorkerID);
            if(thisWorkerAmount){
                if(["Accepted","Confirmation Not Needed"].includes(thisWorkerAmount.requestStatusDisplay)){
                    console.log("Mine");
                    textToDisplay="Mine";
                }else{
                    console.log("Request "+thisWorkerAmount.requestStatusDisplay);
                    textToDisplay="Request "+thisWorkerAmount.requestStatusDisplay;
                }
            }else if(isAccepted){
                console.log("Not Mine");
                textToDisplay="Not Mine";
                shouldRenderSecondary=false;
            }else{
                console.log("Available");
                textToDisplay="Available";
            }
        }
        if(isStudent){
            if(isAccepted){
                //student && workerAmounts.length && at least one is not temp-> Worker Assigned
                console.log("Worker Assigned");
            }else{
                //student && workerAmounts.length === 0 || all or temp -> Looking for Worker
                console.log("Looking for Worker");
            }
        }
		if(textToDisplay){
        	const workerAreaText = elementAssembler({
                elementType:"span",
                parent:workerAreaContainer,
                className: "worker-area-text",
                innerHTML:textToDisplay
            });
        }
		if(shouldRenderSecondary){
        	renderSecondaryElement({userRole,parentElement:workerAreaContainer});
            addCustomToggle(workerAreaContainer);
            workerAreaContainer.classList.add("clickable");
        }

		sheet.insertRule(`
            .worker-area-container{
             	position:relative;   
		}`)

		sheet.insertRule(`
			.worker-area-container.clickable{
				cursor:pointer;
			}`)

        /*

        sheet.insertRule(`
            .task-type-picker-container{
                font-weight:700;
                position:relative;
            }
        `)
        
        sheet.insertRule(`
            .current-task-type-container-${currentTaskType.value}{
				display: inline-flex;
                padding: 5px;
                color:${currentTaskType.fgColor};
            	background:${currentTaskType.bgColor};
                border-radius: 5px;
                align-items: center;
            }
        `)
        
        sheet.insertRule(`
            .mini .current-task-type-container-${currentTaskType.value}{
                color:${currentTaskType.bgColor};
                align-items: center;
				background:unset;
            }
        `)

        sheet.addRule(
            `.task-types-container`,
            `display:none;
            `
        );

        sheet.insertRule(`
            [class^="task-type-container"]{
                display:flex;
                z-index:1;
                align-items:center;
            }
        `)

        sheet.insertRule(`
            [class^="task-type-icon"] {
                padding:4px;
            }
        `)


        sheet.insertRule(`
            [class^="task-type-display"] {
                flex: 1;
                padding: 0px 5px;
            }
        `)



        sheet.addRule(
            `.task-type-picker-container.show .task-types-container`,
            `display:block;
            position:absolute;
            z-index:2;
            background: white;
            border: 1px solid black;
            border-radius: 5px;
            left:0;
            width:max-content;
            `
        );

        sheet.addRule(
            `.task-type-icon`,
            `padding: 5px;
            border-radius: 5px;
            width: 1.875rem;
            height: 1.875rem;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            `
        );

                */
    }
    
    function renderTaskTypePicker({userRole,currentTaskTypeDisplay,style="block",parentElement,canEdit=true}){
        //not sure wheter I should even have containerAttributes
        //style can be block or mini
        const taskTypes=[
            {
                bgColor:"Blue",
                fgColor:"White",
                display:"Assignment",
                icon:"draft_orders",
                value:0
            },
            {
                bgColor:"Orange",
                fgColor:"Black",
                display:"Assessment",
                icon:"draft_orders",
                value:1
            },
            {
                bgColor:"Black",
                fgColor:"White",
                display:"Paper",
                icon:"draft_orders",
                value:2
            },
            {
                bgColor:"Green",
                fgColor:"White",
                display:"Excel",
                icon:"draft_orders",
                value:3
            },
            {
                bgColor:"Green",
                fgColor:"White",
                display:"Discussion",
                icon:"draft_orders",
                value:3
            },
            {
                bgColor:"Grey",
                fgColor:"White",
                display:"Not Set",
                icon:"draft_orders",
                value:4
            },
            {
                bgColor:"Grey",
                fgColor:"White",
                display:"Tutoring",
                icon:"draft_orders",
                value:4
            },
        ]

        const currentTaskType=taskTypes.filter(taskType => taskType.display === currentTaskTypeDisplay)[0];
        const sheet=getSheet();

        const taskTypePickerContainer = elementAssembler({
            elementType:"span",
            parent:parentElement,
            className: "task-type-picker-container "+style
        });
        
        if(userRole==="Admin"&&canEdit){
            addCustomToggle(taskTypePickerContainer);
            
            sheet.insertRule(`
                .task-type-picker-container{
                    cursor:pointer;
                }
            `)
            
        }
        
        
        const currentTaskTypeContainer = elementAssembler({
            elementType:"span",
            parent:taskTypePickerContainer,
            className: "current-task-type-container-"+currentTaskType.value+" "+style
        });

        const currentTaskTypeIcon = elementAssembler({
            elementType:"span",
            parent:currentTaskTypeContainer,
            className: "task-type-icon material-symbols-outlined",
            innerHTML:currentTaskType.icon
        });
        if(style==="block"){
            const currentTaskTypeDisplay = elementAssembler({
                elementType:"span",
                parent:currentTaskTypeContainer,
                className: "task-type-display",
                innerHTML:currentTaskType.display
            });
        }

        const taskTypesContainer = elementAssembler({
            parent:taskTypePickerContainer,
            className: "task-types-container"
        });
        taskTypes.forEach(taskType=>{
            const taskTypeContainer = elementAssembler({
                parent:taskTypesContainer,
                className: "task-type-container-"+taskType.value,
            });
            taskTypeContainer.addEventListener('click',()=>{
                instance.publishState("task_type_display",taskType.display);
                instance.triggerEvent("update_task_type");
            });
            const taskTypeIcon = elementAssembler({
                parent:taskTypeContainer,
                className: "task-type-icon-"+taskType.value+" material-symbols-outlined",
                innerHTML:taskType.icon,
            });
            const taskTypeDisplay = elementAssembler({
                parent:taskTypeContainer,
                className: "task-type-display-"+taskType.value,
                innerHTML:taskType.display,
            });

            sheet.insertRule(`
                .task-type-icon-${taskType.value},.task-type-display-${taskType.value}{
                    color:${taskType.bgColor};
                }
            `)

            sheet.insertRule(`
                .task-type-container-${taskType.value}:hover :is(.task-type-icon-${taskType.value},.task-type-display-${taskType.value}){
                    background:${taskType.bgColor};
                    color:${taskType.fgColor};
                }
            `)

        })

        sheet.insertRule(`
            .task-type-picker-container{
                font-weight:700;
                position:relative;
            }
        `)
        
        sheet.insertRule(`
            .current-task-type-container-${currentTaskType.value}{
				display: inline-flex;
                padding: 5px;
                color:${currentTaskType.fgColor};
            	background:${currentTaskType.bgColor};
                border-radius: 5px;
                align-items: center;
            }
        `)
        
        sheet.insertRule(`
            .mini .current-task-type-container-${currentTaskType.value}{
                color:${currentTaskType.bgColor};
                align-items: center;
				background:unset;
            }
        `)

        sheet.addRule(
            `.task-types-container`,
            `display:none;
            `
        );

        sheet.insertRule(`
            [class^="task-type-container"]{
                display:flex;
                z-index:1;
                align-items:center;
            }
        `)

        sheet.insertRule(`
            [class^="task-type-icon"] {
                padding:4px;
            }
        `)


        sheet.insertRule(`
            [class^="task-type-display"] {
                flex: 1;
                padding: 0px 5px;
            }
        `)



        sheet.addRule(
            `.task-type-picker-container.show .task-types-container`,
            `display:block;
            position:absolute;
            z-index:2;
            background: white;
            border: 1px solid black;
            border-radius: 5px;
            left:0;
            width:max-content;
            `
        );

        sheet.addRule(
            `.task-type-icon`,
            `padding: 5px;
            border-radius: 5px;
            width: 1.875rem;
            height: 1.875rem;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            `
        );


    }
    
    function renderStatusPicker({userRole,currentStatusDisplay,style="block",containerAttributes,parentElement,canEdit=true}){
        //not sure wheter I should even have containerAttributes
        //style can be block or mini
        const taskStatuses=[
        	{
                bgColor:"Grey",
                fgColor:"White",
                forRoles:['Admin','Student','Worker'],
                value:0,
                display:"Requested",
                icon:"draft_orders"
            },
            {
                bgColor:"Red",
                fgColor:"White",
                forRoles:['Admin','Worker'],
                value:1,
                display:"To Do",
                icon:"circle"
            },
            {
                bgColor:"Pink",
                fgColor:"Black",
                forRoles:['Admin','Worker'],
                value:2,
                display:"In Progress",
                icon:"pending"
            },
            {
                bgColor:"Green",
                fgColor:"Black",
                forRoles:['Admin','Worker'],
                value:3,
                display:"Complete (Review)",
                icon:"check_circle"
            },
            {
                bgColor:"Green",
                fgColor:"White",
                forRoles:['Admin'],
                value:4,
                display:"Complete",
                icon:"verified"
            }
        ]
        const userStatuses=taskStatuses.filter(status => status.forRoles.includes(userRole));
        const userStatusValues=userStatuses.map(status=>status.value);
        const maxIndex=userStatusValues.length-1;
        const currentStatus=taskStatuses.filter(status => status.display === currentStatusDisplay)[0];
        const currentStatusValue=currentStatus.value;
        //actual index in userStatuses array
        const currentStatusIndex=userStatusValues.findIndex(value => value===currentStatusValue);
        const nextStatusIndex=currentStatusIndex===maxIndex?maxIndex:currentStatusIndex+1;
        const lastStatusIndex=maxIndex;
        const nextStatus=userStatuses[nextStatusIndex];
        const lastStatus=userStatuses[lastStatusIndex];
        const sheet=getSheet();
        
        const statusPickerContainer = elementAssembler({
            elementType:"span",
            parent:parentElement,
            className: "status-picker-container "+style,
            attributes:containerAttributes
        });
        
        if((userRole==="Admin"||userRole==="Worker")&&canEdit){
            addCustomToggle(statusPickerContainer);

            sheet.insertRule(`
                .status-picker-container{
                    cursor:pointer;
                }
            `)
        }
        
        
        const currentStatusContainer = elementAssembler({
            elementType:"span",
            parent:statusPickerContainer,
            className: "current-status-container "+style
        });
        
        if(style==="mini"){
        	const miniStatusIndicator = elementAssembler({
                elementType:"span",
                parent:currentStatusContainer,
                className: "status-indicator mini material-symbols-outlined",
                innerHTML:currentStatus.icon
            });
        }else if(style==="block"){
        	const blockStatusIndicator = elementAssembler({
                elementType:"span",
                parent:currentStatusContainer,
                className: "status-indicator block",
                innerHTML:currentStatus.display
            });
        }
        
        const statusOptionsContainer = elementAssembler({
            parent:statusPickerContainer,
            className: "status-options-container"
        });
        userStatuses.forEach(status=>{
        	const statusOptionContainer = elementAssembler({
                parent:statusOptionsContainer,
                className: "status-option-container-"+status.value,
            });
            statusOptionContainer.addEventListener('click',()=>{
            	instance.publishState("status_display",status.display);
                instance.triggerEvent("update_task_status");
            });
            const statusOptionIndicator = elementAssembler({
                parent:statusOptionContainer,
                className: "status-option-indicator-"+status.value+" mini material-symbols-outlined",
                innerHTML:status.icon,
            });
            const statusOptionDisplay = elementAssembler({
                parent:statusOptionContainer,
                className: "status-option-display-"+status.value,
                innerHTML:status.display,
            });
            
            sheet.insertRule(`
                .status-option-indicator-${status.value},.status-option-display-${status.value}{
                    color:${status.bgColor};
                }
            `)
            
            sheet.insertRule(`
                .status-option-container-${status.value}:hover :is(.status-option-indicator-${status.value},.status-option-display-${status.value}){
                    background:${status.bgColor};
					color:${status.fgColor};
                }
            `)
            
        })
        
        sheet.insertRule(`
			.status-picker-container{
                font-weight:700;
				position:relative;
            }
		`)
        
        sheet.addRule(
            `.status-options-container`,
            `display:none;
            `
        );
        
        sheet.insertRule(`
			[class^="status-option-container"]{
                display:flex;
				z-index:1;
				align-items:center;
            }
		`)
        
        sheet.insertRule(`
			[class^="status-option-indicator"] {
                padding:4px;
            }
		`)
        
        
        sheet.insertRule(`
			[class^="status-option-display"] {
                flex: 1;
                padding: 0px 5px;
            }
		`)
        
        
        
        sheet.addRule(
            `.status-picker-container.show .status-options-container`,
            `display:block;
			position:absolute;
			z-index:1;
	        background: white;
            border: 1px solid black;
            border-radius: 5px;
			left:0;
			width:max-content;
            `
        );
        
        sheet.addRule(
            `.status-indicator`,
            `padding: ${style==="block"?"5":"2"}px;	
			color:${currentStatus.fgColor};
			background:${currentStatus.bgColor};
            border-radius: 5px;
            min-width: 70px;
            display: inline-block;
            text-align: center;
            `
        );
        
        sheet.addRule(
            `.status-indicator.mini`,
            `
			color:${currentStatus.fgColor};
            `
        );
        
        
    }
    
    function renderDueDatePicker({userRole,currentDueDate,parentElement,toStringStyle="style1",canEdit=true}){
    
        const sheet=getSheet();

        function dateToString(date){
            if(toStringStyle==="style1"){
                return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} 
						by ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`
            }
            if(toStringStyle==="style2"){
                return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} 
						by ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`
            }

        }

        const dueDatePickerContainer = elementAssembler({
            elementType:"span",
            parent:parentElement,
            className: "due-date-picker-container"
        });

        const dueDateText = elementAssembler({
            elementType:"span",
            parent:dueDatePickerContainer,
            className: "due-date-text",
            innerHTML:dateToString(currentDueDate)
        });
        
        if((userRole==="Admin"||userRole==="Student")&&canEdit){
        	const dueDateEditButton = elementAssembler({
                elementType:"span",
                parent:dueDatePickerContainer,
                className: "due-date-edit-button material-symbols-outlined",
                innerHTML:"edit_calendar"
            });

            const calendarContainer = elementAssembler({
                parent:dueDatePickerContainer,
                className: "calendar-container"
            });

            const dateInput = elementAssembler({
                elementType:"input",
                attributes:{
                    type:"datetime-local",
                    value:moment(currentDueDate).format("yyyy-MM-DDTHH:mm")
                },
                parent:calendarContainer,
                className: "date-input"
            });

            dueDateEditButton.addEventListener('click',()=>{
                addCustomToggle(dueDatePickerContainer,{className:"edit"})
                dateInput.focus();
            })

            dateInput.addEventListener('blur',(e)=>{
                if(e.target.value!==""){
                    const date=new Date(e.target.value);
                    console.log("change to this date: ",date);
                    const settings = {
                      "url": baseURL+"api/1.1/wf/change_task_due_date/",
                      "method": "POST",
                      "timeout": 0,
                      "headers": {
                        "Content-Type": "application/json"
                      },
                      "data": JSON.stringify({
                        "taskID":getTaskData("taskID"),
                        "date": date
                      }),
                    };
                    console.log({settings});
                    $.ajax(settings).done(function (response) {
                      console.log(response);
                    });
                    
                }
            })
        }
        
        sheet.insertRule(`
            .due-date-picker-container {
                display:inline-flex;
				align-items:center;
				padding:5px;
				position:relative;
            }
        `)
        
        sheet.insertRule(`
            .due-date-edit-button {
                visibility:hidden;
				cursor:pointer;
            }
        `)
        
        sheet.insertRule(`
            .due-date-picker-container:hover .due-date-edit-button {
                visibility:visible;
            }
        `)

        sheet.insertRule(`
            .calendar-container {
                display:none;
            }
        `)
        
        sheet.insertRule(`
            .edit .calendar-container {
                display:inline;
				position:absolute;
            }
        `)
        
        sheet.insertRule(`
            .edit :is(.due-date-text,.due-date-edit-button) {
                visibility:hidden;
            }
        `)


    }
    
    function renderColorPicker({colorsArray,labelElement,containerAttributes,defaultColor,parentElement,stateToUpdate,eventToTrigger}){
        //refactor this to use a custom element instead
        //create a custom event that fires when the color is changed
        
    	colorsArray??=[
            {label:"red",value:"#FF0A0E"},
            {label:"orange",value:"#FF800A"},
            {label:"yellow",value:"#FFFA0A"},
            {label:"green",value:"#0EFF0A"},
            {label:"cyan",value:"#0AFFFA"},
            {label:"baby blue",value:"#0A88FF"},
            {label:"blue",value:"#0A0EFF"},
            {label:"violet",value:"#800AFF"},
            {label:"pink",value:"#FA0AFF"}
        ];
        
        labelElement??= elementAssembler({
            className: "color-picker-label",
            innerHTML:"Color Picker"
        });
        
        const colorPickerContainer = elementAssembler({
            parent:parentElement,
            className: "color-picker-container",
            attributes:containerAttributes
        });
        
        colorPickerContainer.append(labelElement);
        
        const dataList = elementAssembler({
            elementType:"datalist",
            parent: colorPickerContainer,
            attributes:{
            	id:"color-options"
            }
        });
        
        colorsArray.forEach(color=>{
        	const colorOption = elementAssembler({
                elementType:"option",
                parent: dataList,
                attributes:{
                	value:color.value
                },
                innerHTML:color.label
            });
        });
        
        const colorPicker = elementAssembler({
            elementType:"input",
            parent: colorPickerContainer,
            className: "color-picker",
            attributes:{
        		type:"color",
                value:colorsArray[0].value,
                list:"color-options"
            }
        });
        
        
		colorPicker.value=defaultColor;
        
        colorPicker.addEventListener('change',(e)=>{
			console.log("new color chosen",e);
            instance.publishState(stateToUpdate,e.target.value);
			instance.triggerEvent(eventToTrigger);
        })
        
    }
    
    function download(dataurl, filename) {
      const link = document.createElement("a");
      link.href = dataurl;
      link.download = filename;
      link.click();
    }
    
    function showOnImageOverlay(src){
        instance.data.imageZoomOverlay.classList.add("visible");
        removeAllChildNodes(imageZoomOverlay);
        const imageElement=elementAssembler({
            elementType:"img",
            parent: imageZoomOverlay,
            attributes:{src}
        });
    }
    
    const renderAttachment = (item,hoverable) => {
        const {fileName,fileType,url}=item;
        const attachmentContainer = elementAssembler({
            elementType:"div",
            className: "attachment-container"
        });
        const attachmentFileType = elementAssembler({
            elementType:"img",
            parent: attachmentContainer,
            className: "attachment-file-type",
            attributes:{
                src:getIconFromFileType(fileType)
            }
        });
        const attachmentFileName = elementAssembler({
            elementType:"span",
            parent: attachmentContainer,
            className: "attachment-file-name",
            innerHTML:fileName,
            attributes:{contentEditable:false}
        });
        
       	if(hoverable){
        	const hoverableContainer = elementAssembler({
                parent: attachmentContainer,
                className: "attachment-hoverable-container",
            });
            const expandIcon = elementAssembler({
                elementType:"span",
                className: "material-symbols-outlined",
                innerHTML:"preview"
            });
            const downloadIcon = elementAssembler({
                elementType:"span",
                className: "material-symbols-outlined",
                innerHTML:"download"
            });
            switch(fileType){
                case "pdf":
                    hoverableContainer.append(expandIcon);
                    expandIcon.addEventListener('click',()=>{
                    	const attachmentPreviewOverlay=instance.data.attachmentPreviewOverlay;
                        attachmentPreviewOverlay.classList.add("visible");
                        removeAllChildNodes(attachmentPreviewOverlay);
                        const attachmentFrame=elementAssembler({
                            elementType:"object",
                            parent: attachmentPreviewOverlay,
                            attributes:{
                                data:url,
                                type:"application/pdf"
                            }
                        }); 
                    })
                    break;
                case "doc":
				case "docx":
                    hoverableContainer.append(downloadIcon);
                    downloadIcon.addEventListener('click',()=>{
                    	download(url,fileName);
                    })
                    break;
                case "png":
                case "jpeg":    
                    hoverableContainer.append(expandIcon);
                    expandIcon.addEventListener('click',()=>{
                    	showOnImageOverlay(url)
                    })
                    break;
                default:                    	
                    //console.log("default");
			}
            const deleteIcon = elementAssembler({
                elementType:"span",
                parent: hoverableContainer,
                className: "material-symbols-outlined",
                innerHTML:"delete"
            });
            deleteIcon.addEventListener('click',()=>{
            	const confirmation=confirm("Are you sure you want to delete "+fileName+"?");
				if(confirmation){
                    instance.publishState("delete_from","task_instructions");
                    instance.publishState("file_to_delete",url);
                    instance.triggerEvent("delete_file");
                }
            })
        }
        return attachmentContainer;
    }
    
    const getIconFromTaskType = (taskType) => {
    
    }
    
    const getIconFromFileType = (fileType) => {
        let iconURL="//meta.cdn.bubble.io/f1672788972817x999001454436777700/icons8-file-48.png";
    	switch (fileType){
            case "doc":
            case "docx":
                iconURL="//meta.cdn.bubble.io/f1672788511283x893944106351798400/icons8-microsoft-word-2019-50.png";
                break;
			case "pdf":
            	iconURL="//meta.cdn.bubble.io/f1672788519959x143056281952336000/icons8-pdf-50.png";
                break;
			case "ppt":
                iconURL;
                break;
		}
        
        return iconURL
    }

	const iconNames = {
		Assignment: "menu",
		Assessment: "assessment",
		Discussion: "words",
		Project: "words",
		Excel: "words",
		Paper: "words",
		Powerpoint: "words",
		"Not Set": "emergency_home",
	};
    
    const getFileDataFromURL = (url) => {
        const regexType = /(?<=\.)(\w{3,4})$/;
        const matchType = url.match(regexType);
        const fileType=matchType[0];
        const regexName = /([^/]+)\.[^/.]+$/;
		const matchName = url.match(regexName);
        const fileName=decodeURIComponent(matchName[0]);
        return {fileType,fileName};
    }

	const courseViewerContainer = instance.data.courseViewerContainer;
	removeAllChildNodes(courseViewerContainer);

	const currentUser = context.currentUser;
	const userFullName = currentUser.get("full_name_text");
	const userRole = currentUser.get("loggedinas_option_role")?.get("display");
    //Admin, Worker, or Student

	const getBeginningAndEndOfWeek = (date) => {
		const day = date.getDay();
		const prevMonday = new Date(date);
		prevMonday.setDate(date.getDate() - ((day + 6) % 7));
		const nextSunday = new Date(date);
		nextSunday.setDate(nextSunday.getDate() + (7 - day));
		return { prevMonday, nextSunday };
	};

	const dateGroups = {};

	const createDateGroup = (date) => {
		const { prevMonday, nextSunday } = getBeginningAndEndOfWeek(date);
		const prevMondayDateString = prevMonday.toLocaleDateString("en-US", {
			weekday: "short",
			month: "short",
			day: "numeric",
			year: "numeric",
		});
		const dateKey = prevMonday.toLocaleDateString("en-CA", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		});
		const nextSundayDateString = nextSunday.toLocaleDateString("en-US", {
			weekday: "short",
			month: "short",
			day: "numeric",
			year: "numeric",
		});
		if (!dateGroups.hasOwnProperty(dateKey)) {
			dateGroups[dateKey] = {
				begWeek: {
					dateString: prevMondayDateString,
					date: prevMonday,
				},
				endWeek: {
					dateString: nextSundayDateString,
					date: nextSunday,
				},
				tasks: {},
			};
		}
		return dateGroups[dateKey];
	};

	createDateGroup(new Date());

	function isEmpty(item) {
      return item === null || item === undefined;
    }

	function elementAssembler({
		attributes,
    	parent,
		className,
		elementType = "div",
		innerHTML,
		data,
		style,
	}){
		const newElement = document.createElement(elementType);
		if (!isEmpty(className)) {
			newElement.className = className;
		}
    	if (attributes) {
    		Object.keys(attributes).forEach((key) => {
				newElement.setAttribute(key,attributes[key]);
			});
		}
		if (!isEmpty(innerHTML)) {
			newElement.innerHTML = innerHTML;
		}
		if (data) {
			Object.keys(data).forEach((key) => {
				newElement.dataset[key] = data[key];
			});
		}
		if (parent) {
			parent.append(newElement);
		}
		if (style) {
			for (const [key, value] of Object.entries(style)) {
				newElement.style[key] = value;
			}
		}
        if(className==="request-estimate-value"){
    		console.log({
                attributes,
                parent,
                className,
                elementType,
                innerHTML,
                data,
                style,
            	newElement
            })
    	}
		return newElement;
	};

	const menuOptions = [
		{
			title: "Home",
			render: true,
			endURL: "/",
		},
		{
			title: "Syllabus",
			render: true,
			endURL: "/syllabus/",
		},
        {
			title: "Calendar",
			render: true,
			endURL: "/calendar/",
		},
		{
			title: "Login Info",
			render: true,
			endURL: "/login_info/",
		},
		{
			title: "Grades",
			render: true,
			endURL: "/grades/",
		},
		{
			title: "Attachments",
			render: true,
			endURL: "/attachments/",
		},
		{
			title: "Chat",
			render: true,
			endURL: "/chat/",
		},
		{
			title: "Task",
			render: false,
			endURL: "/task/",
		},
		{
			title: "Settings",
			render: true,
			endURL: "/settings/",
		},
	];

	if (properties.default_active_title) {
		instance.data.menuOptionIndex = menuOptions.findIndex(
			(option) => option.endURL === properties.default_active_title
		);
	}

    function getUserData(user,...args){
        const objToReturn={};
        if(args.includes("userID")){
            objToReturn.userID = user.get("_id");
        }
        if(args.includes("userEmail")){
            console.log({user});
            objToReturn.userEmail = user.get("email");
        }
        if(args.includes("userAvatarColor")){
            objToReturn.userAvatarColor = user.get("avatar_color_text");
        }
        if(args.includes("userFullName")){
            objToReturn.userFullName = user.get("full_name_text");
        }
        if(arguments.length===1){
        	return objToReturn[arguments[0]]
        }
        return objToReturn
    }

    function getStudentData(student,...args){
        const objToReturn={};
        if(args.includes("studentID")){
            objToReturn.studentID = student.get("_id");
        }
        if(args.includes("studentUser")){
            objToReturn.studentUser = student.get("user1_user");
        }
        if(arguments.length===1){
        	return objToReturn[arguments[0]]
        }
        return objToReturn
    }

    function getWorkerData(worker,...args){
        const objToReturn={};
        if(args.includes("workerID")){
            objToReturn.workerID = worker.get("_id");
        }
        if(args.includes("workerUser")){
            objToReturn.workerUser = worker.get("user1_user");
        }
        if(arguments.length===1){
        	return objToReturn[arguments[0]]
        }
        return objToReturn
    }

    function getTaskData(){
        const objToReturn={};
        const task=instance.data.task;
        const args=[...arguments];
        if(args.includes("taskName")){
            objToReturn.taskName = task.get("name_text");
        }
        if(args.includes("taskSubmitByDisplay")){
            let submitByRole = task.get("submit_by_option_submit_by");
            objToReturn.taskSubmitByDisplay = submitByRole?.get("display")||"Not Set";
        }
        if(args.includes("taskDueDate")){
            objToReturn.taskDueDate = task.get("due_date_date");
        }
        if(args.includes("taskID")){
            objToReturn.taskID = task.get("_id");
        }  
        if(args.includes("taskBudget")){
            objToReturn.taskBudget = task.get("budget_number");
        } 
        if(args.includes("taskInstructions")){
            objToReturn.taskInstructions = task.get("instructions_text");
        }
        if(args.includes("taskInstructionAttachments")){
            let taskInstructionAttachmentsList = task.get("instruction_attachments_list_file");
            objToReturn.taskInstructionAttachments=taskInstructionAttachmentsList?.get(0,taskInstructionAttachmentsList.length());
        }
        if(args.includes("taskStatusDisplay")){
            let taskStatus=task.get("task_status_option_task_status");
            objToReturn.taskStatusDisplay=taskStatus.get("display");
        }
        if(args.includes("taskTypeDisplay")){
            let taskType = task.get("task_type__option__option_task_type0");
            objToReturn.taskTypeDisplay=taskType?.get("display")||"Not Set";
        }
        if(args.includes("taskWorkerAmounts")){
            let taskWorkerAmountsList=task.get("worker_amounts_list_custom_worker_amount");
            let taskWorkerAmounts=taskWorkerAmountsList?.get(0,taskWorkerAmountsList.length())||[];
            objToReturn.taskWorkerAmounts=taskWorkerAmounts.map(workerAmount=>{
                //get stuff here
                //"expense_summary_custom_expense_summary"
                let workerAmountID=workerAmount.get("_id");
                let amount=workerAmount.get("amount_number");
                let estimate=workerAmount.get("estimate1_number");
                //let isTemp=workerAmount.get("is_temporary_boolean");
                let paymentStatus=workerAmount.get("payment_status_option_invoicing");
                let paymentStatusDisplay=paymentStatus?.get("display")||"Not Invoiced";
                let requestStatus=workerAmount.get("request_status_option_request_types");
                let requestStatusDisplay=requestStatus?.get("display")||"";
                let worker=workerAmount.get("worker_custom_worker");
                const {workerID,workerUser} = getWorkerData(
                    worker,
                    "workerID",
                    "workerUser"
                );
                const {userID:workerUserID,
                    userFullName:workerFullName,
                    userAvatarColor:workerAvatarColor,
                    userEmail:workerEmail
                } = getUserData(
                    workerUser,
                    "userID",
                    "userFullName",
                    "userAvatarColor",
                    "userEmail"
                )
                let requestedBy=workerAmount.get("requested_by_option_role");
                let requestedByDisplay=requestedBy?.get("display")||"Admin";
                return {
                    workerAmountID,
                    amount,
                    estimate,
                    paymentStatusDisplay,
                    requestStatusDisplay,
                    requestedByDisplay,
                    workerID,
                    workerUser,
                    workerUserID,
                    workerFullName,
                    workerAvatarColor,
                    workerEmail
                }
            })
        }
		if(arguments.length===1){
        	return objToReturn[arguments[0]]
        }
        return objToReturn
    }

    function getCourseData(){
        const objToReturn={};
        const course=instance.data.course;
        const args=[...arguments];
        if(args.includes("courseCode")||args.includes("courseType")||args.includes("courseAvailableWorkers")){
            objToReturn.courseType = course?.get("course_type1_custom_course");
            objToReturn.courseCode = objToReturn.courseType?.get("code_text");
            if(args.includes("courseAvailableWorkers")){
                let courseAvailableWorkersList = objToReturn.courseType?.get("workers_available_list_custom_worker");
                let courseAvailableWorkers = courseAvailableWorkersList?.get(0,courseAvailableWorkersList.length())||[];
                objToReturn.courseAvailableWorkers=courseAvailableWorkers.map(worker=>{
                    const {workerID,workerUser} = getWorkerData(
                        worker,
                        "workerID",
                        "workerUser"
                    );
                    const {userID:workerUserID,
                        userFullName:workerFullName,
                        userAvatarColor:workerAvatarColor,
                        userEmail:workerEmail
                    } = getUserData(
                        workerUser,
                        "userID",
                        "userFullName",
                        "userAvatarColor",
                        "userEmail"
                    )
                    return {
                        workerFullName,
                        workerUserID,
                        workerID,
                        workerAvatarColor,
                        workerEmail
                    }
                })
            }
        }
        if(args.includes("courseName")){
            objToReturn.courseName = course?.get("name_text");
        }
        if(args.includes("courseID")){
            objToReturn.courseID = course?.get("_id");
        }        
        if(args.includes("courseIsArchived")){
            objToReturn.courseIsArchived = course?.get("is_archived_boolean");
        }
        if(args.includes("courseColor")){
            objToReturn.courseColor=course?.get("color_text");
        }
        if(args.includes("courseStudent")||args.includes("courseStudentUser")||args.includes("courseStudentFullName")){
            objToReturn.courseStudent = course?.get("student_custom_student");
            objToReturn.courseStudentUser = objToReturn.courseStudent?.get("user1_user");
            objToReturn.courseStudentFullName = objToReturn.courseStudentUser?.get("full_name_text")||"";
        }
		if(arguments.length===1){
        	return objToReturn[arguments[0]]
        }
        return objToReturn
    }

	if (!instance.data.task && properties.task) {
        instance.data.task=properties.task;
	}

	if (!instance.data.course && properties.course) {
		instance.data.course = properties.course;
	}

	if (properties.tasks) {
		const tasks = properties.tasks;
		instance.data.allTasks = tasks.get(0, tasks.length());
	}
        
	
        
    let showDeleted=properties.show_deleted;
    let showArchived=properties.show_archived;

	instance.data.allTasks?.forEach((task, index) => {
		try {
			let taskGroup;
			const taskKey = task.get("_id");
			const isDeleted = task.get("deleted_boolean");
			const isArchived = task.get("is_archived_boolean");
			const dueDate = task.get("due_date_date");
			const createdDate = task.get("Created Date");
			const taskName = task.get("name_text");
			const taskType = task.get("task_type_custom_task_type");
			const taskTypeDisplay = taskType?.get("display_text")||"Not Set";
        
        	if(taskTypeDisplay==="Non-Task"){
        		return;//ignore Non-Tasks
        	}
        	if(!showDeleted&&isDeleted){
        		return;//ignore deleted tasks
        	}
        	if(!showArchived&&isArchived){
        		return;//ignore archived tasks
        	}
			const dateGroup = createDateGroup(dueDate);
			let taskStatus = task.get("task_status_option_task_status");
			taskStatus = taskStatus
				? {
						display: taskStatus.get("display"),
						value: taskStatus.get("value0"),
						bgColor: taskStatus.get("background_color"),
						fgColor: taskStatus.get("foreground_color"),
				  }
				: null;
        	if(!isDeleted&&taskStatus.value<4){
            	instance.data.courseIsArchivable=false;
            }
			if (dateGroup.tasks.hasOwnProperty(taskKey)) {
				taskGroup = dateGroup.tasks[taskKey];
			} else {
				taskGroup = {
					taskName,
					taskTypeDisplay,
					taskStatus,
					isDeleted,
					isArchived,
					dueDate,
					dueDateString: dueDate.toLocaleDateString("en-US", {
						day: "2-digit",
						month: "2-digit",
						year: "numeric",
					}),
				};
				dateGroup.tasks[taskKey] = taskGroup;
			}
		} catch (e) {}
	});

	const mainHeader = elementAssembler({
		parent: courseViewerContainer,
		className: "main-header",
	});

	const pageMenu = elementAssembler({
		parent: mainHeader,
		className: "page-menu material-symbols-outlined",
		innerHTML: "menu",
	});

	pageMenu.addEventListener("click", () => {
		menuContainer.classList.toggle("minimized");
	});

	const pageTitleContainer = elementAssembler({
		elementType: "ul",
		parent: mainHeader,
		className: "page-title-container",
	});

    const {
        courseID,
        courseCode,
        courseName,
    } = getCourseData(
        "courseID",
        "courseCode",
        "courseName",
    )
            
	if(userRole!=="Student"){
        const courseStudentFullName = getCourseData("courseStudentFullName");
    	const pageTitleStudent = elementAssembler({
            elementType: "li",
            parent: pageTitleContainer,
            className: "page-title"
        });

        const pageTitleStudentLink = elementAssembler({
            elementType: "a",
            parent: pageTitleStudent,
            className: "page-title-link",
            attributes:{
                href:
                    baseURL +
                    "course/" +
                    courseID+"/"
            },
            innerHTML: courseStudentFullName,
        });
    }

	const pageTitleCourse = elementAssembler({
		elementType: "li",
		parent: pageTitleContainer,
		className: "page-title"
	});     
        
	const pageTitleCourseLink = elementAssembler({
		elementType: "a",
		parent: pageTitleCourse,
		className: "page-title-link",
        attributes:{
            href:
                baseURL +
                "course/" +
                courseID+"/"
        },
		innerHTML: courseCode,
	});

	const courseViewerBody = elementAssembler({
		parent: courseViewerContainer,
		className: "course-viewer-body",
	});
        
	const leftContainer = elementAssembler({
		parent: courseViewerBody,
		className: "left-container",
	});

	const menuContainer = elementAssembler({
		elementType: "ul",
		parent: leftContainer,
		className: "menu-container",
	});

	menuOptions.forEach((item, index) => {
		if (item.render) {
			const menuItem = elementAssembler({
				elementType: "li",
				parent: menuContainer,
				className:
					"menu-item" +
					(instance.data.menuOptionIndex === index ? " active" : ""),
			});
			const menuItemLink = elementAssembler({
				elementType: "a",
        attributes:{
          href:
            baseURL +
            "course/" +
            courseID +
            item.endURL  
        },
				parent: menuItem,
				className: "menu-item-link",
				innerHTML: item.title,
			});
		}
	});

	const notLeftContainer = elementAssembler({
		parent: courseViewerBody,
		className: "not-left-container",
	});

	const middleContainer = elementAssembler({
		parent: notLeftContainer,
		className: "middle-container",
	});

	const rightContainer = elementAssembler({
		parent: notLeftContainer,
		className: "right-container",
	});

	const menuOptionIndex = instance.data.menuOptionIndex;

	const menuOption = menuOptions[menuOptionIndex];

	if (menuOption) {
		const pageTitle2 = elementAssembler({
			elementType: "li",
			parent: pageTitleContainer,
			className: "page-title",
			innerHTML: menuOption.title,
		});
	}

	if (menuOption?.title === "Home") {
		//Home
        //Course Title
        const courseHeaderContainer = elementAssembler({
        	elementType:"ul",
            parent: middleContainer,
            className: "course-header-container"
        });
		const courseHeaderCode = elementAssembler({
            elementType:"li",
            parent: courseHeaderContainer,
            className: "course-header-code",
            innerHTML: courseCode
        });
		const courseHeaderName = elementAssembler({
            elementType:"li",
            parent: courseHeaderContainer,
            className: "course-header-name",
            innerHTML: courseName
        });
		//group tasks by week
		Object.keys(dateGroups)
			.sort()
			.forEach((dateKey) => {
				const dateGroup = dateGroups[dateKey];
				const dateGroupContainer = elementAssembler({
					parent: middleContainer,
					className: "date-group-container",
				});
				const dateGroupHeader = elementAssembler({
					parent: dateGroupContainer,
					className: "date-group-header",
				});
				const dateGroupTitle = elementAssembler({
					elementType: "span",
					parent: dateGroupHeader,
					className: "date-group-title",
					innerHTML:
						dateGroup.begWeek.dateString +
						" - " +
						dateGroup.endWeek.dateString,
				});
				const dateGroupBody = elementAssembler({
					elementType: "ul",
					parent: dateGroupContainer,
					className: "date-group-body",
				});

				const dateKeys = Object.keys(dateGroup.tasks);
				if (dateKeys.length === 0) {
					const emptyGroup = elementAssembler({
						parent: dateGroupBody,
						className: "empty-group",
						innerHTML: "Nothing Due This Week!",
					});
				}

				dateKeys
					.sort((keyA, keyB) => {
						const dateA = dateGroup.tasks[keyA].dueDateString;
						const dateB = dateGroup.tasks[keyB].dueDateString;
						if (dateA > dateB) {
							return 1;
						}
						if (dateA < dateB) {
							return -1;
						}
						return 1;
					})
					.forEach((taskKey) => {
						const taskGroup = dateGroup.tasks[taskKey];
						const taskContainer = elementAssembler({
							elementType: "li",
							parent: dateGroupBody,
							className: "task-container",
						});
                    	renderTaskTypePicker({
                            userRole,
                            currentTaskTypeDisplay:taskGroup.taskTypeDisplay,
                            style:"mini",
                            parentElement:taskContainer,
                            canEdit:false
                        })
						const taskBody = elementAssembler({
							parent: taskContainer,
							className: "task-body",
						});
						const taskTitle = elementAssembler({
							elementType: "a",
							parent: taskBody,
							className: "task-title",
              attributes:{
                href:
                  baseURL +
                  "course/" +
                  courseID +
                  "/task/" +
                  taskKey
              },
							innerHTML: taskGroup.taskName,
						});
						const taskInfo = elementAssembler({
							parent: taskBody,
							className: "task-info",
						});
						const taskDueDate = elementAssembler({
							parent: taskInfo,
							className: "task-due-date",
							innerHTML: taskGroup.dueDate.toLocaleDateString(
								"en-US",
								{
									weekday: "short",
									month: "short",
									day: "numeric",
								}
							),
						});
						//const { fgColor, bgColor } = taskGroup.taskStatus;
						renderStatusPicker({
                            userRole,
                            currentStatusDisplay:taskGroup.taskStatus.display,
                            parentElement:taskInfo,
                            style:"small"
                        })
                        /*
						const taskStatus = elementAssembler({
							parent: taskInfo,
							className: "task-status status-",
							data: { statusKey: taskGroup.taskStatus.value },
							style: {
								color: fgColor,
								backgroundColor: bgColor,
								borderColor: bgColor,
							},
							innerHTML: taskGroup.taskStatus.display,
						});
                        */
						addLogOnClick(taskBody, taskGroup);
					});
			});
	} else if (menuOption?.title === "Task") {
        const courseAvailableWorkers = getCourseData("courseAvailableWorkers");
        const {
            task,
            taskType,
            taskName,
            taskDueDate,
            taskID,
            taskInstructions,
            taskInstructionAttachments,
            taskStatusDisplay,
            taskTypeDisplay,
            taskWorkerAmounts,
            taskSubmitByDisplay
        } = getTaskData(
            "task",
            "taskType",
            "taskName",
            "taskDueDate",
            "taskID",
            "taskInstructions",
            "taskInstructionAttachments",
            "taskStatusDisplay",
            "taskTypeDisplay",
            "taskWorkerAmounts",
            "taskSubmitByDisplay"
        );
		const taskContainer = elementAssembler({
			parent: middleContainer,
			className: "task-container single-task-view",
		});
		const taskTitle = elementAssembler({
            elementType:"h1",
			parent: taskContainer,
			className: "single-task-title",
			innerHTML: taskName,
		});
        const taskOverviewContainer = elementAssembler({
            elementType:"ul",
			parent: taskContainer,
			className: "task-overview-container"
		});
        const taskOverviewDueDateContainer = elementAssembler({
            elementType:"li",
			parent: taskOverviewContainer,
			className: "task-overview-item-container"
		});
        const taskOverviewDueDateLabel = elementAssembler({
            elementType:"span",
			parent: taskOverviewDueDateContainer,
			className: "task-overview-item-label",
            innerHTML:"Due"
		});
        const taskOverviewDueDateValue = elementAssembler({
            elementType:"span",
			parent: taskOverviewDueDateContainer,
			className: "task-overview-item"
		});
        renderDueDatePicker({
                userRole,
                currentDueDate:taskDueDate,
                parentElement:taskOverviewDueDateValue,
                toStringStyle:"style1"
		})
        const taskOverviewSubmissionContainer = elementAssembler({
            elementType:"li",
			parent: taskOverviewContainer,
			className: "task-overview-item-container"
		});
        const taskOverviewSubmissionLabel = elementAssembler({
            elementType:"span",
			parent: taskOverviewSubmissionContainer,
			className: "task-overview-item-label",
            innerHTML:"Submission"
		});
        const taskOverviewSubmissionValue = elementAssembler({
            elementType:"span",
			parent: taskOverviewSubmissionContainer,
			className: "task-overview-item",
            innerHTML: taskSubmitByDisplay
		});
        //start
        const taskOverviewWorkerContainer = elementAssembler({
            elementType:"li",
			parent: taskOverviewContainer,
			className: "task-overview-item-container"
		});
        const taskOverviewWorkerLabel = elementAssembler({
            elementType:"span",
			parent: taskOverviewWorkerContainer,
			className: "task-overview-item-label",
            innerHTML:"Worker"
		});
        const taskOverviewWorkerValue = elementAssembler({
            elementType:"span",
			parent: taskOverviewWorkerContainer,
			className: "task-overview-item"
		});
        renderWorkerArea({
            userRole,
            parentElement:taskOverviewWorkerValue,
            availableWorkers:courseAvailableWorkers,
            workerAmounts:taskWorkerAmounts
        })
        //finish
        
        const taskOverviewStatusContainer = elementAssembler({
            elementType:"li",
			parent: taskOverviewContainer,
			className: "task-overview-item-container"
		});
        const taskOverviewStatusLabel = elementAssembler({
            elementType:"span",
			parent: taskOverviewStatusContainer,
			className: "task-overview-item-label",
            innerHTML:"Status"
		});
        const taskOverviewStatusValue = elementAssembler({
            elementType:"span",
			parent: taskOverviewStatusContainer,
			className: "task-overview-item"
		});
        renderStatusPicker({
            userRole,
            currentStatusDisplay:taskStatusDisplay,
            parentElement:taskOverviewStatusValue
        })
        
        const taskOverviewTaskTypeContainer = elementAssembler({
            elementType:"li",
			parent: taskOverviewContainer,
			className: "task-overview-item-container"
		});
        const taskOverviewTaskTypeLabel = elementAssembler({
            elementType:"span",
			parent: taskOverviewTaskTypeContainer,
			className: "task-overview-item-label",
            innerHTML:"Type"
		});
        const taskOverviewTaskTypeValue = elementAssembler({
            elementType:"span",
			parent: taskOverviewTaskTypeContainer,
			className: "task-overview-item"
		});
        renderTaskTypePicker({
            userRole,
            currentTaskTypeDisplay:taskTypeDisplay,
            parentElement:taskOverviewTaskTypeValue
        })
             
        const taskInstructionsContainer = elementAssembler({
			parent: taskContainer,
			className: "task-instructions-container"+(instance.data.editing?" editing":"")
		});
        const taskInstructionsAttachmentArea = elementAssembler({
			parent: rightContainer,
			className: "task-instructions-attachment-area"+(instance.data.showAttachments?" show-attachments":"")
		});
        const taskInstructionsAttachmentsToggler = elementAssembler({
			parent: taskInstructionsAttachmentArea,
			className: "task-instructions-attachments-toggler",
            innerHTML:"Instructions Attachments ("+(taskInstructionAttachments?.length||0)+")"
		});
        taskInstructionsAttachmentsToggler.addEventListener('click',()=>{
            instance.data.showAttachments=!instance.data.showAttachments;
        	taskInstructionsAttachmentArea.classList.toggle("show-attachments");
        });
        const taskInstructionsHeader = elementAssembler({
			parent: taskInstructionsContainer,
			className: "task-instructions-header"
		});
        const taskInstructionsLabel = elementAssembler({
            elementType:"h2",
			parent: taskInstructionsHeader,
			className: "task-instructions-label",
            innerHTML: "Instructions"
		});
        if(userRole==="Admin"||userRole==="Student"){
            const editInstructionsButton = elementAssembler({
                elementType:"button",
                parent: taskInstructionsHeader,
                className: "edit-instructions-button",
                innerHTML: "Edit"
            });
            editInstructionsButton.addEventListener("click", () => {
                instance.data.editorInstance.disableReadOnlyMode('my_id');
                instance.data.editing=true;
                taskInstructionsContainer.classList.add("editing");
            });
        }
        const taskInstructionsArea = elementAssembler({
			parent: taskInstructionsContainer,
			className: "task-instructions-area"
		});
        imageZoomOverlay.addEventListener('click', () => {
        	imageZoomOverlay.classList.remove("visible");
        })
        const taskInstructionsEditor = elementAssembler({
			parent: taskInstructionsArea,
			className: "task-instructions-editor",
            innerHTML:taskInstructions
		});
        const taskInstructionsAttachmentContainer = elementAssembler({
			parent: taskInstructionsAttachmentArea,
			className: "task-instructions-attachment-container"
		});
        const attachmentsFeed=[];
        instance.data.attachmentPreviewOverlay=attachmentPreviewOverlay;
        attachmentPreviewOverlay.addEventListener('click', () => {
        	attachmentPreviewOverlay.classList.remove("visible");
        })
        
        taskInstructionAttachments?.forEach(url=>{
	        const {fileType,fileName} = getFileDataFromURL(url);
        	const item={id:'@'+fileName,fileName,fileType,url}//change id to use url instead of fileName if we ever learn how to customize the mention widget
	        attachmentsFeed.push(item);
        	taskInstructionsAttachmentContainer.append(renderAttachment(item,true));
        });
        const taskInstructionsUploadContainer = elementAssembler({
			parent: taskInstructionsAttachmentArea,
			className: "task-instructions-upload-container"
		});
		const taskInstructionsAttachButton = elementAssembler({
            elementType:"input",
            attributes:{
                type:"file",
                multiple:""
            },
			parent: taskInstructionsUploadContainer,
			className: "task-instructions-attach-button",
            innerHTML:"Attach Instructions"
		});
        const taskInstructionsUploadButton = elementAssembler({
            elementType:"button",
            attributes:{
                type:"submit",
                disabled:""
            },
			parent: taskInstructionsUploadContainer,
			className: "task-instructions-upload-button",
            innerHTML:"Upload Instruction File(s)"
		});
        taskInstructionsAttachButton.addEventListener('change',(e)=>{
            if(e.target.files.length){
            	taskInstructionsUploadButton.disabled=false;
            }else{
            	taskInstructionsUploadButton.disabled=true;
            }
        })
        
        
        taskInstructionsUploadButton.addEventListener('click',(e)=>{
            const myFiles=[];
			let filesAreReady = false
            const files=taskInstructionsAttachButton.files;
            
            const filePromises = Object.entries(files).map(item => {
				return new Promise((resolve, reject) => {
                	const [index, file] = item
                  	const reader = new FileReader();
                  	reader.readAsBinaryString(file);

                  	reader.onload = function(event) {
                    	// Convert file to Base64 string
                        // btoa is built int javascript function for base64 encoding
                        myFiles.push({
                            fileName:file.name,
                            contents:btoa(event.target.result)//`data:${file.type};base64,${btoa(event.target.result)}` I think we only need a base64 string, not a data URI
                        })
                        resolve()
                  	};

                  	reader.onerror = function() {
                    	console.log("couldn't read the file");
                    	reject()
            		};
                })
			})
            
            const fileURLs=[];
            Promise.all(filePromises)
          .then(() => {
            console.log("ready",{myFiles});
            //add a promise here
            const uploadPromises = myFiles.map(file => {
              return new Promise(function(resolve, reject) {
                const {fileName,contents}=file;
                const attachTo=task;//might completely get rid of this since it's not really necessary
                context.uploadContent(fileName, contents, (err,url)=>{
                  if (err) {
                    reject(err);
                  } else {
                      fileURLs.push(url);
                    resolve(url);
                  }
                }, attachTo);
              });
            });
            return Promise.all(uploadPromises);
          })
          .then(() => {
            //do this after promise resolves
			console.log({fileURLs});
			instance.publishState("attach_to","task_instructions");
			instance.publishState("attachments",fileURLs);
			instance.triggerEvent("attach_files");
            taskInstructionsAttachButton.value="";
            taskInstructionsUploadButton.classList.remove("visible");
          })
          .catch((error) => {
            console.log(error)
            console.log('something wrong happened')
          });
        })
        
        let editorInstance=instance.data.editorInstance;
        CKEDITOR.ClassicEditor.create(taskInstructionsEditor,{
            toolbar: {
                items: [
                    'bold', 'italic', 'strikethrough', 'underline', 'code', 'subscript', 'superscript', 'removeFormat', '|',
                    'bulletedList', 'numberedList', 'todoList', '|',
                    'outdent', 'indent', '|',
                    'undo', 'redo',
                    '-',
                    'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', 'highlight', '|',
                    'alignment', '|',
                    'link', 'insertImage', 'blockQuote', 'insertTable', 'mediaEmbed', '|',
                    'specialCharacters', 'horizontalLine', 'pageBreak', '|',
                ],
                shouldNotGroupWhenFull: true
            },
            // Changing the language of the interface requires loading the language file using the <script> tag.
            // language: 'es',
            list: {
                properties: {
                    styles: true,
                    startIndex: true,
                    reversed: true
                }
            },
            // https://ckeditor.com/docs/ckeditor5/latest/features/headings.html#configuration
            heading: {
                options: [
                    { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                    { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                    { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                    { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
                    { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
                    { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
                    { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
                ]
            },
            // https://ckeditor.com/docs/ckeditor5/latest/features/editor-placeholder.html#using-the-editor-configuration
            placeholder: 'Insert instructions here...',
            // https://ckeditor.com/docs/ckeditor5/latest/features/font.html#configuring-the-font-family-feature
            fontFamily: {
                options: [
                    'default',
                    'Arial, Helvetica, sans-serif',
                    'Courier New, Courier, monospace',
                    'Georgia, serif',
                    'Lucida Sans Unicode, Lucida Grande, sans-serif',
                    'Tahoma, Geneva, sans-serif',
                    'Times New Roman, Times, serif',
                    'Trebuchet MS, Helvetica, sans-serif',
                    'Verdana, Geneva, sans-serif'
                ],
                supportAllValues: true
            },
            // https://ckeditor.com/docs/ckeditor5/latest/features/font.html#configuring-the-font-size-feature
            fontSize: {
                options: [ 10, 12, 14, 'default', 18, 20, 22 ],
                supportAllValues: true
            },
            // Be careful with the setting below. It instructs CKEditor to accept ALL HTML markup.
            // https://ckeditor.com/docs/ckeditor5/latest/features/general-html-support.html#enabling-all-html-features
            htmlSupport: {
                allow: [
                    {
                        name: /.*/,
                        attributes: true,
                        classes: true,
                        styles: true
                    }
                ]
            },
            // Be careful with enabling previews
            // https://ckeditor.com/docs/ckeditor5/latest/features/html-embed.html#content-previews
            htmlEmbed: {
                showPreviews: true
            },
            image: {
                insert: {
                    type:'inline' // settings for "insertImage" view goes here
                }
            },
            // https://ckeditor.com/docs/ckeditor5/latest/features/link.html#custom-link-attributes-decorators
            link: {
                decorators: {
                    addTargetToExternalLinks: true,
                    defaultProtocol: 'https://',
                    toggleDownloadable: {
                        mode: 'manual',
                        label: 'Downloadable',
                        attributes: {
                            download: 'file'
                        }
                    }
                }
            },
            // https://ckeditor.com/docs/ckeditor5/latest/features/mentions.html#configuration
            mention: {
                feeds: [
                    {
                        marker: '@',
                        feed: attachmentsFeed,
                        minimumCharacters: 0,
                        itemRenderer: renderAttachment
                    }
                ]
            },
            // The "super-build" contains more premium features that require additional configuration, disable them below.
            // Do not turn them on unless you read the documentation and know how to configure them and setup the editor.
            removePlugins: [
                // These two are commercial, but you can try them out without registering to a trial.
                // 'ExportPdf',
                // 'ExportWord',
                'CKFinder',
                'EasyImage',
                // This sample uses the Base64UploadAdapter to handle image uploads as it requires no configuration.
                // https://ckeditor.com/docs/ckeditor5/latest/features/images/image-upload/base64-upload-adapter.html
                // Storing images as Base64 is usually a very bad idea.
                // Replace it on production website with other solutions:
                // https://ckeditor.com/docs/ckeditor5/latest/features/images/image-upload/image-upload.html
                // 'Base64UploadAdapter',
                'RealTimeCollaborativeComments',
                'RealTimeCollaborativeTrackChanges',
                'RealTimeCollaborativeRevisionHistory',
                'PresenceList',
                'Comments',
                'TrackChanges',
                'TrackChangesData',
                'RevisionHistory',
                'Pagination',
                'WProofreader',
                // Careful, with the Mathtype plugin CKEditor will not load when loading this sample
                // from a local file system (file://) - load this site via HTTP server if you enable MathType
                'MathType'
            ]
        }).then( newEditor => {
            const toolbarElement = newEditor.ui.view.toolbar.element;
            newEditor.on( 'change:isReadOnly', ( evt, propertyName, isReadOnly ) => {
                instance.data.editing=!isReadOnly;
                if ( isReadOnly ) {
                    toolbarElement.style.display = 'none';
                } else {
                    toolbarElement.style.display = 'flex';
                }
            } );
            if(!instance.data.editing){
            	newEditor.enableReadOnlyMode('my_id');
            }
            instance.data.editorInstance=newEditor;
            const instructionImages=document.querySelectorAll(".ck-editor img");
            [...instructionImages].forEach(image => {
                image.addEventListener('click', () => {
                    if(!instance.data.editing){
                    	showOnImageOverlay(image.src);
                    }
                })
            })
        }).catch(error => {
            console.error( error );
        });
        
        
        const saveInstructionsButton = elementAssembler({
            elementType:"button",
			parent: taskInstructionsArea,
			className: "save-instructions-button",
            innerHTML: "Save Changes"
		});
        saveInstructionsButton.addEventListener("click", () => {
            instance.publishState("new_instructions",instance.data.editorInstance.getData());
            taskInstructionsContainer.classList.remove("editing");
            instance.data.editorInstance.enableReadOnlyMode('my_id');
            instance.triggerEvent("update_instructions");
        });
        
	}else if(menuOption?.title==="Settings"){
		const courseColor=getCourseData("courseColor");
		const settingsContainer = elementAssembler({
			className: "course-settings-container",
            parent:middleContainer,
            innerHTML:"<p>Should VIP or Student turn in assignments?</p><p>Other settings</p>"
		}); 
		const archiveSettingsContainer = elementAssembler({
            className: "archive-settings-container",
            parent:settingsContainer
        }); 
		if(instance.data.courseIsArchivable){
            const archiveSettingsButton = elementAssembler({
                elementType:"button",
                className: "archive-settings-button",
                parent:archiveSettingsContainer,
                innerHTML:"Archive Course"
            });    
            archiveSettingsButton.addEventListener('click',()=>{
                instance.triggerEvent("attempt_to_archive_course");
            })
        }else{
        	const archiveSettingsInvalid = elementAssembler({
                className: "archive-settings-invalid",
                parent:settingsContainer,
                innerHTML:"This course cannot be archived"
            }); 
        }
        const labelElement = elementAssembler({
			className: "course-color-label",
            innerHTML: "Course Color"
		});     
        const stateToUpdate="color";
        const eventToTrigger="update_course_color";
        renderColorPicker({
            labelElement,
            defaultColor:courseColor,
            parentElement:settingsContainer,
            stateToUpdate,
            eventToTrigger
        });
        
        
    }else{
    	if(menuOptionIndex>-1){
        	const pendingAreaElement = elementAssembler({
			parent:middleContainer,
			className: "pending-area-element",
            innerHTML: "This page has not yet been developed. Be patient, we'll be here one day soon!"
		});  
        }
    }
            
            /*

	const sheet = (function () {
		// Create the <style> tag
		let style =
			document.querySelector("style.tasks-viewer-style") ||
			document.createElement("style");
		style.className = "tasks-viewer-style";

		// Add a media (and/or media query) here if you'd like!
		// style.setAttribute("media", "screen")
		// style.setAttribute("media", "only screen and (max-width : 1024px)")

		// Add the <style> element to the page
		document.head.appendChild(style);

		return style.sheet;
	})();
    
    */
            
	const sheet = getSheet();
            
	sheet.addRule(
		`:root`,
		`--smallFontSize: 0.75rem;
        --defaultCourseColor:#f06291;;
        --defaultGreyColor:#6b7780;
        --statusColor0:grey;
        --statusColor1:red;
        --statusColor2:pink;
        --statusColor3:green;
        --statusColor4:green;
        --menuActiveColor:#003b5a;
  `
	);

	sheet.addRule(`*`, 
		`box-sizing:border-box;
		`
	);

	sheet.addRule(
		`.material-symbols-outlined`,
		`font-variation-settings:
      'FILL' 0,
      'wght' 400,
      'GRAD' 0,
      'opsz' 48`
	);

	sheet.addRule(
		`.course-viewer-container`,
		`padding: 0 20px;
        width:100%;
        height:100vh;
        overflow-y:scroll;
		font-family: "Atkinson Hyperlegible", Arial, sans-serif;
  `
	);

	sheet.addRule(
		`.main-header`,
		`position: sticky;
      display: flex;
  z-index:1;
      height: 60px;
      top: 0px;
  background:white;
      border-bottom:1px solid var(--defaultGreyColor);
  align-items: center;
  `
	);

	sheet.addRule(
		`.page-title`,
		`
      font-size: 20px;
      display: flex;
      align-items: center;
  `
	);

	sheet.addRule(
		`.page-title:not(:last-of-type):after`,
		`
      content: ">";
      display: inline-block;
      margin: 0 9px;
      font-size:15px;
  `
	);

	sheet.addRule(
		`.page-menu`,
		`
      font-size: 30px;
  cursor:pointer;
  `
	);

	sheet.addRule(
		`.page-title-container`,
		`
      font-size: 25px;
      display: flex;
  padding:0;
  `
	);

	sheet.addRule(
		`.course-viewer-body`,
		`display:flex;
  `
	);

	sheet.addRule(
		`.course-viewer-container.large-screen .course-viewer-body`,
		`
  `
	);

	sheet.addRule(
		`.course-viewer-container .menu-container`,
		`position: sticky;
        top: 60px;
        max-height: 100vh;
        overflow-y: auto;
        overscroll-behavior-y: contain;
        width:200px;
  `
	);

	sheet.addRule(
		`.course-viewer-container .menu-container.minimized`,
		`display:none;
  `
	);

	sheet.addRule(
		`.course-viewer-container.small-screen .menu-container,.course-viewer-container.small-screen .main-header`,
		`display:none;
  `
	);
            
	sheet.addRule(
		`.menu-item`,
		`
        height: 30px;
        line-height: 30px;
        margin: 5px;
        padding: 0px 5px;
        font-size: 18px;
        border-radius: 3px;
		cursor:pointer;
  		`
	);

	sheet.addRule(
		`.menu-item.active`,
		`background:var(--menuActiveColor);
		font-weight:bold;
  color:white;
  `
	);

	sheet.addRule(
		`.menu-item:hover:not(.active)`,
		`background:var(--defaultHeaderColor);
		font-weight:bold;
  color:white;
  `
	);

	sheet.addRule(
		`.menu-item:hover a`,
		`text-decoration:none;
  `
	);

	sheet.addRule(
		`.menu-item-link`,
		`display:block;
  `
	);

	sheet.addRule(
		`.active-title-container:after`,
		`display:block;
  visibility:visible;
  content:"${getCourseData("courseCode")}";
  transform: translateY(-50%);
  `
	);

	sheet.addRule(
		`.active-title-container`,
		`visibility:hidden;
  `
	);

	sheet.addRule(
		`.not-left-container`,
		`flex: 1;
  `
	);

	sheet.addRule(
		`.course-viewer-container.large-screen .not-left-container`,
		`display: flex;
  `
	);

	sheet.addRule(
		`.middle-container`,
		`flex:1;
		margin:10px;
  `
	);

	sheet.addRule(
		`.right-container`,
		`
  margin:10px;
  `
	);

	sheet.addRule(
		`.course-header-container`,
		`list-style:none;
		padding:0;	
		font-size:25px;
		margin: 1.5rem 0;
  `
	);

	sheet.addRule(
		`.course-header-container li`,
		`display:inline-block;
  `
	);

	sheet.addRule(
		`.course-header-container :last-child:before`,
		`content: "|";
    width: 25px;
    display: inline-block;
    text-align: center;
  `
	);

	sheet.addRule(
		`.date-group-container`,
		`border: 1px solid var(--defaultGreyColor);
      border-radius: 3px;
      padding: 0.8rem 1.1rem 1rem 1.1rem;
      margin-bottom:2rem;
      background-color: #fcfcfc;
  `
	);

	sheet.addRule(
		`.date-group-header`,
		`margin-top: 0;
      border: 0;
      background-color: transparent;
      align-items: center;
      padding: 12px 6px;
      position: relative;
      display: flex;
      flex-wrap: wrap;
  `
	);

	sheet.addRule(
		`.date-group-title`,
		`font-size: 1.275rem;
      font-family: "Atkinson Hyperlegible",Arial,sans-serif;
      font-weight: 700;
      letter-spacing: 0.1px;
      text-shadow: none;
      margin-top: -0.8rem;
      padding: 0.75em 0 0.25em;
      border-bottom: 1px solid transparent;
      color: black;
    
  `
	);

	sheet.addRule(
		`.date-group-body`,
		`list-style:none;
  padding:0;
      font-family: "Atkinson Hyperlegible",Arial,sans-serif;
  `
	);

	sheet.addRule(
		`.date-group-body .task-container`,
		`display: flex;
  align-items: center;
      padding: 12px 6px 12px 10px;
      border: 1px solid var(--defaultGreyColor);
  `
	);

	sheet.addRule(
		`.task-body`,
		`flex:1;
		margin:0 12px;
		height:40px;
        width: 100px;
		display: flex;
        flex-direction: column;
        justify-content: space-between;
  `
	);

	sheet.addRule(
		`.task-title`,
		`
		font-size: 120%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 120%;
  `
	);

	sheet.addRule(
		`.task-info`,
		`display:flex;
  `
	);

	sheet.addRule(
		`.task-due-date`,
		`
		font-size: .75rem;
        margin-top: 5px;
        width:80px;
        color: var(--defaultGreyColor);
  `
	);

	sheet.addRule(
		`[class*="task-status"]`,
		`display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 5px;
        padding: 2px;
        margin: 0 20px;
        border:1px solid;
        font-weight: 700;
        white-space:nowrap;
  `
	);

	sheet.addRule(
		`.empty-group`,
		`
  height: 150px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 30px;
      border: 1px solid black;
  `
	);
            
	//
	//SINGLE TASK VIEW
	//
	//
	//SINGLE TASK VIEW
	//
	//
	//SINGLE TASK VIEW
	//
	//
	//SINGLE TASK VIEW
	//
	//
	//SINGLE TASK VIEW
	//
	//
	//SINGLE TASK VIEW
	//
	//task container for single task view
	sheet.addRule(
		`.task-container.single-task-view`,
		`//all:revert
  `
	);
            
	sheet.addRule(
		`.single-task-view .task-title`,
		`
		`
	);

	sheet.addRule(
		`h1`,
		`font-size: 38px;
		font-weight:bold;
		`
	);

	sheet.addRule(
		`h2`,
		`font-size: 30px;
		font-weight:bold;
		`
	);

	sheet.addRule(
		`.task-overview-container`,
		`list-style: none;
        box-sizing: border-box;
        border-top: 1px solid var(--defaultGreyColor);
        border-bottom: 1px solid var(--defaultGreyColor);
        padding: 12px 0;
        margin: 0 0 18px 0;
		line-height: 2rem;
  `
	);
            
            
            
	sheet.addRule(
		`.task-overview-item-container`,
		`display:inline-flex;
		align-items:center;
    	padding-left: 1.2rem;

  `
	);
            
	sheet.addRule(
		`.task-overview-item-label`,
		`font-weight:bold;
		padding-right:0.5em;
  `
	);
            
	sheet.addRule(
		`.task-overview-item`,
		`padding-right:2em;
  `
	);

	sheet.addRule(
		`.task-instructions-header`,
		`display:flex;
        margin-top:24px;   
		`
	);

	sheet.addRule(
		`.task-instructions-label`,
		`margin-right:10px;
		`
	);

	sheet.addRule(
		`     
         .save-instructions-button,
         .editing .task-instructions-text,
         .editing .edit-instructions-button`,
		`display:none;
        `
	);

	sheet.addRule(
		`input[type=file]::-webkit-file-upload-button`,
		`display:inline-block;
        `
	);

	sheet.addRule(
		`.ck-editor__main .ck-read-only`,
		`border:none;
        `
	);

	sheet.addRule(
		`.ck-content`,
		`min-height: 100px;
		word-break: break-word;
        `
	);

	sheet.addRule(
		`.ck-content.ck-read-only`,
		`min-height: 0px;
        `
	);

	sheet.addRule(
		`.editing .task-instructions-editor,
        .editing .save-instructions-button`,
		`display:block;
        `
	);

	sheet.addRule(
		`.editing .task-instructions-area .ck-editor`,
		`display:block;
        `
	);

	sheet.addRule(
		`.ck-content.ck-read-only img`,
		`max-width: 100%;
        height: auto;
        border: 2px solid black;
        border-radius: 10px;
        `
	);

	sheet.addRule(
		`.ck-content.ck-read-only img:hover`,
		`filter:brightness(75%);
        `
	);

	sheet.addRule(
		`.task-instructions-attachments-toggler`,
		`font-size: 18px;
    	font-weight: bold;
        `
	);

	sheet.addRule(
		`.task-instructions-attachments-toggler:before`,
		`content:"Show ";
        `
	);

	sheet.addRule(
		`.show-attachments .task-instructions-attachments-toggler:before`,
		`content:"Hide ";
        `
	);
	
	sheet.addRule(
		`.task-instructions-attachment-container, .task-instructions-upload-container`,
		`display: none;
        `
	);

	sheet.addRule(
		`.show-attachments .task-instructions-attachment-container`,
		`display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        min-height: 75px;
        width: 100%;
		border:1px solid black;
		margin:5px 0;
        `
	);

	sheet.addRule(
		`.show-attachments .task-instructions-upload-container`,
		`display: flex;
        flex-direction: column;
		gap:5px;
        `
	);

	sheet.addRule(
		`.attachment-container`,
		`position:relative;
		display:inline-flex;
		align-items: center;
		width:fit-content;
        `
	);

	sheet.addRule(
		`.attachment-file-type`,
		`width:20px;
        `
	);

	sheet.addRule(
		`.attachment-file-name`,
		`
        `
	);

	sheet.addRule(
		`.attachment-hoverable-container`,
		`display:none;
        `
	);

	sheet.addRule(
		`.attachment-container:hover .attachment-hoverable-container, .attachment-hoverable-container:hover`,
		`position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        background: #ececec;
        padding: 2px;
        `
	);

	sheet.addRule(
		`.task-instructions-attach-button`,
		`
  		`
	);

	sheet.addRule(
		`.task-instructions-upload-button`,
		`width:fit-content;
		margin-right: 5px;
  		`
	);

	sheet.addRule(
		`.task-instructions-upload-button.visible`,
		`display:inline-block;
  		`
	);
            
   sheet.addRule(
		`.image-zoom-overlay, .attachment-preview-overlay`,
		`position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: none;
		z-index:1;    
        `
	);

	sheet.addRule(
		`.image-zoom-overlay.visible, .attachment-preview-overlay.visible`,
		`display: flex;
        align-items: center;
        justify-content: center;
        `
	);
            
	sheet.addRule(
		`.image-zoom-overlay img, .attachment-preview-overlay object`,
		`height: 90%;
        width: 90%;
        object-fit: contain;
        `
	);
   

	
            
    


};