import React from 'react';

module.exports = class Course extends React.Component {
    #name;
    #code;
    #credits;

    constructor(_name) {
        super();
        this.name = _name;
    }

    render() {
        return <h1>Hello, I am {this.name}</h1>;
    }
}