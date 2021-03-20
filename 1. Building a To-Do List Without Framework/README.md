# Building A TO-DO List Without Framework


## Making the Structure

1. Open your favourite text editor and create a file named `index.html` in the `submission` folder.

2. If you are using VSCode or any editor with `emmet` plugin installed you can type `!` and hit `Enter` to generate a HTML5 boilerplate to develop your page.
   [Learn More About The Generated Boilerplate](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics#anatomy_of_an_html_document)
   You will see something like this.
   ```html
   <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Document</title>
    </head>
    <body>
    </body>
    </html>
    ```
    You can change the `title` to your choice

3. Now inside the `body` tag create a `div` and give it an `id` of `todo`.

4. Now inside the `div` create a [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) with a `input` field with and a `button` to submit the form.
   ```html
   <form>
    <input type="text">
    <button type="submit">Submit</button>
   </form>
   ```

5. Give an `id` of `todo-form` to the `form` tag and set the `name` attribute of the input field to `todo-input` so that we can retrieve the value of the input field after form submit event. Optionally, you can also set the `placeholder` attribute to the `input` tag.
    [List of Attributes in input tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefplaceholder)

6. Now create a `div` to hold the todo list just below the closing `form` tag. Give the `div` an `id` of `todo-list`.
   
7. Feel free to add [`CSS`](https://developer.mozilla.org/en-US/docs/Web/CSS) to your app and style it to your likings.


## Adding Javascript

Now to add and remove items in the todo list, we will be using [javascript](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/JavaScript_basics).

We can use JavaScript code in HTML using two ways.
   - We can either include the JavaScript code internally within the HTML document itself.
   - We can keep the JavaScript code in a separate external file and then point to that file from the HTML document.

We will be using the first one but feel free to try the [second method](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_JavaScript_within_a_webpage#linking_an_external_script) also. 

1. Add a [`script`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script) tag just before the closing `body` tag. This is where we will write javascript code.

2. Now let us define an empty [`Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) to store the todo information.
    ```javascript
    let todoList = []
    ```

3. Now we need to create a [`function`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions) to return an [`object`](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Basics) which will get stored in the `todoList`.
   ```javascript 
   function generateTodoItem(itemName)
   {
       const timestamp = Date.now()
       return {
           id: 'todo-item-'+timestamp,
           name: itemName,
           timestamp, // Shorter way of writing `timestamp: timestamp`
           isDone: false
       }
   }
   ```
    **Note**: 
    - We could have also store only the `itemName` in the `Array` but it won't give us much flexibility to add features to our app.
    - In JavaScript, you can add any elements in an `Array` irrespective of their data type.

4. Now we need to create a `function` to return a new [`HTMLElement` (Representation of html element in javascript)](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) which will ultimately get appended to the `todo-list` div.
   
    ```javascript
    function todoElement(item)
    {
        const elem = document.createElement("li")
        elem.id = item.id
        elem.innerHTML = `
            <input type="checkbox" onchange="markItem(event)" ${item.isDone?'checked':''}/>
            <span>${item.name}</span>
            <button onclick="deleteItem(event)">
                Delete Item
            </button>`
        return elem
    }
    ```
    [Learn about Template Strings](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
    
    We will define the `deleteItem` and `markItem` functions later. 
    The `onclick` and `onchange` attributes are used to run the corresponding javascript function on `click` and `change` events of the html element.

    [See the various ways of registering Event Listeners](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Events#dom_event_handler_list)

    [See The List of Events](https://developer.mozilla.org/en-US/docs/Web/Events#event_listing)

5. Now we need to add the items that will be added in the `todoList` array to the `todo-list` div. Let us create function to render the items
    ```javascript
    function renderList()
    {
        const listElement = document.getElementById('todo-list')

        listElement.innerHTML = '' // To clear the contents of the todo-list before re-rendering

        for(let i=0;i<todoList.length;i++)
        {
            const todoItem = todoElement(todoList[i])
            listElement.appendChild(todoItem)
        }

        /* A simpler way to iterate an Array is to use Array.forEach method
        todoList.forEach(function (todoItem){
          listElement.appendChild(todoItem)  
        })
        */
    }
    ```


6. Now the important step is to handle the form submission event using javascript. There are two ways of doing this. The most common way is to attach an event handler to the form element. [Learn More](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) 
   ```javascript
   document.getElementById('todo-form').addEventListener('submit', function(event) {
        event.preventDefault() // This is to prevent the default behaviour of form submit event
        const itemName = event.target['todo-input'].value
        if(itemName) // A simple condition to check if itemName has some value or not
        {
            todoList.push(generateTodoItem(itemName))
            renderList()
            // After render we can reset the form
            // https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement#methods
            event.target.reset()
        }
   })
   ```
   The other way is to set the `onsubmit` attribute in the `form` tag.

7. Now lets write the functions to remove and mark items in the todoList array and render the list.
    ```javascript
    function markItem(event){
        const itemId = event.target.parentElement.id // getting the id of the parent element to search in the array
        todoList.some(function(todoItem){
            if(todoItem.id === itemId)
            {
                todoItem.isDone = !todoItem.isDone
                renderList()
                return true
            }
        })
    }

    function deleteItem(event){
        const itemId = event.target.parentElement.id // getting the id of the parent element to search in the array
        todoList.some(function(todoItem, i){
            if(todoItem.id === itemId)
            {
                todoList.splice(i, 1);
                renderList()
                return true
            }
        })
    }
    ```
    About [Array.some](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some) and 
    [Array.splice](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)


## Storing Information in Web Storage API
We can store the `todoList` array using the [`Web Storage API`](`https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API`) so that we don't lose the information on refresh
1. Create a `button` of `id` of `save-todo` to save the todo list in the [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage). 
   
   **Note:** This button should not be placed inside a form.

2. Create a function to handle the `click` event of the `button` and save the todo list in the `localStorage`
    ```javascript
    function saveTodo(e)
    {
        e.preventDefault()
        localStorage.setItem('todoList', JSON.stringify(todoList))
    }
    ```
    The data stored in `localStorage` is in key/value pair of string. So we need to convert the `Array` to JSON string using [`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) method. We can get back the original array using [`JSON.parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)

3. Now register the function to listen for `click` events. You can use `[target].addEventListener` method or set the `onclick` attribute to the `button` tag.

4. Now the last step is to check for any value in the `localStorage` while initializing the `todoList` Array
    ```javascript
    let todoList = []   
    try{
        if(localStorage.getItem('todoList'))
        {
            todoList = JSON.parse(localStorage.getItem('todoList'))
            renderList()
        }
    }catch(e)
    {
        console.log(e)
    }
    ```
    Using [`try catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) to handle any errors.

## Optional Tasks
   - Similar to the `Save` button to save the `todoList` to `localStorage`. Create a `Clear` button to remove the `todoList` item in `localStorage`
   - We have stored a timestamp property for every todo item. This timestamp is a `number` which is the number of milliseconds elapsed since [`January 1, 1970 00:00:00 UTC`](https://en.wikipedia.org/wiki/Unix_time). You need to parse the number and show it with each todo item in this format `HH:MM DD/MM/YYYY`.
   - Create an `Edit` button for each `todoItem` to edit it. You can also store a `modified` property in each `todoItem` to store the last modified timestamp and show it in the UI. You can use [`window.prompt()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/prompt) to get user input.
   - Show the checked items and unchecked items in separate lists
