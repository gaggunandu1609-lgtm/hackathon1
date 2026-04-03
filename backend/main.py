from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import random

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app = FastAPI(title="Quiz App API")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root path for API health check
@app.get("/api/health")
def api_health():
    return {"message": "API is live"}

# Serve frontend static files
# Note: This should be at the END of the file to not shadow API routes
# But we will use a catch-all route at the bottom instead.

# Models
class QuestionBase(BaseModel):
    id: int
    text: str
    options: List[str]
    category: str
    difficulty: str

class Question(QuestionBase):
    correct_answer: str

class AnswerSubmit(BaseModel):
    question_id: int
    selected_option: Optional[str] = None

class QuizSubmit(BaseModel):
    answers: List[AnswerSubmit]

class AnswerResult(BaseModel):
    question_id: int
    selected_option: Optional[str]
    correct_answer: str
    is_correct: bool

class QuizResult(BaseModel):
    score: int
    total: int
    results: List[AnswerResult]

class UserLogin(BaseModel):
    username: str
    password: str

class UserSignup(BaseModel):
    username: str
    password: str
    role: str  # "provider" or "student"

class NewQuestion(BaseModel):
    text: str
    options: List[str]
    correct_answer: str
    category: str
    difficulty: str

# Users database
USERS = [
    {"username": "admin", "password": "admin123", "role": "provider"},
    {"username": "student", "password": "student123", "role": "student"}
]

# In-memory database
QUESTIONS = [
    {
        "id": 1,
        "text": "What does HTML stand for?",
        "options": ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language", "Hyper Tool Markup Language"],
        "correct_answer": "Hyper Text Markup Language",
        "category": "HTML",
        "difficulty": "Easy"
    },
    {
        "id": 2,
        "text": "Choose the correct HTML element for the largest heading:",
        "options": ["<heading>", "<h1>", "<h6>", "<head>"],
        "correct_answer": "<h1>",
        "category": "HTML",
        "difficulty": "Easy"
    },
    {
        "id": 3,
        "text": "What is the correct syntax to output 'Hello World' in Python?",
        "options": ["echo 'Hello World'", "p('Hello World')", "print('Hello World')", "console.log('Hello World')"],
        "correct_answer": "print('Hello World')",
        "category": "Python",
        "difficulty": "Easy"
    },
    {
        "id": 4,
        "text": "How do you insert COMMENTS in Python code?",
        "options": ["// This is a comment", "/* This is a comment */", "# This is a comment", "<!-- This is a comment -->"],
        "correct_answer": "# This is a comment",
        "category": "Python",
        "difficulty": "Easy"
    },
    {
        "id": 5,
        "text": "Which of the following is not a standard React hook?",
        "options": ["useState", "useEffect", "useContext", "useFetch"],
        "correct_answer": "useFetch",
        "category": "React",
        "difficulty": "Medium"
    },
    {
        "id": 6,
        "text": "What does CSS stand for?",
        "options": ["Cascading Style Sheets", "Computer Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"],
        "correct_answer": "Cascading Style Sheets",
        "category": "CSS",
        "difficulty": "Easy"
    },
    {
        "id": 11,
        "text": "Which PHP function is used to output text?",
        "options": ["echo", "print()", "write()", "printf()"],
        "correct_answer": "echo",
        "category": "PHP",
        "difficulty": "Easy"
    },
    {
        "id": 12,
        "text": "PHP variables start with which prefix?",
        "options": ["&", "!", "$", "#"],
        "correct_answer": "$",
        "category": "PHP",
        "difficulty": "Easy"
    },
    {
        "id": 13,
        "text": "Which data structure follows the Last-In-First-Out (LIFO) principle?",
        "options": ["Queue", "Linked List", "Stack", "Binary Tree"],
        "correct_answer": "Stack",
        "category": "Data Structures",
        "difficulty": "Medium"
    },
    {
        "id": 14,
        "text": "What is the time complexity of searching an element in a balanced Binary Search Tree?",
        "options": ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
        "correct_answer": "O(log n)",
        "category": "Data Structures",
        "difficulty": "Medium"
    },
    {
        "id": 15,
        "text": "In Data Science, what does CSV stand for?",
        "options": ["Comma Separated Values", "Computer System Values", "Common Serial Variables", "Control Source Version"],
        "correct_answer": "Comma Separated Values",
        "category": "Data Science",
        "difficulty": "Easy"
    },
    {
        "id": 16,
        "text": "Which library is most commonly used for numerical computations in Data Science (Python)?",
        "options": ["Matplotlib", "Pandas", "NumPy", "Scikit-Learn"],
        "correct_answer": "NumPy",
        "category": "Data Science",
        "difficulty": "Medium"
    },
    {
        "id": 17,
        "text": "What is the correct way to end a PHP statement?",
        "options": ["Full stop (.)", "Semicolon (;)", "New line", "Colon (:)"],
        "correct_answer": "Semicolon (;)",
        "category": "PHP",
        "difficulty": "Easy"
    },
    {
        "id": 19,
        "text": "What is the output of the following PHP code? <br/><code>$x = 5; $y = 10; echo $x + $y;</code>",
        "options": ["510", "15", "5", "Error"],
        "correct_answer": "15",
        "category": "PHP",
        "difficulty": "Easy"
    },
    {
        "id": 20,
        "text": "Which method is used in Python to add an element at the end of a list?",
        "options": ["add()", "push()", "append()", "insert()"],
        "correct_answer": "append()",
        "category": "Python",
        "difficulty": "Easy"
    },
    {
        "id": 21,
        "text": "In Data Science, which of the following is a supervised learning algorithm?",
        "options": ["K-Means Clustering", "Principal Component Analysis", "Linear Regression", "Association Rules"],
        "correct_answer": "Linear Regression",
        "category": "Data Science",
        "difficulty": "Medium"
    },
    {
        "id": 22,
        "text": "What is the result of <code>bool([0])</code> in Python?",
        "options": ["True", "False", "None", "Error"],
        "correct_answer": "True",
        "category": "Python",
        "difficulty": "Medium"
    },
    {
        "id": 23,
        "text": "Which SQL statement is used to extract data from a database?",
        "options": ["SELECT", "EXTRACT", "GET", "OPEN"],
        "correct_answer": "SELECT",
        "category": "SQL",
        "difficulty": "Easy"
    },
    {
        "id": 24,
        "text": "What does the 'public static void main(String[] args)' method do in Java?",
        "options": ["Defines a variable", "Declares an empty class", "Acts as the entry point of the application", "Imports a package"],
        "correct_answer": "Acts as the entry point of the application",
        "category": "Java",
        "difficulty": "Medium"
    },
    {
        "id": 25,
        "text": "What is a virtual function in C++?",
        "options": ["A function without a body", "A function defined in a base class that gets overridden in a derived class", "A function that cannot be inherited", "A built-in math function"],
        "correct_answer": "A function defined in a base class that gets overridden in a derived class",
        "category": "C++",
        "difficulty": "Hard"
    }
]

