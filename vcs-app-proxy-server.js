const express = require('express');
const app = express();
const helmet = require("helmet");
const PORT = process.env.PORT || 3001;
require('isomorphic-fetch');
app.use(helmet());

// Gets all the user information about the passed in username from github, gitlab and bitbucket
app.get('/get-user/:name', async (req,res) => {
    let userInfoArray = [];
    let username = req.params.name;
    
    //================================================================================ GITHUB PROFILE FETCH
    // Gets the users github account information
    const post1 = await fetch("https://api.github.com/users/" + username);
    let post1Obj = await post1.json();
    userInfoArray.push(post1Obj);

    //================================================================================ GITLAB PROFILE FETCH
    /**
     * Gets the users gitlab account information.
     * First fetch is for the users basic account information, this returns their id that is needed for more information about them
     */ 
    const gitlabAccountId = await fetch("https://gitlab.com/api/v4/users?username=" + username);
    const gitlabAccountIdObj = await gitlabAccountId.json();

    // If the user is not found, the empty array is pushed
    if (gitlabAccountIdObj.length === 0) {
        userInfoArray.push(gitlabAccountIdObj);
    }else {
        // Their id is used to fetch information needed to poulate their profile page
        const gitlabAccountInfo = await fetch("https://gitlab.com/api/v4/users/" + gitlabAccountIdObj[0].id);
        const gitlabAccountInfoObj = await gitlabAccountInfo.json();
        // Response is added to the array
        userInfoArray.push(gitlabAccountInfoObj);
    }
    
    //================================================================================ BIT BUCKET PROFILE FETCH
    /**
     * Ok so this one was a headache. They recently updated their security relating to publically available information. So I have to make 
     * multiple calls to get the information I need.
     * Firstly I have to make a api call to see if there are repositorys linked to the requested username.
     * If no error comes back, then the user exists. I then check the returned repos owner to get the users uuid, which is needed to get user information in the next fetch.
     * BUT, if the " values " key in the json file is empty, that means the users repos are private meaning I cant get their account information at all.
     */
    // This fetch is to see if there are repos with the reqested username
    const post3 = await fetch("https://api.bitbucket.org/2.0/repositories/" + username);
    const post3Obj = await post3.json();
    // The check for the error ( User does not exist )
    if (post3Obj.type === "error") {
        // Pushing a custom response
        userInfoArray.push({"type": "Error", "reason": "User not found"});
    // If no error ( User exists )
    } else {
        // If the value is empty, that means all their repos are private, no information for me.
        if (post3Obj.values.length === 0) {
            // Pushing a custom response
            userInfoArray.push({"type": "Error", "reason": "Account is private"});
        // Else if the values key is not empty, use the uuid to get their full account! Yay!
        }else{
            const post4 = await fetch("https://api.bitbucket.org/2.0/users/" + post3Obj.values[0].owner.uuid);
            const post4Obj = await post4.json();
            // Response is added to the array
            userInfoArray.push(post4Obj);
        }
    }
    // userInfoArray sent back to react app
    res.send(userInfoArray);

})

// GET GIT HUB REPO INFORMATION ====================================================================================
app.get('/user/github/repo/:name', async (req,res) => {
    let repoArray = [] ;
    let repoObj ;
    let username = req.params.name ;
    
    //Gets the last 5 repos by creation date
    const repos = await fetch("http://api.github.com/users/" + username + "/repos?per_page=" + 5 + "&sort=create");
    let reposJson = await repos.json();
    repoObj = reposJson;
    
    /**
     * This loops through each repo, getting the repo name from the above fetch result, and gets the last 5 commit
     * messages. A new object is created for each repo, making a nice package of consisting of the repos name, description, creation date and 5 commits
     * that can be used for the to display the repos easily.
     */
    // The first loop gets the repo commits details for a repo
    for (let index = 0; index < repoObj.length; index++) {
        let repoCommits = await fetch("https://api.github.com/repos/"+ username + "/" + repoObj[index].name + "/commits?per_page=5")
        let commits = await repoCommits.json();

        // Object is created and initialized
        var repoInfoObj = new Object();
        repoInfoObj.repoName = repoObj[index].name;
        repoInfoObj.repoDesc = repoObj[index].description;
        repoInfoObj.createdOn = (repoObj[index].created_at).substr(0, 10);
        repoInfoObj.commitMsg = [];

        /** 
         * This loop runs through the previouse fetch results picking out the commit messages and pushing the message the the objects "commitMsg array"
         */
        for (let index2 = 0; index2 < commits.length; index2++) {
            repoInfoObj.commitMsg.push(commits[index2].commit.message);
        }     
        // The object is the pushed to arr ( This is what is sent back to the app )
        repoArray.push(repoInfoObj);
    }
    // RepoArray sent back to react app
    res.send(repoArray);
})

