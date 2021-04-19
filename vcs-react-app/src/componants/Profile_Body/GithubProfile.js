import React, { Component } from 'react'
import Repos from './Repos';
import Loading from '../../media/loadingHourGlass.gif'

export default class GithubProfile extends Component {
    
    constructor( props ) {
        super( props );
        // States
        this.state = {
            repos: null,
            isLoaded: false
        }
    }
    
    // Fetches the repos for onload
    componentDidMount() {
        fetch('/user/github/repo/' + this.props.accounts[this.props.vcsChosen].login)
        .then(res => res.json())
        .then( (response) => {
            // States are set, load state is changed
            this.setState({
                repos: response,
                isLoaded: true
            })
        })
        // If there is a error fetching data
        .catch((error) => {
            console.log(error )
        })
    }

    render() {
        // Props deconstruction
        const { accounts, vcsChosen } = this.props;

        // Shows the users details first while the repo list is loading
        if (!this.state.isLoaded) {
            return (
                <div>
                    {/* User information section */}
                    <div className="top-container">
                        <div className="row">
                            {/* Profile picture section */}
                            <div className="pro-pic-div col-4">
                                <img alt="avatar" className="profile-picture" src={accounts[vcsChosen].avatar_url}></img>
                            </div>
                            {/* Side info section */}
                            <div className="side-info col-8">
                                <p><i className="fa fa-user-circle-o" aria-hidden="true"></i>&emsp;{accounts[vcsChosen].login}</p>
                                <p><i className="fa fa-address-card" aria-hidden="true"></i>&emsp;{accounts[vcsChosen].name}</p>
                                <p><i className="fa fa-quote-left" aria-hidden="true"></i>&emsp;{((accounts[vcsChosen].bio === null ? "No bio provided" : accounts[vcsChosen].bio))}</p>
                                <p><i className="fa fa-map-marker" aria-hidden="true"></i>&nbsp;&emsp;{accounts[vcsChosen].location}</p>
                                <a href={accounts[vcsChosen].html_url} target="blank"><button >Go to Github</button></a>
                            </div>
                        </div>
                    </div>
                    <hr></hr>
                    {/* Extra information section */}
                    <div className="second-info">
                        <p>Total repos: {accounts[vcsChosen].public_repos}</p>
                        <p>Gists: {accounts[vcsChosen].public_gists}</p>
                        <p>Followers: {accounts[vcsChosen].followers}</p>
                        <p>Following: {accounts[vcsChosen].following}</p>
                    </div>
                    <hr></hr>
                    {/* Repository section section */}
                    <div className="loading-div">
                        <h2>Loading Recent Repos...</h2>
                        <img alt="loading-gif" className="loadingGif" src={Loading}></img>
                    </div>
                </div>
            )
        // Shows the repo list once it has finished loading
        }else {
            return (
                <div>
                    {/* User information section */}
                    <div className="top-container">
                        <div className="row">
                            {/* Profile picture section */}
                            <div className="pro-pic-div col-4">
                                <img alt="avatar" className="profile-picture" src={accounts[vcsChosen].avatar_url}></img>
                            </div>
                            {/* Side info section */}
                            <div className="side-info col-8">
                                <p><i className="fa fa-user-circle-o" aria-hidden="true"></i>&emsp;{accounts[vcsChosen].login}</p>
                                <p><i className="fa fa-address-card" aria-hidden="true"></i>&emsp;{accounts[vcsChosen].name}</p>
                                <p><i className="fa fa-quote-left" aria-hidden="true"></i>&emsp;{((accounts[vcsChosen].bio === null ? "No bio provided" : accounts[vcsChosen].bio))}</p>
                                <p><i className="fa fa-map-marker" aria-hidden="true"></i>&nbsp;&emsp;{accounts[vcsChosen].location}</p>
                                <a href={accounts[vcsChosen].html_url} target="blank"><button >Go to Github</button></a>
                            </div>
                        </div>
                    </div>
                    <hr></hr>
                    {/* Extra information section */}
                    <div className="second-info">
                        <p>Total repos: {accounts[vcsChosen].public_repos}</p>
                        <p>Gists: {accounts[vcsChosen].public_gists}</p>
                        <p>Followers: {accounts[vcsChosen].followers}</p>
                        <p>Following: {accounts[vcsChosen].following}</p>
                    </div>
                    <hr></hr>
                    {/* Repository section section */}
                    <div>
                        <h3>Repositories</h3>
                    </div>
                    <div>
                        <Repos repos={this.state.repos}/>
                    </div>
                </div>
            )
        }
        
    }
}
