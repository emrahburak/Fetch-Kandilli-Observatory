
//const got = require("got");
const axios = require("axios");
const cheerio = require("cheerio");


const uri = "http://www.koeri.boun.edu.tr/scripts/lst0.asp";

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

//function flatten(acc, item){
//    if(item !== ""){
//        return [...acc, ...item.reduce(flatten, [])]
//    }
//    return [...acc, item]
//}

axios.get(uri)  // Layer of request 
.then(response => {   //layer of htmlParse
    const $ = cheerio.load(response.data);
    return $('pre').html().split("\n").slice(7,10);
})
.then(data => data.reduce((acc,val)=>{
    return [...acc, val.split("\n") && val.split(" ").reduce((acc, item )=> 
    item !== '' ? [...acc, item] : acc,[])
 ];
},[]))
.then( res => console.log(res))
.then(result => console.log(result))
.catch(err => console.log(err))



//.then( data => data.map(line => line.split(' ')).filter( item => {
//    return item !== undefined;
//}))
//.then( quality => console.log(quality))
