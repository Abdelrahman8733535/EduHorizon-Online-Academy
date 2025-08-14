// English Level Test JavaScript

// Test questions and answers
const testQuestions = {
    q1: { correct: 'b', points: 1 },
    q2: { correct: 'b', points: 1 },
    q3: { correct: 'a', points: 1 },
    q4: { correct: 'b', points: 1 },
    q5: { correct: 'c', points: 1 }
};

// Level determination based on score
const levelMapping = {
    en: {
        0: 'Beginner',
        1: 'Beginner',
        2: 'Elementary',
        3: 'Intermediate',
        4: 'Upper Intermediate',
        5: 'Advanced'
    },
    ar: {
        0: 'مبتدئ',
        1: 'مبتدئ',
        2: 'ابتدائي',
        3: 'متوسط',
        4: 'متوسط متقدم',
        5: 'متقدم'
    }
};

// Level descriptions
const levelDescriptions = {
    en: {
        'Beginner': 'You are just starting your Arabic journey. We recommend starting with basic vocabulary and grammar courses.',
        'Elementary': 'You have basic Arabic knowledge. Focus on expanding vocabulary and simple sentence structures.',
        'Intermediate': 'You have a good foundation in Arabic. Work on complex grammar and conversation skills.',
        'Upper Intermediate': 'You have strong Arabic skills. Focus on advanced grammar and fluency.',
        'Advanced': 'Excellent! You have advanced Arabic skills. Consider specialized courses or teaching others.'
    },
    ar: {
        'مبتدئ': 'أنت في بداية رحلتك مع اللغة العربية. ننصح بالبدء بدورات المفردات الأساسية والقواعد.',
        'ابتدائي': 'لديك معرفة أساسية باللغة العربية. ركز على توسيع المفردات وتراكيب الجمل البسيطة.',
        'متوسط': 'لديك أساس جيد في اللغة العربة. اعمل على القواعد المعقدة ومهارات المحادثة.',
        'متوسط متقدم': 'لديك مهارات قوية في اللغة العربية. ركز على القواعد المتقدمة والطلاقة.',
        'متقدم': 'ممتاز! لديك مهارات متقدمة في اللغة العربية. فكر في الدورات المتخصصة أو تعليم الآخرين.'
    }
};

// Course recommendations based on level
const courseRecommendations = {
    en: {
        'Beginner': ['Arabic Alphabet & Pronunciation', 'Basic Vocabulary', 'Simple Grammar'],
        'Elementary': ['Elementary Grammar', 'Everyday Conversations', 'Reading Comprehension'],
        'Intermediate': ['Intermediate Grammar', 'Business Arabic', 'Writing Skills'],
        'Upper Intermediate': ['Advanced Grammar', 'Academic Arabic', 'Presentation Skills'],
        'Advanced': ['Arabic Literature', 'Advanced Writing', 'Teaching Arabic']
    },
    ar: {
        'مبتدئ': ['الأبجدية العربية والنطق', 'المفردات الأساسية', 'القواعد البسيطة'],
        'ابتدائي': ['قواعد المستوى الابتدائي', 'المحادثات اليومية', 'فهم القراءة'],
        'متوسط': ['قواعد المستوى المتوسط', 'العربية التجارية', 'مهارات الكتابة'],
        'متوسط متقدم': ['القواعد المتقدمة', 'العربية الأكاديمية', 'مهارات العرض'],
        'متقدم': ['الأدب العربي', 'الكتابة المتقدمة', 'تدريس العربية']
    }
};

// Initialize test when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeArabicTest();
});

// Initialize English test functionality
function initializeArabicTest() {
    const testForm = document.getElementById('arabicTestForm');
    if (testForm) {
        testForm.addEventListener('submit', handleTestSubmission);
    }
    
    // Add change listeners to radio buttons for immediate feedback
    const radioButtons = testForm?.querySelectorAll('input[type="radio"]');
    radioButtons?.forEach(radio => {
        radio.addEventListener('change', updateProgress);
    });
    
    // Initialize progress tracking
    updateProgress();
}

