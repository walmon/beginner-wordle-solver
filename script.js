const dictionaryUrl = 'https://raw.githubusercontent.com/matthewreagan/WebstersEnglishDictionary/master/dictionary.json';

let applicableWords = []
const app = () =>{
    console.log('starting')

    fetch(dictionaryUrl).then(response => response.json())
    .then(data => {
        applicableWords = mergeSort(
            rankWords(
            Object.keys(data).filter(w=>w.length === 5)), 'vowels'
        ).reverse()

        initUI()

        renderWords(applicableWords, 'best-words-list')
    }).catch((err)=>{
        console.error(err)
        alert('Could not pull dictionary')
    })
}

function initUI(){
    document.getElementById('menu').classList.remove('hidden')
    
    const loadingEl = document.getElementById('loading')
    loadingEl.classList.add('hidden')
}

function initStep1(){
    document.getElementById('step1').classList.remove('hidden')
    document.getElementById('step2').classList.add('hidden')
}

function initStep2(){
    document.getElementById('step1').classList.add('hidden')
    document.getElementById('step2').classList.remove('hidden')
}

function getNextWords(){
    const arr = []
    const inputs = ['first-letter','second-letter', 'third-letter', 'fourth-letter', 'fifth-letter']
    inputs.forEach((id,index)=>{
        const text = document.getElementById(id).value
        if(text){
            const match = document.getElementById(id+'-match-type').checked
            arr.push({
                letter: text,
                exact: match
            })
        }else{
            arr.push({
                letter: null,
                exact: null
            })
        }
    })

    console.log(arr)

    const words = filterNextWords(applicableWords, arr)
    console.log(words)
    renderWords(words, 'best-next-words-list')
}

function filterNextWords(words, arr){
    return words.reduce((list,word)=>{
        let add = true
        for(let i=0; i<5; i++){
            const match = arr[i]
            if(match.letter){
                // Try to check
                if(match.exact){
                    if(word.text[i] !== match.letter){
                        add = false
                    }
                }else{
                    let looseMatchAnywhere = false
                    for(let y=0;y < 5; y++){
                        if(word.text[y] === match.letter){
                            looseMatchAnywhere = true
                        }
                    }
                    if(!looseMatchAnywhere) add = false
                }
            }
        }
        if(add){
            list.push({
                text: word.text
            })
        }
        return list
    }, [])
}

function renderWords(words, id){
    document.getElementById(id).innerHTML = '';
    words = words.length ? words : [{text:'not matches found'}]
    words.forEach(word => {
        let li = document.createElement('li')
        li.append(word.text)

        document.getElementById(id).appendChild(li)
    })
}

function rankWords(words){
    return words.map(w=>{
        const vowels = ['a','e','i','o','u'].reduce((count, letter)=> {
            count = hasLetter(w, letter) ? count + 1 : count
            return count
        }, 0)
        return {
            text: w,
            vowels,
        }
    })
}

function merge(l, r, key) {
    let arr = []
    while (l.length && r.length) {
        if (l[0][key] < r[0][key]) {
            arr.push(l.shift())  
        } else {
            arr.push(r.shift()) 
        }
    }
    return [ ...arr, ...l, ...r ]
}

function mergeSort(array, vowels) {
    const half = array.length / 2
    
    if(array.length < 2){
      return array 
    }
    
    const left = array.splice(0, half)
    return merge(mergeSort(left, vowels), mergeSort(array, vowels), vowels)
}

function hasLetter(word, letter){
    return word.split(letter).length - 1
}

app()