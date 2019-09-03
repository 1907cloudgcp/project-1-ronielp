let dbObject = {
    Name: '',
    Age:'',
    Color:''
}

document.getElementById('header').innerText = "Revature Antarctica";

//this assumes your cloud function will return a value named address with the address to an image, in a cloud storage bucket
async function setUpImages(){
    let images = []
    images.push(document.getElementById('carousel-1'))
    images.push(document.getElementById('carousel-2'))
    images.push(document.getElementById('carousel-3'))
    images.forEach(async (value, index)=>{
        //index is the numbered image in the carousel if that matters to you
        let response = await fetch("https://us-central1-rev-antarctica.cloudfunctions.net/get-bucket-images?i="+index)
        
    if(response.status <200 || response.status > 299){
        value.src = "images/penguins.jpg"
    } else {
        data =  await response.json()
        value.src = data["p"]
    }
    })
}
setUpImages()

document.getElementById('calc-label').innerText = "Input a Word: "

document.getElementById('calc-input').type = 'text'

async function calcSubmit(event){
    event.preventDefault()
    let input_word = document.getElementById('calc-input').value
    //let result = await fetch("https://us-central1-rev-antarctica.cloudfunctions.net/calc-input?input_word=${input_word}", {
    let result = await fetch("https://us-central1-rev-antarctica.cloudfunctions.net/calc-input?input_word=" + input_word, {
        method: 'POST',
        body: JSON.stringify(document.getElementById('calc-input').value)
    })
    if(document.getElementById('calc-input').type === 'number'){
        document.getElementById('calc-input').value = 0
    } else {
        document.getElementById('calc-input').value = ''
    }
    let data = await result.json()
    let div = document.getElementById('calc-container')
    let display = document.createElement('p')
    display.innerText = `The length of the word was: ${data} `
    div.appendChild(display)
}



async function buildTable (){
    let objectResponse = await fetch("https://us-central1-rev-antarctica.cloudfunctions.net/get-data")
    if(objectResponse.status <200 || objectResponse.status >299){
        let error =document.createElement('p')
        error.innerText = "Fetch Failed"
        document.getElementById('footer-table').appendChild(error)
    }else {
        let objectList = await objectResponse.json()
       
        let headRow = document.createElement('tr')
        document.getElementById('object-table-head').appendChild(headRow)
        for(key in dbObject){
            let th = document.createElement('th')
            th.innerText = key
            th.className = 'object-table-data'
            headRow.appendChild(th)
        }
        
        objectList = objectList.map((e)=>{
            let newe = {};
            for(key in dbObject){                
                newe[key] = e[key]
            }
            return newe
        })
        let tbody = document.getElementById('object-table-body')
        objectList.forEach((v)=>{
            let row = document.createElement('tr')
            tbody.appendChild(row)
            for(key in v){
                let data = document.createElement('td')
                data.innerText = v[key]
                data.className = 'object-table-data'
                row.appendChild(data)
            }
        })
        
    }
}

function buildForm(){
    for(key in dbObject){
        let div = document.createElement('div')
        div.className = 'form-group'
        document.getElementById('footer-form').appendChild(div)
        let form = document.createElement('input')
        form.className = 'form-control'
        if(typeof(key) === 'number'){
            form.type = 'number'
        } else{
            form.type = 'text'
        }
        form.id = `${key}id`
        let label = document.createElement('label')
        label.for = form.id
        label.innerText = key
        div.appendChild(label)
        div.appendChild(form)
    }

}

function createObject(event){
    event.preventDefault()
    console.log(event);
    let newObj = {}
    for(key in dbObject){
        let input = document.getElementById(`${key}id`)
        newObj[key] = input.value
        if(input.type === 'number'){
            input.value = 0
        } else {
            input.value = ''
        }
    }
    
    fetch('https://us-central1-rev-antarctica.cloudfunctions.net/store-object',{
        method: 'POST',
        body: JSON.stringify(newObj)
    })
}



buildTable()
buildForm()
