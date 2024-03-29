
/**
 * Utilities
 */







/**
 * Content Statibilzation
 */
export function StabilizeContent(content: string | null) : string{

    return (content||'')
    
        .replace(/&gt;/g, `>`).replace(/&lt;/g, `<`)

        // .replace(/&#34;/g, `"`)
        
    ;

}





/**
 * Array Refactor from key to key
 */
 export function ArrayRange<T>(args:T[], from?: number, to?: number){

    const out : T[] = []

    from = from || 0;
    
    to = to || args.length;


    from = from < 0 ? 0 : from;

    to = to > args.length ? args.length : to;


    for (let x = (from); x < args.length; x++) { out.push( args[x] ); }
    
    return out;
    
}






export function decodeHTMLEntities(input: string){

    const tmp = document.createElement('textarea')

    tmp.innerHTML = input;
    
    return tmp.value
    
}




export function encodeHTMLEntities(input: string){

    const tmp = document.createElement('textarea')

    tmp.innerText = input;
    
    return tmp.innerHTML

}






/**
 * Convert URI Query to Object
 */
export function URIParams<T extends { [Key : string] : any }>(query : string){

    const out : T = {} as T

    const u = new URL(`http://exemple.com/?${ query }`)

    for(const [k, v] of u.searchParams){

        const key = k as keyof T;

        try{

            out[ key ] = JSON.parse( decodeURIComponent(v) ) as T[ keyof T]
            
        }
        
        catch(e){
            
            out[ key ] = decodeURIComponent(v) as T[ keyof T]
            
        }
        


    }
    
    return out
    
}




export function URIParamsQuery(params : object) : string | undefined{

    const parse = Object.entries(params)
    
    let output : string[] = []

    if(parse.length){

        parse.map($=>{

            if(typeof $[1] == 'object'){

                output[ output.length ] = (URIParamsQuery($[1])||'')
                
            }

            else{

                output[ output.length ] = `${ $[0] }=${ encodeURIComponent($[1]) }`
                
            }
            
        });


        return output.join('&')
        
    }


    return undefined
    
}






/**
 * Object is Empty
 */

export function isEmptyObject($object : object) : boolean{

    return Object.values($object).length === 0;
    
}




/**
 * Clone Object
 */

export function CloneObject<T>(input: T, deep: boolean = true) : T{

    if(deep == false){

        return {...input} as T
        
    }


    else{

        const o = {...input} as T
        

        Object.entries(input).map($=>{

            const name = $[0] as keyof T

            const value: typeof $[1] = $[1]


            if(typeof $[1] == 'object'){

                o[ name ] = CloneObject<typeof value>(value, true);
                
            }

            else{

                o[ name ] = value;
                
            }
            
        })
        

        return o;
        
    }
    
}






/**
 * Check if Instance Function is a true Function but not Class Funciton
 */

export function isFunction(instance : Function | object) : boolean {
    
    const props = Object.getOwnPropertyNames(instance);
    
    return (!props.includes('prototype') || props.includes('arguments'));
    
}


/**
 * Check if Instance Function is a true Class but not Funciton
 */

export function isClass(instance : Function | object) : boolean {
    
    return !isFunction(instance);
    
}







/**
 * Node Descent
 */
export function NodeDescent(parent : HTMLElement, child : Node | HTMLElement) {
    
    var node = child.parentNode;

    while (node != null) {
   
        if (node == parent) { return true; }
   
        node = node.parentNode;
   
    }

    return false;

}



/**
 * Find Node Descent
 */
export function FindParental(
    
    child : Node | HTMLElement, 
    
    validator : (parent : ParentNode) => boolean
    
){
    
    var node = child.parentNode;

    while (node != null) {
   
        if (validator(node) === true) { return node; }
   
        node = node.parentNode;
   
    }

    return null;

}








/**
 * Fix JSON
 */
// export function JSONSafeParse<T extends object>(json: string) : T | null{

//     let fixed : T = {} as T

//     /**
//      * @Solution from https://stackoverflow.com/a/59329495/18059411
//      */

//     function bulkRegex(str: string, callback: Function | Array<Function>){
//         if(callback && typeof callback === 'function'){
//             return callback(str);
//         }else if(callback && Array.isArray(callback)){
//             for(let i = 0; i < callback.length; i++){
//                 if(callback[i] && typeof callback[i] === 'function'){
//                     str = callback[i](str);
//                 }else{break;}
//             }
//             return str;
//         }
//         return str;
//     }


//     if(json && json !== ''){
//         if(typeof json !== 'string'){
//             try{
//                 json = JSON.stringify(json);
//             }catch(e){return null;}
//         }
//         if(typeof json === 'string'){
//             json = bulkRegex(json, [
//                 (str:string) => str.replace(/[\n\t]/gm, ''),
//                 (str:string) => str.replace(/,\}/gm, '}'),
//                 (str:string) => str.replace(/,\]/gm, ']'),
//                 (str:string) => {
//                     let astr = str.split(/(?=[,\}\]])/g);
//                     astr = astr.map(s => {
//                         if(s.includes(':') && s){
//                             let strP = s.split(/:(.+)/, 2);
//                             strP[0] = strP[0].trim();
//                             if(strP[0]){
//                                 let firstP = strP[0].split(/([,\{\[])/g);
//                                 firstP[firstP.length-1] = bulkRegex(firstP[firstP.length-1], (p:string) => p.replace(/[^A-Za-z0-9\-_]/, ''));
//                                 strP[0] = firstP.join('');
//                             }
//                             let part = strP[1].trim();
//                             if((part.startsWith('"') && part.endsWith('"')) || (part.startsWith('\'') && part.endsWith('\'')) || (part.startsWith('`') && part.endsWith('`'))){
//                                 part = part.substr(1, part.length - 2);
//                             }
//                             part = bulkRegex(part, [
//                                 (p:string) => p.replace(/(["])/gm, '\\$1'),
//                                 (p:string) => p.replace(/\\'/gm, '\''),
//                                 (p:string) => p.replace(/\\`/gm, '`'),
//                             ]);
//                             strP[1] = ('"'+part+'"').trim();
//                             s = strP.join(':');
//                         }
//                         return s;
//                     });
//                     return astr.join('');
//                 },
//                 (str:string) => str.replace(/(['"])?([a-zA-Z0-9\-_]+)(['"])?:/g, '"$2":'),
//                 (str:string) => {
//                     let astr = str.split(/(?=[,\}\]])/gi);
//                     astr = astr.map(s => {
//                         if(s.includes(':') && s){
//                             let strP = s.split(/:(.+)/, 2);
//                             strP[0] = strP[0].trim();
//                             if(strP[1].includes('"') && strP[1].includes(':')){
//                                 let part = strP[1].trim();
//                                 if(part.startsWith('"') && part.endsWith('"')){
//                                     part = part.substring(1, part.length - 2);
//                                     part = bulkRegex(part, (p:string) => p.replace(/(?<!\\)"/gm, ''));
//                                 }
//                                 strP[1] = ('"'+part+'"').trim();
//                             }
//                             s = strP.join(':');
//                         }
//                         return s;
//                     });
//                     return astr.join('');
//                 },
//             ]);
//             try{
//                 fixed = JSON.parse(json);
//             }catch(e){return null;}
//         }
//         return fixed;
//     }

//     return null;

// }


