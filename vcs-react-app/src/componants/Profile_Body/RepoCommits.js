import React from 'react'
import './RepoCommits.css'

export default function RepoCommits( props ) {
    const { commitMsg } = props;

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
