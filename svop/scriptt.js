document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('recruitmentForm');
    const pages = document.querySelectorAll('.form-page');
    const nextBtn = document.querySelector('.next-btn');
    const backBtn = document.querySelector('.back-btn');
    const departmentRadios = document.querySelectorAll('input[name="department"]');
    const departmentQuestions = document.getElementById('departmentQuestions');
    const whatsappShareBtn = document.getElementById('whatsappShareBtn');
    const instagramShareBtn = document.getElementById('instagramShareBtn');
    
    let currentPage = 0;

    // Form text for social sharing
    const shareText = "Join Students Voice of Patient Safety! Apply here: ";
    const shareUrl = window.location.href;

    // Department-specific questions templates
    const departmentTemplates = {
        'Operations': `
            <div class="department-questions">
                <div class="question-group">
                    <label for="venueChecks">What are the things you check at the venue first?</label>
                    <textarea id="venueChecks" name="venueChecks" required></textarea>
                </div>
            </div>
        `,
        'Research': `
            <div class="department-questions">
                <div class="question-group">
                    <label for="softwareFamiliarity">What software are you familiar with?</label>
                    <input type="text" id="softwareFamiliarity" name="softwareFamiliarity" required>
                </div>
                <div class="question-group">
                    <label>Any research workshops or courses you've attended?</label>
                    <div class="radio-group">
                        <label class="radio-option">
                            <input type="radio" name="workshopsAttended" value="Yes" required>
                            <span class="radio-custom"></span>
                            Yes
                        </label>
                        <label class="radio-option">
                            <input type="radio" name="workshopsAttended" value="No">
                            <span class="radio-custom"></span>
                            No
                        </label>
                    </div>
                    <div id="certificateUpload" style="display: none; margin-top: 15px;">
                        <label for="certificate">Upload Certificate</label>
                        <input type="file" id="certificate" name="certificate">
                    </div>
                </div>
                <div class="question-group">
                    <label>Any publications or in-process articles?</label>
                    <div class="radio-group">
                        <label class="radio-option">
                            <input type="radio" name="publications" value="Yes" required>
                            <span class="radio-custom"></span>
                            Yes
                        </label>
                        <label class="radio-option">
                            <input type="radio" name="publications" value="No">
                            <span class="radio-custom"></span>
                            No
                        </label>
                    </div>
                    <div id="publicationLink" style="display: none; margin-top: 15px;">
                        <label for="articleLink">Link to publication/article</label>
                        <input type="text" id="articleLink" name="articleLink">
                    </div>
                </div>
            </div>
        `,
        'Academics': `
            <div class="department-questions">
                <div class="question-group">
                    <label for="slideDesign">How do you design slides to make complex academic content easy to understand?</label>
                    <textarea id="slideDesign" name="slideDesign" required></textarea>
                </div>
                <div class="question-group">
                    <label for="designTools">What design tools or platforms do you use besides PowerPoint, and why?</label>
                    <textarea id="designTools" name="designTools" required></textarea>
                </div>
                <div class="question-group">
                    <label for="consistency">How do you ensure consistency and visual appeal across all slides?</label>
                    <textarea id="consistency" name="consistency" required></textarea>
                </div>
                <div class="question-group">
                    <label for="multimediaUse">Describe a time you used multimedia (videos, charts, animations) effectively in a presentation.</label>
                    <textarea id="multimediaUse" name="multimediaUse" required></textarea>
                </div>
                <div class="question-group">
                    <label for="sessionPreparation">What steps do you take to prepare for hosting an academic session?</label>
                    <textarea id="sessionPreparation" name="sessionPreparation" required></textarea>
                </div>
                <div class="question-group">
                    <label for="issueHandling">How do you handle unexpected issues during a live session?</label>
                    <textarea id="issueHandling" name="issueHandling" required></textarea>
                </div>
                <div class="question-group">
                    <label for="powerpointFeatures">What PowerPoint features do you use most to enhance your presentations?</label>
                    <textarea id="powerpointFeatures" name="powerpointFeatures" required></textarea>
                </div>
                <div class="question-group">
                    <label for="hostingExperience">Share your past hosting experience</label>
                    <textarea id="hostingExperience" name="hostingExperience" required></textarea>
                </div>
                <div class="question-group">
                    <label for="presentationSample">Upload a sample of your academic presentation (optional)</label>
                    <input type="file" id="presentationSample" name="presentationSample">
                </div>
            </div>
        `,
        'Media & Marketing': `
            <div class="department-questions">
                <div class="question-group">
                    <label for="designExperience">Describe your experience with graphic design (tools used, projects, etc.)</label>
                    <textarea id="designExperience" name="designExperience" required></textarea>
                </div>
                <div class="question-group">
                    <label for="socialMediaExperience">What social media platforms are you experienced with and how would you use them for our society?</label>
                    <textarea id="socialMediaExperience" name="socialMediaExperience" required></textarea>
                </div>
                <div class="question-group">
                    <label for="contentCreation">Share your approach to creating engaging content for medical students</label>
                    <textarea id="contentCreation" name="contentCreation" required></textarea>
                </div>
            </div>
        `
    };

    // Show current page
    function showPage(pageIndex) {
        pages.forEach((page, index) => {
            page.classList.toggle('active', index === pageIndex);
        });
        currentPage = pageIndex;
    }

    // Next button click handler
    nextBtn.addEventListener('click', function() {
        // Validate current page before proceeding
        if (validatePage(currentPage)) {
            showPage(currentPage + 1);
        }
    });

    // Back button click handler
    backBtn.addEventListener('click', function() {
        showPage(currentPage - 1);
    });

    // Department selection change handler
    departmentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                departmentQuestions.innerHTML = departmentTemplates[this.value] || '';
                
                // Set up event listeners for dynamic elements
                setupDynamicElements();
            }
        });
    });

    // Set up event listeners for dynamic elements (like conditional fields)
    function setupDynamicElements() {
        // For Research department
        const workshopRadios = document.querySelectorAll('input[name="workshopsAttended"]');
        const publicationRadios = document.querySelectorAll('input[name="publications"]');
        
        if (workshopRadios.length > 0) {
            workshopRadios.forEach(radio => {
                radio.addEventListener('change', function() {
                    const certificateUpload = document.getElementById('certificateUpload');
                    certificateUpload.style.display = this.value === 'Yes' ? 'block' : 'none';
                });
            });
        }
        
        if (publicationRadios.length > 0) {
            publicationRadios.forEach(radio => {
                radio.addEventListener('change', function() {
                    const publicationLink = document.getElementById('publicationLink');
                    publicationLink.style.display = this.value === 'Yes' ? 'block' : 'none';
                });
            });
        }
    }

    // Form validation for current page
    function validatePage(pageIndex) {
        const currentPage = pages[pageIndex];
        const inputs = currentPage.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = 'var(--primary-red)';
                isValid = false;
                
                // Scroll to the first invalid input
                if (isValid === false) {
                    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    input.focus();
                    isValid = false; // To prevent scrolling to other elements
                }
            } else {
                input.style.borderColor = 'var(--gray)';
            }
        });

        // Special validation for email
        const emailInput = document.getElementById('email');
        if (pageIndex === 0 && emailInput && !validateEmail(emailInput.value)) {
            emailInput.style.borderColor = 'var(--primary-red)';
            isValid = false;
            emailInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            emailInput.focus();
        }

        // Special validation for phone number
        const phoneInput = document.getElementById('phone');
        if (pageIndex === 0 && phoneInput && !validatePhone(phoneInput.value)) {
            phoneInput.style.borderColor = 'var(--primary-red)';
            isValid = false;
            phoneInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            phoneInput.focus();
        }

        return isValid;
    }

    // Email validation
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Phone number validation
    function validatePhone(phone) {
        const re = /^\d{10,15}$/;
        return re.test(phone);
    }

    // Format form data for submission
    function formatFormData() {
        const formData = new URLSearchParams();
        
        // Add all form fields except files
        const allInputs = form.querySelectorAll('input, textarea, select');
        allInputs.forEach(input => {
            if (input.type !== 'file' && input.name) {
                if (input.type === 'radio' || input.type === 'checkbox') {
                    if (input.checked) {
                        formData.append(input.name, input.value);
                    }
                } else {
                    formData.append(input.name, input.value);
                }
            }
        });
        
        return formData;
    }

    // WhatsApp sharing functionality
    whatsappShareBtn.addEventListener('click', function() {
        const message = encodeURIComponent(`${shareText} ${shareUrl}`);
        const whatsappUrl = `https://wa.me/?text=${message}`;
        window.open(whatsappUrl, '_blank');
    });

    // Instagram sharing functionality 
    // Note: Instagram doesn't have a direct web API for sharing, so we use clipboard + app deep linking
    instagramShareBtn.addEventListener('click', function() {
        // Copy the URL to clipboard
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`).then(function() {
            // Try to open Instagram app with deep linking
            window.location.href = 'instagram://';
            
            // Fallback if Instagram app doesn't open
            setTimeout(function() {
                alert('URL copied to clipboard! You can paste it in Instagram to share.');
                window.open('https://www.instagram.com', '_blank');
            }, 1000);
        }).catch(function() {
            alert('Failed to copy text. Please manually share the link: ' + shareUrl);
        });
    });

    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validatePage(currentPage)) {
            const selectedDept = document.querySelector('input[name="department"]:checked').value;
            document.getElementById('confirmedDepartment').textContent = selectedDept;
            
            // Format the form data
            const formData = new FormData(form);
            
            // Show loading indicator or disable submit button
            const submitBtn = document.querySelector('.submit-btn');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;
            
            // Send the data to our backend API
            fetch('/submit', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                
                // Save form data to local storage as backup
                try {
                    const formDataObj = {};
                    formData.forEach((value, key) => {
                        formDataObj[key] = value;
                    });
                    localStorage.setItem('svpsRecruitmentForm', JSON.stringify(formDataObj));
                } catch (e) {
                    console.log('Could not save form data locally:', e);
                }
                
                // Reset button state
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                
                // Show confirmation page
                showPage(2);
            })
            .catch(error => {
                console.error('Error:', error);
                
                // Save form data to local storage for backup in case of error
                try {
                    const formDataObj = {};
                    formData.forEach((value, key) => {
                        formDataObj[key] = value;
                    });
                    localStorage.setItem('svpsRecruitmentForm', JSON.stringify(formDataObj));
                } catch (e) {
                    console.log('Could not save form data locally:', e);
                }
                
                // Reset button state
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                
                // Show confirmation page anyway since we saved data locally
                showPage(2);
            });
        }
    });
    
    // Initialize the form
    showPage(0);
});