const hook = document.querySelector("#viphomework-root");

function createRandomWorkers({workerAmountsOptions,availableWorkersOptions}){
    //workerAmountsOptions is an array 
    //each element is an object will all fields of workerAmount
    //if an object is empty, each field will be randomly generated
    //when a worker amount is created, so is an available worker

    //availableWorkersOptions is an array 
    //each element is an object will all fields of availableWorker
    //if an object is empty, each field will be randomly generated
    
    const firstNames=["Tom","Chuck","Michael","Fiona","Julia"];
    const lastNames=["Finley","Glennane","Westin","Forrester","Catalan"];
    const colors=["Red","green",'blue','orange','pink'];
    const requestStatusDisplays=["Pending","Canceled","Denied","Accepted","Confirmation Not Needed"];
    const requestedByDisplays=["Admin","Worker"];
    const workerAmounts=[];
    const availableWorkers=[];
    
    workerAmountsOptions.forEach(option=>{
        let variablesWithDefaults = Object.assign({
            workerAmountID: createRandomID(),
            requestStatusDisplay: getRandomElement(requestStatusDisplays),
            requestedByDisplay: getRandomElement(requestedByDisplays),
            workerID: createRandomID(),
            workerUserID: createRandomID(),
            workerFullName: getRandomElement(firstNames)+" "+getRandomElement(lastNames),
            workerAvatarColor: getRandomElement(colors)
        },option);

        let {
            workerAmountID,
            amount,
            estimate,
            paymentStatusDisplay,
            requestStatusDisplay,
            requestedByDisplay,
            workerID,
            workerUserID,
            workerFullName,
            workerAvatarColor,
            workerEmail
        } = variablesWithDefaults;
          
        workerEmail=workerEmail??workerFullName.split(" ").join("@")+".com";
        requestedByDisplay=requestStatusDisplay==="Confirmation Not Needed"?"Admin":requestedByDisplay;
        const workerAmount= new WorkerAmount({
            workerAmountID,
            amount,
            estimate,
            paymentStatusDisplay,
            requestStatusDisplay,
            requestedByDisplay,
            workerID,
            workerUserID,
            workerFullName,
            workerAvatarColor,
            workerEmail
        })
        
        workerAmounts.push(workerAmount);
        const availableWorker= new Worker({
            workerFullName,
            workerUserID,
            workerID,
            workerAvatarColor,
            workerEmail
        })
        availableWorkers.push(availableWorker)
    })
    //start available workers
    availableWorkersOptions.forEach(option=>{
        let variablesWithDefaults = Object.assign(option,{
            workerID: createRandomID(),
            workerUserID: createRandomID(),
            workerFullName: getRandomElement(firstNames)+" "+getRandomElement(lastNames),
            workerAvatarColor: getRandomElement(colors)
        })

        let {
            workerID,
            workerUserID,
            workerFullName,
            workerAvatarColor,
            workerEmail
        } = variablesWithDefaults;
          
        workerEmail=workerEmail??workerFullName.split(" ").join("@")+".com";
        const availableWorker= new Worker({
            workerFullName,
            workerUserID,
            workerID,
            workerAvatarColor,
            workerEmail
        })
        availableWorkers.push(availableWorker)
    })
    return {workerAmounts,availableWorkers};
}


const {workerAmounts,availableWorkers} = createRandomWorkers({
    workerAmountsOptions:[
        {},{}
    ],
    availableWorkersOptions:[
        {},{}
    ]
})
const workerArea = document.createElement("worker-area");
workerArea.currentUserRole="Admin";
workerArea.availableWorkers=JSON.stringify(availableWorkers);
workerArea.workerAmounts=JSON.stringify(workerAmounts);

workerArea.appendTo(hook);