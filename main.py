from flask import Flask, render_template, request, jsonify, redirect, url_for, session, flash
import os
import logging
import json
import datetime
from functools import wraps

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Create Flask app
app = Flask(__name__, 
            static_url_path='',
            static_folder='./',
            template_folder='./')

# Set secret key for session
app.secret_key = os.environ.get("SESSION_SECRET", "student_voice_secret_key")
# Set session parameters to make it more reliable
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = True
app.config['PERMANENT_SESSION_LIFETIME'] = datetime.timedelta(hours=1)

# Admin credentials (in a real app, these would be in a database with proper password hashing)
ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin123")

# Path to store submissions
SUBMISSIONS_FILE = 'submissions.json'

# Authentication decorator
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'admin_logged_in' not in session:
            return redirect(url_for('admin_login'))
        return f(*args, **kwargs)
    return decorated_function

# Helper function to save submissions
def save_submission(data):
    submissions = []
    try:
        if os.path.exists(SUBMISSIONS_FILE):
            with open(SUBMISSIONS_FILE, 'r') as f:
                submissions = json.load(f)
    except Exception as e:
        logging.error(f"Error loading submissions: {e}")
    
    # Add timestamp
    data['timestamp'] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    submissions.append(data)
    
    try:
        with open(SUBMISSIONS_FILE, 'w') as f:
            json.dump(submissions, f, indent=2)
        return True
    except Exception as e:
        logging.error(f"Error saving submission: {e}")
        return False

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/submit', methods=['POST'])
def submit_form():
    form_data = request.form.to_dict()
    success = save_submission(form_data)
    
    response = {
        'success': success,
        'message': 'Thank you for your submission!' if success else 'There was an error processing your submission.'
    }
    
    return jsonify(response)

@app.route('/admin')
def admin_redirect():
    return redirect(url_for('admin_login'))

@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        logging.debug(f"Login attempt: {username}")
        
        if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
            # Set session variable
            session.clear()
            session['admin_logged_in'] = True
            session.modified = True
            
            # Debug session
            logging.debug(f"Session after login: {session}")
            
            # Set a flash message for successful login
            flash('Login successful!', 'success')
            
            return redirect(url_for('admin_dashboard'))
        else:
            flash('Invalid username or password', 'error')
    
    return render_template('admin_login.html')

@app.route('/admin/dashboard')
@login_required
def admin_dashboard():
    # Log that we're accessing the dashboard
    logging.debug(f"Accessing dashboard, session: {session}")
    
    # Check if user is logged in
    if 'admin_logged_in' not in session or not session['admin_logged_in']:
        logging.warning("Unauthorized dashboard access attempt")
        flash('Please log in to access the dashboard', 'error')
        return redirect(url_for('admin_login'))
    
    # Get submissions from file
    submissions = []
    try:
        if os.path.exists(SUBMISSIONS_FILE):
            with open(SUBMISSIONS_FILE, 'r') as f:
                submissions = json.load(f)
            logging.debug(f"Loaded {len(submissions)} submissions")
        else:
            logging.warning(f"Submissions file not found: {SUBMISSIONS_FILE}")
    except Exception as e:
        logging.error(f"Error loading submissions: {e}")
    
    # Add success message if none exists
    if not session.get('_flashes'):
        flash('Welcome to the admin dashboard!', 'success')
    
    return render_template('admin_dashboard.html', submissions=submissions)

@app.route('/admin/logout')
def admin_logout():
    session.pop('admin_logged_in', None)
    return redirect(url_for('admin_login'))

# Start the server
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)