// Handle test form submission
function handleTestSubmission(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const answers = {};
    let answeredQuestions = 0;
    
    // Collect answers
    Object.keys(testQuestions).forEach(questionId => {
        const answer = formData.get(questionId);
        if (answer) {
            answers[questionId] = answer;
            answeredQuestions++;
        }
    });
    
    // Validate that all questions are answered
    if (answeredQuestions < Object.keys(testQuestions).length) {
        const message = getCurrentLanguage() === 'en' ? 
            'Please answer all questions before submitting.' : 
            'يرجى الإجابة على جميع الأسئلة قبل الإرسال.';
        showAlert(message);
        return;
    }
    
    // Calculate score
    const result = calculateScore(answers);
    
    // Show results
    displayTestResults(result);
    
    // Hide form and show results
    event.target.style.display = 'none';
    document.getElementById('testResults').classList.remove('hidden');
    
    // Scroll to results
    document.getElementById('testResults').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
    });
}

// Calculate test score
function calculateScore(answers) {
    let score = 0;
    let totalPoints = 0;
    const questionResults = {};
    
    Object.keys(testQuestions).forEach(questionId => {
        const question = testQuestions[questionId];
        const userAnswer = answers[questionId];
        const isCorrect = userAnswer === question.correct;
        
        if (isCorrect) {
            score += question.points;
        }
        
        totalPoints += question.points;
        questionResults[questionId] = {
            userAnswer,
            correctAnswer: question.correct,
            isCorrect,
            points: isCorrect ? question.points : 0
        };
    });
    
    const percentage = Math.round((score / totalPoints) * 100);
    const level = levelMapping[getCurrentLanguage()][score];
    
    return {
        score,
        totalPoints,
        percentage,
        level,
        questionResults
    };
}

// Display test results
function displayTestResults(result) {
    const currentLang = getCurrentLanguage();
    
    // Update score display
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.textContent = `${result.score}/${result.totalPoints}`;
    }
    
    // Update level display
    const levelElement = document.getElementById('level');
    if (levelElement) {
        levelElement.textContent = result.level;
        levelElement.style.color = getLevelColor(result.score);
    }
    
    // Add percentage display
    const resultText = document.querySelector('.result-text');
    if (resultText) {
        const percentageText = currentLang === 'en' ? 
            `You scored ${result.score} out of ${result.totalPoints} (${result.percentage}%).` :
            `لقد حصلت على ${result.score} من ${result.totalPoints} (${result.percentage}%).`;
        resultText.innerHTML = percentageText;
    }
    
    // Add level description
    const levelText = document.querySelector('.level-text');
    if (levelText) {
        const description = levelDescriptions[currentLang][result.level];
        levelText.innerHTML = `
            <strong>${currentLang === 'en' ? 'Your Arabic Level:' : 'مستوى لغتك العربية:'}</strong> ${result.level}<br>
            <small>${description}</small>
        `;
    }
    
    // Add course recommendations
    addCourseRecommendations(result.level);
    
    // Add detailed results
    addDetailedResults(result.questionResults);
    
    // Save result to localStorage for future reference
    saveTestResult(result);
}

// Add course recommendations
function addCourseRecommendations(level) {
    const currentLang = getCurrentLanguage();
    const recommendations = courseRecommendations[currentLang][level];
    
    if (!recommendations) return;
    
    const resultsContainer = document.getElementById('testResults');
    if (!resultsContainer) return;
    
    // Remove existing recommendations
    const existingRec = resultsContainer.querySelector('.course-recommendations');
    if (existingRec) {
        existingRec.remove();
    }
    
    // Create recommendations section
    const recSection = document.createElement('div');
    recSection.className = 'course-recommendations';
    recSection.innerHTML = `
        <h4>${currentLang === 'en' ? 'Recommended Courses:' : 'الدورات الموصى بها:'}</h4>
        <ul>
            ${recommendations.map(course => `<li>${course}</li>`).join('')}
        </ul>
        <div class="recommendation-actions">
            <a href="courses.html" class="btn-primary">${currentLang === 'en' ? 'View All Courses' : 'عرض جميع الدورات'}</a>
            <a href="register.html" class="btn-secondary">${currentLang === 'en' ? 'Register Now' : 'سجل الآن'}</a>
        </div>
    `;
    
    resultsContainer.appendChild(recSection);
}