// GET GIT LAB REPO INFORMATION ====================================================================================
app.get('/user/gitlab/repo/:name', async (req,res) => {
    let repoArray = [];
    let repoObj;
    let username = req.params.name;

    //Gets the last 5 repos by creation date
    const repos = await fetch("https://gitlab.com/api/v4/users/" + username + "/projects?per_page=" + 5);
    let reposJson = await repos.json();
    repoObj = reposJson;
    
    /**
     * This loops through each repo, getting the repo name from the above fetch result, and gets the last 5 commit
     * messages. A new object is created for each repo, making a nice package of consisting of the repos name, description, creation date and 5 commits
     * that can be used for the to display the repos easily.
     */
    // The first loop gets the repo commits details for a repo
    for (let index = 0; index < repoObj.length; index++) {
        let repoCommits = await fetch("https://gitlab.com/api/v4/projects/" + repoObj[index].id + "/repository/commits?per_page=5")
        let commits = await repoCommits.json();

        // Object is created and initialized
        var repoInfoObj = new Object();
        repoInfoObj.repoName = repoObj[index].name;
        repoInfoObj.repoDesc = repoObj[index].description;
        repoInfoObj.createdOn = (repoObj[index].created_at).substr(0, 10);
        repoInfoObj.commitMsg = [];
        
        /** 
         * This loop runs through the previouse fetch results picking out the commit messages and 
         * pushing the message to the objects "commitMsg array"
         */
        for (let index2 = 0; index2 < commits.length; index2++) {
            repoInfoObj.commitMsg.push(commits[index2].title);
        }   
        // The object is the pushed to repoArray ( This is what is sent back to the app )  
        repoArray.push(repoInfoObj);
    }
    // repoArray sent back to react app
    res.send(repoArray);
})

// GET BIT BUCKET REPO INFORMATION ====================================================================================
app.get('/user/bitbucket/repo/:name', async (req,res) => {
    let repoArray = [];
    let repoObj;
    let username = req.params.name;

    //Gets the last 5 repos by creation date
    const repos = await fetch("https://api.bitbucket.org/2.0/repositories/" + username + "?pagelen=" + 5 + "&sort=-created_on");
    let reposJson = await repos.json();
    repoObj = reposJson;

    /**
     * This loops through each repo, getting the repo name from the above fetch result, and gets the last 5 commit
     * messages. A new object is created for each repo, making a nice package of consisting of the repos name, description, creation date and 5 commits
     * that can be used for the to display the repos easily.
     */
    // The first loop gets the repo commits details for a repo
    for (let index = 0; index < repoObj.values.length; index++) {
        // Fetches the last 5 commits for the current repo
        let repoCommits = await fetch(repoObj.values[index].links.commits.href + "?pagelen=" + 5);
        let commits = await repoCommits.json();

        // Object is created and initialized
        var repoInfoObj = new Object();
        repoInfoObj.repoName = repoObj.values[index].name;
        repoInfoObj.createdOn = (repoObj.values[index].created_on).substr(0, 10);
        repoInfoObj.commitMsg = [];
        
        /** 
         * This loop runs through the previouse fetch results picking out the commit messages and 
         * pushing the message to the objects "commitMsg array"
         */
        for (let index2 = 0; index2 < commits.values.length; index2++) {
            repoInfoObj.commitMsg.push(commits.values[index2].rendered.message.raw);
        }   
        // The object is the pushed to repoArray ( This is what is sent back to the app )  
        repoArray.push(repoInfoObj);
    }
    // repoArray sent back to react app
    res.send(repoArray);
})

app.listen(PORT, () => {
    console.log(`My ears are open on port ${PORT}...`);
})