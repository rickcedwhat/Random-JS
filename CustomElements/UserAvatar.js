class UserAvatar extends HTMLElement {
    constructor() {
      super();
      // create a shadow root
      this.shadow = this.attachShadow({mode: 'open'});
      privateData.set(this,{});
      // element created
      this.borderColor="white";
      this.bgColor="green";
    }
    
    render() {
      let renderSuccessful=false;
      const avatarUserData=this.avatarUserData;
      const styleInnerHTML=elementAssembler({
        elementType: "style"
      });
      const innerHTML=elementAssembler({});
      styleInnerHTML.innerHTML=`
        .avatar{
          border:2px solid ${this.borderColor};
          border-radius:50%;
          background:${avatarUserData?.avatarColor||this.bgColor};
          font-weight:bold;
          width: 30px;
          height: 30px;
          display:flex;
          align-items:center;
          justify-content:center;
          font-family: Barlow;
          font-size: 14px;    
          color:white;
        }

        .avatar.square{
          border-radius:0;
        }
      `;
      if(avatarUserData?.avatarImgSrc){
          //do this later
      }else if(avatarUserData?.avatarFullName){
        const avatarElement = elementAssembler({
          elementType:"span",
          innerHTML:avatarUserData.avatarFullName.split(" ").map(nameString=>nameString[0]).join(""),
          className:"avatar"+(this.square?" square":"")
        });  
        innerHTML.append(avatarElement);
        renderSuccessful=true;
      }
      if(renderSuccessful){
        this.shadowRoot.innerHTML="";//remove any old content
        this.shadowRoot.append(styleInnerHTML);
        this.shadowRoot.append(innerHTML);
        this.rendered=true;
      }
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
      //throw error if empty
      return privateData.get(this).currentUserRole;
    }

    set avatarUserData(value) {
      //validate data
      //should include avatarID, avatarFullName, avatarRole, avatarColor, avatarImgSrc
      let obj=JSON.parse(value);
      let valid=true;
      if(valid){
        privateData.get(this).avatarUserData=obj;
      }else{
        throw new TypeError("Invalid Avatar User");
      }
      this.render();
    }

    get avatarUserData() {
      return privateData.get(this).avatarUserData;
    }
  
    static get observedAttributes() {
      /* array of attribute names to monitor for changes */
      return [
            "show-quick-glance",
            "square"
        ]
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
        // called when one of attributes listed above is modified
        console.log({name, oldValue, newValue});
        if(UserAvatar.observedAttributes.includes(name)){
          const prop = hyphenToCamel(name);
          if(["showQuickGlance","square"].includes(prop)){
            this[prop]=true;
          }else{
            this[prop]=newValue;
          }
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
customElements.define("user-avatar", UserAvatar);