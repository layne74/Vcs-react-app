import React from 'react'

export default function RepoCommits( props ) {
    // Props deconstruction
    const { commitMsg } = props;

    // Maps the commit messages
    const listItems = commitMsg.map((msg, index) =>
        <li key={index.toString()}>
            {msg}
        </li>
    );
    
    return (
        <ul>
            {listItems}
        </ul>
    )
}
