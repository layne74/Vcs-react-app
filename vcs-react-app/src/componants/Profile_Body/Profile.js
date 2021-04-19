import React from 'react'
import InstructionsPage from '../../media/landing-page-picture.png'
import GithubProfile from './GithubProfile'
import GitLabProfile from './GitLabProfile'
import GitbucketProfile from './GitbucketProfile'
import './Profile.css'


export default function Profile( props ) {
    // Props Deconstruction
    const { accounts, vcsChosen} = props

    // Switch case for vcs
    // If no vcs has been chosen yet then the instructions page is shown
    switch (vcsChosen) {
        case 0:
            // Returns the github profile template
            return (
                <div className="profile-div">
                    <GithubProfile accounts={accounts} vcsChosen={vcsChosen}/>
                </div>
            )
        case 1:
            // Returns the gitlab profile template
            return (
                <div className="profile-div">
                    <GitLabProfile accounts={accounts} vcsChosen={vcsChosen}/>
                </div>
            )
        case 2:
            // Returns the gitbucket profile template
            return (
                <div className="profile-div">
                    <GitbucketProfile accounts={accounts} vcsChosen={vcsChosen}/>
                </div>
            )
        default:
            // Returns the instructions
            return (
                <div>
                    <img alt="instructions-avatar" src={InstructionsPage}></img>
                </div>
            )

    }
}
