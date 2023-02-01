let fun = function(instance, properties, context) {
    
    let baseURL="https://app.viphomework.com/";
    if(window.location.href.includes("version-test")){
    	baseURL+="version-test/";   
	}
    
    //helper functions and objects
    function removeAllChildNodes(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }
    
    const currentUser=context.currentUser;
	instance.data.userRole=currentUser.get("loggedinas_option_role")?.get("display");
    
    const dateGroups={};
    const today=new Date();
    const todayDateKey=today.toLocaleDateString('en-CA', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    const todayDateString=today.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    dateGroups[todayDateKey]={
        dateString:todayDateString,
        dueDate:today,
        studentGroups:{}   
    }
    
    let todaysDateGroup;

	function getURLParam(param){
        //returns string - if param doesnt exist, returns null
		return new URL(window.location.href).searchParams.get(param);
    }

	function setURLParam(param,value){
        //param: completed, archived, deleted
        const currentURL = new URL(window.location.href)
        currentURL.searchParams.set(param,value);
    	window.location.href = currentURL.href;
    }

	const classID=instance.data.classID;
    const taskViewerContainer=instance.data.taskViewerContainer;
    removeAllChildNodes(taskViewerContainer);
    let allTasks;
    
    let minimizeCompleted=properties.minimize_completed;
	let showCompleted=properties.show_completed||minimizeCompleted;
    let showDeleted=properties.show_deleted;
    let showArchived=properties.show_archived;

    if(properties.all_tasks){
        const {all_tasks}=properties;
        allTasks=all_tasks.get(0,all_tasks.length());
    }
    
    allTasks.forEach((task,index) => {
        try{
            let dateGroup, studentGroup, courseGroup, timeGroup, statusGroup,taskGroup;
            
            const isDeleted=task.get("deleted_boolean");
            const isArchived=task.get("is_archived_boolean");
            const status=task.get("task_status_option_task_status");
            const statusKey=status.get("value0");
            const statusComplete=(statusKey>=3);
            
            if(!showArchived&&isArchived){
            	return;//this task is archived - ignore it
            }
            
            if(!showDeleted&&isDeleted){
            	return;//this task is deleted - ignore it
            }
            
            if(!showCompleted&&statusComplete){
            	return;//this task is complete - ignore it
            }

            //date stuff
            const dueDate=task.get("due_date_date");
            const dateKey=dueDate.toLocaleDateString('en-CA', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            const dateString=dueDate.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
            if(dateGroups.hasOwnProperty(dateKey)){
                dateGroup=dateGroups[dateKey];
            }else{
                dateGroup={
                    dateString,
                    dueDate,
                    studentGroups:{}   
                }
                dateGroups[dateKey]=dateGroup;
            }

            //student stuff

            const student=task.get("student_custom_student");
            const studentKey=student.get("_id");
            const studentUser=student.get("user1_user");
            const fullName=studentUser.get("full_name_text");

            if(dateGroup.studentGroups.hasOwnProperty(studentKey)){
                studentGroup=dateGroup.studentGroups[studentKey];
            }else{
                studentGroup={
                    student,
                    studentUser,
                    fullName,
                    courseGroups:{}
                }
                dateGroups[dateKey].studentGroups[studentKey]=studentGroup;
            }

            //course stuff

            const course=task.get("course1_custom_course1");
            const courseKey=course.get("_id");
            const courseName=course.get("name_text");
            const courseCode=course.get("course_type1_custom_course").get("code_text");
            const courseColor=course.get("color_text");
            
            if(studentGroup.courseGroups.hasOwnProperty(courseKey)){
                courseGroup=studentGroup.courseGroups[courseKey];
            }else{
                courseGroup={
                    course,
                    courseName,
                    courseCode,
                    courseColor,
                    timeGroups:{} 
                }
                dateGroups[dateKey].studentGroups[studentKey].courseGroups[courseKey]=courseGroup;
            }

            //time stuff

            const timeKey=dueDate.toLocaleTimeString('en-US', {
              minute:'2-digit',
              hour:'2-digit',
              hour12: false
            });
            const timeString=dueDate.toLocaleTimeString('en-US', {
              minute:'2-digit',
              hour:'2-digit',
              hour12: true
            });

            if(courseGroup.timeGroups.hasOwnProperty(timeKey)){
                timeGroup=courseGroup.timeGroups[timeKey];
            }else{
                timeGroup={
                    timeString,
                    statusGroups:{}
                }
                dateGroups[dateKey].studentGroups[studentKey].courseGroups[courseKey].timeGroups[timeKey]=timeGroup;
            }

            //status stuff
            
			//first three done above to check against show_completed
            //const status=task.get("task_status_option_task_status");
            //const statusComplete=(statusKey>=3);
            //const statusKey=status.get("value0");
            const statusString=status.get("display");
            const statusFGColor=status.get("foreground_color");
            const statusBGColor=status.get("background_color");
            const statusIsMinimized=statusComplete&&minimizeCompleted;
            if(statusComplete){
                if(!instance.data.minimizedStatusGroupKeys.hasOwnProperty(courseKey+"/"+timeKey+"/"+statusKey)){
                	instance.data.minimizedStatusGroupKeys[courseKey+"/"+timeKey+"/"+statusKey]=statusIsMinimized;
                    //minimizedStatusGroupsKeys is set if it hasnt been set before
                    //otherwise, it's only changed through the click event on the complete container
                    
                }
            }
            
            if(timeGroup.statusGroups.hasOwnProperty(statusKey)){
                statusGroup=timeGroup.statusGroups[statusKey];
            }else{
                statusGroup={
                    statusString,
                    statusFGColor,
                    statusBGColor,
                    statusComplete,
                    statusIsMinimized,
                    tasks:{}
                }
                dateGroups[dateKey].studentGroups[studentKey].courseGroups[courseKey].timeGroups[timeKey].statusGroups[statusKey]=statusGroup;
            }

            //task stuff

            const taskKey=task.get("_id");
            const taskName=task.get("name_text");
            const taskPrice=task.get("price_number");
            const taskType=task.get("task_type_custom_task_type");
            const taskTypeString=taskType?.get("display_text");

            if(statusGroup.tasks.hasOwnProperty(taskKey)){
                taskGroup=statusGroup.tasks[taskKey];
            }else{
                taskGroup={
                	taskName,
					taskPrice,
					taskTypeString,
					isDeleted,
					isArchived
                }
                dateGroups[dateKey].studentGroups[studentKey].courseGroups[courseKey].timeGroups[timeKey].statusGroups[statusKey].tasks[taskKey]=taskGroup;
            }
        }catch(e){
        	//d.log({task,index,e})
        }
        
    })
    
    const isEmpty = (item) => (!item?.length);
    
    const elementAssembler = ({
		attributes,
    	parent,
		className,
		elementType = "div",
		innerHTML,
		data,
		style,
	}) => {
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
		return newElement;
	};
            
	const mainHeader=elementAssembler({
        parent:taskViewerContainer,
        className:"main-header"
	});
        
    const pageTitle=elementAssembler({
        parent:mainHeader,
        className:"page-title",
        innerHTML:"Dashboard"
	});
        
    const actionsContainer=elementAssembler({
        parent:mainHeader,
        className:"actions-container"
	});    
        
	const todayButton=elementAssembler({
        parent:actionsContainer,
        className:"today-button",
        innerHTML:"Today"
	});
        
	todayButton.addEventListener('click',()=>{
    	todaysDateGroup.scrollIntoView({ behavior: 'smooth', block: 'center' });
        //add and then remove a class from the group so that it draws the user's attention
    });
        
	const addTaskButton=elementAssembler({
        elementType:"span",
        parent:actionsContainer,
        className:"add-task-button material-symbols-outlined",
        innerHTML:"add"
	});
	addTaskButton.addEventListener('click',()=>{
        setURLParam("archived","show");
    });
        
	const taskViewerBody=elementAssembler({
        parent:taskViewerContainer,
        className:"task-viewer-body role-"+instance.data.userRole?.toLowerCase()
	}); 
                               
	const sheet = (function() {
        // Create the <style> tag
        let style = document.querySelector("style.dashboard-style")||document.createElement("style");
        style.className="dashboard-style";

        // Add a media (and/or media query) here if you'd like!
        // style.setAttribute("media", "screen")
        // style.setAttribute("media", "only screen and (max-width : 1024px)")

        // Add the <style> element to the page
        document.head.appendChild(style);

        return style.sheet;
    })();
                               
	sheet.addRule(`:root`,
    	`--smallFontSize: 0.75rem;
		--defaultCourseColor:#f06291;
		--defaultGreyColor:#6b7780;
		--statusColor0:grey;
		--statusColor1:red;
		--statusColor2:pink;
		--statusColor3:green;
		--statusColor4:green;		`
    );
                               
	sheet.addRule(`*`,
    	`box-sizing:border-box`
    );
            
	sheet.addRule(`.material-symbols-outlined`,
    	`font-variation-settings:
        'FILL' 0,
        'wght' 400,
        'GRAD' 0,
        'opsz' 48`
    );
        
	sheet.addRule(`.main-header`,
    	`position: sticky;
        display: flex;
        height: 60px;
        top: 0px;
		background:white;
        border-bottom:1px solid var(--defaultGreyColor);
		justify-content:space-between;
		`
    );
        
	sheet.addRule(`.page-title, .actions-container`,
    	`
        font-size: 30px;
        display: flex;
        align-items: center;
		`
    );
        
	sheet.addRule(`.today-button`,
    	`
        font-size: 20px;
        border:1px solid black;
		padding:5px;
		border-radius:2px;
		margin-right:15px;
		`
    );
        
	sheet.addRule(`.actions-container :is(div,span)`,
    	`
        cursor:pointer;
		`
    );
        
            
            
    sheet.addRule(`.task-viewer-container-`+classID,
    	`padding: 0 20px 80%;
		width:100%;
		height:100vh;
		overflow-y:scroll;
		`
    );
        
	sheet.addRule(`.task-viewer-body`,
    	`//margin-top:60px;`
    );
    
    sheet.addRule(`[class*="date-group-header"]`,
    	`font-size:30px;
		padding-top:5px;
		font-weight:700;`
    );
                               
	sheet.addRule(`[class*="student-group-header"]`,
    	`font-size:25px;
		padding-top:15px;
		padding-bottom 5px;
		font-weight:700;
		`
    );
        
    sheet.addRule(`.role-student [class*="student-group-header"]`,
    	`display:none;
		`
    );    
                               
	sheet.addRule(`[class*="student-group-container"]`,
    	`font-size:20px;
		padding:5px 0;
		`
    );
    
    sheet.addRule(`[class*="course-group-container"]`,
    	`display:flex;
                               `
    );

	sheet.addRule(`[class*="course-group-container"].small-screen,[class*="course-group-container"].medium-screen`,
    	`display:block;
                               `
    );
                               
	sheet.addRule(`[class*="course-group-left"]`,
    	`background-color:var(--defaultCourseColor);
		cursor:pointer;
		`
    );
            
	sheet.addRule(`[class*="course-group-left"]:hover`,
    	`color:var(--defaultCourseColor);
		`
    );
                               
    sheet.addRule(`[class*="course-group-header"]`,
    	`height: 50px;
		text-align:center;                             
        background: white;
        border: 1px solid;
        line-height: 50px;
		color:#f06291;
		border-color:#f06291;
		font-weight:700;
        width: 125px;`
    );

	sheet.addRule(`[class*="course-group-header"].small-screen,[class*="course-group-header"].medium-screen`,
    	`width: 100%;
        text-align: left;
        border: none;`
    );

    
                               
    sheet.addRule(`[class*="course-group-body"]`,
    	`border-top:1px solid #f06291;
		width:100%;
		`
    );

	sheet.addRule(`[class*="course-group-body"].small-screen,[class*="course-group-body"].medium-screen`,
    	`border-top-width:2px;
		`
    );

	sheet.addRule(`[class*="time-group-container"]`,
    	`//display:flex
                               `
    );

	sheet.addRule(`[class*="status-group-container"]`,
    	`padding:0;
                               `
    );
            
	sheet.addRule(`[class*="status-group-container"].hide-complete [class*="completed-container"]`,
    	`display:flex;
                               `
    );
    
	sheet.addRule(`[class*="status-group-container"].hide-complete [class*="task-container"]`,
    	`display:none;
                               `
    );   
            
	sheet.addRule(`[class*="status-icon"]`,
    	`cursor:pointer;
                               `
    );
            
    sheet.addRule(`[class*="status-icon"]:hover`,
    	`transform: translateY(4px);
                               `
    );        
            
	sheet.addRule(`[class*="status-icon"][data-status-key="0"]`,
    	`color:var(--statusColor0);
                               `
    );
            
	sheet.addRule(`[class*="status-icon"][data-status-key="1"]`,
    	`color:var(--statusColor1);
                               `
    );
            
	sheet.addRule(`[class*="status-icon"][data-status-key="2"]`,
    	`color:var(--statusColor2);
                               `
    );
            
	sheet.addRule(`[class*="status-icon"][data-status-key="3"]`,
    	`color:var(--statusColor3);
                               `
    );
            
	sheet.addRule(`[class*="status-icon"][data-status-key="4"]`,
    	`color:var(--statusColor4);
                               `
    );
            
	sheet.addRule(`[class*="task-container"],[class*="completed-container"]`,
    	`display:flex;
		height:80px;
		padding:12px 8px;
		border-bottom:1px solid grey;`
    );
            
	//starting completed-container
            
	sheet.addRule(`[class*="completed-container"]`,
    	`display:none;
		color:var(--defaultCourseColor);
		cursor:pointer;
		height:50px;`
    );
            
	sheet.addRule(`[class*="completed-left"]`,
    	`flex:0 0 10%;
		text-align:center;
		`
    );
                               
	sheet.addRule(`[class*="completed-left"].small-screen,[class*="completed-left"].medium-screen`,
    	`display:none;                       
		`
    );

	sheet.addRule(`[class*="task-body"]`,
    	`flex:0 0 90%;
        display:flex;                       
		`
    );
                               
	sheet.addRule(`[class*="completed-body"].small-screen,[class*="completed-body"].medium-screen`,
    	`flex:0 0 100%;  
		overflow:hidden;
		`
    );
                               
	sheet.addRule(`[class*="completed-body"].small-screen`,
    	`flex-direction:column;                       
		`
    );
            
	//starting task-container
            
	sheet.addRule(`[class*="task-container"].complete`,
    	`display:none;`
    );
            
	sheet.addRule(`[class*="task-container"].deleted [class*="task-name"]`,
    	`
		font-style:italic;`
    );
            
	sheet.addRule(`[class*="task-container"].deleted [class*="task-name"]:before`,
    	`content:"DELETED";
		color:white;
		background-color:red;
		padding:0 5px;
		margin-right:5px;
		font-weight:700;
		`
    );
            
	sheet.addRule(`[class*="task-container"].archived [class*="task-name"]`,
    	`
		font-style:italic;`
    );
            
	sheet.addRule(`[class*="task-container"].archived [class*="task-name"]:before`,
    	`content:"ARCHIVED";
		color:white;
		background-color:grey;
		padding:0 5px;
		margin-right:5px;
		font-weight:700;
		`
    );

	sheet.addRule(`[class*="task-left"]`,
    	`flex:0 0 10%;
		text-align: center;
        display: flex;
        justify-content: center;
        flex-direction: column;
		`
    );
                               
	sheet.addRule(`[class*="task-left"].small-screen,[class*="task-left"].medium-screen`,
    	`display:none;                       
		`
    );

	sheet.addRule(`[class*="task-body"]`,
    	`flex:0 0 90%;
        display:flex;                       
		`
    );
                               
	sheet.addRule(`[class*="task-body"].small-screen,[class*="task-body"].medium-screen`,
    	`flex:0 0 100%;  
		overflow:hidden;
		`
    );
                               
	sheet.addRule(`[class*="task-body"].small-screen`,
    	`flex-direction:column;                       
		`
    );

	sheet.addRule(`[class*="task-title-area"]`,
    	`flex:0 0 80%;
        overflow: hidden;
    	white-space: nowrap;
    	text-overflow: ellipsis;
		`
    );

	sheet.addRule(`[class*="task-time"]`,
    	`flex:0 0 20%;
		font-size:var(--smallFontSize);
		text-align:right;
		`
    );
                               
	sheet.addRule(`[class*="task-time"].small-screen`,
    	`text-align:left;
		`
    );

	sheet.addRule(`[class*="task-bread-crumbs"]`,
    	`font-size:15px;
        color:var(--defaultGreyColor);
		margin-bottom:5px;
		max-height: 15px;
    	overflow: hidden;
		`
    );

	sheet.addRule(`[class*="task-course-name"]`,
    	`float:left;
		margin-right:5px;
		`
    );

	sheet.addRule(`[class*="task-student-name"]`,
    	`float:left;
		`
    );
                               
    sheet.addRule(`[class*="task-name"]`,
    	`height: 22px;
		white-space:nowrap;
		cursor:pointer;
		`
    );
        
	sheet.addRule(`[class*="empty-group"]`,
    	`display:none;
		`
    );
        
	sheet.addRule(`[class*="empty-group"]:only-child`,
    	`display:block;
		height: 100px;
        text-align: center;
        border-top: 1px solid var(--defaultGreyColor);
		padding-top:15px;
		`
    );
        
            

	let screenSizeClass="";

	const mediaQuerySmallScreen = matchMedia("screen and (max-width: 590px)");
	const mediaQueryMediumScreen = matchMedia("screen and (min-width: 591px) and (max-width: 895px)");

	if(mediaQuerySmallScreen.matches){
		screenSizeClass=" small-screen";
	}else if(mediaQueryMediumScreen.matches){
		screenSizeClass=" medium-screen";
	}

	const dateKeys=Object.keys(dateGroups).sort();	
	
    dateKeys.forEach(dateKey => {
		const dateData=dateGroups[dateKey];
        const dateHeader=elementAssembler({
        	parent:taskViewerBody,
            className:"date-group-header",
            innerHTML:dateData.dateString
        })
        const dateGroupContainer=elementAssembler({
        	parent:taskViewerBody,
            className:"date-group-container"
        })

		if(dateKey===todayDateKey){
			todaysDateGroup=dateGroupContainer;
            dateHeader.innerHTML="Today </br>"+dateData.dateString;
            //no tasks are due today
			const emptyGroup=elementAssembler({
                parent:dateGroupContainer,
                className:"empty-group",
                innerHTML:"No Tasks Planned Today"
            }); 
		}
        
        const studentGroups=dateGroups[dateKey].studentGroups;
        for(let studentKey in studentGroups){
			const studentData=studentGroups[studentKey];
            const studentGroupHeader=elementAssembler({
                parent:dateGroupContainer,
                className:"student-group-header",
                innerHTML:studentData.fullName
            });
        	const studentGroupContainer=elementAssembler({
                parent:dateGroupContainer,
                className:"student-group-container",
            });
            
            const courseGroups=studentGroups[studentKey].courseGroups;
            for(let courseKey in courseGroups){
                const courseData=courseGroups[courseKey];
                const courseGroupContainer=elementAssembler({
                    parent:studentGroupContainer,
                    className:"course-group-container-"+courseKey+screenSizeClass,
                });
                const courseGroupLeft=elementAssembler({
                    elementType:"a",
                    attributes:{
                      	href:baseURL+"course/"+courseKey
                    },
                    parent:courseGroupContainer,
                    className:"course-group-left-"+courseKey+screenSizeClass,
                });
                const courseGroupHeader=elementAssembler({
                    parent:courseGroupLeft,
                    className:"course-group-header-"+courseKey+screenSizeClass,
                    innerHTML:courseData.courseCode
                });
                const courseGroupBody=elementAssembler({
                    parent:courseGroupContainer,
                    className:"course-group-body-"+courseKey+screenSizeClass,
                });
                
                sheet.addRule(`.course-group-left-${courseKey}`,
                    `background:${courseData.courseColor};`
                );
                
                sheet.addRule(`.course-group-left-${courseKey}:hover`,
                    `color:${courseData.courseColor};`
                );
                
                sheet.addRule(`.course-group-header-${courseKey}`,
                    `border-color:${courseData.courseColor};
					color:${courseData.courseColor};`
                );
                
                sheet.addRule(`.course-group-body-${courseKey}`,
                    `border-color:${courseData.courseColor};`
                );
                
                const timeGroups=courseGroups[courseKey].timeGroups;
                for(let timeKey in timeGroups){
                    const timeData=timeGroups[timeKey];
                    const timeString=timeData.timeString;
                    const timeGroupContainer=elementAssembler({
                        parent:courseGroupBody,
                        className:"time-group-container",
                    });
                    
                    const statusGroups=timeGroups[timeKey].statusGroups;
                    for(let statusKey in statusGroups){
                        const statusGroup=statusGroups[statusKey];
                        const {statusString,statusIsMinimized,statusComplete,statusFGColor,statusBGColor}=statusGroup;
                        const statusGroupContainer=elementAssembler({
                            elementType:"ul",
                            parent:timeGroupContainer,
                            className:"status-group-container"+(instance.data.minimizedStatusGroupKeys[courseKey+"/"+timeKey+"/"+statusKey]?" hide-complete":"")
                        });
                        
                        const tasks=statusGroups[statusKey].tasks;
                        
                        
                        
                        if(statusComplete){
                        	const completedCount=Object.keys(tasks).length;
                            const completedContainer=elementAssembler({
                                elementType:"li",
                                parent:statusGroupContainer,
                                className:"completed-container-"+courseKey+screenSizeClass
                            });
                            const completedLeft=elementAssembler({
                                parent:completedContainer,
                                className:"completed-left"+screenSizeClass,
                                innerHTML:">"
                            });
                            const completedBody=elementAssembler({
                                parent:completedContainer,
                                className:"completed-body"+screenSizeClass,
                                innerHTML:"Show "+completedCount+ " "+statusString+" task"+(completedCount===1?"":"s")
                            });
                            completedContainer.addEventListener('click',()=>{
                                instance.data.minimizedStatusGroupKeys[courseKey+"/"+timeKey+"/"+statusKey]=!instance.data.minimizedStatusGroupKeys[courseKey+"/"+timeKey+"/"+statusKey];
                                statusGroupContainer.classList.remove("hide-complete");
                            });
                            
                            sheet.addRule(`.completed-container-${courseKey}`,
                                `color:${courseData.courseColor};`
                            );
                        }
                        
                        for(let taskKey in tasks){
                            const taskData=tasks[taskKey];
                            const {isDeleted,isArchived}=taskData;
                            const taskContainer=elementAssembler({
                                elementType:"li",
                                parent:statusGroupContainer,
                                className:"task-container"+(isDeleted?" deleted":"")+(isArchived?" archived":"")
                            });
                            const taskLeft=elementAssembler({
                                parent:taskContainer,
                                className:"task-left"+screenSizeClass
                            });
                            const statusIcon=elementAssembler({
                                elementType:"span",
                                parent:taskLeft,
                                className:"material-symbols-outlined status-icon-"+taskKey+" status-key-"+statusKey,
                                innerHTML:statusKey==="4"?"done_all":(statusKey==="3"?"done":"check_box_outline_blank"),
                                data:{fgColor:statusFGColor,bgColor:statusBGColor,display:statusString,statusKey},
                                attributes:{
                                    title:statusString
                                }
                            });
                            const taskBody=elementAssembler({
                                parent:taskContainer,
                                className:"task-body"+screenSizeClass
                            });
							const taskTitleArea=elementAssembler({
                                parent:taskBody,
                                className:"task-title-area"
                            });
							const taskBreadCrumbs=elementAssembler({
                                parent:taskTitleArea,
                                className:"task-bread-crumbs",
                            });
							const taskCourseName=elementAssembler({
                                parent:taskBreadCrumbs,
                                className:"task-course-name",
								innerHTML:courseData.courseName
                            });
							const taskStudentName=elementAssembler({
                                parent:taskBreadCrumbs,
                                className:"task-student-name",
								innerHTML:studentData.fullName
                            });
							const taskName=elementAssembler({
								elementType:"a",
                                parent:taskTitleArea,
                                className:"task-name",
                                attributes:{
                                    href:baseURL+"course/"+courseKey+"/task/"+taskKey
                                },
                                innerHTML:taskData.taskName
                            });
						    
                            const taskTime=elementAssembler({
                                parent:taskBody,
                                className:"task-time"+screenSizeClass,
                                innerHTML:timeString
                            });
                            
                        }
                        
                    }
                    
                }
                
            }
        
        }
    })

	function scrollIntoViewIfNeeded(target){
        if (target.getBoundingClientRect().bottom > window.innerHeight){
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        if (target.getBoundingClientRect().top < 0){
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } 
    }

	scrollIntoViewIfNeeded(todaysDateGroup);
	//should only happen once, not on each redraw: todaysDateGroup.scrollIntoView();

}