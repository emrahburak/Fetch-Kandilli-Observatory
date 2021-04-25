
const axios = require("axios");
const cheerio = require("cheerio");


console.log("start script")
//meta data
const url = "http://www.koeri.boun.edu.tr/scripts/lst0.asp";
const template = {
    tarih:'',
    saat: '',
    enlem: '',
    boylam: '',
    derinlikkm: '',
    md: '',
    ml: '',
    yer: '',
    cozumniteligi: '',
}

//helpers
// /\(.*\)|\{.*\}|\[.*\]/
const isUpperAlphaOrBrackets = str => str.match(/^[A-Z]+$|\(.*\)/) && true;
const isIlksel = str => str.match(/.*(sel)/) ? true:false
const isRevize = str => str.match(/^[A-Z]+[0-9]+$/) && true;

//run
axios.get(url)  // Layer of request
.then(response => {   //layer of htmlParse
    const $ = cheerio.load(response.data);
    return $('pre').html().split("\n").slice(7);  // We dont need the first 7 lines.
})
.then(chunk => chunk.reduce((acc,val)=> { // cleaning data
    return [...acc, val.split("\n") && val.split(" ").reduce((acc, item )=>
    item !== '' ? [...acc, item] : acc,[]) ];
},[]))
.then(data => data.map((item) => { //concat data and template
    if(Array.isArray(item)){
        return { ...template,
            [Object.keys(template)[0]]:item[0],
            [Object.keys(template)[1]]:item[1],
            [Object.keys(template)[2]]:item[2],
            [Object.keys(template)[3]]:item[3],
            [Object.keys(template)[4]]:item[4],
            [Object.keys(template)[5]]:item[5],
            [Object.keys(template)[6]]:item[6],
            [Object.keys(template)[7]]:item.reduce((acc, item) => {
                if(isUpperAlphaOrBrackets(item)) return acc.concat(' ',item);
                return acc;
            },""),
            [Object.keys(template)[8]]:item.reduce((acc,val) => {
                if(isIlksel(val)) return acc.concat("İlksel");
                if(isRevize(val)) return acc.concat(item.slice(item.indexOf(val)));
                return acc;
            },"")
        }
    }
    return [ ...item]
},[]))
.then(query => console.log(query))
.catch(err => console.log(err))
//.then(result => console.log(JSON.stringify(result)))
console.log("end script")

    