@app.get("/categories")
def get_categories():
    categories = list(set(q["category"] for q in QUESTIONS))
    return {"categories": categories}

@app.get("/questions", response_model=List[QuestionBase])
def get_questions(category: Optional[str] = None, difficulty: Optional[str] = None, limit: int = 10):
    filtered_questions = QUESTIONS
    if category and category.lower() != "all":
        filtered_questions = [q for q in filtered_questions if q["category"] == category]
    if difficulty and difficulty.lower() != "all":
        filtered_questions = [q for q in filtered_questions if q["difficulty"] == difficulty]
        
    # Shuffle options and questions to make it dynamic
    selected = random.sample(filtered_questions, min(len(filtered_questions), limit))
    
    # Do not leak correct answer to frontend in this endpoint
    response_questions = []
    for q in selected:
        shuffled_options = q["options"][:]
        random.shuffle(shuffled_options)
        response_questions.append({
            "id": q["id"],
            "text": q["text"],
            "options": shuffled_options,
            "category": q["category"],
            "difficulty": q["difficulty"]
        })
        
    return response_questions

@app.post("/submit", response_model=QuizResult)
def submit_quiz(submission: QuizSubmit):
    score = 0
    results = []
    
    # Map questions for fast lookup
    question_map = {q["id"]: q for q in QUESTIONS}
    
    for answer in submission.answers:
        q_id = answer.question_id
        if q_id not in question_map:
            continue
            
        correct_ans = question_map[q_id]["correct_answer"]
        is_correct = (answer.selected_option == correct_ans)
        
        if is_correct:
            score += 1
            
        results.append(AnswerResult(
            question_id=q_id,
            selected_option=answer.selected_option,
            correct_answer=correct_ans,
            is_correct=is_correct
        ))
        
    return QuizResult(
        score=score,
        total=len(submission.answers),
        results=results
    )

@app.post("/signup")
def user_signup(user: UserSignup):
    if any(u["username"] == user.username for u in USERS):
        raise HTTPException(status_code=400, detail="Username already exists")
    
    USERS.append({
        "username": user.username,
        "password": user.password,
        "role": user.role
    })
    return {"success": True, "message": "Signup successful"}

@app.post("/login")
def user_login(creds: UserLogin):
    user = next((u for u in USERS if u["username"] == creds.username and u["password"] == creds.password), None)
    if user:
        return {"success": True, "token": f"{user['username']}-secret", "role": user["role"]}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/admin/questions")
def add_question(question: NewQuestion):
    # Generate a new unique ID
    new_id = max((q["id"] for q in QUESTIONS), default=0) + 1
    new_q_dict = {
        "id": new_id,
        "text": question.text,
        "options": question.options,
        "correct_answer": question.correct_answer,
        "category": question.category,
        "difficulty": question.difficulty
    }
    QUESTIONS.append(new_q_dict)
    return {"success": True, "message": "Question added successfully!", "question": new_q_dict}

# --- SERVE FRONTEND ---
# Path to the frontend build directory
frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")

# Mount assets specifically (Vite puts them in dist/assets)
if os.path.exists(os.path.join(frontend_path, "assets")):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_path, "assets")), name="assets")

# Catch-all route to serve the React index.html for all other paths
@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    # Check if the requested file exists in the frontend dist folder
    file_path = os.path.join(frontend_path, full_path)
    if os.path.isfile(file_path):
        return FileResponse(file_path)
    
    # Otherwise, return index.html to let React Router handle it
    index_path = os.path.join(frontend_path, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    
    return {"message": "Frontend not built. Please build the frontend to see the UI."}

