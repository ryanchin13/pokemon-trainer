//Author: Ryan Chin
//HC: I pledge my honor that I have abided by the Stevens Honor System;
//Description: File that will handle error checking for varied inputs

function checkId(id) {
    if(!id) {
        throw `Error: ${id}: ${id || "parameter"} not given`;
    }
    if(id.trim().length === 0) {
        throw `Error: id parameter is just white space or empty.`;
    }
    // if(!Number.isInteger(val) || val<=0) {
    //     throw `Error: id: ${string} is not a positive whole number.`
    // }
}

function checkPage(pagenum) {
    if(!pagenum) {
        throw `Error: ${pagenum}: ${pagenum || "parameter"} not given`;
    }
    if(pagenum.trim().length === 0) {
        throw `Error: pagenum parameter is just white space or empty.`;
    }
    const val = Number(pagenum);
    if(Number.isNaN(val)) {
        throw `Error: pagenum: ${pagenum} is not a positive whole number greater than 0.`
    }
    if(!Number.isInteger(val) || val<0) {
        throw `Error: pagenum: ${pagenum} is not a positive whole number greater than 0.`
    }
	// if(pagenum > totalPages) {
    //     throw `There are no results for page ${pagenum}, the last page is ${totalPages}`
    // }
}

function checkName(name) {
    if(!name) throw `Error: Must give name for Trainer`
    if(name.trim().length === 0) throw `Error: name must not be solely white space or empty`
    if(typeof name !== 'string') throw `Error: name must be of type string`
}

module.exports = { 
    checkId,
    checkPage,
    checkName
}