// Add detailed results breakdown
function addDetailedResults(questionResults) {
    const currentLang = getCurrentLanguage();
    const resultsContainer = document.getElementById('testResults');
    if (!resultsContainer) return;
    
    // Remove existing detailed results
    const existingDetails = resultsContainer.querySelector('.detailed-results');
    if (existingDetails) {
        existingDetails.remove();
    }
    
    // Create detailed results section
    const detailsSection = document.createElement('div');
    detailsSection.className = 'detailed-results';
    detailsSection.style.marginTop = '30px';
    
    let detailsHTML = `
        <h4>${currentLang === 'en' ? 'Question Breakdown:' : 'تفصيل الأسئلة:'}</h4>
        <div class="question-breakdown">
    `;
    
    Object.keys(questionResults).forEach((questionId, index) => {
        const result = questionResults[questionId];
        const questionNumber = index + 1;
        const statusIcon = result.isCorrect ? '✅' : '❌';
        const statusText = result.isCorrect ? 
            (currentLang === 'en' ? 'Correct' : 'صحيح') : 
            (currentLang === 'en' ? 'Incorrect' : 'خطأ');
        
        detailsHTML += `
            <div class="question-result ${result.isCorrect ? 'correct' : 'incorrect'}">
                <span class="question-number">${currentLang === 'en' ? 'Question' : 'السؤال'} ${questionNumber}:</span>
                <span class="status">${statusIcon} ${statusText}</span>
            </div>
        `;
    });
    
    detailsHTML += '</div>';
    detailsSection.innerHTML = detailsHTML;
    
    resultsContainer.appendChild(detailsSection);
}

// Update progress as user answers questions
function updateProgress() {
    const form = document.getElementById('arabicTestForm');
    if (!form) return;
    
    const totalQuestions = Object.keys(testQuestions).length;
    let answeredQuestions = 0;
    
    Object.keys(testQuestions).forEach(questionId => {
        const radios = form.querySelectorAll(`input[name="${questionId}"]`);
        const isAnswered = Array.from(radios).some(radio => radio.checked);
        if (isAnswered) {
            answeredQuestions++;
        }
    });
    
    // Update progress indicator if it exists
    const progressIndicator = document.querySelector('.test-progress');
    if (progressIndicator) {
        const percentage = Math.round((answeredQuestions / totalQuestions) * 100);
        progressIndicator.textContent = `${answeredQuestions}/${totalQuestions} ${getCurrentLanguage() === 'en' ? 'completed' : 'مكتمل'}`;
        progressIndicator.style.width = `${percentage}%`;
    }
    
    // Enable/disable submit button based on completion
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = answeredQuestions < totalQuestions;
        if (answeredQuestions === totalQuestions) {
            submitButton.classList.add('ready');
        } else {
            submitButton.classList.remove('ready');
        }
    }
}

// Get level color based on score
function getLevelColor(score) {
    const colors = {
        0: '#e74c3c',  // Red for beginner
        1: '#e74c3c',  // Red for beginner
        2: '#f39c12',  // Orange for elementary
        3: '#f1c40f',  // Yellow for intermediate
        4: '#2ecc71',  // Green for upper intermediate
        5: '#27ae60'   // Dark green for advanced
    };
    return colors[score] || '#7f8c8d';
}

// Save test result to localStorage
function saveTestResult(result) {
    const testHistory = JSON.parse(localStorage.getItem('arabicTestHistory') || '[]');
    
    const newResult = {
        date: new Date().toISOString(),
        score: result.score,
        totalPoints: result.totalPoints,
        percentage: result.percentage,
        level: result.level,
        language: getCurrentLanguage()
    };
    
    testHistory.push(newResult);
    
    // Keep only last 10 results
    if (testHistory.length > 10) {
        testHistory.splice(0, testHistory.length - 10);
    }
    
    localStorage.setItem('arabicTestHistory', JSON.stringify(testHistory));
}

// Get current language (fallback function if not available globally)
function getCurrentLanguage() {
    return window.currentLanguage || document.documentElement.lang || 'en';
}

// Show alert message
function showAlert(message) {
    // Create custom alert if needed, or use browser alert
    alert(message);
}

// Retake test function
function retakeTest() {
    // Reset form
    const form = document.getElementById('arabicTestForm');
    if (form) {
        form.reset();
        form.style.display = 'block';
    }
    
    // Hide results
    const results = document.getElementById('testResults');
    if (results) {
        results.classList.add('hidden');
    }
    
    // Scroll back to form
    if (form) {
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Reset progress
    updateProgress();
}

// Export functions for global access
window.retakeTest = retakeTest;
window.handleTestSubmission = handleTestSubmission;

