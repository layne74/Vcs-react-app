import React from 'react'

export default function Results( props ) {
    // Prop deconstruction
    const { accounts, setVcsFunction, vcsChosen } = props;
    // array of vcs providers
    const resSites = ["GitHub", "GitLab", "BitBucket"]
    let counter = -1;

    // Maps the accounts prop
    let results = accounts.map( (item, index) => {
        counter++
        let assignedClass = (counter === vcsChosen ? "result-block active-block" : "result-block")
        // Each vcs has different names in the json. So using if I can differentiate between them all 
        // Stores result from query
        let resultItem;
        if (resSites[counter] === "GitHub") {
            resultItem = (
                <div key={index} className={assignedClass}>
                    <p className="result-title">{resSites[counter]}</p>
                    {/* The onclick sends back the id ( the vcs number whech tell the program what profile to load ) */}
                    {((item.login === undefined) ? <p>User not found</p> : <p className="response-name" id={counter} onClick={e => setVcsFunction(e.target.id)}>{item.login}</p>)}
                </div>
            )
        }else if (resSites[counter] === "GitLab") {
            resultItem = (
                <div key={index} className={assignedClass}>
                    <p className="result-title">{resSites[counter]}</p>
                    {/* The onclick sends back the id ( the vcs number whech tell the program what profile to load ) */}
                    {((item.length === 0) ? <p>User not found</p> : <p className="response-name" id={counter} onClick={e => setVcsFunction(e.target.id)}>{item.username}</p>)}
                </div>
            )
        }else if (resSites[counter] === "BitBucket") {
            resultItem = (
                <div key={index} className={assignedClass}>
                    <p className="result-title">{resSites[counter]}</p>
                    {/* The onclick sends back the id ( the vcs number whech tell the program what profile to load ) */}
                    {((item.type === "Error") ? <p>{item.reason}</p> : <p className="response-name" id={counter} onClick={e => setVcsFunction(e.target.id)}>{item.nickname}</p>)}
                </div>
            )
        }
        return resultItem
    });

    //Ignore this================================================================================Ignore this
    let btns = document.getElementsByClassName("response-name");
    
    for (let i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function() {
            let current = document.getElementsByClassName("active-block");
            if (current.length > 0) { 
                current[0].className = current[0].className.replace(" active-block", "");
            }
            this.parentNode.className += " active-block";
        });
    }
    //Ignore this================================================================================Ignore this


    return (
        <div id="result-row">
            {results}
        </div>
    )
}
