
var state = {
    amount: 10,
    difficulty: "easy",
    selected_txt: "",   
    correct_txt: "",
    all_options_comp: [],
    
    correct_or_wrong: 0,
    still_running: 1,

    current_question: 0,
    max_questions: 10,
    question_ans: []
};



//using a IIFE 
(async function (){
    /** get json data from endpoint: hitting an API 
     * 1. Use fetch to get the data from an API 
    */
    const endpoint = `https://opentdb.com/api.php?amount=${state.amount}&difficulty=${state.difficulty}&type=multiple`
    const questions = await ( await fetch(endpoint)).json()//the double await is to ensure that the fetching endpoint and conversion to json is received well 
    //NB: try and handle errors like ERR_CONNECTION_TIMED_OUT 

    const res = questions.results //shorten the variable result
    console.log(res)  //results

    //...  : spread operator, it says the array should be spread out 
    function shuffleArray(array){
       return [...array].sort(() => Math.random() - 0.5)
    } 

    /** Populate the whole page with the data of index */
    function fillUpForIndex(index){
        /** Question */
        const questionDivComp = document.querySelector(".question_sentence")
        questionDivComp.textContent = res[index].question

        /** options */
        all_options = shuffleArray([...res[index].incorrect_answers, res[index].correct_answer])
        state.correct_txt = res[index].correct_answer
        console.log(all_options)  //all options in the question list 
        
        //populate the options to the page 
        state.all_options_comp =[]

        // const questionOptionBox = document.querySelector(".option_box")
        const questionOptionBox = document.querySelector(".option_box")

        // if( Array.from(questionOptionBox.children).length) 
        while (questionOptionBox.children.length) {
            questionOptionBox.removeChild(questionOptionBox.firstChild)
            // questionOptionBox.removeChild(questionOptionBox.children[0])
            // console.log(" Has child nodes" + questionOptionBox.children.length)
        }
        
        

        for (let opt of all_options){
            const questionOption = document.createElement("li")
            questionOption.textContent = opt 
            questionOption.classList.add("options") 
            
            questionOptionBox.appendChild(questionOption)

            state.all_options_comp.push(questionOption)

            questionOption.addEventListener("click", (e) => {
                if (state.still_running == 0) return 

                state.all_options_comp.forEach(comp => {
                    comp.classList.remove("selected")
                })
                questionOption.classList.add("selected")
                state.selected_txt = questionOption.textContent
            })
        }

        //disable or enable buttons based on question position 
        if (state.current_question == 0){
            prevBtn.disabled = true
        }else {
            prevBtn.disabled = false
        }
        if (state.current_question == (state.max_questions - 1)){
            nextBtn.disabled = true
        }else{
            nextBtn.disabled = false
        }

        state.still_running = 1
        
    }

    
    /** Enter button */
    const enterBtn = document.querySelector(".enter_btn")
    enterBtn.addEventListener("click", (e) => {
        //i'm using for loop because of the break statement which is 
        //not available in foreach 
        if (state.selected_txt == state.correct_txt){
            state.correct_or_wrong = 1
        }

        for (let comp of state.all_options_comp) {
            if (comp.textContent == state.selected_txt 
                && state.correct_or_wrong == 0){
                comp.classList.add("wrong")
            }else if (comp.textContent == state.correct_txt)
            {
                comp.classList.add("right")
            }
            state.still_running = 0
        }
    })

    /** Prev and Next button */
    const prevBtn = document.querySelector(".prev_btn")
    const nextBtn = document.querySelector(".next_btn")

    prevBtn.addEventListener("click", (e) => {
        // state.current_question++
        // fillUpForIndex(state.current_question)
    })

    nextBtn.addEventListener("click", (e) => {
        state.current_question++
        fillUpForIndex(state.current_question)
    })


    fillUpForIndex(0)
}) ();

