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
    
    const isInsideElement = function (parent, child) {
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
                    
    const sideBarContainer=instance.data.sideBarContainer;
    removeAllChildNodes(sideBarContainer);
                               
	const currentUser=context.currentUser;
	const userFullName=currentUser.get("full_name_text");
	const userRole=currentUser.get("loggedinas_option_role")?.get("display");
	console.log({userRole,userFullName});
    
    const menuOptions=[
		{
			title:"Account",
			icon:"account_circle",
			pullout:true,
            roles:["Student","Worker","Admin"]
		},
		{
			title:"Dashboard",
			icon:"dashboard",
			url:baseURL+"dashboard?completed=minimize",
			roles:["Student","Worker","Admin"]
		},
		{
			title:"Courses",
			icon:"school",
			pullout:true,
			roles:["Student","Worker","Admin"]
		},
		{
			title:"Messages",
			icon:"chat",
			pullout:true,
			roles:["Student","Worker","Admin"]
		},
		{
			title:"Reminders",
			icon:"timer",
			pullout:true,
			roles:["Worker","Admin"]
		},
		{
			title:"Notifications",
			icon:"notifications",
			pullout:true,
			roles:["Student","Worker","Admin"]
		},
		{
			title:"Minimize",
			icon:sideBarContainer.classList.contains("minimized")?"expand_content":"close_fullscreen",
			roles:["Student","Worker","Admin"]
		}
	];

	if(properties.default_active_title){
    	instance.data.activeOptionIndex=menuOptions.findIndex(option=>option.title===properties.default_active_title);
        instance.data.activeTitle=menuOptions[instance.data.activeOptionIndex].title;
    }
    
	function getSheet(){
        let style = document.querySelector("style.side-bar-style");
        if(!style){
        	style = document.createElement("style");
            style.className = "side-bar-style";

            // Add a media (and/or media query) here if you'd like!
            // style.setAttribute("media", "screen")
            // style.setAttribute("media", "only screen and (max-width : 1024px)")

            // Add the <style> element to the page
            document.head.appendChild(style);
        }
        return style.sheet;
    }

	const sheet=getSheet();

	const rulesToOverwrite=[
    	'zIndex',
        'width',
        'maxWidth',
        'minWidth',
        'height',
        'max-height',
        'min-height'
    ]
    rulesToOverwrite.forEach(rule=>{
    	instance.canvas[0].style[rule]=null;
    })

	const cleanClassAndReturnSelector = (element) => {
        classes=[];
    	const classList=[...element.classList].forEach(className=>{
            classes.push(/^\d/.test(className.charAt(0))?"_"+className:className);
        });
        element.className=classes.join(" ");
        return "."+classes.join(".");
    };

	const ancestorSelector=cleanClassAndReturnSelector(instance.canvas[0]);

	sheet.addRule(`:root`,
    	`--smallFontSize: 0.75rem;
		--defaultHeaderColor:#007698;
		--darkerHeaderColor:#00000033;
		--defaultSideBarWidth:84px;
		--minimizedSideBarWidth:54px;
		--collapsedSideBarWidth:0;
		`
    );

	sheet.insertRule(`${ancestorSelector}{
		z-index:6;
		width:var(--defaultSideBarWidth);
		max-width:var(--defaultSideBarWidth);
		min-width:var(--defaultSideBarWidth);
	}`);

	sheet.insertRule(`${ancestorSelector}:has(.minimized){
		width:var(--minimizedSideBarWidth);
		max-width:var(--minimizedSideBarWidth);
		min-width:var(--minimizedSideBarWidth);
	}`);

	sheet.insertRule(`${ancestorSelector}:has(.placed-on-top){
		width:100%;
		max-width:100%;
		min-width:100%;
		height:60px;
		max-height:60px;
		min-height:60px;
	}`);

	sheet.insertRule(`${ancestorSelector}:has(.placed-on-top) + #main-area{
		width:100vw !important;
	}`);

	sheet.insertRule(`#main-header{
		position:fixed !important;
		background:white !important;
		width:-webkit-fill-available !important;
		padding:0 20px !important;
		min-width:unset !important;
		max-width:unset !important;
	}`);

	sheet.insertRule(`#main-header:after{
		content:"";
        border-bottom: 1px solid var(--defaultGreyColor);
        position: absolute;
        left: 20px;
        bottom: 0px;
        right: 20px;
	}`);

	sheet.insertRule(`#main-header + .bubble-element{
		margin-top:65px !important;
	}`);

                               
	sheet.addRule(`*`,
    	`box-sizing:border-box`
    );
                               
	sheet.addRule(`.side-bar-container`,
    	`
        display: flex;
        flex-direction: column;
        z-index: 100;
        background-color:var(--defaultHeaderColor);
		position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
		color:white;
		width:var(--defaultSideBarWidth);
		pointer:cursor;
		`
    );

	sheet.addRule(`.side-bar-container.placed-on-top`,
    	`display: block;
        z-index: unset;
		width:100%;
		height:60px;
		`
    );

	sheet.addRule(`.side-bar-container.placed-on-top .side-bar-head`,
    	`display: none;
		`
    );

	sheet.addRule(`.side-bar-container.placed-on-top .menu-container`,
    	`display: none;
		`
    );
                               
	sheet.addRule(`.side-bar-container.minimized`,
    	`
        width:var(--minimizedSideBarWidth);
		`
    );
    
    sheet.addRule(`.side-bar-container.minimized [class*="menu-option-title"]`,
    	`
        display:none;
		`
    );

	sheet.addRule(`.side-bar-head`,
    	`display:flex;
		justify-content:center;
		`
    );
       
                               
	sheet.addRule(`.vip-home-button`,
    	`text-align:center;
		font-size:36px;
		font-family:noto;
		`
    );
           
    sheet.addRule(`.menu-container`,
    	`
        list-style:none;
		padding:0;
		`
    );
    
    sheet.addRule(`.menu-option-container`,
    	`
		font-size:14px;
		text-align:center;
		margin-bottom:10px;
		cursor:pointer;
		`
    );

	sheet.addRule(`.menu-option-container:hover`,
    	`
		background-color:var(--darkerHeaderColor);
		`
    );

	sheet.addRule(`.menu-option-container.active`,
    	`
		background:white;
		color:var(--defaultHeaderColor);
		`
    );

	sheet.addRule(`.menu-option-link:hover, .vip-home-button:hover`,
    	`
		text-decoration:none;
		`
    );
    
    sheet.addRule(`.menu-option-icon`,
    	`
        font-size:40px;
		`
    );

	sheet.addRule(`[class*="pullout-container"]`,
    	`display:none;
		`
    );

	sheet.addRule(`[class*="pullout-container"].active`,
    	`
		display:block;
		position: fixed;
        top: 0px;
        left: var(--defaultSideBarWidth);
        width: 400px;
        height: 100vh;
        background: white;
		color:var(--defaultHeaderColor);
		box-shadow:10px 0px 15px -15px black;
		`
    );

	sheet.addRule(`.minimized [class*="pullout-container"].active`,
    	`
		left:var(--minimizedSideBarWidth);
		`
    );

	sheet.addRule(`[class*="pullout-header"]`,
    	`
        font-family: "Atkinson Hyperlegible",Arial,sans-serif;
		font-size:1.375rem;
		font-weight:700;
		`
    );  

	sheet.addRule(`[class*="horizontal-side-bar"]`,
    	`display:none;
		`
    );

	sheet.addRule(`.side-bar-container.placed-on-top [class*="horizontal-side-bar"]`,
    	`display:flex;
		align-items:center;
		height:100%;
		`
    );
	
	sheet.addRule(`[class*="horizontal-side-bar"] [class*="hamburger-menu-container"], [class*="horizontal-side-bar"] [class*="spacer"]`,
    	`
		padding:15px;
		`
    );

	sheet.addRule(`.side-bar-container.placed-on-top [class*="active-title-container"]`,
    	`text-align: center;
        flex-grow: 1;
		font-size:18px;
		padding:15px;
		`
    );
    
	const sideBarHead=elementAssembler({
		parent:sideBarContainer,
		className:"side-bar-head",
	}); 
    
    const vipHome=elementAssembler({
        elementType:"a",
        attributes:{
        	href:baseURL
        },
		parent:sideBarHead,
		className:"vip-home-button",
        innerHTML:"VIP"
	});

    const menuContainer=elementAssembler({
        elementType:"ul",
        parent:sideBarContainer,
        className:"menu-container",
    });

	const createPullout = (option) => {
    	const pulloutContainer=elementAssembler({
            parent:sideBarContainer,
            className:"pullout-container-"+option.title.toLowerCase()
        });
        const pulloutHeader=elementAssembler({
            parent:pulloutContainer,
            className:"pullout-header"
        });
        if(option.title==="Account"){
        	const pulloutAvatar=elementAssembler({
                parent:pulloutHeader,
                className:"pullout-avatar",
                innerHTML:userFullName.split(" ").map(name=>name[0]).join("").slice(0,2)
            });
            const pulloutTitle=elementAssembler({
                parent:pulloutHeader,
                className:"pullout-title",
                innerHTML:userFullName
            });
            const pulloutLogout=elementAssembler({
                parent:pulloutHeader,
                className:"pullout-logout",
                innerHTML:"Logout"
            });
        }else{
        	const pulloutTitle=elementAssembler({
                parent:pulloutHeader,
                className:"pullout-title",
                innerHTML:option.title
            });
        }
        
        const getCoursesList = () => {
            if(userRole==="Student"){
                const studentCourses=currentUser.get("student_custom_student").get("courses_list_custom_course1");
                const courseList=studentCourses?.get(0,studentCourses.length()).map(course=>{
                    const courseID=course.get("_id")
                    const courseCode=course.get("course_type1_custom_course").get("code_text");
                    const courseName=course.get("name_text");
                    return {
                        linkText:courseName,
                        linkURL:baseURL+"course/"+courseID,
                        linkCaption:courseCode
                    }
                });
            	return courseList;
            }else if(userRole==="Worker"||userRole==="Admin"){
            	return [
                    {
                        linkText:"Edit My Courses",
                        linkURL:baseURL+"settings",
                        linkCaption:"Click me"
                    }
                ]
            }
            
        };

        function renderSwitchRole({parentElement}){
            //currentUser and userRole available from global scope
            const userRolesList=currentUser.get("roles_list_option_role");
            let userRoles=userRolesList.get(0,userRolesList.length());
			userRoles=userRoles.map(role=>{
            	return role.get("display");
            }).sort((a,b)=>{
            	if(a===userRole){
                	return -1
                }
                if(b===userRole){
                	return 1
                }
                return 0
            })
            const useAsRoleSelect=elementAssembler({
                elementType:"select",
                parent:parentElement,
                className:"use-as-role-select",
            });
			userRoles.forEach((role,index)=>{
                const isActiveRole=role===userRole;
                useAsRoleSelect[index] = new Option("Use VIPHW as "+role,role,isActiveRole,isActiveRole);
            });
            useAsRoleSelect.addEventListener('change',(e)=>{
                const value=e.target.selectedOptions[0].value;
                console.log("switch to this role: ",value);
                instance.publishState("change_role_to",value);
                instance.triggerEvent("change_role");
            });
            
            sheet.insertRule(`
				.use-as-role-select{
					
				}
			`)
            
            sheet.insertRule(`
				.user-role-option{
					
				}
			`)
            
        }
        
        const list={
        	Account:[
                {
                    linkText:"Profile",
                    linkURL:baseURL+"profile",
                    linkCaption:null
                },
                {
                    linkText:"Files",
                    linkURL:baseURL+"files",
                    linkCaption:null
                },
                {
                    linkText:"Settings",
                    linkURL:baseURL+"settings",
                    linkCaption:null
                },
                {
                    render:renderSwitchRole
                }
            ],
            Courses:getCoursesList(),
            Messages:[
            	
            ],
           	Notifications:[
            
            ],
        }[option.title]
        
        if(list){
            const pulloutListContainer=elementAssembler({
                parent:pulloutContainer,
                className:"pullout-list-container",
            });
        	list.forEach(item=>{
                if(item.linkURL){
                    const pulloutListItem=elementAssembler({
                        parent:pulloutListContainer,
                        className:"pullout-list-item",
                    });
                    const pulloutListLink=elementAssembler({
                           elementType:"a",
                        parent:pulloutListItem,
                        className:"pullout-list-item-link",
                        innerHTML:item.linkText,
                        attributes:{
                            href:item.linkURL
                        }
                    });
                    if(item.linkCaption){
                        const pulloutListLinkCaption=elementAssembler({
                            parent:pulloutListItem,
                            className:"pullout-list-item-link-caption",
                            innerHTML:item.linkCaption,
                        });
                    }
                }
                if(item.render){
                    item.render({
                        parentElement:pulloutListContainer,
                    })
                }
            });
        }
        
        document.addEventListener('click',(e) => {
            if([...pulloutContainer.classList].includes("active")&&!isInsideElement(pulloutContainer,e.target)){
                //reset pullout and option containers
                pulloutContainer.classList.remove("active");
                instance.data.activePulloutIndex=-1;
                optionContainers[instance.data.activeOptionIndex].classList.remove("active");
                instance.data.activeOptionIndex=menuOptions.findIndex(option=>option.title===properties.default_active_title);
       	 		instance.data.activeTitle=menuOptions[instance.data.activeOptionIndex].title;
                optionContainers[instance.data.activeOptionIndex].classList.add("active");
            }
        });
        
        pulloutContainers.push(pulloutContainer);
        const index=pulloutContainers.length-1;
        pulloutContainer.dataset.index=index;
        return index;
    }

	const addOptionContainerClickHandler = ({optionContainer,shouldMinimize,shouldPullout,data}) => {
    	optionContainer.addEventListener('click',(e)=>{
            e.stopPropagation();
            if(shouldMinimize){
                instance.data.activePulloutIndex=-1;
            	sideBarContainer.classList.toggle("minimized");
            }else{
                optionContainers[instance.data.activeOptionIndex].classList.remove("active");
				optionContainer.classList.add("active");
                instance.data.activeOptionIndex=data.index;
            }
            if(shouldPullout){
                let activePulloutIndex=instance.data.activePulloutIndex;
                let pulloutIndex=optionContainer.dataset.pulloutIndex;
                const activePulloutContainer=pulloutContainers[activePulloutIndex];
                const pulloutContainer=pulloutContainers[pulloutIndex];
                if(activePulloutContainer){
                	activePulloutContainer.classList.remove("active");
                    if(activePulloutIndex===pulloutIndex){
                    	pulloutIndex=-1;
                		optionContainer.classList.remove("active");
                		instance.data.activeOptionIndex=menuOptions.findIndex(option=>option.title===properties.default_active_title);
       	 				instance.data.activeTitle=menuOptions[instance.data.activeOptionIndex].title;
                		optionContainers[instance.data.activeOptionIndex].classList.add("active");
                    }else{
                    	pulloutContainer.classList.add("active");
                    }
                }else{
                	pulloutContainer.classList.add("active");
                }
                instance.data.activePulloutIndex=pulloutIndex;
            }
            
        })
        if(!shouldMinimize){
        	optionContainers.push(optionContainer);
        }
    }
    
	let activeOptionIndex=instance.data.activeOptionIndex;
	let activePulloutIndex=instance.data.activePulloutIndex;
	const optionContainers=[];
	const pulloutContainers=[];
	menuOptions.filter(option=>option.roles.includes(userRole)).forEach((option,index)=>{
    	const optionContainer=elementAssembler({
            elementType:"li",
            parent:menuContainer,
            className:"menu-option-container"+(activeOptionIndex===index?" active":"")
        });
        const optionLink=elementAssembler({
            elementType:"a",
            attributes:option.url?{
            	href:option.url
            }:{},
            parent:optionContainer,
            className:"menu-option-link"
        });
        const optionIcon=elementAssembler({
            elementType:"span",
            parent:optionLink,
            className:"menu-option-icon material-symbols-outlined",
            innerHTML:option.icon
        });
        const optionTitle=elementAssembler({
            parent:optionLink,
            className:"menu-option-title",
            innerHTML:option.title
        });
        const shouldMinimize=option.title==="Minimize";
        const shouldPullout=option.pullout;
        const data={option,index};
        if(shouldPullout){
        	optionContainer.dataset.pulloutIndex=createPullout(option);
        }
        addOptionContainerClickHandler({optionContainer,shouldMinimize,shouldPullout,data});
  
    });

	const horizontalSideBar=elementAssembler({
        parent:sideBarContainer,
        className:"horizontal-side-bar"
    });

	const hamburgerMenuContainer=elementAssembler({
        parent:horizontalSideBar,
        className:"hamburger-menu-container"
    });

	const hamburgerMenuIcon=elementAssembler({
        elementType:"span",
        parent:hamburgerMenuContainer,
        className:"hamburger-menu-icon material-symbols-outlined",
        innerHTML:"menu"
    });

	const spacer1=elementAssembler({
        parent:horizontalSideBar,
        className:"spacer"
    });

	const activeTitleContainer=elementAssembler({
        parent:horizontalSideBar,
        className:"active-title-container",
        innerHTML:instance.data.activeTitle
    });

	const spacer2=elementAssembler({
        parent:horizontalSideBar,
        className:"spacer"
    });

	const spacer3=elementAssembler({
        parent:horizontalSideBar,
        className:"spacer"
    });
    
}